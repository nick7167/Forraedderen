import { expect, type Page } from "@playwright/test";
import fs from "node:fs";

const SHOT_DIR = "Test Screenshots";

/** Save a viewport screenshot into the `Test Screenshots/` folder. */
export async function shot(page: Page, name: string) {
  fs.mkdirSync(SHOT_DIR, { recursive: true });
  await page.screenshot({ path: `${SHOT_DIR}/${name}.png` });
}

/** Collect console errors + page errors so specs can assert the app is clean. */
export function errorGuard(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  return errors;
}

/** The add-to-home pop-up shows once per session in the browser — dismiss it. */
export async function dismissAddToHome(page: Page) {
  // The X icon-button shares the aria-label, so target the text button by content.
  const cont = page.locator("button", { hasText: "Fortsæt i browser" });
  if (await cont.first().isVisible().catch(() => false)) {
    await cont.first().click();
    await page.waitForTimeout(400);
  }
}

/** The first-time host "settings coach" overlay — dismiss by clicking it away. */
export async function dismissCoach(page: Page) {
  const close = page.getByText("Tryk for at lukke", { exact: false });
  if (await close.isVisible().catch(() => false)) {
    await page.mouse.click(196, 700);
    await page.waitForTimeout(400);
  }
}

/** Home → enter a name → create a room → wait for the Lobby. */
export async function createRoom(page: Page, name = "Tester") {
  await page.goto("/");
  await page.waitForTimeout(1500);
  await dismissAddToHome(page);
  await page.getByPlaceholder("Dit navn").fill(name);
  // The bottom hero CTA (last "Opret spil").
  await page.getByRole("button", { name: "Opret spil" }).last().click();
  await expect(page.getByText("Lobby")).toBeVisible({ timeout: 15_000 });
  await dismissCoach(page);
}

/** Add N bots from the lobby. */
export async function addBots(page: Page, n: number) {
  for (let i = 0; i < n; i++) {
    await page.getByRole("button", { name: "Tilføj bot" }).click();
    await page.waitForTimeout(900);
  }
}

/** During the clue phase, submit a clue if it's our turn (bots fill the rest). */
export async function submitClueIfMyTurn(page: Page) {
  const input = page.getByPlaceholder("Skriv ét ord eller kort spor");
  if ((await input.count()) && (await input.isEnabled().catch(() => false))) {
    await input.fill("hmm");
    // The send button is the icon button next to the input.
    const send = page.locator("button:has(svg.lucide-send)");
    if (await send.isVisible().catch(() => false)) await send.click();
    await page.waitForTimeout(400);
  }
}

/** Open the host settings drawer from the lobby. */
export async function openSettings(page: Page) {
  await page.locator('button[aria-label="Indstillinger"]').click();
  await expect(page.getByRole("heading", { name: "Indstillinger" })).toBeVisible();
  await page.waitForTimeout(400);
}
