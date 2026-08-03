import { describe, it, expect } from "vitest";
import { QUESTION_PAIRS } from "./questionData";
import { SCALE_PAIRS } from "./scaleData";
import { DANISH_PACKS } from "./packData";

/**
 * Content guards for the reveal card.
 *
 * The card lays out and shrinks to fit — but it can only shrink so far before
 * the text stops being readable at arm's length, and the e2e fit specs
 * (`scale-reveal-fit`, `word-reveal-fit`) only prove the *current* extremes fit.
 * These caps sit just above today's longest entries so an authored question or
 * word that blows past the tested envelope fails here, in a fast unit test,
 * rather than silently clipping on someone's phone.
 *
 * If a cap needs raising, raise it deliberately and re-run the e2e fit specs —
 * they measure the real thing.
 */

const QUESTION_MAX = 110;
const SCALE_MAX = 70;
const WORD_MAX = 24; // matches the custom-pack cap in packs.ts

function longest(strings: string[]) {
  return strings.reduce((a, b) => (b.length > a.length ? b : a), "");
}

describe("reveal card content stays inside the tested envelope", () => {
  it(`no question exceeds ${QUESTION_MAX} characters`, () => {
    const worst = longest(QUESTION_PAIRS.flatMap((p) => [p.crew, p.imposter]));
    expect(worst.length, `longest question: "${worst}"`).toBeLessThanOrEqual(QUESTION_MAX);
  });

  it(`no scale prompt exceeds ${SCALE_MAX} characters`, () => {
    const worst = longest(SCALE_PAIRS.flatMap((p) => [p.crew, p.imposter]));
    expect(worst.length, `longest scale prompt: "${worst}"`).toBeLessThanOrEqual(SCALE_MAX);
  });

  it(`no built-in pack word exceeds ${WORD_MAX} characters`, () => {
    const worst = longest(DANISH_PACKS.flatMap((p) => p.words));
    expect(worst.length, `longest word: "${worst}"`).toBeLessThanOrEqual(WORD_MAX);
  });
});
