import { test, expect, type Page, type BrowserContext } from "@playwright/test";
import { dismissCoach } from "./helpers";

/**
 * The invite link (`/j/:code`) — Phase 5's headline feature.
 *
 * Two separate browser contexts so the second player is genuinely a different
 * device with its own localStorage: a first-timer with no saved profile, which
 * is exactly who receives an invite link.
 */


test.setTimeout(300_000);
test.use({
  viewport: { width: 375, height: 812 },
  isMobile: true,
  hasTouch: true,
});

async function dismissAddToHome(page: Page) {
  const cont = page.getByRole("button", { name: /Fortsæt i browser/ });
  if (await cont.first().isVisible().catch(() => false)) {
    await cont.first().click();
    await page.waitForTimeout(250);
  }
}

/** Host creates a room and returns its code. */
async function hostCreatesRoom(page: Page): Promise<string> {
  await page.goto("/");
  await dismissAddToHome(page);
  await page.getByPlaceholder("Dit navn").fill("Vært");
  await page.getByRole("button", { name: "Opret spil" }).last().click();
  await expect(page.getByTestId("room-code")).toBeVisible({ timeout: 30_000 });
    await dismissCoach(page);
  return (await page.getByTestId("room-code-cell").allTextContents()).join("");
}

test("a first-timer joins straight from an invite link", async ({ browser }) => {
  const hostCtx: BrowserContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
  });
  const guestCtx: BrowserContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
  });

  try {
    const host = await hostCtx.newPage();
    const code = await hostCreatesRoom(host);
    expect(code).toHaveLength(4);

    // The guest opens the link cold — no saved profile on this device.
    const guest = await guestCtx.newPage();
    const errors: string[] = [];
    guest.on("pageerror", (e) => errors.push(e.message));
    guest.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });

    await guest.goto(`/j/${code}`);
    await dismissAddToHome(guest);

    // The code is already applied — nothing to transcribe.
    await expect(guest.getByTestId("room-code-cell").first()).toBeVisible({ timeout: 20_000 });
    expect((await guest.getByTestId("room-code-cell").allTextContents()).join("")).toBe(code);

    await guest.getByPlaceholder("Dit navn").fill("Gæst");
    await guest.getByRole("button", { name: "Deltag i spil" }).click();

    // Lands in the lobby, and the host sees them arrive.
    await expect(guest.getByTestId("room-code")).toBeVisible({ timeout: 30_000 });
    await expect(host.getByTestId("player-card").filter({ hasText: "Gæst" })).toBeVisible({
      timeout: 30_000,
    });

    expect(errors, `errors on the join route:\n${errors.join("\n")}`).toEqual([]);
  } finally {
    await hostCtx.close();
    await guestCtx.close();
  }
});

test("a returning player is dropped straight in", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  try {
    const host = await ctx.newPage();
    const code = await hostCreatesRoom(host);

    // Same context → the profile saved while creating is still there. Opening
    // the invite link should need no input at all.
    const returning = await ctx.newPage();
    await returning.goto(`/j/${code}`);
    await dismissAddToHome(returning);

    // Straight to a room, never asked for a name.
    await returning.waitForURL(/\/room\//, { timeout: 30_000 });
    await expect(returning.getByTestId("room-code")).toBeVisible({ timeout: 30_000 });
  } finally {
    await ctx.close();
  }
});

test("a bad code returns to the home screen instead of a dead end", async ({ page }) => {
  await page.goto("/j/ZZZZ");
  await dismissAddToHome(page);
  await page.waitForTimeout(1500);
  // Either the name form (then a failed join) or an immediate bounce home —
  // what matters is that the user is never stranded on the link.
  const nameField = page.getByPlaceholder("Dit navn");
  if (await nameField.isVisible().catch(() => false)) {
    await nameField.fill("Tester");
    await page.getByRole("button", { name: "Deltag i spil" }).click();
  }
  await page.waitForURL((url) => !url.pathname.startsWith("/j/"), { timeout: 30_000 });
  await expect(page.getByRole("button", { name: "Opret spil" }).last()).toBeVisible();
});
