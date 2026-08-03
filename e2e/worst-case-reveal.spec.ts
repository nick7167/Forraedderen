import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import { QUESTION_PAIRS } from "../convex/questionData";
import { createRoom, addBots } from "./helpers";

/**
 * Visual capture of the reveal card holding the longest question the game can
 * deal, at the tightest and the reference viewport. The measurements live in
 * scale-reveal-fit.spec.ts; this exists so the QA gallery shows the worst case
 * rather than whichever short question the draw happened to pick.
 *
 * Run with:  pnpm exec playwright test e2e/worst-case-reveal.spec.ts
 */

const OUT = "qa-screenshots";

const ALL = QUESTION_PAIRS.flatMap((p) => [p.crew, p.imposter]);
const LONGEST = ALL.reduce((a, b) => (b.length > a.length ? b : a));

const SIZES = [
  { w: 320, h: 568, tag: "320x568" },
  { w: 375, h: 812, tag: "375x812" },
];

test.setTimeout(600_000);
test.use({ deviceScaleFactor: 2, isMobile: true, hasTouch: true });

async function dismissAddToHome(page: Page) {
  const cont = page.getByRole("button", { name: /Fortsæt i browser/ });
  if (await cont.first().isVisible().catch(() => false)) {
    await cont.first().click();
    await page.waitForTimeout(250);
  }
}

for (const { w, h, tag } of SIZES) {
  test(`longest question renders in full at ${tag}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });

    // Shared setup — see createRoom() for why the CTA needs a forced click here.
    await createRoom(page);
    await addBots(page, 2);

    await page.getByRole("button", { name: "Indstillinger" }).click();
    await expect(page.getByTestId("settings-panel")).toBeVisible();
    await page.getByTestId("mode-card").filter({ hasText: "Spørgsmål" }).click();
    await page.waitForTimeout(400);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);

    await page.getByRole("button", { name: "Start spil" }).click();
    await expect(page.getByTestId("card-scene")).toBeVisible({ timeout: 30_000 });
    await page.getByTestId("card-scene").click();
    await page.waitForTimeout(1100);

    fs.mkdirSync(OUT, { recursive: true });
    if (tag === "375x812") {
      // Gallery: the questions-mode reveal as dealt, and the flipped-back state.
      await page.screenshot({ path: `${OUT}/04c-role-reveal-question.png` });
      await page.getByTestId("card-scene").click();
      await page.waitForTimeout(900);
      await expect(page.getByTestId("card-inner")).toHaveAttribute("data-flipped", "false");
      await page.screenshot({ path: `${OUT}/04d-role-reveal-hidden-again.png` });
      await page.getByTestId("card-scene").click();
      await page.waitForTimeout(900);
    }

    // Pin the text: a Convex update (bots readying up) re-renders RoleReveal
    // and would restore the drawn question before the screenshot lands.
    await page.getByTestId("card-word").evaluate((el, text) => {
      const pin = () => {
        if (el.textContent !== text) el.textContent = text;
      };
      new MutationObserver(pin).observe(el, { childList: true, characterData: true, subtree: true });
      pin();
    }, LONGEST);
    await page.waitForTimeout(400);

    await page.screenshot({ path: `${OUT}/04b-role-reveal-longest-question-${tag}.png` });

    // The whole question must be laid out, not clipped by the face.
    const clipped = await page.evaluate(() => {
      const back = document.querySelector('[data-testid="card-back"][data-role="prompt"]') as HTMLElement;
      return {
        y: back.scrollHeight - back.clientHeight,
        x: back.scrollWidth - back.clientWidth,
        rendered: back.querySelector('[data-testid="card-word"]')!.textContent ?? "",
      };
    });
    expect(clipped.rendered, "screenshot must show the longest question").toBe(LONGEST);
    expect(clipped.y, "question clipped vertically").toBeLessThanOrEqual(0);
    expect(clipped.x, "question clipped horizontally").toBeLessThanOrEqual(0);
  });
}
