// Built-in Danish word packs. Plain common nouns/categories — no licensed
// content, no brand names. Seeded into the `packs` table by
// packs.seedBuiltInPacks / packs.reseedBuiltInPacks.
//
// Barrel module — the packs themselves live in `convex/content/packs.*.ts`:
//   packs.core   the 20 broad categories the game shipped with
//   packs.extra  additional broad family categories
//   packs.party  "Krydret indhold" packs (opt-in)
//   packs.dansk  "Dansk kultur" packs
//
// IMPORTANT: after changing any pack file, run
//   npx convex run packs:reseedBuiltInPacks
// or the deployment keeps serving the previously seeded words.

import type { SeedPack } from "./content/types";
import { tagTier } from "./content/types";
import { PACKS_CORE } from "./content/packs.core";
import { PACKS_EXTRA } from "./content/packs.extra";
import { PACKS_PARTY } from "./content/packs.party";
import { PACKS_DANSK } from "./content/packs.dansk";

export type { SeedPack };

/** Every built-in pack across every tier. */
export const DANISH_PACKS: SeedPack[] = [
  ...PACKS_CORE,
  ...PACKS_EXTRA,
  ...tagTier<SeedPack>(PACKS_PARTY, "party"),
  ...tagTier<SeedPack>(PACKS_DANSK, "dansk"),
];
