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
} from "./helpers";

test.describe.configure({ mode: "serial" });

test("lobby — room code, players, how-to-play, settings, all 4 modes, packs, pack create", async ({
  page,
}) => {
  const errors = errorGuard(page);

  await createRoom(page, "Tester");

  // Lobby overview
  await expect(page.getByText(/Spillere · \d+\/12/)).toBeVisible();
  await expect(page.getByText("Mindst 3 spillere")).toBeVisible();
  await shot(page, "05-lobby");

  // How to play drawer
  await page.locator('button[aria-label="Sådan spilles"]').click();
  await expect(page.getByText("Sådan spilles")).toBeVisible();
  await shot(page, "06-rules-top");
  const rulesScroll = page.locator(".no-scrollbar").filter({ hasText: "Målet" }).last();
  await rulesScroll.evaluate((el) => (el.scrollTop = el.scrollHeight));
  await page.waitForTimeout(400);
  await shot(page, "07-rules-bottom");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  // Settings drawer — default (Klassisk)
  await openSettings(page);
  await shot(page, "08-settings");

  // Switch through all 4 modes
  await page.getByRole("button", { name: "Klassisk" }).click();
  await expect(page.getByText("Kamæleonen kender ikke ordet", { exact: false })).toBeVisible();
  await shot(page, "09-settings-klassisk");

  await page.getByRole("button", { name: "Undercover" }).click();
  await expect(page.getByText("Kamæleonen får et lignende ord", { exact: false })).toBeVisible();
  await shot(page, "09-settings-undercover");

  await page.getByRole("button", { name: "Spørgsmål" }).click();
  await expect(page.getByText("Kamæleonen får et lidt andet spørgsmål", { exact: false })).toBeVisible();
  await shot(page, "09-settings-questions");

  await page.getByRole("button", { name: "Måleren" }).click();
  await expect(page.getByText("Alle svarer fra 1–5", { exact: false })).toBeVisible();
  await shot(page, "09-settings-scale");

  // Back to Klassisk for the spy round
  await page.getByRole("button", { name: "Klassisk" }).click();

  // Set 1 round so match ends quickly
  await setOneRound(page);

  // Pack picker
  await page.getByText("Tilfældig", { exact: false }).first().click();
  await expect(page.getByText("Vælg kategori")).toBeVisible();
  await shot(page, "10-packs");

  // Search within packs
  await page.getByPlaceholder("Søg kategori…").fill("dyr");
  await page.waitForTimeout(300);
  await expect(page.getByRole("button", { name: /Dyr/ })).toBeVisible();
  await shot(page, "11-packs-search");
  await page.getByPlaceholder("Søg kategori…").fill("");

  // Custom pack creation form
  await page.getByRole("button", { name: "Lav egen pakke" }).click();
  await expect(page.getByText("Ny pakke")).toBeVisible();
  await shot(page, "12-pack-create");
  await page.getByRole("button", { name: "Tilbage" }).click();

  // Select random (closes picker)
  await page.getByText("Tilfældig kategori", { exact: false }).click();
  await expect(page.getByText("Vælg kategori")).toBeHidden({ timeout: 3_000 });

  await closeDrawer(page);

  expect(errors, errors.join("\n")).toEqual([]);
});

test("klassisk (spy) — full round: reveal → clues → discussion → vote → resolve → match results", async ({
  page,
}) => {
  const errors = errorGuard(page);

  await createRoom(page, "Tester");
  await openSettings(page);
  await page.getByRole("button", { name: "Klassisk" }).click();
  await setOneRound(page);
  await closeDrawer(page);
  await addBots(page, 2);
  await expect(page.getByText("Spillere · 3/12")).toBeVisible();

  await page.getByRole("button", { name: "Start spil" }).click();

  // Role reveal (card face-down)
  await expect(page.getByText("Tryk for at se din rolle")).toBeVisible({ timeout: 15_000 });
  await shot(page, "13-reveal-front");

  // Flip the card
  await page.getByText("Tryk for at se din rolle").click();
  await page.waitForTimeout(800);
  await expect(page.getByText(/Du er|Ordet/)).toBeVisible();
  await shot(page, "14-reveal-back");

  // Mark ready → advances when all ready (bots are auto-ready)
  await page.getByRole("button", { name: "Klar" }).first().click();

  // Clue phase
  await expect(page.getByRole("heading", { name: "SPOR" })).toBeVisible({ timeout: 15_000 });
  await shot(page, "15-clue");
  await waitForDiscussion(page);

  // Discussion
  await expect(page.getByRole("heading", { name: "DISKUTÉR" })).toBeVisible({ timeout: 20_000 });
  await shot(page, "16-discussion");
  await page.getByRole("button", { name: "Gå til afstemning" }).click();

  // Vote
  await expect(page.getByRole("heading", { name: "STEM" })).toBeVisible({ timeout: 15_000 });
  await shot(page, "17-vote");
  await voteForFirstBot(page);

  // Round resolve
  await expect(page.getByText(/Kamæleonen var|Kamæleonerne var/)).toBeVisible({ timeout: 20_000 });
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
  await page.getByRole("button", { name: "Undercover" }).click();
  await setOneRound(page);
  await closeDrawer(page);
  await addBots(page, 2);
  await page.getByRole("button", { name: "Start spil" }).click();

  // Reveal
  await expect(page.getByText("Tryk for at se din rolle")).toBeVisible({ timeout: 15_000 });
  await page.getByText("Tryk for at se din rolle").click();
  await page.waitForTimeout(800);
  await shot(page, "02-role-reveal");
  await page.getByRole("button", { name: "Klar" }).first().click();

  // Clues
  await expect(page.getByRole("heading", { name: "SPOR" })).toBeVisible({ timeout: 15_000 });
  await shot(page, "03-clue-phase");
  await waitForDiscussion(page);

  // Discussion
  await shot(page, "04-discussion");
  await page.getByRole("button", { name: "Gå til afstemning" }).click();

  // Vote
  await expect(page.getByRole("heading", { name: "STEM" })).toBeVisible({ timeout: 15_000 });
  await shot(page, "05-vote");
  await voteForFirstBot(page);

  // Resolve
  await expect(page.getByText(/Kamæleonen var|Kamæleonerne var/)).toBeVisible({ timeout: 20_000 });
  await shot(page, "06-round-resolve");
  await page.getByRole("button", { name: "Næste runde" }).click();

  // Match results
  await expect(page.getByText("Slutresultat")).toBeVisible({ timeout: 15_000 });
  await shot(page, "07-match-results");

  expect(errors, errors.join("\n")).toEqual([]);
});
