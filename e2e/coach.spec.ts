import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";

/**
 * Captures the first-time host "settings coach" overlay so its alignment with
 * the lobby's settings icon-btn can be checked by eye.
 *
 * Run with:  pnpm exec playwright test e2e/coach.spec.ts
 */

const OUT = "concept-parity/app";

test.setTimeout(180_000);

test.use({
  viewport: { width: 375, height: 812 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});

async function dismissAddToHome(page: Page) {
  const cont = page.getByRole("button", { name: /Fortsæt i browser/ });
  if (await cont.first().isVisible().catch(() => false)) {
    await cont.first().click();
    await page.waitForTimeout(300);
  }
}

test("settings coach overlay", async ({ page }) => {
  await page.goto("/");
  await dismissAddToHome(page);
  await page.getByPlaceholder("Dit navn").fill("Tester");
  await page.getByRole("button", { name: "Opret spil" }).last().click();

  await expect(page.getByTestId("room-code")).toBeVisible({ timeout: 30_000 });
  // The coach only shows on a freshly created lobby.
  await expect(page.locator("text=Tilpas spillet")).toBeVisible();
  await page.waitForTimeout(600);

  fs.mkdirSync(OUT, { recursive: true });
  await page.screenshot({ path: `${OUT}/12-settings-coach.png` });

  // The spotlight must land on the real settings button underneath it.
  const spot = await page.getByRole("button", { name: "Indstillinger" }).first().boundingBox();
  const real = await page
    .locator('[data-testid="settings-button"]')
    .last()
    .boundingBox();
  console.log("spotlight:", spot, "real button:", real);
  expect(Math.abs(spot!.x - real!.x)).toBeLessThan(2);
  expect(Math.abs(spot!.y - real!.y)).toBeLessThan(2);
  expect(Math.abs(spot!.width - real!.width)).toBeLessThan(2);
  expect(Math.abs(spot!.height - real!.height)).toBeLessThan(2);
});
