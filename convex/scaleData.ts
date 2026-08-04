// Built-in prompt pairs for "Måleren" (the scale game mode).
//
// Barrel module — the authored pairs live in `convex/content/scale.*.ts`, one
// file per tier. `SCALE_PAIRS` is the complete pool; `pickWords` in round.ts
// narrows it to the tiers a room has enabled.
//
// Måleren prompts are the tightest content in the game: a hard 70-character cap
// and both prompts must sit on the same 1–5 scale. Add new pairs to the tier
// file, not here.

import type { ScalePair } from "./content/types";
import { tagTier } from "./content/types";
import { SCALE_FAMILY } from "./content/scale.family";
import { SCALE_PARTY } from "./content/scale.party";
import { SCALE_DANSK } from "./content/scale.dansk";

export type { ScalePair };

/** Complete Måleren draw pool across every tier. */
export const SCALE_PAIRS: ScalePair[] = [
  ...SCALE_FAMILY,
  ...tagTier<ScalePair>(SCALE_PARTY, "party"),
  ...tagTier<ScalePair>(SCALE_DANSK, "dansk"),
];
