// Built-in Danish question pairs for the "questions" game mode.
//
// This module is the barrel: the authored pairs live in `convex/content/`, one
// file per tier, and are combined here into the single flat draw pool. The
// content files are large enough that keeping them out of this file is what
// makes either of them readable.
//
// `QUESTION_PAIRS` is the complete pool across every tier. Callers narrow it to
// the tiers a room has enabled — see `pickWords` in round.ts. Do NOT add pairs
// here; add them to the matching file in `convex/content/` so the tier tagging
// and the content-quality tests stay honest.

import type { QuestionPair } from "./content/types";
import { tagTier } from "./content/types";
import { QUESTIONS_FAMILY } from "./content/questions.family";
import { QUESTIONS_PARTY } from "./content/questions.party";
import { QUESTIONS_DANSK } from "./content/questions.dansk";

export type { QuestionPair };

/** Complete question-mode draw pool across every tier. */
export const QUESTION_PAIRS: QuestionPair[] = [
  ...QUESTIONS_FAMILY,
  ...tagTier<QuestionPair>(QUESTIONS_PARTY, "party"),
  ...tagTier<QuestionPair>(QUESTIONS_DANSK, "dansk"),
];
