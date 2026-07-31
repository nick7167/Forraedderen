import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import App from "./App.tsx";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";
// Ported verbatim from ui-concepts/kamaeleon-polish-concepts.html — the app's
// visual source of truth. Loaded last so its values win.
import "./concept.css";

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;

if (!CONVEX_URL) {
  throw new Error(
    "Missing VITE_CONVEX_URL. Run `pnpm dev:convex` to provision Convex, then add it to .env.local. See README.md.",
  );
}

const convex = new ConvexReactClient(CONVEX_URL);

// --- Viewport height (fixes iOS where `100dvh` isn't finalized until a scroll) ---
// Drive the app height from JS so the first paint already has the right pixel
// height. `innerHeight` (not visualViewport) stays stable when the keyboard opens.
function setAppHeight() {
  document.documentElement.style.setProperty("--app-h", `${window.innerHeight}px`);
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
    <ConvexProvider client={convex}>
      <BrowserRouter>
        <App />
        <Toaster richColors position="top-center" />
      </BrowserRouter>
    </ConvexProvider>
  </StrictMode>,
);
