// Shared shapes for every built-in content module in this directory.
//
// Content is split three ways so the host can widen the draw pool from the
// lobby without ever being surprised by it:
//
//   family  — the default. Always in the pool, works with kids at the table.
//   party   — "Krydret indhold". Adult-leaning; opt-in, off by default.
//   dansk   — "Dansk kultur". Danish traditions/places/habits; on by default.
//
// The tiers are ADDITIVE: family is always drawn from, and each enabled tier
// is layered on top. `tier` is omitted on family items so the 348 pairs and 20
// packs that predate tiering stay valid untouched.

export type ContentTier = "party" | "dansk";

export type QuestionPair = {
  crew: string;
  imposter: string;
  tier?: ContentTier;
};

export type ScalePair = {
  crew: string;
  imposter: string;
  tier?: ContentTier;
};

export type SeedPack = {
  name: string;
  emoji: string;
  words: string[];
  tier?: ContentTier;
};

/** Stamp a tier onto a whole authored batch, so the data files stay clean. */
export function tagTier<T extends { tier?: ContentTier }>(
  items: readonly Omit<T, "tier">[],
  tier: ContentTier,
): T[] {
  return items.map((item) => ({ ...item, tier }) as T);
}
