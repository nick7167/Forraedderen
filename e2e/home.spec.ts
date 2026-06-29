import { test, expect } from "@playwright/test";
import { shot, errorGuard, dismissAddToHome } from "./helpers";

test.describe.configure({ mode: "serial" });

test("home: branding, logo, add-to-home pop-up, avatar picker, join", async ({ page }) => {
  const errors = errorGuard(page);
  await page.goto("/");

  // Tab title rebranded.
  await expect(page).toHaveTitle("Kamæleon");

  // Add-to-home pop-up (shows once per session in the browser).
  await expect(page.getByText("Få den fulde oplevelse")).toBeVisible();
  await expect(page.getByText("Føj Kamæleon", { exact: false })).toBeVisible();
  await shot(page, "02-add-to-home");
  await dismissAddToHome(page);

  // Logo + branding on home.
  const logo = page.locator('img[alt="Kamæleon"]');
  await expect(logo).toBeVisible();
  expect(await logo.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
  await expect(page.getByText("Find kamæleonen", { exact: false })).toBeVisible();
  await expect(page.getByRole("button", { name: "Opret spil" }).last()).toBeVisible();
  await expect(page.getByRole("button", { name: "Deltag i spil" })).toBeVisible();
  await expect(page.getByText("Log ind")).toBeVisible();
  // No leftover old branding on the home screen.
  await expect(page.locator("body")).not.toContainText("Forræder");
  await shot(page, "01-home");

  // Avatar picker drawer.
  await page.locator("button:has(svg.lucide-pencil)").first().click();
  await expect(page.getByText("Vælg avatar")).toBeVisible();
  await shot(page, "03-avatar-picker");
  await page.getByText("🦁").first().click().catch(() => {});
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  // Join mode reveals the code field.
  await page.getByRole("button", { name: "Deltag i spil" }).click();
  await expect(page.getByPlaceholder("ABCD")).toBeVisible();
  await shot(page, "04-join");

  expect(errors, errors.join("\n")).toEqual([]);
});
