import { test, expect } from "@playwright/test";
import {
  shot,
  errorGuard,
  createRoom,
  addBots,
  openSettings,
  closeDrawer,
  setOneRound,
  voteForFirstBot,
  advanceToVote,
} from "./helpers";

test.describe.configure({ mode: "serial" });

test("spørgsmål (questions) mode — answer reveal → discussion → vote → resolve", async ({
  page,
}) => {
  const errors = errorGuard(page);

  await createRoom(page, "Tester");
  await openSettings(page);
  await page.locator(".mode-card", { hasText: "Spørgsmål" }).click();
  await expect(page.getByText("Kamæleonen får et lidt andet spørgsmål", { exact: false })).toBeVisible();
  await setOneRound(page);
  await closeDrawer(page);

  await addBots(page, 2);
  await expect(page.locator(".count-badge", { hasText: "3 / 12" })).toBeVisible();
  await page.getByRole("button", { name: "Start spil" }).click();

  // Reveal card — shows the personal question + answer input
  await expect(page.locator(".card-scene")).toBeVisible({ timeout: 30_000 });
  await page.locator(".card-scene").click();
  await page.waitForTimeout(600);
  await shot(page, "20-questions-reveal");

  // Submit an answer and mark ready
  const answerField = page.getByPlaceholder("Skriv dit svar (ét ord)");
  await answerField.fill("Blå");
  await shot(page, "03-questions-answer");
  await page.getByRole("button", { name: /Klar/ }).first().click();

  // Discussion — all answers now visible with shared crew question
  await expect(page.locator(".phase-badge", { hasText: "Diskutér" })).toBeVisible({ timeout: 30_000 });
  await shot(page, "21-questions-discussion");
  await advanceToVote(page);

  // Vote
  await expect(page.locator(".vote-grid")).toBeVisible({ timeout: 30_000 });
  await shot(page, "22-questions-vote");
  await voteForFirstBot(page);

  // Resolve
  await expect(page.locator(".result-headline")).toBeVisible({ timeout: 40_000 });
  await shot(page, "23-questions-resolve");

  expect(errors, errors.join("\n")).toEqual([]);
});
