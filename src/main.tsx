import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import App from "./App.tsx";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CONVEX_URL) {
  throw new Error(
    "Missing VITE_CONVEX_URL. Run `pnpm dev:convex` to provision Convex, then add it to .env.local. See README.md.",
  );
}
if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error(
    "Missing VITE_CLERK_PUBLISHABLE_KEY. Create a Clerk app and add its publishable key to .env.local. See README.md.",
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
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <BrowserRouter>
          <App />
          <Toaster richColors position="top-center" />
        </BrowserRouter>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </StrictMode>,
);
