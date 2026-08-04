import { describe, it, expect } from "vitest";
import { QUESTION_PAIRS } from "./questionData";
import { SCALE_PAIRS } from "./scaleData";
import { DANISH_PACKS } from "./packData";
import type { QuestionPair } from "./content/types";

/**
 * Content quality gate.
 *
 * `content-length.test.ts` guards the *reveal card* — whether text physically
 * fits. This file guards the *game*: whether the pools are big, varied, and
 * internally consistent enough that a group can't memorise them.
 *
 * The two failure modes it exists to catch:
 *
 *   1. Literal duplicates. Easy to introduce when authoring thousands of items
 *      in batches, and invisible until a player sees the same prompt twice.
 *   2. SHAPE monotony. Far more damaging and much harder to notice by reading:
 *      a pool that is 75% "Hvor mange …" feels repetitive long before it runs
 *      out of items. The distribution assertions below are the real teeth here.
 *
 * The draw is memoryless (`Math.random()` in round.ts `pickWords`), so pool
 * size is the only thing standing between a group and a repeat. `MIN_*` below
 * encode the sizes that keep expected repeats near 0.1 per 15-round evening;
 * they are floors, not targets — never lower one to make a test pass.
 */

// Pool floors. Expected repeats in N draws ≈ C(N,2)/pool; at N=15 these give
// roughly 0.15 (scale) and 0.09 (questions) per evening.
const MIN_QUESTIONS = 1100;
const MIN_SCALE = 650;
const MIN_WORDS = 6000;
const MIN_PACKS = 38;
// A pinned pack is the entire draw pool for that room, so shallow packs are
// where repeats show up first.
const MIN_WORDS_PER_PACK = 120;

// Danish letters, digits, and the punctuation the existing corpus uses. Exists
// to catch mojibake (Ã¦/Ã¸/Ã¥), smart quotes, and stray control characters.
//
// The umlauts and cedilla are here on purpose: they are the *correct* Danish
// spelling of borrowed words and European place names (München, Zürich, crème,
// curaçao). Narrowing this to pure Danish letters would force misspellings.
const ALLOWED = /^[A-Za-zÆØÅæøåÉéÈèÊêËëÛûÜüÔôÖöÀàÁáÄäÇçÑñ0-9 '(),.:%?/&-]+$/;

const normalise = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-zæøå0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokens = (s: string) => new Set(normalise(s).split(" ").filter(Boolean));

function jaccard(a: Set<string>, b: Set<string>) {
  let shared = 0;
  for (const t of a) if (b.has(t)) shared++;
  return shared / (a.size + b.size - shared);
}

/**
 * The answer TYPE a question demands. In Spørgsmål everyone writes a free-text
 * one-word answer, so if the crew is answering "3" and the imposter is
 * answering "Mette" the imposter is caught by format rather than by content —
 * the whole game collapses.
 *
 * Deliberately only THREE buckets. Finer classification produces false
 * positives without catching anything real: "Hvad er din yndlingsfarve?" and
 * "Hvilken farve er din yndlingstrøje?" are a perfectly good pair, because
 * `hvad` and `hvilken` both take a noun in Danish. What genuinely leaks is a
 * number against a word, or a person's name against anything else.
 */
function answerType(q: string): "number" | "person" | "word" {
  const n = normalise(q);
  if (/^hvem/.test(n)) return "person";
  if (
    /^hvor (mange|gammel|gammelt|lang|langt|længe|tit|ofte|højt|dyrt|mange gange)\b/.test(n)
  ) {
    return "number";
  }
  return "word";
}

/** Leading shape of a prompt, used for the distribution assertions. */
function opener(q: string) {
  return normalise(q).split(" ").slice(0, 2).join(" ");
}

function distribution(items: string[]) {
  const counts = new Map<string, number>();
  for (const q of items) counts.set(opener(q), (counts.get(opener(q)) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function findDuplicates(values: string[]) {
  const seen = new Map<string, string>();
  const dupes: string[] = [];
  for (const v of values) {
    const key = normalise(v);
    if (seen.has(key)) dupes.push(`"${v}" ≈ "${seen.get(key)}"`);
    else seen.set(key, v);
  }
  return dupes;
}

/** Every pair whose two sides are ≥ threshold similar to another pair's. */
function findNearDuplicates(values: string[], threshold: number) {
  const toks = values.map(tokens);
  const hits: string[] = [];
  // Index by token so this stays near-linear instead of O(n²) at 2,400 items.
  const byToken = new Map<string, number[]>();
  toks.forEach((set, i) => {
    for (const t of set) {
      if (!byToken.has(t)) byToken.set(t, []);
      byToken.get(t)!.push(i);
    }
  });
  const checked = new Set<string>();
  toks.forEach((set, i) => {
    const candidates = new Set<number>();
    for (const t of set) for (const j of byToken.get(t) ?? []) if (j > i) candidates.add(j);
    for (const j of candidates) {
      const key = `${i}:${j}`;
      if (checked.has(key)) continue;
      checked.add(key);
      if (jaccard(set, toks[j]) >= threshold) {
        hits.push(`"${values[i]}"\n    ≈ "${values[j]}"`);
      }
    }
  });
  return hits;
}

const allQuestions = QUESTION_PAIRS.flatMap((p) => [p.crew, p.imposter]);
const allScale = SCALE_PAIRS.flatMap((p) => [p.crew, p.imposter]);
const allWords = DANISH_PACKS.flatMap((p) => p.words);

describe("pool depth", () => {
  it(`Spørgsmål has at least ${MIN_QUESTIONS} pairs`, () => {
    expect(QUESTION_PAIRS.length).toBeGreaterThanOrEqual(MIN_QUESTIONS);
  });

  it(`Måleren has at least ${MIN_SCALE} pairs`, () => {
    expect(SCALE_PAIRS.length).toBeGreaterThanOrEqual(MIN_SCALE);
  });

  it(`word packs hold at least ${MIN_WORDS} words across ${MIN_PACKS}+ packs`, () => {
    expect(allWords.length).toBeGreaterThanOrEqual(MIN_WORDS);
    expect(DANISH_PACKS.length).toBeGreaterThanOrEqual(MIN_PACKS);
  });

  it(`no pack is shallower than ${MIN_WORDS_PER_PACK} words`, () => {
    const shallow = DANISH_PACKS.filter(
      (p) => p.words.length < MIN_WORDS_PER_PACK,
    ).map((p) => `${p.name} (${p.words.length})`);
    expect(shallow, `packs below the floor: ${shallow.join(", ")}`).toEqual([]);
  });
});

describe("no duplicates", () => {
  it("every crew question is unique", () => {
    const dupes = findDuplicates(QUESTION_PAIRS.map((p) => p.crew));
    expect(dupes, `duplicate crew questions:\n${dupes.join("\n")}`).toEqual([]);
  });

  it("every imposter question is unique", () => {
    const dupes = findDuplicates(QUESTION_PAIRS.map((p) => p.imposter));
    expect(dupes, `duplicate imposter questions:\n${dupes.join("\n")}`).toEqual([]);
  });

  it("every Måleren prompt is unique across both sides", () => {
    const dupes = findDuplicates(allScale);
    expect(dupes, `duplicate scale prompts:\n${dupes.join("\n")}`).toEqual([]);
  });

  it("no pair has the same question on both sides", () => {
    const same = [...QUESTION_PAIRS, ...SCALE_PAIRS]
      .filter((p) => normalise(p.crew) === normalise(p.imposter))
      .map((p) => p.crew);
    expect(same, `crew === imposter:\n${same.join("\n")}`).toEqual([]);
  });

  it("no two questions are near-duplicates of each other", () => {
    const hits = findNearDuplicates(QUESTION_PAIRS.map((p) => p.crew), 0.8);
    expect(hits, `near-duplicate crew questions:\n${hits.join("\n")}`).toEqual([]);
  });

  it("no two Måleren prompts are near-duplicates of each other", () => {
    const hits = findNearDuplicates(allScale, 0.8);
    expect(hits, `near-duplicate scale prompts:\n${hits.join("\n")}`).toEqual([]);
  });
});

describe("formatting", () => {
  it("every question and prompt ends with a question mark", () => {
    const bad = [...allQuestions, ...allScale].filter((q) => !q.endsWith("?"));
    expect(bad, `missing "?":\n${bad.join("\n")}`).toEqual([]);
  });

  it("every question and prompt starts with a capital letter", () => {
    const bad = [...allQuestions, ...allScale].filter(
      (q) => q[0] !== q[0]?.toUpperCase(),
    );
    expect(bad, `lowercase opener:\n${bad.join("\n")}`).toEqual([]);
  });

  it("all content uses only Danish letters and expected punctuation", () => {
    const bad = [...allQuestions, ...allScale, ...allWords].filter(
      (s) => !ALLOWED.test(s),
    );
    expect(bad, `unexpected characters (mojibake?):\n${bad.join("\n")}`).toEqual([]);
  });

  it("no content has leading, trailing, or doubled whitespace", () => {
    const bad = [...allQuestions, ...allScale, ...allWords].filter(
      (s) => s !== s.trim() || /\s\s/.test(s),
    );
    expect(bad, `whitespace problems:\n${bad.join("\n")}`).toEqual([]);
  });
});

describe("every prompt stands alone", () => {
  /**
   * A player only ever sees THEIR OWN side of a pair. So a prompt whose
   * pronoun points at the partner prompt — "Hvor dårlig samvittighed får du af
   * det?" — is literally unanswerable for whoever holds it, and it marks the
   * imposter the moment they try.
   *
   * These patterns are deliberately narrow: a referential `den`/`det`/`dem` in
   * trailing position with nothing in the same string to bind to. Broader
   * pronoun detection produces mostly false positives, because Danish is full
   * of perfectly self-contained pronouns — the expletive subject in "Hvor svært
   * er det at sige nej?", the idiom "med det samme", the nominal "er du den,
   * der betaler?", and any prompt that names its own antecedent ("…fyldt en
   * elkedel og glemt at tænde for den?").
   */
  const DANGLING: [RegExp, string][] = [
    [/\b(af|på|om|med|fra|til|ved|efter|over|for) (den|det|dem)\?$/i, "trailing pronoun after a preposition"],
    [/\b(den|det|dem) (bagefter|alligevel|faktisk|typisk|igen)\?$/i, "pronoun + adverb with no antecedent"],
    [/\bgør du (det|den|dem)\?$/i, "‘gør du det?’ with no antecedent"],
    [/\bstyr på det\?$/i, "‘styr på det?’ with no antecedent"],
    [/\bden (dag|hele vejen igennem)\b/i, "definite back-reference to the partner prompt"],
    [/\bhusker du af dagen\?$/i, "‘dagen’ is only defined in the partner prompt"],
  ];

  /**
   * A trailing pronoun is fine when the prompt first sets up its own referent
   * in a coordinated or subordinate clause — "…fyldt en elkedel OG glemt at
   * tænde for den?" names the kettle before pointing at it. Requiring one of
   * these linkers before the pronoun is what separates those from a bare
   * "…får du af det?", which has nothing to point at.
   */
  const HAS_LOCAL_ANTECEDENT = /\b(og|uden|hvis|når|som|der|at|men|fordi|selvom)\b/i;

  function danglingReason(s: string): string | undefined {
    for (const [re, why] of DANGLING) {
      if (!re.test(s)) continue;
      const upToPronoun = s.slice(0, s.search(re));
      if (HAS_LOCAL_ANTECEDENT.test(upToPronoun)) continue;
      return why;
    }
    return undefined;
  }

  it("no prompt depends on its partner to make sense", () => {
    const bad = [...allQuestions, ...allScale]
      .map((s) => [s, danglingReason(s)] as const)
      .filter(([, why]) => why)
      .map(([s, why]) => `${why}: "${s}"`);
    expect(bad, `prompts that cannot be answered alone:\n${bad.join("\n")}`).toEqual([]);
  });
});

describe("Spørgsmål answer types match within a pair", () => {
  /**
   * Only Spørgsmål needs this. Måleren is exempt by construction: everyone
   * answers on the same 1–5 scale whichever prompt they hold, so a mismatched
   * opener can never leak the imposter there.
   */
  it("crew and imposter demand the same kind of answer", () => {
    const mismatched = QUESTION_PAIRS.filter(
      (p: QuestionPair) => answerType(p.crew) !== answerType(p.imposter),
    ).map(
      (p) =>
        `[${answerType(p.crew)} vs ${answerType(p.imposter)}]\n    crew: "${p.crew}"\n    imp:  "${p.imposter}"`,
    );
    expect(
      mismatched,
      `${mismatched.length} pairs leak the imposter by answer format:\n${mismatched.join("\n")}`,
    ).toEqual([]);
  });
});

describe("shape variety", () => {
  /**
   * The assertion that actually encodes "stop feeling repetitive". Without it a
   * pool can grow 4x and still read as the same handful of questions, because
   * volume was added in the shapes that were already dominant.
   */
  const MAX_SHARE = 0.25;

  it(`no Spørgsmål opener exceeds ${MAX_SHARE * 100}% of the pool`, () => {
    const dist = distribution(QUESTION_PAIRS.map((p) => p.crew));
    const over = dist
      .filter(([, n]) => n / QUESTION_PAIRS.length > MAX_SHARE)
      .map(([o, n]) => `"${o}…" ${n}/${QUESTION_PAIRS.length} (${Math.round((100 * n) / QUESTION_PAIRS.length)}%)`);
    expect(over, `over-represented openers:\n${over.join("\n")}\n\nfull distribution: ${JSON.stringify(dist.slice(0, 12))}`).toEqual([]);
  });

  it(`no Måleren opener exceeds ${MAX_SHARE * 100}% of the pool`, () => {
    const dist = distribution(SCALE_PAIRS.map((p) => p.crew));
    const over = dist
      .filter(([, n]) => n / SCALE_PAIRS.length > MAX_SHARE)
      .map(([o, n]) => `"${o}…" ${n}/${SCALE_PAIRS.length} (${Math.round((100 * n) / SCALE_PAIRS.length)}%)`);
    expect(over, `over-represented openers:\n${over.join("\n")}\n\nfull distribution: ${JSON.stringify(dist.slice(0, 12))}`).toEqual([]);
  });
});

describe("word packs", () => {
  it("no pack contains the same word twice", () => {
    const problems: string[] = [];
    for (const pack of DANISH_PACKS) {
      const dupes = findDuplicates(pack.words);
      if (dupes.length) problems.push(`${pack.name}: ${dupes.join(", ")}`);
    }
    expect(problems, `duplicate words within a pack:\n${problems.join("\n")}`).toEqual([]);
  });

  it("each pack capitalises its words consistently", () => {
    // Packs are internally consistent but differ from each other by design —
    // "Dyr" is Title Case, "Madretter" is lowercase. Only mixing WITHIN a pack
    // looks like a mistake on the reveal card.
    const problems: string[] = [];
    for (const pack of DANISH_PACKS) {
      // Skip digit-initial words ("3d-printer") — they have no case to be
      // consistent about, and counting them as capitalised is a false positive.
      const cased = pack.words.filter((w) => /^\p{L}/u.test(w));
      const upper = cased.filter((w) => w[0] === w[0]?.toUpperCase()).length;
      const lower = cased.length - upper;
      if (upper > 0 && lower > 0) {
        problems.push(`${pack.name}: ${upper} capitalised vs ${lower} lowercase`);
      }
    }
    expect(problems, `inconsistent capitalisation:\n${problems.join("\n")}`).toEqual([]);
  });

  it("every pack has a unique name and an emoji", () => {
    const dupes = findDuplicates(DANISH_PACKS.map((p) => p.name));
    expect(dupes, `duplicate pack names: ${dupes.join(", ")}`).toEqual([]);
    const noEmoji = DANISH_PACKS.filter((p) => !p.emoji.trim()).map((p) => p.name);
    expect(noEmoji, `packs missing an emoji: ${noEmoji.join(", ")}`).toEqual([]);
  });
});
