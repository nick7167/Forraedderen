import { test, expect } from "@playwright/test";
import { shot, errorGuard, createRoom, addBots, openSettings } from "./helpers";

test.describe.configure({ mode: "serial" });

test("questions mode: reveal/answer → discussion → vote → resolve", async ({ page }) => {
  const errors = errorGuard(page);

  await createRoom(page, "Tester");
  await openSettings(page);
  await page.getByRole("button", { name: "Spørgsmål" }).click();
  await expect(page.getByText("Kamæleonen får et lidt andet spørgsmål", { exact: false })).toBeVisible();
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(400);

  await addBots(page, 2);
  await expect(page.getByText("Spillere · 3/12")).toBeVisible();
  await page.getByRole("button", { name: "Start spil" }).click();

  // Questions reveal: flip card → shows the question + an answer field.
  await expect(page.getByText("Tryk for at se din rolle")).toBeVisible({ timeout: 15_000 });
  await page.getByText("Tryk for at se din rolle").click();
  await page.waitForTimeout(600);
  await shot(page, "20-questions-reveal");
  const answer = page.getByPlaceholder("Skriv dit svar (ét ord)");
  await answer.fill("Blå");
  await page.getByRole("button", { name: "Klar" }).first().click();

  // Discussion
  await expect(page.getByRole("heading", { name: "DISKUTÉR" })).toBeVisible({ timeout: 15_000 });
  await shot(page, "21-questions-discussion");
  await page.getByRole("button", { name: "Gå til afstemning" }).click();

  // Vote
  await expect(page.getByRole("heading", { name: "STEM" })).toBeVisible({ timeout: 15_000 });
  await shot(page, "22-questions-vote");
  await page.getByRole("button", { name: /Bot Bo/ }).first().click();

  // Resolve
  await expect(page.getByText(/Kamæleonen var|Kamæleonerne var/)).toBeVisible({ timeout: 20_000 });
  await shot(page, "23-questions-resolve");

  expect(errors, errors.join("\n")).toEqual([]);
});
