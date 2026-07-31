import { describe, expect, it } from "vitest";
import type { Id } from "./_generated/dataModel";
import {
  decideBallot,
  effectiveImposterCount,
  eligibleVoters,
  isPromptMode,
  nextClueTurn,
  scoreDeltas,
  tallyVotes,
  topTarget,
} from "./engine";

/** Ids are opaque strings at runtime; short names keep the cases readable. */
const p = (name: string) => name as Id<"players">;
const [A, B, C, D, E] = ["A", "B", "C", "D", "E"].map(p);

const vote = (voter: Id<"players">, target: Id<"players">) => ({
  voterPlayerId: voter,
  targetPlayerId: target,
});

describe("isPromptMode", () => {
  it("covers the simultaneous-answer modes only", () => {
    expect(isPromptMode("questions")).toBe(true);
    expect(isPromptMode("scale")).toBe(true);
    expect(isPromptMode("spy")).toBe(false);
    expect(isPromptMode("undercover")).toBe(false);
  });
});

describe("effectiveImposterCount", () => {
  it("never exceeds playerCount - 2, so the crew always outnumber", () => {
    expect(effectiveImposterCount(3, 5)).toBe(1);
    expect(effectiveImposterCount(5, 5)).toBe(3);
    expect(effectiveImposterCount(12, 3)).toBe(3);
  });

  it("never drops below 1, even in degenerate lobbies", () => {
    expect(effectiveImposterCount(3, 1)).toBe(1);
    expect(effectiveImposterCount(2, 1)).toBe(1);
    expect(effectiveImposterCount(0, 4)).toBe(1);
  });
});

describe("eligibleVoters", () => {
  it("drops eliminated players and preserves turn order", () => {
    expect(eligibleVoters([A, B, C, D], [B])).toEqual([A, C, D]);
    expect(eligibleVoters([A, B, C], [])).toEqual([A, B, C]);
    expect(eligibleVoters([A, B], [A, B])).toEqual([]);
  });
});

describe("nextClueTurn", () => {
  it("returns the first player yet to clue this pass", () => {
    expect(nextClueTurn([A, B, C], new Set([A]))).toBe(B);
    expect(nextClueTurn([A, B, C], new Set())).toBe(A);
  });

  it("returns undefined once the pass is complete", () => {
    expect(nextClueTurn([A, B], new Set([A, B]))).toBeUndefined();
  });

  it("follows turn order, not the order players actually clued in", () => {
    // B clued out of order (host skip); A is still the one owing a clue.
    expect(nextClueTurn([A, B, C], new Set([B]))).toBe(A);
  });
});

describe("tallyVotes / topTarget", () => {
  it("counts per target", () => {
    const tally = tallyVotes([vote(A, C), vote(B, C), vote(C, A)]);
    expect(tally.get(C)).toBe(2);
    expect(tally.get(A)).toBe(1);
  });

  it("reports a clear winner", () => {
    expect(topTarget(tallyVotes([vote(A, C), vote(B, C), vote(C, A)]))).toEqual({
      top: C,
      count: 2,
      tie: false,
    });
  });

  it("detects a shared lead as a tie", () => {
    const r = topTarget(tallyVotes([vote(A, B), vote(B, A)]));
    expect(r.tie).toBe(true);
  });

  it("is not fooled by a repeated count below the lead", () => {
    // C leads with 3; A and B both have 1 — equal to each other, not to the lead.
    const r = topTarget(
      tallyVotes([vote(A, C), vote(B, C), vote(C, C), vote(D, A), vote(E, B)]),
    );
    expect(r).toEqual({ top: C, count: 3, tie: false });
  });

  it("detects a tie regardless of which tied player is seen first", () => {
    expect(topTarget(tallyVotes([vote(A, B), vote(C, B), vote(D, A), vote(E, A)])).tie).toBe(true);
    expect(topTarget(tallyVotes([vote(D, A), vote(E, A), vote(A, B), vote(C, B)])).tie).toBe(true);
  });

  it("handles an empty ballot", () => {
    expect(topTarget(tallyVotes([]))).toEqual({ top: null, count: 0, tie: false });
  });
});

describe("decideBallot — single imposter", () => {
  const imposters = [C];

  it("crew win when the imposter is voted out", () => {
    expect(
      decideBallot({
        votes: [vote(A, C), vote(B, C), vote(C, A)],
        imposterPlayerIds: imposters,
        eliminatedPlayerIds: [],
      }),
    ).toEqual({ kind: "finish", outcome: "crew", eliminated: [] });
  });

  it("imposters win when the crew vote out one of their own", () => {
    expect(
      decideBallot({
        votes: [vote(A, B), vote(C, B), vote(B, A)],
        imposterPlayerIds: imposters,
        eliminatedPlayerIds: [],
      }),
    ).toEqual({ kind: "finish", outcome: "imposters", eliminated: [] });
  });

  it("imposters win on a tie", () => {
    expect(
      decideBallot({
        votes: [vote(A, C), vote(B, A)],
        imposterPlayerIds: imposters,
        eliminatedPlayerIds: [],
      }),
    ).toEqual({ kind: "finish", outcome: "imposters", eliminated: [] });
  });

  it("imposters win when nobody voted", () => {
    expect(
      decideBallot({
        votes: [],
        imposterPlayerIds: imposters,
        eliminatedPlayerIds: [],
      }),
    ).toEqual({ kind: "finish", outcome: "imposters", eliminated: [] });
  });
});

describe("decideBallot — multiple imposters", () => {
  const imposters = [C, D];

  it("opens another ballot when one of several imposters is caught", () => {
    expect(
      decideBallot({
        votes: [vote(A, C), vote(B, C)],
        imposterPlayerIds: imposters,
        eliminatedPlayerIds: [],
      }),
    ).toEqual({ kind: "nextBallot", eliminated: [C] });
  });

  it("crew win once the last imposter is caught", () => {
    expect(
      decideBallot({
        votes: [vote(A, D), vote(B, D)],
        imposterPlayerIds: imposters,
        eliminatedPlayerIds: [C],
      }),
    ).toEqual({ kind: "finish", outcome: "crew", eliminated: [C, D] });
  });

  it("imposters win immediately if a crew member is voted out", () => {
    expect(
      decideBallot({
        votes: [vote(A, B), vote(C, B), vote(D, B)],
        imposterPlayerIds: imposters,
        eliminatedPlayerIds: [],
      }),
    ).toEqual({ kind: "finish", outcome: "imposters", eliminated: [] });
  });

  it("does NOT record a voted-out crew member as eliminated", () => {
    // Preserved quirk: `eliminated` only ever grows on an imposter catch.
    const r = decideBallot({
      votes: [vote(A, B), vote(C, B)],
      imposterPlayerIds: imposters,
      eliminatedPlayerIds: [],
    });
    expect(r.eliminated).not.toContain(B);
  });

  it("imposters win on a tie even mid-elimination", () => {
    expect(
      decideBallot({
        votes: [vote(A, D), vote(B, E)],
        imposterPlayerIds: imposters,
        eliminatedPlayerIds: [C],
      }),
    ).toEqual({ kind: "finish", outcome: "imposters", eliminated: [C] });
  });
});

describe("scoreDeltas", () => {
  it("gives +1 to each crew member who voted for an imposter", () => {
    const d = scoreDeltas({
      votes: [vote(A, C), vote(B, C), vote(C, A)],
      imposterPlayerIds: [C],
      eliminatedPlayerIds: [],
      outcome: "crew",
    });
    expect(d.get(A)).toBe(1);
    expect(d.get(B)).toBe(1);
    expect(d.has(C)).toBe(false);
  });

  it("credits a correct voter only once across multiple ballots", () => {
    const d = scoreDeltas({
      votes: [vote(A, C), vote(A, D)],
      imposterPlayerIds: [C, D],
      eliminatedPlayerIds: [C, D],
      outcome: "crew",
    });
    expect(d.get(A)).toBe(1);
  });

  it("still rewards a correct vote when the crew lost the round", () => {
    const d = scoreDeltas({
      votes: [vote(A, C), vote(B, D)],
      imposterPlayerIds: [C],
      eliminatedPlayerIds: [],
      outcome: "imposters",
    });
    expect(d.get(A)).toBe(1);
  });

  it("gives +2 to surviving imposters when the imposters won", () => {
    const d = scoreDeltas({
      votes: [vote(A, B)],
      imposterPlayerIds: [C, D],
      eliminatedPlayerIds: [],
      outcome: "imposters",
    });
    expect(d.get(C)).toBe(2);
    expect(d.get(D)).toBe(2);
  });

  it("gives no bonus to an eliminated imposter", () => {
    const d = scoreDeltas({
      votes: [vote(A, C)],
      imposterPlayerIds: [C, D],
      eliminatedPlayerIds: [C],
      outcome: "imposters",
    });
    expect(d.has(C)).toBe(false);
    expect(d.get(D)).toBe(2);
  });

  it("gives no imposter bonus when the crew won", () => {
    const d = scoreDeltas({
      votes: [vote(A, C)],
      imposterPlayerIds: [C],
      eliminatedPlayerIds: [],
      outcome: "crew",
    });
    expect(d.has(C)).toBe(false);
  });

  it("never credits an imposter for voting at another imposter", () => {
    const d = scoreDeltas({
      votes: [vote(C, D)],
      imposterPlayerIds: [C, D],
      eliminatedPlayerIds: [],
      outcome: "crew",
    });
    expect(d.size).toBe(0);
  });

  it("combines both awards for an imposter who also voted correctly", () => {
    // C is an imposter, so their vote earns nothing; D survives for +2.
    const d = scoreDeltas({
      votes: [vote(A, D), vote(C, D)],
      imposterPlayerIds: [C, D],
      eliminatedPlayerIds: [],
      outcome: "imposters",
    });
    expect(d.get(A)).toBe(1);
    expect(d.get(C)).toBe(2);
    expect(d.get(D)).toBe(2);
  });

  it("returns an empty map when nothing was earned", () => {
    const d = scoreDeltas({
      votes: [vote(A, B)],
      imposterPlayerIds: [C],
      eliminatedPlayerIds: [],
      outcome: "crew",
    });
    expect(d.size).toBe(0);
  });
});
