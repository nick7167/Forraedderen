import { expect, type Page } from "@playwright/test";
import fs from "node:fs";

const SHOT_DIR = "Test Screenshots";

/** Save a viewport screenshot into the `Test Screenshots/` folder. */
export async function shot(page: Page, name: string) {
  fs.mkdirSync(SHOT_DIR, { recursive: true });
  await page.screenshot({ path: `${SHOT_DIR}/${name}.png`, fullPage: false });
}

/** Collect console errors + page errors so specs can assert the app is clean.
 *  Clerk-related network errors are excluded — Clerk JS loads from a custom
 *  domain (clerk.adrez.dev) that isn't reachable from headless VMs, but Clerk
 *  is not actively used in the game flow so these errors are benign. */
export function errorGuard(page: Page) {
  const errors: string[] = [];
  const IGNORE = [
    /clerk/i,
    /ERR_NAME_NOT_RESOLVED/i,
    /ERR_CONNECTION_REFUSED/i,
    /Failed to load resource.*clerk/i,
    /adrez\.dev/i,
  ];
  const isIgnored = (msg: string) => IGNORE.some((re) => re.test(msg));

  page.on("console", (m) => {
    if (m.type() === "error" && !isIgnored(m.text()))
      errors.push(`console: ${m.text()}`);
  });
  page.on("pageerror", (e) => {
    if (!isIgnored(e.message)) errors.push(`pageerror: ${e.message}`);
  });
  return errors;
}

/** The add-to-home pop-up shows once per session — dismiss it. */
export async function dismissAddToHome(page: Page) {
  const cont = page.locator("button", { hasText: "Fortsæt i browser" });
  if (await cont.first().isVisible().catch(() => false)) {
    await cont.first().click();
    await page.waitForTimeout(400);
  }
}

/** The first-time host "settings coach" overlay — dismiss it. */
export async function dismissCoach(page: Page) {
  const overlay = page.locator("text=Tilpas spillet");
  if (await overlay.isVisible().catch(() => false)) {
    await page.mouse.click(196, 700);
    await page.waitForTimeout(400);
  }
}

/**
 * Home → enter a name → create a room → wait for the Lobby.
 * Returns after the lobby is visible and the coach is dismissed.
 */
export async function createRoom(page: Page, name = "Tester") {
  await page.goto("/");
  await page.waitForTimeout(1500);
  await dismissAddToHome(page);
  await page.getByPlaceholder("Dit navn").fill(name);
  await page.getByRole("button", { name: "Opret spil" }).last().click();
  // The room-code card is the lobby's anchor since the concept redesign — the
  // old "Lobby" TopBar title no longer exists.
  await expect(page.locator(".room-code-card")).toBeVisible({ timeout: 30_000 });
  await dismissCoach(page);
}

/** Add N CPU bots from the lobby. */
export async function addBots(page: Page, n: number) {
  for (let i = 0; i < n; i++) {
    await page.getByRole("button", { name: "Tilføj bot" }).click();
    await page.waitForTimeout(900);
  }
}

/** Open host settings drawer and wait for it to render. */
export async function openSettings(page: Page) {
  await page.locator('button[aria-label="Indstillinger"]').click();
  await expect(page.locator(".settings-drawer")).toBeVisible();
  await page.waitForTimeout(400);
}

/** Close an open drawer by pressing Escape (falls back to clicking outside). */
export async function closeDrawer(page: Page) {
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  if (await page.locator(".settings-drawer").isVisible().catch(() => false)) {
    await page.mouse.click(196, 40);
    await page.waitForTimeout(400);
  }
}

/** Set "Antal runder" to 1 round (so a single round ends the match). */
export async function setOneRound(page: Page) {
  const roundRow = page.locator(".setting-row", { hasText: "Antal runder" });
  for (let i = 0; i < 25; i++) {
    const val = (await roundRow.locator(".step-val").innerText().catch(() => "")).trim();
    if (val === "1") break;
    await roundRow.locator(".step-btn").first().click();
    await page.waitForTimeout(120);
  }
}

/**
 * During the sequential clue phase, submit a clue if it's our turn.
 * Bots auto-fill the rest via the Convex scheduler.
 */
export async function submitClueIfMyTurn(page: Page) {
  const input = page.locator(".clue-input");
  const send = page.locator(".clue-send");
  if ((await input.count()) && (await input.isEnabled().catch(() => false))) {
    await input.fill("hmm");
    if (await send.isEnabled().catch(() => false)) {
      await send.click();
      await page.waitForTimeout(400);
    }
  }
}

/**
 * Wait for the clue phase to fully complete (bots finish + discussion appears).
 * Handles any number of clue passes.
 */
export async function waitForDiscussion(page: Page) {
  const discuss = page.locator(".phase-badge", { hasText: "Diskutér" });
  for (let i = 0; i < 25; i++) {
    if (await discuss.isVisible().catch(() => false)) return;
    await submitClueIfMyTurn(page);
    await page.waitForTimeout(1400);
  }
  await expect(discuss).toBeVisible({ timeout: 20_000 });
}

/**
 * Move from the discussion screen to voting. With more than one clue pass the
 * host advances through "Næste spor" first, so this loops until the grid shows.
 */
export async function advanceToVote(page: Page) {
  for (let i = 0; i < 6; i++) {
    if (await page.locator(".vote-grid").isVisible().catch(() => false)) return;
    const advance = page.getByRole("button", { name: /Gå til afstemning|Næste spor/ });
    if (await advance.first().isVisible().catch(() => false)) await advance.first().click();
    await page.waitForTimeout(1800);
  }
  await expect(page.locator(".vote-grid")).toBeVisible({ timeout: 30_000 });
}

/** Vote for the first bot in the vote phase. */
export async function voteForFirstBot(page: Page) {
  // Vote cards are the only interactive targets in the grid; `.self` is ours.
  await page.locator(".vote-card:not(.self)").first().click();
  // Since the concept redesign, picking only *selects* — confirm to cast.
  const confirm = page.locator(".confirm-wrap.visible button");
  await expect(confirm).toBeVisible({ timeout: 5_000 });
  await confirm.click();
}

/** Run a complete round from role reveal through the round-resolve screen. */
export async function completeRound(page: Page, opts: { mode?: string } = {}) {
  // Reveal
  await expect(page.locator(".card-scene")).toBeVisible({ timeout: 30_000 });
  await page.locator(".card-scene").click();
  await page.waitForTimeout(1100); // the 0.8s flip

  if (opts.mode === "scale") {
    await expect(page.locator(".scale-row")).toBeVisible({ timeout: 10_000 });
    await page.locator(".scale-cell").nth(2).click();
  } else if (opts.mode === "questions") {
    await page.getByPlaceholder("Skriv dit svar (ét ord)").fill("Blå").catch(() => {});
  }

  await page.getByRole("button", { name: /Klar/ }).first().click();

  if (opts.mode !== "questions" && opts.mode !== "scale") {
    await expect(page.locator(".clue-feed")).toBeVisible({ timeout: 30_000 });
    await waitForDiscussion(page);
  } else {
    await expect(page.locator(".phase-badge", { hasText: "Diskutér" })).toBeVisible({
      timeout: 30_000,
    });
  }

  // Discussion → vote. With >1 clue pass the host may need several hops.
  for (let i = 0; i < 6; i++) {
    if (await page.locator(".vote-grid").isVisible().catch(() => false)) break;
    const advance = page.getByRole("button", { name: /Gå til afstemning|Næste spor/ });
    if (await advance.first().isVisible().catch(() => false)) await advance.first().click();
    await page.waitForTimeout(1800);
  }
  await expect(page.locator(".vote-grid")).toBeVisible({ timeout: 30_000 });
  await voteForFirstBot(page);

  // Resolve
  await expect(page.locator(".result-headline")).toBeVisible({ timeout: 40_000 });
}
