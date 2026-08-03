import { test, expect } from "@playwright/test";
import {
  shot,
  errorGuard,
  createRoom,
  addBots,
  openSettings,
  closeDrawer,
  setOneRound,
  submitClueIfMyTurn,
  waitForDiscussion,
  voteForFirstBot,
  advanceToVote,
} from "./helpers";

test.describe.configure({ mode: "serial" });

test("lobby — room code, players, how-to-play, settings, all 4 modes, packs, pack create", async ({
  page,
}) => {
  const errors = errorGuard(page);

  await createRoom(page, "Tester");

  // Lobby overview
  await expect(page.getByTestId("player-count")).toBeVisible();
  await expect(page.getByText("Mindst 3 spillere")).toBeVisible();
  await shot(page, "05-lobby");

  // How to play drawer
  await page.locator('button[aria-label="Sådan spilles"]').click();
  await expect(page.getByText("Sådan spilles")).toBeVisible();
  await shot(page, "06-rules-top");
  const rulesScroll = page.getByTestId("how-to-content").filter({ hasText: "Målet" }).last();
  await rulesScroll.evaluate((el) => (el.scrollTop = el.scrollHeight));
  await page.waitForTimeout(400);
  await shot(page, "07-rules-bottom");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  // Settings drawer — default (Klassisk)
  await openSettings(page);
  await shot(page, "08-settings");

  // Switch through all 4 modes
  await page.getByTestId("mode-card").filter({ hasText: "Klassisk" }).click();
  await expect(page.getByText("Kamæleonen kender ikke ordet", { exact: false })).toBeVisible();
  await shot(page, "09-settings-klassisk");

  await page.getByTestId("mode-card").filter({ hasText: "Undercover" }).click();
  await expect(page.getByText("Kamæleonen får et lignende ord", { exact: false })).toBeVisible();
  await shot(page, "09-settings-undercover");

  await page.getByTestId("mode-card").filter({ hasText: "Spørgsmål" }).click();
  await expect(page.getByText("Kamæleonen får et lidt andet spørgsmål", { exact: false })).toBeVisible();
  await shot(page, "09-settings-questions");

  await page.getByTestId("mode-card").filter({ hasText: "Måleren" }).click();
  await expect(page.getByText("Alle svarer fra 1–5", { exact: false })).toBeVisible();
  await shot(page, "09-settings-scale");

  // Back to Klassisk for the spy round
  await page.getByTestId("mode-card").filter({ hasText: "Klassisk" }).click();

  // Set 1 round so match ends quickly
  await setOneRound(page);

  // Pack picker
  await page.getByTestId("change-pack").click();
  await expect(page.getByText("Vælg kategori")).toBeVisible();
  await shot(page, "10-packs");

  // Search within packs
  await page.getByPlaceholder("Søg kategori…").fill("dyr");
  await page.waitForTimeout(300);
  await expect(page.getByRole("button", { name: /Dyr/ })).toBeVisible();
  await shot(page, "11-packs-search");
  // Clearing the query is what brings the "random" card back (showRandom).
  await page.getByPlaceholder("Søg kategori…").fill("");
  await page.waitForTimeout(300);

  // Custom pack creation form
  await page.getByRole("button", { name: "Lav egen pakke" }).click();
  await expect(page.getByText("Ny pakke")).toBeVisible();
  await shot(page, "12-pack-create");
  await page.getByRole("button", { name: "Tilbage" }).click();

  // Select random (closes picker)
  await page.getByRole("button", { name: /Tilfældig kategori/ }).click();
  await expect(page.getByText("Vælg kategori")).toBeHidden({ timeout: 5_000 });

  await closeDrawer(page);

  expect(errors, errors.join("\n")).toEqual([]);
});

test("klassisk (spy) — full round: reveal → clues → discussion → vote → resolve → match results", async ({
  page,
}) => {
  const errors = errorGuard(page);

  await createRoom(page, "Tester");
  await openSettings(page);
  await page.getByTestId("mode-card").filter({ hasText: "Klassisk" }).click();
  await setOneRound(page);
  await closeDrawer(page);
  await addBots(page, 2);
  await expect(page.getByTestId("player-count").filter({ hasText: "3 / 12" })).toBeVisible();

  await page.getByRole("button", { name: "Start spil" }).click();

  // Role reveal (card face-down)
  await expect(page.getByTestId("card-scene")).toBeVisible({ timeout: 30_000 });
  await shot(page, "13-reveal-front");

  // Flip the card
  await page.getByTestId("card-scene").click();
  await page.waitForTimeout(1100);
  await expect(page.getByTestId("card-role")).toBeVisible();
  await expect(page.getByTestId("card-inner")).toHaveAttribute("data-flipped", "true");
  await shot(page, "14-reveal-back");

  // Tap again to hide it — it's a pass-the-phone game. The ready button and
  // roster stay mounted so the layout doesn't jump underneath the player.
  await page.getByTestId("card-scene").click();
  await page.waitForTimeout(900);
  await expect(page.getByTestId("card-inner")).toHaveAttribute("data-flipped", "false");
  await expect(page.getByTestId("card-inner")).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByRole("button", { name: /Klar/ }).first()).toBeVisible();
  await shot(page, "14b-reveal-hidden-again");

  await page.getByTestId("card-scene").click();
  await page.waitForTimeout(900);
  await expect(page.getByTestId("card-inner")).toHaveAttribute("data-flipped", "true");

  // Mark ready → advances when all ready (bots are auto-ready)
  await page.getByRole("button", { name: /Klar/ }).first().click();

  // Clue phase
  await expect(page.getByTestId("clue-feed")).toBeVisible({ timeout: 30_000 });
  await shot(page, "15-clue");
  await waitForDiscussion(page);

  // Discussion
  await expect(page.getByTestId("phase-badge").filter({ hasText: "Diskutér" })).toBeVisible({ timeout: 30_000 });
  await shot(page, "16-discussion");
  await advanceToVote(page);

  // Vote
  await expect(page.getByTestId("vote-grid")).toBeVisible({ timeout: 30_000 });
  await shot(page, "17-vote");
  await voteForFirstBot(page);

  // Round resolve
  await expect(page.getByTestId("result-headline")).toBeVisible({ timeout: 40_000 });
  await shot(page, "18-resolve");

  // Advance to match results
  await page.getByRole("button", { name: "Næste runde" }).click();

  // Match results
  await expect(page.getByText("Slutresultat")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole("button", { name: "Spil igen" })).toBeVisible();
  await shot(page, "19-match-results");

  expect(errors, errors.join("\n")).toEqual([]);
});

test("undercover mode — full round: decoy word reveal → clues → vote → resolve", async ({
  page,
}) => {
  const errors = errorGuard(page);

  await createRoom(page, "Tester");
  await openSettings(page);
  await page.getByTestId("mode-card").filter({ hasText: "Undercover" }).click();
  await setOneRound(page);
  await closeDrawer(page);
  await addBots(page, 2);
  await page.getByRole("button", { name: "Start spil" }).click();

  // Reveal
  await expect(page.getByTestId("card-scene")).toBeVisible({ timeout: 30_000 });
  await page.getByTestId("card-scene").click();
  await page.waitForTimeout(1100);
  await shot(page, "02-role-reveal");
  await page.getByRole("button", { name: /Klar/ }).first().click();

  // Clues
  await expect(page.getByTestId("clue-feed")).toBeVisible({ timeout: 30_000 });
  await shot(page, "03-clue-phase");
  await waitForDiscussion(page);

  // Discussion
  await shot(page, "04-discussion");
  await advanceToVote(page);

  // Vote
  await expect(page.getByTestId("vote-grid")).toBeVisible({ timeout: 30_000 });
  await shot(page, "05-vote");
  await voteForFirstBot(page);

  // Resolve
  await expect(page.getByTestId("result-headline")).toBeVisible({ timeout: 40_000 });
  await shot(page, "06-round-resolve");
  await page.getByRole("button", { name: "Næste runde" }).click();

  // Match results
  await expect(page.getByText("Slutresultat")).toBeVisible({ timeout: 15_000 });
  await shot(page, "07-match-results");

  expect(errors, errors.join("\n")).toEqual([]);
});
