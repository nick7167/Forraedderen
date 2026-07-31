/**
 * Pure game rules — no database, no context, no side effects.
 *
 * These were extracted verbatim from `round.ts` so the win conditions and
 * scoring can be unit-tested (see `engine.test.ts`). Behaviour is intentionally
 * identical to the pre-extraction implementation, quirks included; the tests
 * lock in what the game *does*, not what it arguably should do. Any deliberate
 * rule change belongs in a separate, reviewed commit.
 */

import type { Id } from "./_generated/dataModel";

type PlayerId = Id<"players">;

/** Modes that use a private prompt and a simultaneous reveal-screen answer. */
export function isPromptMode(gameMode: string): boolean {
  return gameMode === "questions" || gameMode === "scale";
}

/** Clamp the configured imposter count to what the player count allows. */
export function effectiveImposterCount(playerCount: number, configured: number): number {
  return Math.max(1, Math.min(configured, playerCount - 2));
}

/** Players eligible to vote this ballot (in the round, not eliminated). */
export function eligibleVoters(
  turnOrder: readonly PlayerId[],
  eliminatedPlayerIds: readonly PlayerId[],
): PlayerId[] {
  return turnOrder.filter((id) => !eliminatedPlayerIds.some((e) => e === id));
}

/**
 * Whose turn it is in the clue phase: the first player in turn order who hasn't
 * clued in the current pass. `undefined` once everyone has.
 */
export function nextClueTurn(
  turnOrder: readonly PlayerId[],
  cluedThisPass: ReadonlySet<PlayerId>,
): PlayerId | undefined {
  return turnOrder.find((id) => !cluedThisPass.has(id));
}

/** Count votes per target, in first-vote-seen order. */
export function tallyVotes(
  votes: readonly { targetPlayerId: PlayerId }[],
): Map<PlayerId, number> {
  const tally = new Map<PlayerId, number>();
  for (const vote of votes) {
    tally.set(vote.targetPlayerId, (tally.get(vote.targetPlayerId) ?? 0) + 1);
  }
  return tally;
}

/**
 * The most-voted target, and whether the lead is shared.
 *
 * `tie` means "the highest count is held by more than one player" — a shared
 * lead, not merely any repeated count. An empty tally yields `{top: null}`.
 */
export function topTarget(tally: ReadonlyMap<PlayerId, number>): {
  top: PlayerId | null;
  count: number;
  tie: boolean;
} {
  let top: PlayerId | null = null;
  let count = 0;
  let tie = false;
  for (const [id, n] of tally) {
    if (n > count) {
      top = id;
      count = n;
      tie = false;
    } else if (n === count) {
      tie = true;
    }
  }
  return { top, count, tie };
}

/** What resolving the current ballot should do. */
export type BallotDecision =
  /** The round ends now with this outcome. */
  | { kind: "finish"; outcome: "crew" | "imposters"; eliminated: PlayerId[] }
  /** An imposter was caught but others remain — open another ballot. */
  | { kind: "nextBallot"; eliminated: PlayerId[] };

/**
 * Apply the outcome rules to a ballot.
 *
 *  - Tie, or nobody voted ⇒ no elimination ⇒ imposters survive ⇒ imposters win.
 *    (Documented in HowToPlay — players lose to this rule otherwise unexplained.)
 *  - Exactly 1 imposter ⇒ this single ballot decides it: crew win iff the
 *    imposter is the one voted out.
 *  - 2+ imposters ⇒ iterative elimination: voting out a crew member hands the
 *    round to the imposters immediately; catching the last imposter wins it for
 *    the crew; otherwise another ballot opens.
 *
 * Note the deliberate asymmetry preserved from the original: `eliminated` only
 * grows when an *imposter* is voted out. A crew member voted out in a
 * multi-imposter round ends the round without being recorded as eliminated.
 */
export function decideBallot(input: {
  votes: readonly { targetPlayerId: PlayerId }[];
  imposterPlayerIds: readonly PlayerId[];
  eliminatedPlayerIds: readonly PlayerId[];
}): BallotDecision {
  const { votes, imposterPlayerIds, eliminatedPlayerIds } = input;
  const { top, tie } = topTarget(tallyVotes(votes));
  const eliminated = [...eliminatedPlayerIds];

  if (top === null || tie) {
    return { kind: "finish", outcome: "imposters", eliminated };
  }

  const votedOutIsImposter = imposterPlayerIds.some((id) => id === top);

  if (imposterPlayerIds.length === 1) {
    return {
      kind: "finish",
      outcome: votedOutIsImposter ? "crew" : "imposters",
      eliminated,
    };
  }

  if (!votedOutIsImposter) {
    return { kind: "finish", outcome: "imposters", eliminated };
  }

  const nowEliminated = [...eliminated, top];
  const caught = imposterPlayerIds.filter((id) =>
    nowEliminated.some((e) => e === id),
  ).length;

  return caught >= imposterPlayerIds.length
    ? { kind: "finish", outcome: "crew", eliminated: nowEliminated }
    : { kind: "nextBallot", eliminated: nowEliminated };
}

/**
 * Points awarded for a finished round, as a map of player → delta.
 *
 *  - Any non-imposter who voted for an imposter scores +1, **once per round**
 *    however many ballots they got it right on. This is awarded even when the
 *    crew ultimately lose the round — being right still counts.
 *  - If the imposters won, every imposter not recorded as eliminated scores +2.
 *
 * Players with no change are omitted.
 */
export function scoreDeltas(input: {
  votes: readonly { voterPlayerId: PlayerId; targetPlayerId: PlayerId }[];
  imposterPlayerIds: readonly PlayerId[];
  eliminatedPlayerIds: readonly PlayerId[];
  outcome: "crew" | "imposters";
}): Map<PlayerId, number> {
  const { votes, imposterPlayerIds, eliminatedPlayerIds, outcome } = input;
  const imposters = new Set(imposterPlayerIds);
  const deltas = new Map<PlayerId, number>();

  const credited = new Set<PlayerId>();
  for (const vote of votes) {
    if (!imposters.has(vote.voterPlayerId) && imposters.has(vote.targetPlayerId)) {
      credited.add(vote.voterPlayerId);
    }
  }
  for (const voter of credited) {
    deltas.set(voter, (deltas.get(voter) ?? 0) + 1);
  }

  if (outcome === "imposters") {
    for (const imposterId of imposterPlayerIds) {
      if (!eliminatedPlayerIds.some((e) => e === imposterId)) {
        deltas.set(imposterId, (deltas.get(imposterId) ?? 0) + 2);
      }
    }
  }

  return deltas;
}
