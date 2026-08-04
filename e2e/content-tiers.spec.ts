import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { createRoom, addBots, openSettings, dismissAddToHome, dismissCoach } from "./helpers";

/**
 * The two content-tier switches ("Krydret indhold" / "Dansk kultur") in the
 * lobby settings.
 *
 * Scope is deliberately the UI only: that both rows render for every mode, that
 * the defaults are krydret-off / dansk-on, and that tapping them sticks. What
 * the toggles actually *do* to the draw pool is pure logic and is covered far
 * more thoroughly — every pool, every combination — by
 * convex/content-tiers.test.ts.
 */

const OUT = "qa-screenshots";

test.setTimeout(180_000);

test("content tiers — both switches render, default correctly, and persist", async ({ page }) => {
  await createRoom(page);
  await addBots(page, 2);

  await openSettings(page);

  const spicy = page.getByRole("switch", { name: "Krydret indhold" });
  const dansk = page.getByRole("switch", { name: "Dansk kultur" });

  await expect(spicy).toBeVisible();
  await expect(dansk).toBeVisible();
  await expect(page.getByText("Krydret indhold", { exact: true })).toBeVisible();
  await expect(page.getByText("Dansk kultur", { exact: true })).toBeVisible();

  // Krydret is opt-in; Dansk kultur ships on.
  await expect(spicy).toHaveAttribute("aria-checked", "false");
  await expect(dansk).toHaveAttribute("aria-checked", "true");

  // The panel scrolls and the tier rows sit below the fold — scroll them into
  // view so the QA gallery shows the rows this change actually added.
  await dansk.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  fs.mkdirSync(OUT, { recursive: true });
  await page.screenshot({ path: `${OUT}/13-settings-content-tiers.png` });

  // Both flip, and the change survives the round trip through Convex rather
  // than only living in the optimistic local state.
  await spicy.click();
  await expect(spicy).toHaveAttribute("aria-checked", "true");
  await dansk.click();
  await expect(dansk).toHaveAttribute("aria-checked", "false");

  // A reload re-mounts from server state, so the install prompt and the host
  // coach can both reappear ahead of the settings button.
  await page.reload();
  await dismissAddToHome(page);
  await dismissCoach(page);
  await openSettings(page);
  await expect(page.getByRole("switch", { name: "Krydret indhold" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(page.getByRole("switch", { name: "Dansk kultur" })).toHaveAttribute(
    "aria-checked",
    "false",
  );
});
