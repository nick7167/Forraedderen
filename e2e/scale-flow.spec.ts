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

test("måleren (scale) mode — 1–5 answer → discussion → vote → resolve → match highlights", async ({
  page,
}) => {
  const errors = errorGuard(page);

  await createRoom(page, "Måler");
  await openSettings(page);
  await page.locator(".mode-card", { hasText: "Måleren" }).click();
  await expect(page.getByText("Alle svarer fra 1–5", { exact: false })).toBeVisible();
  await setOneRound(page);
  await closeDrawer(page);

  await addBots(page, 2);
  await expect(page.locator(".count-badge", { hasText: "3 / 12" })).toBeVisible();
  await page.getByRole("button", { name: "Start spil" }).click();

  // Reveal — shows the scale prompt + 1–5 picker
  await expect(page.locator(".card-scene")).toBeVisible({ timeout: 30_000 });
  await page.locator(".card-scene").click();
  await page.waitForTimeout(600);
  await expect(page.getByText("Vælg et tal fra 1 til 5")).toBeVisible({ timeout: 8_000 });
  await shot(page, "24-scale-reveal");

  // Pick a number and mark ready
  await page.locator(".scale-cell").nth(2).click();
  await shot(page, "25-scale-answer");
  await page.getByRole("button", { name: /Klar/ }).first().click();

  // Discussion — all numbers revealed with the shared crew prompt
  await expect(page.locator(".phase-badge", { hasText: "Diskutér" })).toBeVisible({ timeout: 30_000 });
  await shot(page, "26-scale-discussion");
  await advanceToVote(page);

  // Vote
  await expect(page.locator(".vote-grid")).toBeVisible({ timeout: 30_000 });
  await shot(page, "27-scale-vote");
  await voteForFirstBot(page);

  // Resolve
  await expect(page.locator(".result-headline")).toBeVisible({ timeout: 40_000 });
  await shot(page, "28-scale-resolve");

  // Match results with analytics highlights
  await page.getByRole("button", { name: "Næste runde" }).click();
  await expect(page.getByText("Slutresultat")).toBeVisible({ timeout: 15_000 });
  // Which highlights exist depends on how the match actually played out (a
  // clean crew sweep has no "Bedste bluff"), so assert the shape, not the set:
  // the section appears only when it has something to show.
  const highlightChips = page.locator(".stat-chip");
  if (await page.getByText("Højdepunkter").isVisible().catch(() => false)) {
    expect(await highlightChips.count()).toBeGreaterThan(0);
  } else {
    expect(await highlightChips.count()).toBe(0);
  }
  await shot(page, "29-scale-match-results");

  expect(errors, errors.join("\n")).toEqual([]);
});
