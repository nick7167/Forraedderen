import { test, expect } from "@playwright/test";
import { errorGuard, createRoom, addBots, openSettings } from "./helpers";

test.describe.configure({ mode: "serial" });

test("scale mode: private scale → discussion → vote → match highlights", async ({ page }) => {
  const errors = errorGuard(page);

  await createRoom(page, "Måler");
  await openSettings(page);
  await page.getByRole("button", { name: "Måleren" }).click();
  await expect(page.getByText("Alle svarer fra 1–5", { exact: false })).toBeVisible();

  // One round takes the match through the final-results analytics screen.
  const roundRow = page
    .getByText("Antal runder", { exact: true })
    .locator('xpath=ancestor::div[contains(@class,"justify-between")][1]');
  for (let i = 0; i < 6; i++) {
    if ((await roundRow.locator("span").first().innerText()) === "1") break;
    await roundRow.locator("button").first().click();
  }
  await expect(roundRow.locator("span").first()).toHaveText("1");
  await page.keyboard.press("Escape");

  await addBots(page, 2);
  await page.getByRole("button", { name: "Start spil" }).click();

  await expect(page.getByText("Tryk for at se din rolle")).toBeVisible({ timeout: 15_000 });
  await page.getByText("Tryk for at se din rolle").click();
  await expect(page.getByText("Vælg et tal fra 1 til 5")).toBeVisible();
  await page.getByRole("button", { name: "3", exact: true }).click();
  await page.getByRole("button", { name: "Klar" }).first().click();

  await expect(page.getByRole("heading", { name: "DISKUTÉR" })).toBeVisible({ timeout: 15_000 });
  await page.getByRole("button", { name: "Gå til afstemning" }).click();
  await expect(page.getByRole("heading", { name: "STEM" })).toBeVisible({ timeout: 15_000 });
  await page.getByRole("button", { name: /Bot Bo/ }).first().click();

  await expect(page.getByText(/Kamæleonen var|Kamæleonerne var/)).toBeVisible({ timeout: 20_000 });
  await page.getByRole("button", { name: "Næste runde" }).click();
  await expect(page.getByText("Slutresultat")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("Højdepunkter")).toBeVisible();
  await expect(page.getByText("Mest mistænkt")).toBeVisible();

  expect(errors, errors.join("\n")).toEqual([]);
});
