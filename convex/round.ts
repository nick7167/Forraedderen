import { mutation, internalMutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { DANISH_PACKS } from "./packData";
import { QUESTION_PAIRS } from "./questionData";
import { SCALE_PAIRS } from "./scaleData";
import {
  shuffle,
  requireHost,
  requirePlayer,
  resolvePlayer,
  activePlayers,
  toPublicPlayer,
} from "./lib";
import {
  decideBallot,
  effectiveImposterCount,
  eligibleVoters,
  isPromptMode,
  nextClueTurn,
  scoreDeltas,
} from "./engine";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";

// How long the scheduler waits before a bot acts (feels alive, not instant).
const BOT_ACT_MS = 1300;

/**
 * Stall recovery. The game deliberately has NO turn clock — being timed while
 * you think of a clue makes for a worse party game. What it can't tolerate is
 * someone closing the tab mid-turn: the clue phase is strictly sequential and a
 * ballot waits for every eligible voter, so one vanished player froze the whole
 * round with only the host able to unstick it (and nothing at all could save a
 * round whose *host* had vanished).
 *
 * So recovery keys off presence, not time: a player who has stopped sending
 * heartbeats is skipped; a player who is present is never rushed.
 *
 * OFFLINE_SKIP_MS sits well above PRESENCE_TIMEOUT_MS (12s) so a brief network
 * blip or a backgrounded tab doesn't lose anyone their turn.
 */
const OFFLINE_SKIP_MS = 25_000;

/** How often a round re-checks for a vanished player while one is pending. */
const STALL_POLL_MS = 6_000;

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
    validateForStart(players.length);
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
    validateForStart(players.length);
    await dealRound(ctx, room, nextNumber);
  },
});

/**
 * Delete every round of a room and all their clues + votes. Used when
 * returning to the lobby (so a replay starts clean — no duplicate roundNumbers
 * that would break the `by_room_and_number` lookups) and when a room is torn down.
 */
export async function clearRounds(ctx: MutationCtx, roomId: Id<"rooms">) {
  const rounds = await ctx.db
    .query("rounds")
    .withIndex("by_room", (q) => q.eq("roomId", roomId))
    .collect();
  for (const round of rounds) {
    const clues = await ctx.db
      .query("clues")
      .withIndex("by_round", (q) => q.eq("roundId", round._id))
      .collect();
    for (const c of clues) await ctx.db.delete(c._id);
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_round", (q) => q.eq("roundId", round._id))
      .collect();
    for (const vt of votes) await ctx.db.delete(vt._id);
    await ctx.db.delete(round._id);
  }
}

/** Host returns everyone to the lobby for a fresh match (resets scores). */
export const backToLobby = mutation({
  args: hostArgs(),
  handler: async (ctx, args) => {
    const room = await requireHost(ctx, args);
    // Clear the finished match's rounds so the next match starts with unique
    // round numbers (fixes the "Spil igen" blank screen).
    await clearRounds(ctx, room._id);
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

    const existing = await ctx.db
      .query("clues")
      .withIndex("by_round", (q) => q.eq("roundId", round._id))
      .collect();
    const cluedThisPass = new Set(
      existing.filter((c) => c.passNumber === round.currentPass).map((c) => c.playerId),
    );
    // Enforce sequential turn order server-side (not just in the UI).
    const current = nextClueTurn(round.turnOrder, cluedThisPass);
    if (current !== me._id) {
      throw new Error("Det er ikke din tur endnu.");
    }

    await ctx.db.insert("clues", {
      roundId: round._id,
      playerId: me._id,
      passNumber: round.currentPass,
      text,
      createdAt: Date.now(),
    });

    await maybeAdvanceCluePhase(ctx, room, round);
    scheduleTick(ctx, room._id, round._id);
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
    if (args.targetPlayerId === me._id) {
      throw new Error("Du kan ikke stemme på dig selv.");
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
    scheduleTick(ctx, room._id, round._id);
  },
});

// ---------------------------------------------------------------------------
// Host skip
// ---------------------------------------------------------------------------

/**
 * Host skip. In the clue phase this skips ONLY the current player's turn
 * (places a "—" placeholder and advances to the next player); in the vote
 * phase it force-resolves the ballot ("Afslut afstemning").
 */
export const skipPhase = mutation({
  args: { ...hostArgs(), roundId: v.id("rounds") },
  handler: async (ctx, args) => {
    const room = await requireHost(ctx, args);
    const round = await ctx.db.get(args.roundId);
    if (round === null || round.roomId !== room._id) throw new Error("Ugyldig runde.");
    if (round.phase === "clues") {
      // Skip only the current-turn player (first without a clue this pass).
      const clues = await ctx.db
        .query("clues")
        .withIndex("by_round", (q) => q.eq("roundId", round._id))
        .collect();
      const cluedThisPass = new Set(
        clues.filter((c) => c.passNumber === round.currentPass).map((c) => c.playerId),
      );
      const current = nextClueTurn(round.turnOrder, cluedThisPass);
      if (current) {
        await ctx.db.insert("clues", {
          roundId: round._id,
          playerId: current,
          passNumber: round.currentPass,
          text: "—",
          createdAt: Date.now(),
        });
        await maybeAdvanceCluePhase(ctx, room, round); // advances only if that was the last
      }
    } else if (round.phase === "vote") {
      await resolveBallot(ctx, room, round);
    }
    scheduleTick(ctx, room._id, round._id);
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

    // A "participant" is in this round's turn order. Players who joined
    // mid-match (or otherwise aren't dealt in) are spectators this round and
    // must NOT receive the secret word/role — they wait for the next round.
    const isParticipant = me !== null && round.turnOrder.some((id) => id === me._id);
    const iAmImposter =
      isParticipant && round.imposterPlayerIds.some((id) => id === me!._id);
    const revealEverything = round.phase === "resolve";
    // In undercover/prompt modes the imposter must NOT know they're the
    // imposter during play — they're shown a normal word/question card (the
    // decoy). The truth only comes out at the reveal.
    const hideImposter =
      (round.gameMode === "undercover" || isPromptMode(round.gameMode)) &&
      !revealEverything;

    // Whose turn / who still needs to act this pass (turn order is sequential).
    const cluedThisPass = new Set(
      clues.filter((c) => c.passNumber === round.currentPass).map((c) => c.playerId),
    );
    // Prompt modes answer simultaneously (no turn order, no current turn).
    const currentTurnPlayerId =
      round.phase === "clues" && !isPromptMode(round.gameMode)
        ? nextClueTurn(round.turnOrder, cluedThisPass) ?? null
        : null;

    // In prompt modes, answers are collected on the reveal screen. Hide
    // everyone else's answer text until reveal ends (simultaneous reveal at
    // discussion). You always see your own.
    const answersHidden =
      isPromptMode(round.gameMode) && round.phase === "reveal";
    const cluesOut = answersHidden
      ? clues.map((c) => ({
          ...c,
          text: me && c.playerId === me._id ? c.text : "",
        }))
      : clues;
    // Who has submitted an answer this pass (for the answer-phase roster).
    const answeredPlayerIds = [...cluedThisPass];

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
    if (!isParticipant && !revealEverything) {
      myWord = null; // spectator / not dealt into this round
    } else if (revealEverything || !iAmImposter) {
      myWord = round.secretWord; // crew (and everyone at reveal) see the real word/question
    } else if (round.gameMode === "undercover" || isPromptMode(round.gameMode)) {
      myWord = round.decoyWord ?? null; // hidden imposter sees the decoy word/question
    } else {
      myWord = null; // spy imposter knows no word
    }

    // Everyone in the round can always see the category — crew and imposters
    // alike. (The secret word is still gated by role/mode above.)
    const categoryVisible = revealEverything || isParticipant;

    // Prompt modes: the real crew prompt becomes public from the
    // discussion phase onward, so everyone — including the in-the-dark imposter —
    // can judge which answer doesn't fit. (This reveals the question, never who
    // the imposter is.)
    const sharedPrompt =
      isPromptMode(round.gameMode) &&
      (round.phase === "discussion" ||
        round.phase === "vote" ||
        round.phase === "resolve")
        ? round.secretWord
        : null;

    return {
      roundId: round._id,
      roundNumber: round.roundNumber,
      phase: round.phase,
      gameMode: round.gameMode,
      currentPass: round.currentPass,
      cluePasses: round.cluePasses,
      currentBallot: round.currentBallot,
      category: categoryVisible ? round.category : null,
      sharedPrompt,
      turnOrder: round.turnOrder,
      readyPlayerIds: round.readyPlayerIds ?? [],
      currentTurnPlayerId,
      eliminatedPlayerIds: round.eliminatedPlayerIds,
      phaseDeadline: round.phaseDeadline ?? null,
      clues: cluesOut,
      answeredPlayerIds,
      votedPlayerIds,
      players: allPlayers
        .sort((a, b) => a.joinedAt - b.joinedAt)
        .map((p) => toPublicPlayer(p, room.hostPlayerId)),
      me: me
        ? {
            playerId: me._id,
            isParticipant,
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
            scoreDeltas: round.scoreDeltas ?? [],
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

type MatchStat = {
  playerId: Id<"players">;
  correctVotes: number;
  crewVotesCast: number;
  votesReceived: number;
  imposterWins: number;
};

type AnalyticsPlayer = {
  playerId: Id<"players">;
  name: string;
  avatarEmoji: string;
  avatarColor: string;
};

type MatchHighlight = {
  value: number;
  players: AnalyticsPlayer[];
};

function analyticsPlayer(player: Doc<"players">): AnalyticsPlayer {
  return {
    playerId: player._id,
    name: player.name,
    avatarEmoji: player.avatarEmoji,
    avatarColor: player.avatarColor,
  };
}

function leadersFor(
  stats: MatchStat[],
  playerById: Map<Id<"players">, Doc<"players">>,
  valueFor: (stat: MatchStat) => number,
): MatchHighlight | null {
  const candidates = stats.filter((stat) => playerById.has(stat.playerId));
  const topValue = Math.max(0, ...candidates.map(valueFor));
  if (topValue === 0) return null;
  return {
    value: topValue,
    players: candidates
      .filter((stat) => valueFor(stat) === topValue)
      .map((stat) => analyticsPlayer(playerById.get(stat.playerId)!))
      .sort((a, b) => a.name.localeCompare(b.name, "da")),
  };
}

/**
 * Match-end highlights calculated from the authoritative rounds and ballots.
 * The room is deliberately capped at 12 players and a match at 20 rounds, so
 * the bounded reads below cover the full match without unbounded queries.
 */
export const getMatchAnalytics = query({
  args: playerArgs(),
  handler: async (ctx, args) => {
    await requirePlayer(ctx, args);
    const room = await ctx.db.get(args.roomId);
    if (room === null || room.phase !== "finished") return null;

    const roomPlayers = await ctx.db
      .query("players")
      .withIndex("by_room", (q) => q.eq("roomId", room._id))
      .take(12);
    const playerById = new Map(roomPlayers.map((player) => [player._id, player]));
    const stats = new Map<Id<"players">, MatchStat>(
      roomPlayers.map((player) => [
        player._id,
        {
          playerId: player._id,
          correctVotes: 0,
          crewVotesCast: 0,
          votesReceived: 0,
          imposterWins: 0,
        },
      ]),
    );

    const rounds = await ctx.db
      .query("rounds")
      .withIndex("by_room", (q) => q.eq("roomId", room._id))
      .take(20);

    for (const round of rounds) {
      const imposters = new Set(round.imposterPlayerIds);
      for (const imposterId of round.imposterPlayerIds) {
        const stat = stats.get(imposterId);
        if (
          stat &&
          round.outcome === "imposters" &&
          !round.eliminatedPlayerIds.some((id) => id === imposterId)
        ) {
          stat.imposterWins++;
        }
      }

      const votes = await ctx.db
        .query("votes")
        .withIndex("by_round", (q) => q.eq("roundId", round._id))
        .take(300);
      for (const vote of votes) {
        const targetStat = stats.get(vote.targetPlayerId);
        if (targetStat) targetStat.votesReceived++;

        const voterStat = stats.get(vote.voterPlayerId);
        if (voterStat && !imposters.has(vote.voterPlayerId)) {
          voterStat.crewVotesCast++;
          if (imposters.has(vote.targetPlayerId)) voterStat.correctVotes++;
        }
      }
    }

    const allStats = [...stats.values()];
    const detectiveCandidates = allStats.filter((stat) => stat.crewVotesCast > 0);
    const topAccuracy = Math.max(
      0,
      ...detectiveCandidates.map(
        (stat) => Math.round((stat.correctVotes / stat.crewVotesCast) * 100),
      ),
    );
    const bestDetective: MatchHighlight | null =
      topAccuracy === 0
        ? null
        : {
            value: topAccuracy,
            players: detectiveCandidates
              .filter(
                (stat) =>
                  Math.round((stat.correctVotes / stat.crewVotesCast) * 100) ===
                  topAccuracy,
              )
              .map((stat) => analyticsPlayer(playerById.get(stat.playerId)!))
              .sort((a, b) => a.name.localeCompare(b.name, "da")),
          };

    return {
      bestDetective,
      mostCorrectVotes: leadersFor(allStats, playerById, (stat) => stat.correctVotes),
      mostSuspected: leadersFor(allStats, playerById, (stat) => stat.votesReceived),
      bestBluff: leadersFor(allStats, playerById, (stat) => stat.imposterWins),
    };
  },
});

/**
 * Everything that happened in earlier rounds of this match.
 *
 * People argue about what someone said two rounds ago — and until now there was
 * no way to check. Only *resolved* rounds are included, so this can never leak
 * the current round's secret. Bounded by the 20-round match cap.
 */
export const getRoundHistory = query({
  args: playerArgs(),
  handler: async (ctx, args) => {
    await requirePlayer(ctx, args);
    const room = await ctx.db.get(args.roomId);
    if (room === null) return [];

    const rounds = (
      await ctx.db
        .query("rounds")
        .withIndex("by_room", (q) => q.eq("roomId", room._id))
        .take(20)
    )
      .filter((r) => r.phase === "resolve" && r.outcome !== undefined)
      .sort((a, b) => b.roundNumber - a.roundNumber);

    const out = [];
    for (const round of rounds) {
      const clues = (
        await ctx.db
          .query("clues")
          .withIndex("by_round", (q) => q.eq("roundId", round._id))
          .collect()
      )
        .sort((a, b) => a.createdAt - b.createdAt)
        .map((c) => ({
          playerId: c.playerId,
          passNumber: c.passNumber,
          text: c.text,
        }));

      out.push({
        roundNumber: round.roundNumber,
        gameMode: round.gameMode,
        category: round.category,
        secretWord: round.secretWord,
        decoyWord: round.decoyWord ?? null,
        imposterPlayerIds: round.imposterPlayerIds,
        outcome: round.outcome ?? null,
        clues,
      });
    }
    return out;
  },
});

function validateForStart(playerCount: number) {
  if (playerCount < 3) throw new Error("Mindst 3 spillere skal være med.");
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
    // .order("desc").first() (not .unique()) so a stray duplicate round number
    // can never throw here.
    const prev = await ctx.db
      .query("rounds")
      .withIndex("by_room_and_number", (q) =>
        q.eq("roomId", room._id).eq("roundNumber", roundNumber - 1),
      )
      .order("desc")
      .first();
    if (prev) prevImposters = prev.imposterPlayerIds;
  }
  const imposterCount = effectiveImposterCount(players.length, s.imposterCount);
  let pool = players.filter((p) => !prevImposters.some((id) => id === p._id));
  if (pool.length < imposterCount) pool = players; // small group fallback
  const imposterIds = shuffle(pool).slice(0, imposterCount).map((p) => p._id);

  // Turn order: fully randomized every round — anyone, including an imposter,
  // can be first to give a clue.
  const order = shuffle(players.map((p) => p._id));

  const { word, category, decoyWord } = await pickWords(ctx, room);

  const roundId = await ctx.db.insert("rounds", {
    roomId: room._id,
    roundNumber,
    secretWord: word,
    decoyWord, // undercover only; all imposters share it
    category,
    imposterPlayerIds: imposterIds,
    turnOrder: order,
    // Bots can't tap "ready", so they start ready; humans ready up on the
    // reveal screen and the round auto-begins once everyone is ready.
    readyPlayerIds: players.filter((p) => p.isBot).map((p) => p._id),
    gameMode: s.gameMode,
    // Prompt modes are a single simultaneous answer round.
    cluePasses: isPromptMode(s.gameMode) ? 1 : s.cluePasses,
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

  // reveal → clues is triggered by markReady (or the host via beginClues). The
  // tick arms the stall watchdog for the reveal screen itself.
  scheduleTick(ctx, room._id, roundId);
  return roundId;
}

/**
 * Which content tiers a room draws from. Family content is unconditional; the
 * two toggles ADD their tier on top, so both off is the safe-for-any-table pool
 * and both on is the widest one.
 *
 * `danishContent` defaults to ON when absent so rooms created before tiering
 * existed still see the Danish-culture content; `spicyContent` defaults to OFF
 * because party content should never appear without someone asking for it.
 */
export function enabledTiers(settings: Doc<"rooms">["settings"]) {
  return {
    party: settings.spicyContent === true,
    dansk: settings.danishContent !== false,
  };
}

export function inEnabledTier<T extends { tier?: "party" | "dansk" }>(
  items: readonly T[],
  settings: Doc<"rooms">["settings"],
): readonly T[] {
  const tiers = enabledTiers(settings);
  const pool = items.filter((item) => !item.tier || tiers[item.tier]);
  // Family content is always present, so this can only fire if a tier file is
  // emptied — fall back to the whole list rather than crashing the deal.
  return pool.length > 0 ? pool : items;
}

async function pickWords(
  ctx: QueryCtx,
  room: Doc<"rooms">,
): Promise<{ word: string; category: string; decoyWord?: string }> {
  // Prompt modes draw a crew/imposter pair from their dedicated flat pool. We
  // reuse secretWord (crew prompt) + decoyWord (imposter prompt); there are no
  // categories in these modes, so category is left empty.
  if (isPromptMode(room.settings.gameMode)) {
    const pairs = inEnabledTier(
      room.settings.gameMode === "scale" ? SCALE_PAIRS : QUESTION_PAIRS,
      room.settings,
    );
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    return { word: pair.crew, category: "", decoyWord: pair.imposter };
  }

  // Resolve a {name, words[]} pack to draw from.
  let category: string;
  let words: string[];

  const pinned = room.settings.packId
    ? await ctx.db.get(room.settings.packId)
    : null;

  if (pinned && pinned.words.length > 0) {
    // Host pinned a specific category (built-in or custom) from the DB. An
    // explicit choice always wins — we don't second-guess it against the tier
    // toggles, or pinning a Krydret pack would silently do nothing.
    category = pinned.name;
    words = pinned.words.map((w) => w.word);
  } else {
    // Random category — drawn straight from the in-code pack list, so it always
    // works even on a fresh deployment with an unseeded `packs` table.
    const pool = inEnabledTier(DANISH_PACKS, room.settings);
    const seed = pool[Math.floor(Math.random() * pool.length)];
    category = seed.name;
    words = seed.words;
  }

  const word = words[Math.floor(Math.random() * words.length)];

  let decoyWord: string | undefined;
  if (room.settings.gameMode === "undercover") {
    // A different word from the same category "reminds" the imposter of the real one.
    const others = words.filter((w) => w.toLowerCase() !== word.toLowerCase());
    if (others.length > 0) {
      decoyWord = others[Math.floor(Math.random() * others.length)];
    }
  }

  return { word, category, decoyWord };
}

/**
 * Prompt modes: leave the reveal screen for the discussion. Answers were
 * collected as players readied up; fill any still missing (bots get a filler
 * answer, force-skipped humans get "—") so the discussion shows one per player.
 */
async function startDiscussion(
  ctx: MutationCtx,
  room: Doc<"rooms">,
  round: Doc<"rounds">,
) {
  const clues = await ctx.db
    .query("clues")
    .withIndex("by_round", (q) => q.eq("roundId", round._id))
    .collect();
  const answered = new Set(
    clues.filter((c) => c.passNumber === 1).map((c) => c.playerId),
  );
  const players = await ctx.db
    .query("players")
    .withIndex("by_room", (q) => q.eq("roomId", room._id))
    .collect();
  const isBot = (id: Id<"players">) =>
    players.find((p) => p._id === id)?.isBot === true;

  for (const id of round.turnOrder) {
    if (answered.has(id)) continue;
    await ctx.db.insert("clues", {
      roundId: round._id,
      playerId: id,
      passNumber: 1,
      text: isBot(id) ? await botClueText(ctx, room, round) : "—",
      createdAt: Date.now(),
    });
  }

  await ctx.db.patch(round._id, { phase: "discussion", phaseDeadline: undefined });
  await ctx.db.patch(room._id, { phase: "discussion" });
  scheduleTick(ctx, room._id, round._id);
}

/**
 * Host force-start from the reveal screen. Clue modes go to the clue phase;
 * Prompt modes go straight to discussion (answers are gathered at reveal).
 */
export const beginClues = mutation({
  args: { ...hostArgs(), roundId: v.id("rounds") },
  handler: async (ctx, args) => {
    const room = await requireHost(ctx, args);
    const round = await ctx.db.get(args.roundId);
    if (round === null || round.roomId !== room._id) throw new Error("Ugyldig runde.");
    if (round.phase !== "reveal") return;
    await leaveReveal(ctx, room, round);
  },
});

/**
 * A player taps "ready" on the reveal screen. In prompt modes this also
 * carries their answer (typed on the reveal screen). Once every participant is
 * ready the round auto-advances: clue modes → clue phase; prompt modes →
 * discussion. (The host can still force-start via beginClues.)
 */
export const markReady = mutation({
  args: {
    ...playerArgs(),
    roundId: v.id("rounds"),
    answerText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const me = await requirePlayer(ctx, args);
    const { room, round } = await loadActiveRound(ctx, args.roomId, args.roundId);
    if (round.phase !== "reveal") return;
    // Only participants (dealt into this round) ready up; spectators wait.
    if (!round.turnOrder.some((id) => id === me._id)) return;

    // Prompt modes: record the player's answer (once) as they ready up.
    if (isPromptMode(round.gameMode)) {
      const text = (args.answerText ?? "").trim().slice(0, 60);
      if (text.length === 0) throw new Error("Skriv dit svar.");
      if (round.gameMode === "scale" && !/^[1-5]$/.test(text)) {
        throw new Error("Vælg et tal fra 1 til 5.");
      }
      const existing = await ctx.db
        .query("clues")
        .withIndex("by_round", (q) => q.eq("roundId", round._id))
        .collect();
      const alreadyAnswered = existing.some(
        (c) => c.passNumber === 1 && c.playerId === me._id,
      );
      if (!alreadyAnswered) {
        await ctx.db.insert("clues", {
          roundId: round._id,
          playerId: me._id,
          passNumber: 1,
          text,
          createdAt: Date.now(),
        });
      }
    }

    const ready = new Set(round.readyPlayerIds ?? []);
    ready.add(me._id);
    await ctx.db.patch(round._id, { readyPlayerIds: [...ready] });

    // Everyone ready → advance (mirrors beginClues).
    if (round.turnOrder.every((id) => ready.has(id))) {
      await leaveReveal(ctx, room, round);
    } else {
      // Someone is still on their card. Re-arm the watchdog so a player who
      // closes the tab here can't strand the round.
      scheduleTick(ctx, room._id, round._id);
    }
  },
});

/** Leave the reveal screen: clue modes start cluing, prompt modes discuss. */
async function leaveReveal(
  ctx: MutationCtx,
  room: Doc<"rooms">,
  round: Doc<"rounds">,
) {
  if (isPromptMode(round.gameMode)) {
    await startDiscussion(ctx, room, round);
    return;
  }
  await ctx.db.patch(round._id, { phase: "clues", phaseDeadline: undefined });
  await ctx.db.patch(room._id, { phase: "clues" });
  scheduleTick(ctx, room._id, round._id);
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
      phaseDeadline: undefined,
    });
    await ctx.db.patch(room._id, { phase: "clues" });
  } else {
    await ctx.db.patch(round._id, { phase: "vote", phaseDeadline: undefined });
    await ctx.db.patch(room._id, { phase: "vote" });
  }
  scheduleTick(ctx, room._id, round._id);
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
  return eligibleVoters(round.turnOrder, round.eliminatedPlayerIds);
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

  // Outcome rules live in `engine.ts` and are unit-tested there.
  const decision = decideBallot({
    votes: ballotVotes,
    imposterPlayerIds: round.imposterPlayerIds,
    eliminatedPlayerIds: round.eliminatedPlayerIds,
  });

  if (decision.kind === "nextBallot") {
    await ctx.db.patch(round._id, {
      eliminatedPlayerIds: decision.eliminated,
      currentBallot: round.currentBallot + 1,
      phaseDeadline: undefined,
    });
    return;
  }

  if (decision.eliminated.length !== round.eliminatedPlayerIds.length) {
    await ctx.db.patch(round._id, { eliminatedPlayerIds: decision.eliminated });
  }
  await finishRound(ctx, room, round, decision.outcome, decision.eliminated);
}

/** Score the round, mark it resolved, and move the room to the scoreboard. */
async function finishRound(
  ctx: MutationCtx,
  room: Doc<"rooms">,
  round: Doc<"rounds">,
  outcome: "crew" | "imposters",
  eliminatedPlayerIds: readonly Id<"players">[] = round.eliminatedPlayerIds,
) {
  const allVotes = await ctx.db
    .query("votes")
    .withIndex("by_round", (q) => q.eq("roundId", round._id))
    .collect();

  // Scoring rules live in `engine.ts` and are unit-tested there.
  const deltas = scoreDeltas({
    votes: allVotes,
    imposterPlayerIds: round.imposterPlayerIds,
    eliminatedPlayerIds,
    outcome,
  });
  for (const [playerId, delta] of deltas) {
    const player = await ctx.db.get(playerId);
    if (player) await ctx.db.patch(player._id, { score: player.score + delta });
  }

  await ctx.db.patch(round._id, {
    phase: "resolve",
    outcome,
    phaseDeadline: undefined,
    scoreDeltas: [...deltas].map(([playerId, delta]) => ({ playerId, delta })),
  });
  await ctx.db.patch(room._id, { phase: "scoreboard" });
}

// ---------------------------------------------------------------------------
// Bots — CPU players that auto-play via the Convex scheduler
// ---------------------------------------------------------------------------

/** Schedule an engine tick (bots acting, and stall recovery). */
function scheduleTick(
  ctx: MutationCtx,
  roomId: Id<"rooms">,
  roundId: Id<"rounds">,
  delayMs: number = BOT_ACT_MS,
) {
  void ctx.scheduler.runAfter(delayMs, internal.round.botTick, {
    roomId,
    roundId,
  });
}

const BOT_FILLER = ["hmm", "måske", "noget", "ja", "svært", "tja"];

/** On-theme clue: a random word from the round's category, never the secret word. */
async function botClueText(
  ctx: MutationCtx,
  room: Doc<"rooms">,
  round: Doc<"rounds">,
): Promise<string> {
  // Måleren bots give a valid private scale answer.
  if (round.gameMode === "scale") {
    return String(1 + Math.floor(Math.random() * 5));
  }

  // Questions mode has no predefined answers — real players type their own.
  // Bots are just filler, so they pick a generic one-word answer.
  if (round.gameMode === "questions") {
    return BOT_FILLER[Math.floor(Math.random() * BOT_FILLER.length)];
  }

  // Words for the round's category — works for random games (matched against the
  // DANISH_PACKS constant by name) and pinned built-in/custom packs (the table).
  let words: string[] | null = null;
  const builtIn = DANISH_PACKS.find((p) => p.name === round.category);
  if (builtIn) {
    words = builtIn.words;
  } else if (room.settings.packId) {
    const pack = await ctx.db.get(room.settings.packId);
    if (pack && pack.words.length > 0) words = pack.words.map((w) => w.word);
  }
  if (words && words.length > 0) {
    const candidates = words.filter(
      (w) => w.toLowerCase() !== round.secretWord.toLowerCase(),
    );
    const pick = candidates.length > 0 ? candidates : words;
    return pick[Math.floor(Math.random() * pick.length)];
  }
  return BOT_FILLER[Math.floor(Math.random() * BOT_FILLER.length)];
}

/**
 * One engine tick. Two jobs, in order:
 *
 *   1. Let the bot whose turn it is act (clue or vote), paced so it feels alive.
 *   2. Stall recovery — skip a *participant who has gone offline* so a closed
 *      tab can't freeze the round. See OFFLINE_SKIP_MS. Players who are present
 *      are never skipped, however long they take.
 *
 * While a human is still pending, the tick re-arms itself at STALL_POLL_MS so
 * someone who disappears mid-turn is noticed even if nobody else acts again.
 * `phaseDeadline` gates that loop to a single chain: concurrent actions each
 * schedule a tick, and all but the one that owns the current deadline stop.
 *
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
    const byId = new Map(players.map((p) => [p._id, p]));
    const isBot = (id: Id<"players">) => byId.get(id)?.isBot === true;
    const now = Date.now();
    /** Gone quiet long enough that we stop waiting for them. */
    const hasVanished = (id: Id<"players">) => {
      const p = byId.get(id);
      return p !== undefined && p.isBot !== true && now - p.lastSeen > OFFLINE_SKIP_MS;
    };

    /**
     * Keep polling while someone is still pending, so a player who vanishes
     * mid-turn is picked up even if nobody else touches the game. Only the
     * chain owning the current deadline continues; duplicates stop here.
     */
    const keepWatching = async () => {
      if (round.phaseDeadline !== undefined && now < round.phaseDeadline) return;
      await ctx.db.patch(round._id, { phaseDeadline: now + STALL_POLL_MS });
      scheduleTick(ctx, roomId, roundId, STALL_POLL_MS);
    };

    if (round.phase === "discussion") {
      // Only the host can advance the discussion, so a host who is a bot — or
      // who has left the building — would otherwise strand everyone here.
      const hostId = room.hostPlayerId;
      if (hostId && (isBot(hostId) || hasVanished(hostId))) {
        await advanceFromDiscussion(ctx, room, round);
        return;
      }
      await keepWatching();
      return;
    }

    if (round.phase === "clues") {
      const cluesNow = await ctx.db
        .query("clues")
        .withIndex("by_round", (q) => q.eq("roundId", round._id))
        .collect();
      const cluedThisPass = new Set(
        cluesNow.filter((c) => c.passNumber === round.currentPass).map((c) => c.playerId),
      );

      const current = nextClueTurn(round.turnOrder, cluedThisPass);
      if (current === undefined) return; // pass complete

      // A bot's turn, or a vanished player's turn: fill it and move on. The
      // placeholder matches what a host skip inserts.
      if (isBot(current) || hasVanished(current)) {
        await ctx.db.insert("clues", {
          roundId: round._id,
          playerId: current,
          passNumber: round.currentPass,
          text: isBot(current) ? await botClueText(ctx, room, round) : "—",
          createdAt: Date.now(),
        });
        await maybeAdvanceCluePhase(ctx, room, round);
        scheduleTick(ctx, roomId, roundId);
        return;
      }

      // A present human's turn — wait for them, however long they take.
      await keepWatching();
      return;
    }

    if (round.phase === "vote") {
      const eligible = eligibleVoters(round.turnOrder, round.eliminatedPlayerIds);
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
      if (pendingBot !== undefined) {
        const targets = eligible.filter((id) => id !== pendingBot);
        const target = targets[Math.floor(Math.random() * targets.length)];
        await ctx.db.insert("votes", {
          roundId: round._id,
          ballotNumber: round.currentBallot,
          voterPlayerId: pendingBot,
          targetPlayerId: target,
        });
        await maybeResolveBallot(ctx, room, round);
        scheduleTick(ctx, roomId, roundId);
        return;
      }

      const pending = eligible.filter((id) => !voted.has(id));
      if (pending.length === 0) return;

      // Everyone still present has voted and the rest have vanished — resolve
      // on the votes actually cast rather than waiting forever. Deliberately we
      // do NOT vote on an absent player's behalf; that would fabricate a result.
      if (pending.every(hasVanished)) {
        await resolveBallot(ctx, room, round);
        return;
      }

      await keepWatching();
      return;
    }
    if (round.phase === "reveal") {
      const ready = new Set(round.readyPlayerIds ?? []);
      const pending = round.turnOrder.filter((id) => !ready.has(id));
      if (pending.length === 0) return;
      // Everyone still present has readied up and the rest have vanished — start
      // without them rather than stranding the room on the card screen.
      if (pending.every(hasVanished)) {
        await leaveReveal(ctx, room, round);
        return;
      }
      await keepWatching();
      return;
    }
    // resolve / scoreboard → nothing; the host advances.
  },
});
