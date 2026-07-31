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
} from "./helpers";

test.describe.configure({ mode: "serial" });

test("måleren (scale) mode — 1–5 answer → discussion → vote → resolve → match highlights", async ({
  page,
}) => {
  const errors = errorGuard(page);

  await createRoom(page, "Måler");
  await openSettings(page);
  await page.getByRole("button", { name: "Måleren" }).click();
  await expect(page.getByText("Alle svarer fra 1–5", { exact: false })).toBeVisible();
  await setOneRound(page);
  await closeDrawer(page);

  await addBots(page, 2);
  await expect(page.getByText("Spillere · 3/12")).toBeVisible();
  await page.getByRole("button", { name: "Start spil" }).click();

  // Reveal — shows the scale prompt + 1–5 picker
  await expect(page.getByText("Tryk for at se din rolle")).toBeVisible({ timeout: 15_000 });
  await page.getByText("Tryk for at se din rolle").click();
  await page.waitForTimeout(600);
  await expect(page.getByText("Vælg et tal fra 1 til 5")).toBeVisible({ timeout: 8_000 });
  await shot(page, "24-scale-reveal");

  // Pick a number and mark ready
  await page.getByRole("button", { name: "3", exact: true }).click();
  await shot(page, "25-scale-answer");
  await page.getByRole("button", { name: "Klar" }).first().click();

  // Discussion — all numbers revealed with the shared crew prompt
  await expect(page.getByRole("heading", { name: "DISKUTÉR" })).toBeVisible({ timeout: 20_000 });
  await shot(page, "26-scale-discussion");
  await page.getByRole("button", { name: "Gå til afstemning" }).click();

  // Vote
  await expect(page.getByRole("heading", { name: "STEM" })).toBeVisible({ timeout: 15_000 });
  await shot(page, "27-scale-vote");
  await voteForFirstBot(page);

  // Resolve
  await expect(page.getByText(/Kamæleonen var|Kamæleonerne var/)).toBeVisible({ timeout: 20_000 });
  await shot(page, "28-scale-resolve");

  // Match results with analytics highlights
  await page.getByRole("button", { name: "Næste runde" }).click();
  await expect(page.getByText("Slutresultat")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("Højdepunkter")).toBeVisible();
  await expect(page.getByText("Bedste detektiv")).toBeVisible();
  await expect(page.getByText("Mest mistænkt")).toBeVisible();
  await shot(page, "29-scale-match-results");

  expect(errors, errors.join("\n")).toEqual([]);
});
