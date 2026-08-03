import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import { QUESTION_PAIRS } from "../convex/questionData";
import { createRoom, addBots } from "./helpers";

/**
 * The prompt-mode role-reveal screen must fit without scrolling *and* without
 * clipping the card's own contents.
 *
 * Måleren is the tallest variant in the app: the card plus a round counter, the
 * ready roster, a 1–5 picker, the ready button and (for the host) a force-start
 * button. Run across a range of viewport heights — 762 is the one that
 * originally overflowed and clipped the ready roster, 568 is the one that
 * clipped the question itself.
 *
 * Run with:  pnpm exec playwright test e2e/scale-reveal-fit.spec.ts
 */

const OUT = "qa-screenshots";

// Common phone viewports (CSS px), including the 762 that regressed.
const SIZES = [
  { w: 320, h: 568 }, // iPhone SE 1st gen — the tightest realistic case
  { w: 375, h: 667 }, // iPhone SE 2/3
  { w: 390, h: 762 },
  { w: 375, h: 812 }, // the concept's own frame
  { w: 430, h: 932 }, // iPhone 15 Pro Max
];

// The real content, not a synthetic string. Questions run far longer than the
// single words the card was originally designed for — the longest is 102 chars
// against a card sized for "Blæksprutte" — and that gap is the whole bug.
const ALL_QUESTIONS = QUESTION_PAIRS.flatMap((p) => [p.crew, p.imposter]);
const LONGEST = ALL_QUESTIONS.reduce((a, b) => (b.length > a.length ? b : a));
const SHORTEST = ALL_QUESTIONS.reduce((a, b) => (b.length < a.length ? b : a));

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
 * Measure the revealed card face. `faceOverflow` is the check that would have
 * caught the original bug: the face is `overflow:hidden` + `justify-content:
 * center`, so overflow is clipped symmetrically and the label and hint pill
 * silently leave the card *before* the question does.
 */
/**
 * Optionally swap in `probe` and measure in ONE synchronous evaluate.
 *
 * Injecting the text in a separate call doesn't work: a Convex subscription
 * update (bots readying up) re-renders RoleReveal and restores the drawn
 * question, so a measurement taken even 80ms later silently measures the wrong
 * string. JS is single-threaded, so React cannot run mid-evaluate — set, read,
 * restore. The layout is pure CSS, which is what makes swapping the text a
 * faithful stand-in for the server dealing that question.
 */
function measureFace(page: Page, probe?: string) {
  return page.evaluate((text: string | undefined) => {
    const back = document.querySelector(
      '[data-testid="card-back"]',
    ) as HTMLElement;
    const wordEl = back.querySelector('[data-testid="card-word"]') as HTMLElement;
    const original = wordEl.textContent;
    if (text !== undefined) wordEl.textContent = text;
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
      wordSize: getComputedStyle(wordEl).fontSize,
      // Proof the measurement saw the string we asked for.
      rendered: wordEl.textContent ?? "",
    };
    if (text !== undefined) wordEl.textContent = original;
    return measured;
  }, probe);
}

for (const { w, h } of SIZES) {
  test(`Måleren reveal fits at ${w}x${h}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });

    // Shared setup — see createRoom() for why the CTA needs a forced click here.
    await createRoom(page);
    await addBots(page, 2);

    // Switch to Måleren.
    await page.getByRole("button", { name: "Indstillinger" }).click();
    await expect(page.getByTestId("settings-panel")).toBeVisible();
    await page.getByTestId("mode-card").filter({ hasText: "Måleren" }).click();
    await page.waitForTimeout(400);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);

    await page.getByRole("button", { name: "Start spil" }).click();
    await expect(page.getByTestId("card-scene")).toBeVisible({ timeout: 30_000 });

    // Flip to the answer side — that's when the picker appears in the footer.
    await page.getByTestId("card-scene").click();
    await page.waitForTimeout(1100);
    await expect(page.getByTestId("scale-row")).toBeVisible();

    fs.mkdirSync(OUT, { recursive: true });
    await page.screenshot({ path: `${OUT}/scale-reveal-${w}x${h}.png` });

    const m = await page.evaluate(() => {
      const screen = document.querySelector('[data-testid="s-reveal"]') as HTMLElement;
      const content = document.querySelector('[data-testid="s-reveal"]') as HTMLElement;
      const card = document.querySelector('[data-testid="card-scene"]')!.getBoundingClientRect();
      const ready = document.querySelector('[data-testid="ready-row"]')!.getBoundingClientRect();
      const round = document.querySelector('[data-testid="round-info"]')!.getBoundingClientRect();
      const footer = document.querySelector('[data-testid="reveal-footer"]')!.getBoundingClientRect();
      return {
        docScrollY: document.documentElement.scrollHeight - document.documentElement.clientHeight,
        contentScrollY: content.scrollHeight - content.clientHeight,
        screenScrollY: screen.scrollHeight - screen.clientHeight,
        card: { w: Math.round(card.width), h: Math.round(card.height) },
        roundTop: Math.round(round.top),
        readyBottom: Math.round(ready.bottom),
        footerTop: Math.round(footer.top),
        vh: window.innerHeight,
      };
    });
    console.log(`${w}x${h}`, JSON.stringify(m));

    // Nothing scrolls.
    expect(m.docScrollY, "page must not scroll").toBeLessThanOrEqual(0);
    expect(m.contentScrollY, "reveal body must not scroll").toBeLessThanOrEqual(0);
    expect(m.screenScrollY, "reveal screen must not scroll").toBeLessThanOrEqual(0);
    // The ready roster must clear the footer rather than run under the picker.
    expect(m.readyBottom, "ready roster must sit above the footer").toBeLessThanOrEqual(m.footerTop + 1);
    // The round counter must not be clipped off the top.
    expect(m.roundTop, "round counter must be on screen").toBeGreaterThanOrEqual(0);

    // Prompt cards are width-first: a sentence needs measure, not the concept's
    // portrait proportions. Deriving width from height is what left a 102-char
    // question with ~100px of column at 320×568. The 286:402 contract still
    // holds for word modes and is asserted in word-reveal-fit.spec.ts.
    expect(m.card.w, "prompt card takes the column width").toBeGreaterThanOrEqual(
      Math.min(w - 48, 240),
    );
    expect(m.card.w, "…but never wider than the design cap").toBeLessThanOrEqual(340);

    // The card must not clip its own contents at the delivered prompt.
    const face = await measureFace(page);
    expect(face.faceOverflowY, "card back must not clip vertically").toBeLessThanOrEqual(0);
    expect(face.faceOverflowX, "card back must not clip horizontally").toBeLessThanOrEqual(0);
    expect(face.outside, "every card-back child must sit inside the card").toEqual([]);

    // Now the real worst case — the longest question the game can actually deal.
    for (const probe of [LONGEST, SHORTEST]) {
      const f = await measureFace(page, probe);
      const label = `${probe.length} chars @ ${f.wordSize}: "${probe.slice(0, 40)}…"`;
      expect(f.rendered, "probe must be the string measured").toBe(probe);
      expect(f.faceOverflowY, `clipped vertically — ${label}`).toBeLessThanOrEqual(0);
      expect(f.faceOverflowX, `clipped horizontally — ${label}`).toBeLessThanOrEqual(0);
      expect(f.outside, `pushed out of the card — ${label}`).toEqual([]);
    }
  });
}
