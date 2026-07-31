import { defineConfig } from "vitest/config";
import path from "node:path";

// Unit tests only — pure logic (the Convex game engine). Browser-level coverage
// lives in `e2e/` under Playwright; `exclude` keeps the two from colliding.
export default defineConfig({
  test: {
    include: ["convex/**/*.test.ts", "src/**/*.test.ts"],
    exclude: ["e2e/**", "node_modules/**", "dist/**"],
    environment: "node",
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
