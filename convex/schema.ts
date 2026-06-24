import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Game mode:
//  - "spy":        imposter knows they're the imposter and gets no word.
//  - "undercover": imposter secretly gets a related decoy word and is NOT told
//                  they're the imposter.
export const gameModeValidator = v.union(
  v.literal("spy"),
  v.literal("undercover"),
);

// Per-room game settings (host-configurable in the lobby / between rounds).
export const settingsValidator = v.object({
  gameMode: gameModeValidator,
  imposterCount: v.number(), // 1+ (validated against player count at start)
  cluePasses: v.number(), // 1-3: how many clues each player gives
  imposterSeesCategory: v.boolean(), // "spy" mode only
  impostersKnowEachOther: v.boolean(), // "spy" mode only
  timersEnabled: v.boolean(),
  clueSecs: v.number(), // per-turn clue timer when enabled
  voteSecs: v.number(), // voting timer when enabled
  roundCount: v.number(), // rounds in a match
  packId: v.optional(v.id("packs")), // pinned category; undefined = random
});

// Phases the room moves through. `lobby` and `finished` bookend a match;
// the rest cycle each round.
export const phaseValidator = v.union(
  v.literal("lobby"),
  v.literal("reveal"),
  v.literal("clues"),
  v.literal("discussion"),
  v.literal("vote"),
  v.literal("resolve"),
  v.literal("scoreboard"),
  v.literal("finished"),
);

export default defineSchema({
  // Signed-in users, mirrored from Clerk. Optional — guests don't have one.
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),

  // A game room: lobby + match container + current phase pointer.
  rooms: defineTable({
    code: v.string(), // short shareable join code, e.g. "AB3K"
    phase: phaseValidator,
    currentRoundNumber: v.number(), // 0 in the lobby; 1..N during a match
    hostPlayerId: v.optional(v.id("players")), // set right after host joins
    settings: settingsValidator,
    createdAt: v.number(),
  }).index("by_code", ["code"]),

  // A participant in a room. Supports both guests and signed-in users.
  players: defineTable({
    roomId: v.id("rooms"),
    userId: v.optional(v.id("users")), // set when signed in via Clerk
    // Random token a guest stores in localStorage to authorize their actions.
    // Never projected to clients (see toPublicPlayer in convex/lib.ts).
    guestSecret: v.optional(v.string()),
    isBot: v.optional(v.boolean()), // CPU player; auto-plays via the scheduler
    name: v.string(),
    avatarEmoji: v.string(),
    avatarColor: v.string(),
    score: v.number(),
    // Players who join mid-match sit out until this round number.
    activeFromRound: v.number(),
    joinedAt: v.number(),
    lastSeen: v.number(), // presence heartbeat
  })
    .index("by_room", ["roomId"])
    .index("by_room_and_user", ["roomId", "userId"])
    .index("by_user", ["userId"]),

  // One round of play within a room.
  rounds: defineTable({
    roomId: v.id("rooms"),
    roundNumber: v.number(),
    secretWord: v.string(),
    // "undercover" only: the related word the imposter(s) secretly receive.
    decoyWord: v.optional(v.string()),
    category: v.string(), // pack/category name shown to crew (and imposter if enabled)
    imposterPlayerIds: v.array(v.id("players")),
    turnOrder: v.array(v.id("players")), // clue order for this round
    // Snapshots of the settings at round start (so mid-match changes are clean):
    gameMode: gameModeValidator,
    cluePasses: v.number(),
    imposterSeesCategory: v.boolean(),
    impostersKnowEachOther: v.boolean(),
    phase: v.union(
      v.literal("reveal"),
      v.literal("clues"),
      v.literal("discussion"),
      v.literal("vote"),
      v.literal("resolve"),
    ),
    currentPass: v.number(), // 1..cluePasses
    eliminatedPlayerIds: v.array(v.id("players")), // for iterative elimination
    currentBallot: v.number(), // 1..N voting rounds (iterative for 2+ imposters)
    outcome: v.optional(v.union(v.literal("crew"), v.literal("imposters"))),
    phaseDeadline: v.optional(v.number()), // epoch ms when timed phase auto-advances
  })
    .index("by_room", ["roomId"])
    .index("by_room_and_number", ["roomId", "roundNumber"]),

  // A submitted clue (attributed, revealed live).
  clues: defineTable({
    roundId: v.id("rounds"),
    playerId: v.id("players"),
    passNumber: v.number(),
    text: v.string(),
    createdAt: v.number(),
  }).index("by_round", ["roundId"]),

  // A secret ballot. `ballotNumber` supports iterative elimination.
  votes: defineTable({
    roundId: v.id("rounds"),
    ballotNumber: v.number(),
    voterPlayerId: v.id("players"),
    targetPlayerId: v.id("players"),
  })
    .index("by_round", ["roundId"])
    .index("by_round_and_ballot", ["roundId", "ballotNumber"]),

  // Word packs: built-in curated Danish packs + user-saved custom packs.
  packs: defineTable({
    ownerUserId: v.optional(v.id("users")), // undefined = built-in/curated
    name: v.string(),
    language: v.string(), // "da"
    emoji: v.string(),
    isBuiltIn: v.boolean(),
    words: v.array(
      v.object({ word: v.string(), hint: v.optional(v.string()) }),
    ),
  }).index("by_owner", ["ownerUserId"]),
});
