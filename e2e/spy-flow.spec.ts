import { test, expect } from "@playwright/test";
import {
  shot,
  errorGuard,
  createRoom,
  addBots,
  openSettings,
  submitClueIfMyTurn,
} from "./helpers";

test.describe.configure({ mode: "serial" });

test("spy flow: lobby → rules → settings/modes → packs → full round → match results", async ({
  page,
}) => {
  const errors = errorGuard(page);

  // --- Lobby ---
  await createRoom(page, "Tester");
  await expect(page.getByText("Lobby")).toBeVisible();
  await expect(page.getByText(/Spillere · \d+\/12/)).toBeVisible();
  await expect(page.getByText("Mindst 3 spillere")).toBeVisible();
  await shot(page, "05-lobby");

  // --- Rules drawer (scroll to the bottom; last section must be reachable) ---
  await page.locator('button[aria-label="Sådan spilles"]').click();
  await expect(page.getByText("Sådan spilles")).toBeVisible();
  await shot(page, "06-rules-top");
  const rulesScroll = page.locator(".no-scrollbar").filter({ hasText: "Målet" }).last();
  await rulesScroll.evaluate((el) => (el.scrollTop = el.scrollHeight));
  await page.waitForTimeout(400);
  await expect(page.getByText("Spørgsmål", { exact: true })).toBeVisible();
  await shot(page, "07-rules-bottom");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  // --- Settings: cycle modes (screenshot each), then category + rounds ---
  await openSettings(page);
  await shot(page, "08-settings");

  await page.getByRole("button", { name: "Undercover" }).click();
  await expect(page.getByText("Kamæleonen får et lignende ord", { exact: false })).toBeVisible();
  await shot(page, "09-settings-undercover");

  await page.getByRole("button", { name: "Spørgsmål" }).click();
  await expect(page.getByText("Kamæleonen får et lidt andet spørgsmål", { exact: false })).toBeVisible();
  await shot(page, "09-settings-questions");

  await page.getByRole("button", { name: "Klassisk" }).click();
  await expect(page.getByText("Kamæleonen kender ikke ordet", { exact: false })).toBeVisible();
  await shot(page, "09-settings-klassisk");

  // Antal runder → 1 (so one round ends the match → match-results screen).
  const roundRow = page
    .getByText("Antal runder", { exact: true })
    .locator('xpath=ancestor::div[contains(@class,"justify-between")][1]');
  for (let i = 0; i < 6; i++) {
    if ((await roundRow.locator("span").first().innerText()) === "1") break;
    await roundRow.locator("button").first().click(); // minus
    await page.waitForTimeout(150);
  }
  await expect(roundRow.locator("span").first()).toHaveText("1");

  // Category picker — one session: browse, search, peek the create form, pick random.
  await page.getByText("Tilfældig", { exact: false }).first().click();
  await expect(page.getByText("Vælg kategori")).toBeVisible();
  await shot(page, "10-packs");
  const search = page.getByPlaceholder("Søg kategori…");
  await search.fill("dyr");
  await page.waitForTimeout(300);
  await expect(page.getByRole("button", { name: /Dyr/ })).toBeVisible();
  await shot(page, "11-packs-search");
  await search.fill("");
  await page.getByRole("button", { name: "Lav egen pakke" }).click();
  await expect(page.getByText("Ny pakke")).toBeVisible();
  await shot(page, "12-pack-create");
  await page.getByRole("button", { name: "Tilbage" }).click();
  await page.getByText("Tilfældig kategori", { exact: false }).click(); // select random → closes picker
  await expect(page.getByText("Vælg kategori")).toBeHidden();

  // Close the settings drawer (back to lobby).
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  if (await page.getByRole("heading", { name: "Indstillinger" }).isVisible().catch(() => false)) {
    await page.mouse.click(196, 70); // click the dimmed area above the sheet
    await page.waitForTimeout(400);
  }

  // --- Start match (need 3 players) ---
  await addBots(page, 2);
  await expect(page.getByText("Spillere · 3/12")).toBeVisible();
  await page.getByRole("button", { name: "Start spil" }).click();

  // --- Reveal ---
  await expect(page.getByText("Tryk for at se din rolle")).toBeVisible({ timeout: 15_000 });
  await shot(page, "13-reveal-front");
  await page.getByText("Tryk for at se din rolle").click();
  await page.waitForTimeout(800);
  await expect(page.getByText(/Du er|Ordet/)).toBeVisible();
  await shot(page, "14-reveal-back");
  await page.getByRole("button", { name: "Klar" }).first().click();

  // --- Clue phase ---
  await expect(page.getByRole("heading", { name: "SPOR" })).toBeVisible({ timeout: 15_000 });
  await shot(page, "15-clue");
  const advance = page.getByRole("button", { name: "Gå til afstemning" });
  for (let i = 0; i < 12; i++) {
    await submitClueIfMyTurn(page);
    if (await advance.isVisible().catch(() => false)) break;
    await page.waitForTimeout(1300);
  }

  // --- Discussion ---
  await expect(page.getByRole("heading", { name: "DISKUTÉR" })).toBeVisible({ timeout: 15_000 });
  await shot(page, "16-discussion");
  await advance.click();

  // --- Vote ---
  await expect(page.getByRole("heading", { name: "STEM" })).toBeVisible({ timeout: 15_000 });
  await shot(page, "17-vote");
  await page.getByRole("button", { name: /Bot Bo/ }).first().click();

  // --- Round result ---
  await expect(page.getByText(/Kamæleonen var|Kamæleonerne var/)).toBeVisible({ timeout: 20_000 });
  await shot(page, "18-resolve");
  await page.getByRole("button", { name: "Næste runde" }).click();

  // --- Match results ---
  await expect(page.getByText("Slutresultat")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole("button", { name: "Spil igen" })).toBeVisible();
  await shot(page, "19-match-results");

  expect(errors, errors.join("\n")).toEqual([]);
});
