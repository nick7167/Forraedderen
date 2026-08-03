import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import App from "./App.tsx";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
// The single stylesheet. Tokens, primitives-support utilities and the role card all live
// there, mirroring SnapArena's globals.css. There is no second stylesheet to keep in sync.
import "./index.css";

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;

if (!CONVEX_URL) {
  throw new Error(
    "Missing VITE_CONVEX_URL. Run `pnpm dev:convex` to provision Convex, then add it to .env.local. See README.md.",
  );
}

const convex = new ConvexReactClient(CONVEX_URL);

// --- Viewport height (fixes iOS where `100dvh` isn't finalized until a scroll) ---
// Drive the app height from JS so the first paint already has the right pixel height.
//
// `documentElement.clientHeight`, NOT `window.innerHeight`. innerHeight is the *layout*
// viewport, which is not the area you can actually see: under mobile emulation it reports
// 675px inside a 568px viewport, and on a real device it diverges the same way while the
// page is zoomed. Sizing the reveal screen from it made that screen taller than the
// visible area — and parked the sticky action bar below the fold, where it could not be
// tapped at all.
//
// clientHeight matches `100dvh` and `visualViewport.height`, and unlike visualViewport it
// does not collapse when the on-screen keyboard opens — which is the property the original
// innerHeight choice was reaching for.
function setAppHeight() {
  const h = document.documentElement.clientHeight || window.innerHeight;
  document.documentElement.style.setProperty("--app-h", `${h}px`);
}
setAppHeight(); // synchronous, before render → correct on first paint
window.addEventListener("resize", setAppHeight);
window.addEventListener("orientationchange", setAppHeight);
window.addEventListener("pageshow", setAppHeight);
window.visualViewport?.addEventListener("resize", setAppHeight);

// --- Capture the install prompt early (it can fire before React mounts) ---
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  (window as unknown as { __deferredInstall?: Event }).__deferredInstall = e;
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ConvexProvider client={convex}>
        <BrowserRouter>
          <App />
          <Toaster richColors position="top-center" />
        </BrowserRouter>
      </ConvexProvider>
    </ErrorBoundary>
  </StrictMode>,
);
