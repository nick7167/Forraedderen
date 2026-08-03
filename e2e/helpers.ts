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
  const cont = page.getByTestId("a2hs-continue");
  if (await cont.first().isVisible().catch(() => false)) {
    await cont.first().click();
    await page.waitForTimeout(400);
  }
}

/**
 * The first-time host "settings coach" overlay — dismiss it.
 *
 * Waits for it rather than sampling `isVisible()` once. The coach mounts from an effect
 * that only fires after Convex resolves this device as the host, so it can appear a beat
 * AFTER the lobby is on screen — a single check races it, and a missed coach then swallows
 * every subsequent click behind a full-screen scrim until the test times out.
 *
 * Clicks the overlay's centre: the spotlight is top-right and the bubble hangs just below
 * it, so the middle of the screen is scrim at every viewport size.
 */
export async function dismissCoach(page: Page) {
  const overlay = page.getByTestId("settings-coach");
  const appeared = await overlay
    .waitFor({ state: "visible", timeout: 3000 })
    .then(() => true)
    .catch(() => false);
  if (!appeared) return;

  await overlay.click();
  await overlay.waitFor({ state: "detached", timeout: 5000 }).catch(() => {});
}

/**
 * Home → enter a name → create a room → wait for the Lobby.
 * Returns after the lobby is visible and the coach is dismissed.
 */
export async function createRoom(page: Page, name = "Tester") {
  await page.goto("/");
  await page.waitForTimeout(1500);
  await dismissAddToHome(page);
  await page.getByTestId("name-input").fill(name);

  /**
   * `force: true` on the CTA, with an explicit visibility assertion in front of it.
   *
   * The CTA lives in the sticky bottom bar, which pins to the *layout* viewport. Under
   * Playwright's mobile emulation the layout viewport is larger than the configured one
   * (380x675 inside a 320x568 page, scaled down to fit), so the bar's box sits at y=607
   * against a viewport Playwright believes is 568 tall. It is genuinely on screen — the
   * hit test at its centre returns the button — but Playwright's in-viewport actionability
   * check disagrees and retries the scroll forever.
   *
   * So: keep the real check (is it visible?) and skip only the one that emulation gets
   * wrong. Without this the reveal-geometry specs hang for the full test timeout at
   * 320x568 and nowhere else.
   */
  await expect(page.getByTestId("home-cta")).toBeVisible();
  await page.getByTestId("home-cta").click({ force: true });
  // The room-code card is the lobby's anchor.
  await expect(page.getByTestId("room-code")).toBeVisible({ timeout: 30_000 });
  await dismissCoach(page);
}

/** Add N CPU bots from the lobby. */
export async function addBots(page: Page, n: number) {
  for (let i = 0; i < n; i++) {
    await page.getByTestId("add-bot").click();
    await page.waitForTimeout(900);
  }
}

/** Open host settings drawer and wait for it to render. */
export async function openSettings(page: Page) {
  await page.getByTestId("settings-button").click();
  await expect(page.getByTestId("settings-panel")).toBeVisible();
  await page.waitForTimeout(400);
}

/** Close an open drawer by pressing Escape (falls back to clicking outside). */
export async function closeDrawer(page: Page) {
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  if (await page.getByTestId("settings-panel").isVisible().catch(() => false)) {
    await page.mouse.click(196, 40);
    await page.waitForTimeout(400);
  }
}

/** Set "Antal runder" to 1 round (so a single round ends the match). */
export async function setOneRound(page: Page) {
  const roundRow = page.getByTestId("setting-row").filter({ hasText: "Antal runder" });
  for (let i = 0; i < 25; i++) {
    const val = (await roundRow.getByTestId("step-val").innerText().catch(() => "")).trim();
    if (val === "1") break;
    await roundRow.getByTestId("step-down").click();
    await page.waitForTimeout(120);
  }
}

/**
 * During the sequential clue phase, submit a clue if it's our turn.
 * Bots auto-fill the rest via the Convex scheduler.
 */
export async function submitClueIfMyTurn(page: Page) {
  const input = page.getByTestId("clue-input");
  const send = page.getByTestId("clue-send");
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
  const discuss = page.getByTestId("phase-badge").filter({ hasText: "Diskutér" });
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
    if (await page.getByTestId("vote-grid").isVisible().catch(() => false)) return;
    const advance = page.getByRole("button", { name: /Gå til afstemning|Næste spor/ });
    if (await advance.first().isVisible().catch(() => false)) await advance.first().click();
    await page.waitForTimeout(1800);
  }
  await expect(page.getByTestId("vote-grid")).toBeVisible({ timeout: 30_000 });
}

/** Vote for the first bot in the vote phase. */
export async function voteForFirstBot(page: Page) {
  // Vote cards are the only interactive targets in the grid; `data-self` is ours.
  await page.locator('[data-testid="vote-card"]:not([data-self])').first().click();
  // Picking only *selects* — confirm to cast.
  const confirm = page.getByTestId("confirm-vote");
  await expect(confirm).toBeEnabled({ timeout: 5_000 });
  await confirm.click();
}

/** Run a complete round from role reveal through the round-resolve screen. */
export async function completeRound(page: Page, opts: { mode?: string } = {}) {
  // Reveal
  await expect(page.getByTestId("card-scene")).toBeVisible({ timeout: 30_000 });
  await page.getByTestId("card-scene").click();
  await page.waitForTimeout(1100); // the flip

  if (opts.mode === "scale") {
    await expect(page.getByTestId("scale-row")).toBeVisible({ timeout: 10_000 });
    await page.getByTestId("scale-cell").nth(2).click();
  } else if (opts.mode === "questions") {
    await page.getByPlaceholder("Skriv dit svar (ét ord)").fill("Blå").catch(() => {});
  }

  await page.getByTestId("ready-button").click();

  if (opts.mode !== "questions" && opts.mode !== "scale") {
    await expect(page.getByTestId("clue-feed")).toBeVisible({ timeout: 30_000 });
    await waitForDiscussion(page);
  } else {
    await expect(
      page.getByTestId("phase-badge").filter({ hasText: "Diskutér" }),
    ).toBeVisible({ timeout: 30_000 });
  }

  // Discussion → vote. With >1 clue pass the host may need several hops.
  for (let i = 0; i < 6; i++) {
    if (await page.getByTestId("vote-grid").isVisible().catch(() => false)) break;
    const advance = page.getByRole("button", { name: /Gå til afstemning|Næste spor/ });
    if (await advance.first().isVisible().catch(() => false)) await advance.first().click();
    await page.waitForTimeout(1800);
  }
  await expect(page.getByTestId("vote-grid")).toBeVisible({ timeout: 30_000 });
  await voteForFirstBot(page);

  // Resolve
  await expect(page.getByTestId("result-headline")).toBeVisible({ timeout: 40_000 });
}
