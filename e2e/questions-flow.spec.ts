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
  await page.getByTestId("mode-card").filter({ hasText: "Spørgsmål" }).click();
  await expect(page.getByText("Kamæleonen får et lidt andet spørgsmål", { exact: false })).toBeVisible();
  await setOneRound(page);
  await closeDrawer(page);

  await addBots(page, 2);
  await expect(page.getByTestId("player-count").filter({ hasText: "3 / 12" })).toBeVisible();
  await page.getByRole("button", { name: "Start spil" }).click();

  // Reveal card — shows the personal question + answer input
  await expect(page.getByTestId("card-scene")).toBeVisible({ timeout: 30_000 });
  await page.getByTestId("card-scene").click();
  await page.waitForTimeout(600);
  await shot(page, "20-questions-reveal");

  // Submit an answer and mark ready
  const answerField = page.getByPlaceholder("Skriv dit svar (ét ord)");
  await answerField.fill("Blå");
  await shot(page, "03-questions-answer");
  await page.getByRole("button", { name: /Klar/ }).first().click();

  // Discussion — all answers now visible with shared crew question
  await expect(page.getByTestId("phase-badge").filter({ hasText: "Diskutér" })).toBeVisible({ timeout: 30_000 });
  await shot(page, "21-questions-discussion");
  await advanceToVote(page);

  // Vote
  await expect(page.getByTestId("vote-grid")).toBeVisible({ timeout: 30_000 });
  await shot(page, "22-questions-vote");
  await voteForFirstBot(page);

  // Resolve
  await expect(page.getByTestId("result-headline")).toBeVisible({ timeout: 40_000 });
  await shot(page, "23-questions-resolve");

  expect(errors, errors.join("\n")).toEqual([]);
});
