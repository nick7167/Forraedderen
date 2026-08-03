import { test, expect } from "@playwright/test";
import { shot, errorGuard, dismissAddToHome } from "./helpers";
import { t } from "../src/lib/strings";

test.describe.configure({ mode: "serial" });

test("home screen — branding, install prompt, avatar picker, join mode", async ({ page }) => {
  const errors = errorGuard(page);

  await page.goto("/");
  await page.waitForTimeout(1500);

  // Page title
  await expect(page).toHaveTitle(/^Kamæleon/);

  // Add-to-home pop-up may appear (only fires in real browsers — skipped in headless)
  const addToHome = page.getByText("Få den fulde oplevelse");
  if (await addToHome.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await shot(page, "02-add-to-home");
    await dismissAddToHome(page);
  }

  // Logo + tagline + both mode buttons visible
  await expect(page.getByTestId("wordmark")).toBeVisible();
  await expect(page.getByTestId("wordmark-text")).toHaveText("Kamæleon");
  // By test id, not a substring: "Find kamæleonen" is now also the title of step 3
  // in the home explainer, so a loose text match resolves to two elements.
  await expect(page.getByTestId("tagline")).toHaveText(t.tagline);
  await expect(page.getByRole("button", { name: "Opret spil" }).last()).toBeVisible();
  await expect(page.getByRole("button", { name: "Deltag i spil" })).toBeVisible();
  await page.waitForTimeout(500);
  await shot(page, "01-home");

  // Avatar picker — open, screenshot, close
  await page.getByTestId("avatar-edit").first().click();
  await expect(page.getByText("Vælg avatar")).toBeVisible({ timeout: 5_000 });
  await shot(page, "03-avatar-picker");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  // Join mode reveals code field
  await page.getByRole("button", { name: "Deltag i spil" }).click();
  await expect(page.getByPlaceholder("ABCD")).toBeVisible();
  await shot(page, "04-join");

  expect(errors, errors.join("\n")).toEqual([]);
});
