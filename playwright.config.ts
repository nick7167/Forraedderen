import { defineConfig } from "@playwright/test";

// E2E "tour" of Kamæleon. Runs against the live deployed URL so that
// Clerk (pk_live_) and Convex are fully wired — localhost is not an
// allowed Clerk origin for the production key.
// Mobile viewport to match the mobile-first design.
export default defineConfig({
  testDir: "e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 240_000,
  expect: { timeout: 15_000 },
  outputDir: "test-results",
  reporter: [["list"]],
  use: {
    baseURL: "https://ea284c1e1.abacusai.cloud",
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
