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
    // Defaults to the deployed app; set BASE to test a local dev server:
    //   BASE=http://127.0.0.1:5173 pnpm test:e2e
    // Without this every spec silently tested production, which also meant a
    // spec could pass against a *stale* deploy while the working tree was broken.
    baseURL: process.env.BASE ?? "https://ea284c1e1.abacusai.cloud",
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
