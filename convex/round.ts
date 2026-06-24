import { mutation, internalMutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import {
  shuffle,
  requirePlayer,
  resolvePlayer,
  activePlayers,
  toPublicPlayer,
} from "./lib";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";

// How long the scheduler waits before a bot acts (feels alive, not instant).
const BOT_ACT_MS = 1300;

// ---------------------------------------------------------------------------
// Starting a match / round
// ---------------------------------------------------------------------------

/** Host starts the match: validates settings and deals round 1. */
export const startMatch = mutation({
  args: hostArgs(),
  handler: async (ctx, args) => {
    const room = await requireHost(ctx, args);
    if (room.phase !== "lobby") throw new Error("Spillet er allerede i gang.");
    const players = await activePlayers(ctx, room._id, 1);
    validateForStart(players.length, room.settings.imposterCount);
    await dealRound(ctx, room, 1);
  },
});

/** Host advances to the next round (or finishes the match). */
export const nextRound = mutation({
  args: hostArgs(),
  handler: async (ctx, args) => {
    const room = await requireHost(ctx, args);
    if (room.phase !== "scoreboard") {
      throw new Error("Kan kun gå videre fra resultattavlen.");
    }
    if (room.currentRoundNumber >= room.settings.roundCount) {
      await ctx.db.patch(room._id, { phase: "finished" });
      return;
    }
    const nextNumber = room.currentRoundNumber + 1;
    const players = await activePlayers(ctx, room._id, nextNumber);
    validateForStart(players.length, room.settings.imposterCount);
    await dealRound(ctx, room, nextNumber);
  },
});

/** Host returns everyone to the lobby for a fresh match (keeps scores reset). */
export const backToLobby = mutation({
  args: hostArgs(),
  handler: async (ctx, args) => {
    const room = await requireHost(ctx, args);
    const players = await ctx.db
      .query("players")
      .withIndex("by_room", (q) => q.eq("roomId", room._id))
      .collect();
    for (const p of players) {
      await ctx.db.patch(p._id, { score: 0, activeFromRound: 1 });
    }
    await ctx.db.patch(room._id, {
      phase: "lobby",
      currentRoundNumber: 0,
    });
  },
});

// ---------------------------------------------------------------------------
// Clue phase
// ---------------------------------------------------------------------------

export const submitClue = mutation({
  args: { ...playerArgs(), roundId: v.id("rounds"), text: v.string() },
  handler: async (ctx, args) => {
    const me = await requirePlayer(ctx, args);
    const { room, round } = await loadActiveRound(ctx, args.roomId, args.roundId);
    if (round.phase !== "clues") throw new Error("Det er ikke spor-fasen.");
    if (!round.turnOrder.some((id) => id === me._id)) {
      throw new Error("Du er ikke med i denne runde.");
    }
    const text = args.text.trim().slice(0, 60);
    if (text.length === 0) throw new Error("Skriv et spor.");

    // One clue per player per pass.
    const existing = await ctx.db
      .query("clues")
      .withIndex("by_round", (q) => q.eq("roundId", round._id))
      .collect();
    if (
      existing.some(
        (c) => c.playerId === me._id && c.passNumber === round.currentPass,
      )
    ) {
      throw new Error("Du har allerede givet et spor i denne omgang.");
    }

    await ctx.db.insert("clues", {
      roundId: round._id,
      playerId: me._id,
      passNumber: round.currentPass,
      text,
      createdAt: Date.now(),
    });

    await maybeAdvanceCluePhase(ctx, room, round);
    scheduleBotTick(ctx, room._id, round._id);
  },
});

// ---------------------------------------------------------------------------
// Vote phase
// ---------------------------------------------------------------------------

export const castVote = mutation({
  args: {
    ...playerArgs(),
    roundId: v.id("rounds"),
    targetPlayerId: v.id("players"),
  },
  handler: async (ctx, args) => {
    const me = await requirePlayer(ctx, args);
    const { room, round } = await loadActiveRound(ctx, args.roomId, args.roundId);
    if (round.phase !== "vote") throw new Error("Det er ikke afstemnings-fasen.");
    if (round.eliminatedPlayerIds.some((id) => id === me._id)) {
      throw new Error("Du er ude og kan ikke stemme.");
    }
    const eligible = voters(round);
    if (!eligible.some((id) => id === me._id)) {
      throw new Error("Du kan ikke stemme i denne runde.");
    }
    if (!eligible.some((id) => id === args.targetPlayerId)) {
      throw new Error("Ugyldig stemme.");
    }

    // Replace any prior vote on this ballot.
    const ballotVotes = await ctx.db
      .query("votes")
      .withIndex("by_round_and_ballot", (q) =>
        q.eq("roundId", round._id).eq("ballotNumber", round.currentBallot),
      )
      .collect();
    const prior = ballotVotes.find((vt) => vt.voterPlayerId === me._id);
    if (prior) {
      await ctx.db.patch(prior._id, { targetPlayerId: args.targetPlayerId });
    } else {
      await ctx.db.insert("votes", {
        roundId: round._id,
        ballotNumber: round.currentBallot,
        voterPlayerId: me._id,
        targetPlayerId: args.targetPlayerId,
      });
    }

    await maybeResolveBallot(ctx, room, round);
    scheduleBotTick(ctx, room._id, round._id);
  },
});

// ---------------------------------------------------------------------------
// Host skip (advance past a staller) + timer auto-advance
// ---------------------------------------------------------------------------

/** Host forces the current phase forward, auto-filling missing inputs. */
export const skipPhase = mutation({
  args: { ...hostArgs(), roundId: v.id("rounds") },
  handler: async (ctx, args) => {
    const room = await requireHost(ctx, args);
    const round = await ctx.db.get(args.roundId);
    if (round === null || round.roomId !== room._id) throw new Error("Ugyldig runde.");
    if (round.phase === "clues") {
      await fillMissingClues(ctx, round);
      const fresh = await ctx.db.get(round._id);
      if (fresh) await maybeAdvanceCluePhase(ctx, room, fresh, true);
    } else if (round.phase === "vote") {
      await resolveBallot(ctx, room, round);
    }
    scheduleBotTick(ctx, room._id, round._id);
  },
});

// ---------------------------------------------------------------------------
// Read model for an in-progress round (role-private)
// ---------------------------------------------------------------------------

/** Round view tailored to the requesting player (their secret role/word). */
export const getRoundState = query({
  args: {
    roomId: v.id("rooms"),
    roundId: v.id("rounds"),
    playerId: v.optional(v.id("players")),
    guestSecret: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const round = await ctx.db.get(args.roundId);
    if (round === null || round.roomId !== args.roomId) return null;
    const room = await ctx.db.get(args.roomId);
    if (room === null) return null;
    const me = await resolvePlayer(ctx, args);
    const now = Date.now();

    const allPlayers = await ctx.db
      .query("players")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();

    const clues = (
      await ctx.db
        .query("clues")
        .withIndex("by_round", (q) => q.eq("roundId", round._id))
        .collect()
    )
      .sort((a, b) => a.createdAt - b.createdAt)
      .map((c) => ({
        _id: c._id,
        playerId: c.playerId,
        passNumber: c.passNumber,
        text: c.text,
      }));

    const iAmImposter = me !== null && round.imposterPlayerIds.some((id) => id === me._id);
    const revealEverything = round.phase === "resolve";
    // In undercover mode the imposter must NOT know they're the imposter during
    // play — they're shown a normal word card (the decoy). The truth only comes
    // out at the reveal.
    const hideImposter = round.gameMode === "undercover" && !revealEverything;

    // Whose turn / who still needs to act this pass (turn order is sequential).
    const cluedThisPass = new Set(
      clues.filter((c) => c.passNumber === round.currentPass).map((c) => c.playerId),
    );
    const currentTurnPlayerId =
      round.phase === "clues"
        ? round.turnOrder.find((id) => !cluedThisPass.has(id)) ?? null
        : null;

    // Voting status (who has voted, not who they voted for — secret).
    const ballotVotes =
      round.phase === "vote" || revealEverything
        ? await ctx.db
            .query("votes")
            .withIndex("by_round_and_ballot", (q) =>
              q.eq("roundId", round._id).eq("ballotNumber", round.currentBallot),
            )
            .collect()
        : [];
    const votedPlayerIds = ballotVotes.map((vt) => vt.voterPlayerId);

    // Full vote breakdown only at reveal.
    const voteBreakdown = revealEverything
      ? (
          await ctx.db
            .query("votes")
            .withIndex("by_round", (q) => q.eq("roundId", round._id))
            .collect()
        ).map((vt) => ({
          ballotNumber: vt.ballotNumber,
          voterPlayerId: vt.voterPlayerId,
          targetPlayerId: vt.targetPlayerId,
        }))
      : [];

    // What we tell the client about *this* player's role.
    const effectiveImposter = iAmImposter && !hideImposter;

    // Co-imposter visibility (spy mode, when enabled). Never in undercover
    // (the imposter doesn't even know they're an imposter).
    const teammateIds =
      effectiveImposter && round.impostersKnowEachOther
        ? round.imposterPlayerIds.filter((id) => me && id !== me._id)
        : [];

    // The word shown on this player's card.
    let myWord: string | null;
    if (revealEverything || !iAmImposter) {
      myWord = round.secretWord; // crew (and everyone at reveal) see the real word
    } else if (round.gameMode === "undercover") {
      myWord = round.decoyWord ?? null; // hidden imposter sees the decoy
    } else {
      myWord = null; // spy imposter knows no word
    }

    // Category is always visible in undercover (the imposter holds a word too).
    const categoryVisible =
      round.gameMode === "undercover" ||
      revealEverything ||
      !iAmImposter ||
      round.imposterSeesCategory;

    return {
      roundId: round._id,
      roundNumber: round.roundNumber,
      phase: round.phase,
      gameMode: round.gameMode,
      currentPass: round.currentPass,
      cluePasses: round.cluePasses,
      currentBallot: round.currentBallot,
      category: categoryVisible ? round.category : null,
      turnOrder: round.turnOrder,
      currentTurnPlayerId,
      eliminatedPlayerIds: round.eliminatedPlayerIds,
      phaseDeadline: round.phaseDeadline ?? null,
      clues,
      votedPlayerIds,
      players: allPlayers
        .sort((a, b) => a.joinedAt - b.joinedAt)
        .map((p) => toPublicPlayer(p, room.hostPlayerId, now)),
      me: me
        ? {
            playerId: me._id,
            isImposter: effectiveImposter,
            secretWord: myWord,
            teammateIds,
          }
        : null,
      // Revealed only at resolve:
      reveal: revealEverything
        ? {
            imposterPlayerIds: round.imposterPlayerIds,
            secretWord: round.secretWord,
            decoyWord: round.decoyWord ?? null,
            gameMode: round.gameMode,
            outcome: round.outcome ?? null,
            voteBreakdown,
          }
        : null,
    };
  },
});

// ---------------------------------------------------------------------------
// Core engine helpers
// ---------------------------------------------------------------------------

function hostArgs() {
  return {
    roomId: v.id("rooms"),
    playerId: v.optional(v.id("players")),
    guestSecret: v.optional(v.string()),
  };
}
function playerArgs() {
  return {
    roomId: v.id("rooms"),
    playerId: v.optional(v.id("players")),
    guestSecret: v.optional(v.string()),
  };
}

function validateForStart(playerCount: number, imposterCount: number) {
  if (playerCount < 3) throw new Error("Mindst 3 spillere skal være med.");
  if (imposterCount < 1) throw new Error("Mindst 1 forræder.");
  if (imposterCount >= playerCount) {
    throw new Error("For mange forrædere i forhold til spillere.");
  }
  // Keep at least 2 crew so the game is playable.
  if (playerCount - imposterCount < 2) {
    throw new Error("Der skal være mindst 2 i besætningen.");
  }
}

async function requireHost(
  ctx: QueryCtx,
  args: { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret?: string },
): Promise<Doc<"rooms">> {
  const room = await ctx.db.get(args.roomId);
  if (room === null) throw new Error("Rummet findes ikke.");
  const me = await requirePlayer(ctx, args);
  if (room.hostPlayerId !== me._id) throw new Error("Kun værten kan gøre det.");
  return room;
}

async function loadActiveRound(
  ctx: QueryCtx,
  roomId: Id<"rooms">,
  roundId: Id<"rounds">,
): Promise<{ room: Doc<"rooms">; round: Doc<"rounds"> }> {
  const room = await ctx.db.get(roomId);
  if (room === null) throw new Error("Rummet findes ikke.");
  const round = await ctx.db.get(roundId);
  if (round === null || round.roomId !== roomId) throw new Error("Ugyldig runde.");
  return { room, round };
}

/** Pick imposters, order, word; create the round; set phases. */
async function dealRound(ctx: MutationCtx, room: Doc<"rooms">, roundNumber: number) {
  const players = await activePlayers(ctx, room._id, roundNumber);
  const s = room.settings;

  // Imposter rotation: random, avoid whoever was imposter last round.
  let prevImposters: Id<"players">[] = [];
  if (roundNumber > 1) {
    const prev = await ctx.db
      .query("rounds")
      .withIndex("by_room_and_number", (q) =>
        q.eq("roomId", room._id).eq("roundNumber", roundNumber - 1),
      )
      .unique();
    if (prev) prevImposters = prev.imposterPlayerIds;
  }
  let pool = players.filter((p) => !prevImposters.some((id) => id === p._id));
  if (pool.length < s.imposterCount) pool = players; // small group fallback
  const imposterIds = shuffle(pool).slice(0, s.imposterCount).map((p) => p._id);

  // Turn order: fully randomized, but an imposter is never forced to go first.
  let order = shuffle(players.map((p) => p._id));
  if (imposterIds.some((id) => id === order[0]) && order.length > 1) {
    const firstCrew = order.findIndex((id) => !imposterIds.some((im) => im === id));
    if (firstCrew > 0) [order[0], order[firstCrew]] = [order[firstCrew], order[0]];
  }

  const { word, category, decoyWord } = await pickWords(ctx, room);

  const roundId = await ctx.db.insert("rounds", {
    roomId: room._id,
    roundNumber,
    secretWord: word,
    decoyWord, // undercover only; all imposters share it
    category,
    imposterPlayerIds: imposterIds,
    turnOrder: order,
    gameMode: s.gameMode,
    cluePasses: s.cluePasses,
    imposterSeesCategory: s.imposterSeesCategory,
    impostersKnowEachOther: s.impostersKnowEachOther,
    phase: "reveal",
    currentPass: 1,
    eliminatedPlayerIds: [],
    currentBallot: 1,
    phaseDeadline: undefined,
  });

  await ctx.db.patch(room._id, {
    phase: "reveal",
    currentRoundNumber: roundNumber,
  });

  // reveal → clues is triggered by the host via beginClues (after cards seen).
  return roundId;
}

async function pickWords(
  ctx: QueryCtx,
  room: Doc<"rooms">,
): Promise<{ word: string; category: string; decoyWord?: string }> {
  let pack: Doc<"packs"> | null = null;
  if (room.settings.packId) {
    // Host pinned a specific category.
    pack = await ctx.db.get(room.settings.packId);
  } else {
    // Random category: pick a random built-in pack each round.
    const builtIns = await ctx.db
      .query("packs")
      .withIndex("by_owner", (q) => q.eq("ownerUserId", undefined))
      .collect();
    if (builtIns.length > 0) {
      pack = builtIns[Math.floor(Math.random() * builtIns.length)];
    }
  }
  if (pack === null || pack.words.length === 0) {
    return { word: "Hemmelighed", category: "Standard" };
  }

  const words = pack.words;
  const word = words[Math.floor(Math.random() * words.length)].word;

  let decoyWord: string | undefined;
  if (room.settings.gameMode === "undercover") {
    // A different word from the same category "reminds" the imposter of the real one.
    const others = words
      .map((w) => w.word)
      .filter((w) => w.toLowerCase() !== word.toLowerCase());
    if (others.length > 0) {
      decoyWord = others[Math.floor(Math.random() * others.length)];
    }
  }

  return { word, category: pack.name, decoyWord };
}

/** Move room/round from reveal → clues (called by client once cards seen). */
export const beginClues = mutation({
  args: { ...hostArgs(), roundId: v.id("rounds") },
  handler: async (ctx, args) => {
    const room = await requireHost(ctx, args);
    const round = await ctx.db.get(args.roundId);
    if (round === null || round.roomId !== room._id) throw new Error("Ugyldig runde.");
    if (round.phase !== "reveal") return;
    await ctx.db.patch(round._id, {
      phase: "clues",
      phaseDeadline: room.settings.timersEnabled
        ? Date.now() + room.settings.clueSecs * 1000
        : undefined,
    });
    await ctx.db.patch(room._id, { phase: "clues" });
    scheduleBotTick(ctx, room._id, round._id);
  },
});

async function fillMissingClues(ctx: MutationCtx, round: Doc<"rounds">) {
  const existing = await ctx.db
    .query("clues")
    .withIndex("by_round", (q) => q.eq("roundId", round._id))
    .collect();
  const done = new Set(
    existing.filter((c) => c.passNumber === round.currentPass).map((c) => c.playerId),
  );
  const now = Date.now();
  for (const id of round.turnOrder) {
    if (!done.has(id)) {
      await ctx.db.insert("clues", {
        roundId: round._id,
        playerId: id,
        passNumber: round.currentPass,
        text: "—",
        createdAt: now,
      });
    }
  }
}

/** If everyone has clued this pass, advance to next pass or to voting. */
async function maybeAdvanceCluePhase(
  ctx: MutationCtx,
  room: Doc<"rooms">,
  round: Doc<"rounds">,
  force = false,
) {
  const clues = await ctx.db
    .query("clues")
    .withIndex("by_round", (q) => q.eq("roundId", round._id))
    .collect();
  const cluedThisPass = new Set(
    clues.filter((c) => c.passNumber === round.currentPass).map((c) => c.playerId),
  );
  const everyone = round.turnOrder.every((id) => cluedThisPass.has(id));
  if (!everyone && !force) return;

  // Pause for discussion after every completed clue round. The host then
  // advances (advanceDiscussion) to the next clue round or to voting.
  await ctx.db.patch(round._id, { phase: "discussion", phaseDeadline: undefined });
  await ctx.db.patch(room._id, { phase: "discussion" });
}

/** Move from the discussion screen to the next clue round, or to voting. */
async function advanceFromDiscussion(
  ctx: MutationCtx,
  room: Doc<"rooms">,
  round: Doc<"rounds">,
) {
  if (round.currentPass < round.cluePasses) {
    await ctx.db.patch(round._id, {
      phase: "clues",
      currentPass: round.currentPass + 1,
      phaseDeadline: room.settings.timersEnabled
        ? Date.now() + room.settings.clueSecs * 1000
        : undefined,
    });
    await ctx.db.patch(room._id, { phase: "clues" });
  } else {
    await ctx.db.patch(round._id, {
      phase: "vote",
      phaseDeadline: room.settings.timersEnabled
        ? Date.now() + room.settings.voteSecs * 1000
        : undefined,
    });
    await ctx.db.patch(room._id, { phase: "vote" });
  }
  scheduleBotTick(ctx, room._id, round._id);
}

/** Host advances from the discussion screen. */
export const advanceDiscussion = mutation({
  args: { ...hostArgs(), roundId: v.id("rounds") },
  handler: async (ctx, args) => {
    const room = await requireHost(ctx, args);
    const round = await ctx.db.get(args.roundId);
    if (round === null || round.roomId !== room._id) throw new Error("Ugyldig runde.");
    if (round.phase !== "discussion") return;
    await advanceFromDiscussion(ctx, room, round);
  },
});

/** Players eligible to vote this ballot (active, not eliminated). */
function voters(round: Doc<"rounds">): Id<"players">[] {
  return round.turnOrder.filter(
    (id) => !round.eliminatedPlayerIds.some((e) => e === id),
  );
}

/** If all eligible voters have voted, resolve the ballot. */
async function maybeResolveBallot(
  ctx: MutationCtx,
  room: Doc<"rooms">,
  round: Doc<"rounds">,
) {
  const eligible = voters(round);
  const ballotVotes = await ctx.db
    .query("votes")
    .withIndex("by_round_and_ballot", (q) =>
      q.eq("roundId", round._id).eq("ballotNumber", round.currentBallot),
    )
    .collect();
  if (ballotVotes.length < eligible.length) return;
  await resolveBallot(ctx, room, round);
}

/**
 * Tally the current ballot and apply outcome rules:
 *  - Tie ⇒ no elimination ⇒ imposters survive ⇒ imposters win the round.
 *  - 1 imposter: single vote decides (crew win iff the imposter is voted out).
 *  - 2+ imposters (iterative): eliminate the top player; if they're crew ⇒
 *    imposters win immediately; if all imposters are caught ⇒ crew win; else
 *    open the next ballot.
 */
async function resolveBallot(
  ctx: MutationCtx,
  room: Doc<"rooms">,
  round: Doc<"rounds">,
) {
  const ballotVotes = await ctx.db
    .query("votes")
    .withIndex("by_round_and_ballot", (q) =>
      q.eq("roundId", round._id).eq("ballotNumber", round.currentBallot),
    )
    .collect();

  const tally = new Map<Id<"players">, number>();
  for (const vt of ballotVotes) {
    tally.set(vt.targetPlayerId, (tally.get(vt.targetPlayerId) ?? 0) + 1);
  }
  let top: Id<"players"> | null = null;
  let topCount = 0;
  let tie = false;
  for (const [id, count] of tally) {
    if (count > topCount) {
      top = id;
      topCount = count;
      tie = false;
    } else if (count === topCount) {
      tie = true;
    }
  }

  const totalImposters = round.imposterPlayerIds.length;

  // No clear target (tie or no votes) ⇒ imposters survive ⇒ imposters win.
  if (top === null || tie) {
    await finishRound(ctx, room, round, "imposters");
    return;
  }

  const eliminatedIsImposter = round.imposterPlayerIds.some((id) => id === top);

  if (totalImposters === 1) {
    await finishRound(ctx, room, round, eliminatedIsImposter ? "crew" : "imposters");
    return;
  }

  // Iterative elimination for 2+ imposters.
  if (!eliminatedIsImposter) {
    await finishRound(ctx, room, round, "imposters");
    return;
  }
  const newlyEliminated = [...round.eliminatedPlayerIds, top];
  const caughtImposters = round.imposterPlayerIds.filter((id) =>
    newlyEliminated.some((e) => e === id),
  ).length;
  if (caughtImposters >= totalImposters) {
    await ctx.db.patch(round._id, { eliminatedPlayerIds: newlyEliminated });
    await finishRound(ctx, { ...room }, { ...round, eliminatedPlayerIds: newlyEliminated }, "crew");
    return;
  }
  // Open the next ballot.
  await ctx.db.patch(round._id, {
    eliminatedPlayerIds: newlyEliminated,
    currentBallot: round.currentBallot + 1,
    phaseDeadline: room.settings.timersEnabled
      ? Date.now() + room.settings.voteSecs * 1000
      : undefined,
  });
}

/** Score the round, mark it resolved, and move the room to the scoreboard. */
async function finishRound(
  ctx: MutationCtx,
  room: Doc<"rooms">,
  round: Doc<"rounds">,
  outcome: "crew" | "imposters",
) {
  // Scoring: each crew member who voted for an imposter +1; surviving imposters +2.
  const allVotes = await ctx.db
    .query("votes")
    .withIndex("by_round", (q) => q.eq("roundId", round._id))
    .collect();
  const imposterSet = new Set(round.imposterPlayerIds);

  // Award +1 per correct imposter-vote (across all ballots), to non-imposters.
  const creditedVoters = new Set<Id<"players">>();
  for (const vt of allVotes) {
    if (!imposterSet.has(vt.voterPlayerId) && imposterSet.has(vt.targetPlayerId)) {
      // one credit per voter max
      if (!creditedVoters.has(vt.voterPlayerId)) {
        creditedVoters.add(vt.voterPlayerId);
      }
    }
  }
  for (const voterId of creditedVoters) {
    const p = await ctx.db.get(voterId);
    if (p) await ctx.db.patch(p._id, { score: p.score + 1 });
  }

  // Surviving imposters (not eliminated) +2.
  if (outcome === "imposters") {
    for (const impId of round.imposterPlayerIds) {
      if (!round.eliminatedPlayerIds.some((e) => e === impId)) {
        const p = await ctx.db.get(impId);
        if (p) await ctx.db.patch(p._id, { score: p.score + 2 });
      }
    }
  }

  await ctx.db.patch(round._id, {
    phase: "resolve",
    outcome,
    phaseDeadline: undefined,
  });
  await ctx.db.patch(room._id, { phase: "scoreboard" });
}

// ---------------------------------------------------------------------------
// Bots — CPU players that auto-play via the Convex scheduler
// ---------------------------------------------------------------------------

/** Schedule a bot tick if the round could currently need a bot to act. */
function scheduleBotTick(
  ctx: MutationCtx,
  roomId: Id<"rooms">,
  roundId: Id<"rounds">,
) {
  void ctx.scheduler.runAfter(BOT_ACT_MS, internal.round.botTick, {
    roomId,
    roundId,
  });
}

const BOT_FILLER = ["hmm", "måske", "noget", "ja", "svært", "tja"];

/** On-theme clue: a random word from the round's pack, never the secret word. */
async function botClueText(
  ctx: MutationCtx,
  room: Doc<"rooms">,
  round: Doc<"rounds">,
): Promise<string> {
  if (room.settings.packId) {
    const pack = await ctx.db.get(room.settings.packId);
    if (pack && pack.words.length > 0) {
      const candidates = pack.words
        .map((w) => w.word)
        .filter((w) => w.toLowerCase() !== round.secretWord.toLowerCase());
      const pick = (candidates.length > 0 ? candidates : pack.words.map((w) => w.word));
      return pick[Math.floor(Math.random() * pick.length)];
    }
  }
  return BOT_FILLER[Math.floor(Math.random() * BOT_FILLER.length)];
}

/**
 * One bot "tick": make the current bot act (clue or vote), advance the engine,
 * and re-schedule if another bot still needs to act. Drives a paced cadence.
 * Internal — only callable by the scheduler, never by clients.
 */
export const botTick = internalMutation({
  args: { roomId: v.id("rooms"), roundId: v.id("rounds") },
  handler: async (ctx, { roomId, roundId }) => {
    const room = await ctx.db.get(roomId);
    const round = await ctx.db.get(roundId);
    if (room === null || round === null || round.roomId !== roomId) return;

    const players = await ctx.db
      .query("players")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .collect();
    const isBot = (id: Id<"players">) =>
      players.find((p) => p._id === id)?.isBot === true;

    // If a bot inherited host (the human host left), auto-advance the
    // discussion screen so the game can't stall. With a human host, the button
    // drives it and bots do nothing here.
    if (round.phase === "discussion") {
      if (room.hostPlayerId && isBot(room.hostPlayerId)) {
        await advanceFromDiscussion(ctx, room, round);
      }
      return;
    }

    if (round.phase === "clues") {
      // Whose turn is it? (first in order without a clue this pass)
      const cluesNow = await ctx.db
        .query("clues")
        .withIndex("by_round", (q) => q.eq("roundId", round._id))
        .collect();
      const cluedThisPass = new Set(
        cluesNow.filter((c) => c.passNumber === round.currentPass).map((c) => c.playerId),
      );
      const current = round.turnOrder.find((id) => !cluedThisPass.has(id));
      if (current === undefined || !isBot(current)) return; // human's turn → wait

      await ctx.db.insert("clues", {
        roundId: round._id,
        playerId: current,
        passNumber: round.currentPass,
        text: await botClueText(ctx, room, round),
        createdAt: Date.now(),
      });
      await maybeAdvanceCluePhase(ctx, room, round);
      scheduleBotTick(ctx, roomId, roundId); // next bot (clue or vote)
      return;
    }

    if (round.phase === "vote") {
      const eligible = voters(round);
      const voted = new Set(
        (
          await ctx.db
            .query("votes")
            .withIndex("by_round_and_ballot", (q) =>
              q.eq("roundId", round._id).eq("ballotNumber", round.currentBallot),
            )
            .collect()
        ).map((vt) => vt.voterPlayerId),
      );
      const pendingBot = eligible.find((id) => isBot(id) && !voted.has(id));
      if (pendingBot === undefined) return; // only humans left to vote

      const targets = eligible.filter((id) => id !== pendingBot);
      const target = targets[Math.floor(Math.random() * targets.length)];
      await ctx.db.insert("votes", {
        roundId: round._id,
        ballotNumber: round.currentBallot,
        voterPlayerId: pendingBot,
        targetPlayerId: target,
      });
      await maybeResolveBallot(ctx, room, round);
      scheduleBotTick(ctx, roomId, roundId); // next pending bot / next ballot
      return;
    }
    // reveal / resolve / scoreboard → nothing; host advances.
  },
});
