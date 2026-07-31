import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";

/**
 * Concept-parity tour.
 *
 * Walks the whole game against a LOCAL dev server at the concept's own
 * reference viewport (375×812, the `.phone` size in
 * ui-concepts/kamaeleon-polish-concepts.html) and drops one screenshot per
 * screen into `concept-parity/app/`, alongside renders of the concept itself in
 * `concept-parity/concept/`, so the two can be compared frame for frame.
 *
 * Run with:  BASE=http://127.0.0.1:5173 pnpm exec playwright test e2e/concept-parity.spec.ts
 */

const BASE = process.env.BASE ?? "http://127.0.0.1:5173";
const CONCEPT = "file://" + process.cwd() + "/ui-concepts/kamaeleon-polish-concepts.html";
const OUT_APP = "concept-parity/app";
const OUT_REF = "concept-parity/concept";

// Bots clue and vote on server-side timers, so a full round can outlast the
// shared 240s budget in playwright.config.ts.
test.setTimeout(600_000);

test.use({
  baseURL: BASE,
  viewport: { width: 375, height: 812 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});

async function shot(page: Page, dir: string, name: string) {
  fs.mkdirSync(dir, { recursive: true });
  // Let the aurora/float loops settle so frames are comparable run to run.
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${dir}/${name}.png`, fullPage: false });
}

async function dismissAddToHome(page: Page) {
  const cont = page.getByRole("button", { name: /Fortsæt i browser/ });
  if (await cont.first().isVisible().catch(() => false)) {
    await cont.first().click();
    await page.waitForTimeout(300);
  }
}

async function dismissCoach(page: Page) {
  const overlay = page.locator("text=Tilpas spillet");
  if (await overlay.isVisible().catch(() => false)) {
    await page.mouse.click(188, 760);
    await page.waitForTimeout(300);
  }
}

test("concept reference renders", async ({ page }) => {
  const screens = ["home", "lobby", "settings", "reveal", "clue", "vote", "results"];
  await page.goto(CONCEPT);
  // The concept draws inside a 375×812 `.phone`; clip to that frame so the
  // captures line up 1:1 with the app's viewport shots.
  for (const id of screens) {
    await page.evaluate((s) => {
      document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));
      document.getElementById("screen-" + s)!.classList.add("active");
      document.querySelector(".demo-header")!.setAttribute("style", "display:none");
      document.querySelector(".screen-nav")!.setAttribute("style", "display:none");
      document.querySelector(".notes-panel")?.setAttribute("style", "display:none");
      document.querySelector(".demo-page")!.setAttribute("style", "padding:0");
    }, id);
    await page.waitForTimeout(300);
    fs.mkdirSync(OUT_REF, { recursive: true });
    await page.locator(".phone-screen").screenshot({ path: `${OUT_REF}/${id}.png` });
  }
});

test("app tour", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });

  // ---- Home -------------------------------------------------------------
  await page.goto("/");
  await dismissAddToHome(page);
  await page.getByPlaceholder("Dit navn").fill("Tester");
  await shot(page, OUT_APP, "01-home");

  // ---- Lobby ------------------------------------------------------------
  await page.getByRole("button", { name: "Opret spil" }).last().click();
  await expect(page.locator(".room-code-card")).toBeVisible({ timeout: 30_000 });
  await dismissCoach(page);
  // Bots so the round is startable.
  for (let i = 0; i < 2; i++) {
    await page.getByRole("button", { name: /Tilføj bot/ }).click();
    await page.waitForTimeout(500);
  }
  await shot(page, OUT_APP, "02-lobby");

  // ---- Settings ---------------------------------------------------------
  await page.getByRole("button", { name: "Indstillinger" }).click();
  await expect(page.locator(".settings-drawer")).toBeVisible();
  await shot(page, OUT_APP, "03-settings");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  // ---- Role reveal ------------------------------------------------------
  await page.getByRole("button", { name: "Start spil" }).click();
  await expect(page.locator(".card-scene")).toBeVisible({ timeout: 30_000 });
  await shot(page, OUT_APP, "04-reveal-front");
  await page.locator(".card-scene").click();
  await page.waitForTimeout(1100); // the 0.8s flip
  await shot(page, OUT_APP, "05-reveal-back");

  // ---- Clue phase -------------------------------------------------------
  await page.getByRole("button", { name: /Klar/ }).click();
  await expect(page.locator(".clue-feed")).toBeVisible({ timeout: 30_000 });
  await shot(page, OUT_APP, "06-clue");

  // Turn order is random, so wait for the send button to unlock (our turn)
  // rather than assuming we're first.
  const input = page.locator(".clue-input");
  const send = page.locator(".clue-send");
  if (await input.isEnabled().catch(() => false)) {
    await input.fill("Bitter");
    for (let i = 0; i < 20; i++) {
      if (await send.isEnabled().catch(() => false)) {
        await send.click();
        await page.waitForTimeout(1200);
        break;
      }
      // Someone else's turn, or the phase already moved on.
      if (!(await input.isVisible().catch(() => false))) break;
      await page.waitForTimeout(1500);
    }
  }
  await shot(page, OUT_APP, "07-clue-filled");

  // ---- Discussion / Vote ------------------------------------------------
  // Bots clue on a timer and the host advances each phase, so drive the round
  // forward until the vote grid appears rather than assuming one hop.
  let shotDiscussion = false;
  for (let i = 0; i < 12; i++) {
    if (await page.locator(".vote-grid").isVisible().catch(() => false)) break;

    if (!shotDiscussion && (await page.locator(".phase-badge", { hasText: "Diskutér" }).isVisible().catch(() => false))) {
      await shot(page, OUT_APP, "08-discussion");
      shotDiscussion = true;
    }
    const advance = page.getByRole("button", { name: /Gå til afstemning|Næste spor/ });
    if (await advance.first().isVisible().catch(() => false)) {
      await advance.first().click();
    }
    await page.waitForTimeout(2500);
  }

  await expect(page.locator(".vote-grid")).toBeVisible({ timeout: 40_000 });
  await shot(page, OUT_APP, "09-vote");
  await page.locator(".vote-card:not(.self)").first().click();
  await page.waitForTimeout(700);
  await shot(page, OUT_APP, "10-vote-selected");

  // ---- Round result -----------------------------------------------------
  const confirm = page.locator(".confirm-wrap.visible button");
  if (await confirm.isEnabled().catch(() => false)) await confirm.click();
  for (let i = 0; i < 12; i++) {
    if (await page.locator(".result-headline").isVisible().catch(() => false)) break;
    const end = page.getByRole("button", { name: /Afslut afstemning/ });
    if (await end.first().isVisible().catch(() => false)) await end.first().click();
    await page.waitForTimeout(2500);
  }
  if (await page.locator(".result-headline").isVisible().catch(() => false)) {
    await shot(page, OUT_APP, "11-round-result");
  }

  console.log("page errors:", errors);
});
