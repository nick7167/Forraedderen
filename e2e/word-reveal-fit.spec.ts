import { test, expect, type Page } from "@playwright/test";
import { DANISH_PACKS } from "../convex/packData";

/**
 * Word-mode (Klassisk) reveal — where the concept's 286:402 card lives.
 *
 * Prompt modes deliberately give up that ratio (a sentence needs measure, not
 * portrait proportions — see scale-reveal-fit.spec.ts), so this is the spec
 * that holds the mockup contract: at 375×812 the card must be exactly 286×402,
 * and the ratio must survive shrinking at every other size.
 *
 * It also injects the longest built-in word. Long Danish compounds
 * (`overstregningstusch`, 19 chars) used to overflow the card horizontally at
 * EVERY viewport including the concept's own reference frame, because
 * `.card-word` had no `overflow-wrap`.
 *
 * Run with:  pnpm exec playwright test e2e/word-reveal-fit.spec.ts
 */


const SIZES = [
  { w: 320, h: 568 },
  { w: 375, h: 667 },
  { w: 390, h: 762 },
  { w: 375, h: 812 }, // the concept's own frame
  { w: 430, h: 932 },
];

const ALL_WORDS = DANISH_PACKS.flatMap((p) => p.words);
const LONGEST_WORD = ALL_WORDS.reduce((a, b) => (b.length > a.length ? b : a));
// The custom-pack cap (convex/packs.ts) — the longest word the game can ever
// deal, built-in or user-authored.
const MAX_WORD = "M".repeat(24);

test.setTimeout(600_000);
test.use({ deviceScaleFactor: 2, isMobile: true, hasTouch: true });

async function dismissAddToHome(page: Page) {
  const cont = page.getByRole("button", { name: /Fortsæt i browser/ });
  if (await cont.first().isVisible().catch(() => false)) {
    await cont.first().click();
    await page.waitForTimeout(250);
  }
}

/**
 * Optionally swap in `probe` and measure in ONE synchronous evaluate — a Convex
 * update re-renders RoleReveal and restores the drawn word, so a two-step
 * inject-then-measure silently measures the wrong string. The class swap
 * mirrors wordLengthClass() in RoleReveal.tsx so the probe renders exactly as
 * the component would render it.
 */
function measureFace(page: Page, probe?: string) {
  return page.evaluate((text: string | undefined) => {
    const back = document.querySelector(
      '[data-testid="card-back"]',
    ) as HTMLElement;
    const wordEl = back.querySelector('[data-testid="card-word"]') as HTMLElement;
    const original = { text: wordEl.textContent, cls: wordEl.className };
    if (text !== undefined) {
      wordEl.textContent = text;
      // `unknown` is the imposter's fixed-size "— ? —" placeholder; drop it so
      // the probe renders as a real word does regardless of the role dealt.
      // The imposter face is otherwise the taller of the two, so this is the
      // stricter of the two layouts to test against.
      wordEl.classList.remove("len-l", "len-xl", "unknown");
      if (text.length > 18) wordEl.classList.add("len-xl");
      else if (text.length > 12) wordEl.classList.add("len-l");
    }
    const cb = document.querySelector('[data-testid="card-scene"]')!.getBoundingClientRect();
    const measured = {
      faceOverflowY: back.scrollHeight - back.clientHeight,
      faceOverflowX: back.scrollWidth - back.clientWidth,
      outside: [...back.children]
        .filter((c) => {
          const r = c.getBoundingClientRect();
          // Deliberately-dropped decoration (display:none) reports a zero rect
          // at the origin — that's shed, not clipped.
          if (r.width === 0 && r.height === 0) return false;
          return (
            r.top < cb.top - 0.5 ||
            r.bottom > cb.bottom + 0.5 ||
            r.left < cb.left - 0.5 ||
            r.right > cb.right + 0.5
          );
        })
        .map((c) => c.className),
      card: { w: Math.round(cb.width), h: Math.round(cb.height) },
      wordSize: getComputedStyle(wordEl).fontSize,
      // Proof the measurement saw the string we asked for.
      rendered: wordEl.textContent ?? "",
    };
    if (text !== undefined) {
      wordEl.textContent = original.text;
      wordEl.className = original.cls;
    }
    return measured;
  }, probe);
}

for (const { w, h } of SIZES) {
  test(`Klassisk reveal fits at ${w}x${h}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });

    await page.goto("/");
    await dismissAddToHome(page);
    await page.getByPlaceholder("Dit navn").fill("Tester");
    await page.getByRole("button", { name: "Opret spil" }).last().click();
    await expect(page.getByTestId("room-code")).toBeVisible({ timeout: 30_000 });

    const coach = page.locator("text=Tilpas spillet");
    if (await coach.isVisible().catch(() => false)) {
      await page.mouse.click(w / 2, h - 60);
      await page.waitForTimeout(300);
    }

    for (let i = 0; i < 2; i++) {
      await page.getByRole("button", { name: /Tilføj bot/ }).click();
      await page.waitForTimeout(400);
    }

    await page.getByRole("button", { name: "Start spil" }).click();
    await expect(page.getByTestId("card-scene")).toBeVisible({ timeout: 30_000 });
    await page.getByTestId("card-scene").click();
    await page.waitForTimeout(1100);

    const m = await measureFace(page);
    console.log(`${w}x${h}`, JSON.stringify(m));

    // The concept's proportions, preserved under shrink.
    expect(
      Math.abs(m.card.w / m.card.h - 286 / 402),
      "word card keeps the concept's 286:402",
    ).toBeLessThan(0.02);
    if (w === 375 && h === 812) {
      expect(m.card, "the concept's reference frame is pixel-exact").toEqual({ w: 286, h: 402 });
    }

    expect(m.faceOverflowY, "card back must not clip vertically").toBeLessThanOrEqual(0);
    expect(m.faceOverflowX, "card back must not clip horizontally").toBeLessThanOrEqual(0);
    expect(m.outside, "every card-back child must sit inside the card").toEqual([]);

    // Long compounds and the custom-pack ceiling must both wrap, not bleed.
    for (const probe of [LONGEST_WORD, MAX_WORD]) {
      const f = await measureFace(page, probe);
      const label = `"${probe}" (${probe.length} chars @ ${f.wordSize})`;
      expect(f.rendered, "probe must be the string measured").toBe(probe);
      expect(f.faceOverflowY, `clipped vertically — ${label}`).toBeLessThanOrEqual(0);
      expect(f.faceOverflowX, `clipped horizontally — ${label}`).toBeLessThanOrEqual(0);
      expect(f.outside, `pushed out of the card — ${label}`).toEqual([]);
    }
  });
}
