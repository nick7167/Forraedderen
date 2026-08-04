import { describe, it, expect } from "vitest";
import type { Doc } from "./_generated/dataModel";
import { enabledTiers, inEnabledTier } from "./round";
import { QUESTION_PAIRS } from "./questionData";
import { SCALE_PAIRS } from "./scaleData";
import { DANISH_PACKS } from "./packData";

/**
 * The content-tier filter behind the two lobby toggles.
 *
 * The rule is ADDITIVE: family content is always drawn from, and each enabled
 * tier layers on top. The two things worth pinning down are the defaults for
 * rooms created before tiering existed (the fields are optional, so `undefined`
 * has to mean something deliberate) and that turning a tier off actually
 * removes its content rather than merely hiding it in the picker.
 */

const settings = (over: Partial<Doc<"rooms">["settings"]> = {}) =>
  ({
    gameMode: "questions",
    imposterCount: 1,
    cluePasses: 1,
    imposterSeesCategory: true,
    impostersKnowEachOther: true,
    roundCount: 5,
    ...over,
  }) as Doc<"rooms">["settings"];

describe("tier defaults", () => {
  it("treats a pre-tiering room as dansk-on, krydret-off", () => {
    // Both fields absent — every room that existed before this change.
    expect(enabledTiers(settings())).toEqual({ party: false, dansk: true });
  });

  it("honours explicit values", () => {
    expect(
      enabledTiers(settings({ spicyContent: true, danishContent: false })),
    ).toEqual({ party: true, dansk: false });
  });
});

/**
 * Declared as a generic function rather than a loop over a mixed array: looping
 * gives `pool` the union `QuestionPair[] | ScalePair[] | SeedPack[]`, and a
 * generic call cannot resolve one `T` from a union, so the convex typecheck
 * fails even though the runtime behaviour is identical. Each call below binds a
 * concrete `T`.
 */
function tierFilteringSuite<T extends { tier?: "party" | "dansk" }>(
  label: string,
  pool: readonly T[],
) {
  describe(`tier filtering — ${label}`, () => {
    it(`${label}: family-only is a strict subset with no tiered items`, () => {
      const only = inEnabledTier(pool, settings({ danishContent: false }));
      expect(only.length).toBeGreaterThan(0);
      expect(only.length).toBeLessThan(pool.length);
      expect(only.every((x) => !x.tier)).toBe(true);
    });

    it(`${label}: each toggle adds exactly its own tier`, () => {
      const family = inEnabledTier(pool, settings({ danishContent: false }));
      const withDansk = inEnabledTier(pool, settings({}));
      const withParty = inEnabledTier(
        pool,
        settings({ spicyContent: true, danishContent: false }),
      );
      const both = inEnabledTier(pool, settings({ spicyContent: true }));

      const dansk = pool.filter((x) => x.tier === "dansk").length;
      const party = pool.filter((x) => x.tier === "party").length;
      expect(dansk).toBeGreaterThan(0);
      expect(party).toBeGreaterThan(0);

      expect(withDansk.length).toBe(family.length + dansk);
      expect(withParty.length).toBe(family.length + party);
      expect(both.length).toBe(pool.length);
    });

    it(`${label}: party content never appears unless krydret is on`, () => {
      for (const s of [settings({}), settings({ danishContent: false })]) {
        expect(inEnabledTier(pool, s).some((x) => x.tier === "party")).toBe(false);
      }
    });
  });
}

tierFilteringSuite("Spørgsmål", QUESTION_PAIRS);
tierFilteringSuite("Måleren", SCALE_PAIRS);
tierFilteringSuite("ordpakker", DANISH_PACKS);
