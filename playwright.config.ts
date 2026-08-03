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
    // Defaults to the LOCAL dev server, so the suite tests the working tree. It used to
    // default to the deployed URL, which meant every run silently tested production — a
    // spec could pass against a stale deploy while the working tree was broken, and a
    // failure could be someone else's deploy rather than your change.
    //
    // To test a deployment on purpose:
    //   BASE=https://your-deploy.example pnpm test:e2e
    // `localhost`, not `127.0.0.1`: Vite 7 binds to the IPv6 loopback by default, so the
    // dotted-quad form refuses the connection on machines where both stacks are present.
    baseURL: process.env.BASE ?? "http://localhost:5173",
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
