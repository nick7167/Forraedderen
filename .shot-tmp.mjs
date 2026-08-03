import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";

const OUT = "/tmp/claude-1000/-workspaces-codespaces-blank/efdc8bb6-14cb-4cca-82f6-e7d679fffcbf/scratchpad";
const svg = readFileSync("public/logo.svg", "utf8");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 760, height: 300 }, deviceScaleFactor: 2 });

// Render the icon at the sizes it actually ships at, on the ink page, so small-size
// legibility is judged rather than assumed.
await page.setContent(`
  <body style="margin:0;background:#14171f;display:flex;gap:28px;align-items:center;justify-content:center;height:300px;font-family:sans-serif">
    ${[512, 192, 64, 32, 16].map((s) => `
      <div style="text-align:center;color:#7a8398;font-size:11px">
        <div style="width:${s > 200 ? 200 : s}px;height:${s > 200 ? 200 : s}px">${svg.replace('width="512" height="512"', 'width="100%" height="100%"')}</div>
        <div style="margin-top:8px">${s}px</div>
      </div>`).join("")}
  </body>`);
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/icon-check.png` });
console.log("icon rendered");
await browser.close();
