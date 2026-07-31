import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";

/**
 * Måleren's role-reveal screen must fit without scrolling.
 *
 * It's the tallest variant in the app: the concept's fixed 402px card plus a
 * round counter, the ready roster, a 1–5 picker, the ready button and (for the
 * host) a force-start button. Run across a range of viewport heights — 762 is
 * the one that originally overflowed and clipped the ready roster.
 *
 * Run with:  BASE=http://127.0.0.1:5173 pnpm exec playwright test e2e/scale-reveal-fit.spec.ts
 */

const BASE = process.env.BASE ?? "http://127.0.0.1:5173";
const OUT = "concept-parity/app";

// Common phone viewports (CSS px), including the 762 that regressed.
const SIZES = [
  { w: 320, h: 568 }, // iPhone SE 1st gen — the tightest realistic case
  { w: 375, h: 667 }, // iPhone SE 2/3
  { w: 390, h: 762 },
  { w: 375, h: 812 }, // the concept's own frame
  { w: 430, h: 932 }, // iPhone 15 Pro Max
];

test.setTimeout(600_000);
test.use({ baseURL: BASE, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

async function dismissAddToHome(page: Page) {
  const cont = page.getByRole("button", { name: /Fortsæt i browser/ });
  if (await cont.first().isVisible().catch(() => false)) {
    await cont.first().click();
    await page.waitForTimeout(250);
  }
}

for (const { w, h } of SIZES) {
  test(`Måleren reveal fits at ${w}x${h}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });

    await page.goto("/");
    await dismissAddToHome(page);
    await page.getByPlaceholder("Dit navn").fill("Tester");
    await page.getByRole("button", { name: "Opret spil" }).last().click();
    await expect(page.locator(".room-code-card")).toBeVisible({ timeout: 30_000 });

    // Dismiss the first-run coach so it doesn't swallow clicks.
    const coach = page.locator("text=Tilpas spillet");
    if (await coach.isVisible().catch(() => false)) {
      await page.mouse.click(w / 2, h - 60);
      await page.waitForTimeout(300);
    }

    for (let i = 0; i < 2; i++) {
      await page.getByRole("button", { name: /Tilføj bot/ }).click();
      await page.waitForTimeout(400);
    }

    // Switch to Måleren.
    await page.getByRole("button", { name: "Indstillinger" }).click();
    await expect(page.locator(".settings-drawer")).toBeVisible();
    await page.locator(".mode-card", { hasText: "Måleren" }).click();
    await page.waitForTimeout(400);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);

    await page.getByRole("button", { name: "Start spil" }).click();
    await expect(page.locator(".card-scene")).toBeVisible({ timeout: 30_000 });

    // Flip to the answer side — that's when the picker appears in the footer.
    await page.locator(".card-scene").click();
    await page.waitForTimeout(1100);
    await expect(page.locator(".scale-row")).toBeVisible();

    fs.mkdirSync(OUT, { recursive: true });
    await page.screenshot({ path: `${OUT}/scale-reveal-${w}x${h}.png` });

    const m = await page.evaluate(() => {
      const screen = document.querySelector(".s-reveal") as HTMLElement;
      const content = document.querySelector(".s-reveal .content") as HTMLElement;
      const card = document.querySelector(".card-scene")!.getBoundingClientRect();
      const ready = document.querySelector(".ready-row")!.getBoundingClientRect();
      const round = document.querySelector(".round-info")!.getBoundingClientRect();
      const footer = document.querySelector(".s-reveal .footer")!.getBoundingClientRect();
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
    // The card keeps the concept's 286:402 proportions.
    expect(Math.abs(m.card.w / m.card.h - 286 / 402)).toBeLessThan(0.02);
  });
}
