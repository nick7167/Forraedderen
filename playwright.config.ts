import { defineConfig } from "@playwright/test";

// E2E "tour" of Kamæleon. Runs against the PRODUCTION build via `vite preview`
// (not the dev server) so behavior matches the deployed app — notably React
// StrictMode's dev double-mount would otherwise hide the once-per-session
// add-to-home pop-up. Mobile viewport to match the mobile-first design.
export default defineConfig({
  testDir: "e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 240_000,
  expect: { timeout: 12_000 },
  outputDir: "test-results",
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4321",
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  webServer: {
    command: "pnpm exec vite build && pnpm exec vite preview --port 4321 --strictPort",
    url: "http://localhost:4321",
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
