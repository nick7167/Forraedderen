import { useEffect, useState } from "react";
import { Dialog } from "@/ui/Dialog";
import { Button } from "@/ui/Button";
import { Glyph } from "@/ui/Glyph";
import { t } from "@/lib/strings";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const SEEN_KEY = "forraeder.a2hs.seen";

function isStandalone(): boolean {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari exposes this on navigator when launched from the home screen.
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  const ua = navigator.userAgent;
  const iOS = /iphone|ipad|ipod/i.test(ua);
  // iPadOS 13+ reports as Mac; detect via touch.
  const iPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return iOS || iPadOS;
}

/**
 * Pop-up that nudges browser users to install the PWA. Never shows in the installed app
 * (standalone), shows once per browser session, and is dismissible. Android/desktop Chrome
 * gets a native install button; iOS Safari (no programmatic install) gets the
 * Share → "Føj til hjemmeskærm" steps.
 *
 * Now a plain `Dialog` — it was previously a hand-rolled overlay with its own scrim, its
 * own close button and a neon-bordered tile, none of which it needed.
 */
export function AddToHomeScreen() {
  const [open, setOpen] = useState(
    () => typeof window !== "undefined" && !isStandalone() && !sessionStorage.getItem(SEEN_KEY),
  );
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    () =>
      (window as unknown as { __deferredInstall?: BeforeInstallPromptEvent })
        .__deferredInstall ?? null,
  );

  useEffect(() => {
    if (!open) return;
    sessionStorage.setItem(SEEN_KEY, "1"); // once per session
    // The install event may arrive after mount — capture it to enable the button.
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, [open]);

  if (!open) return null;

  const ios = isIos();
  const canInstall = !!deferred;

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setOpen(false);
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} testId="a2hs">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-6xl" aria-hidden>
          🦎
        </span>
        <h2 className="font-display text-display-2 text-paper font-extrabold">{t.a2hsTitle}</h2>
        <p className="text-body text-muted max-w-xs">{t.a2hsBody}</p>
      </div>

      {ios && (
        <div className="mt-5 flex flex-col gap-2">
          <p className="text-label text-muted font-semibold tracking-[0.12em] uppercase">
            {t.a2hsIosIntro}
          </p>
          <div className="bg-ink-inset border-line text-body flex items-center gap-3 rounded-md border px-3 py-2.5 font-medium">
            <Glyph name="share" className="text-gold text-lg" /> {t.a2hsIosStep1}
          </div>
          <div className="bg-ink-inset border-line text-body flex items-center gap-3 rounded-md border px-3 py-2.5 font-medium">
            <Glyph name="plus" className="text-gold text-lg" /> {t.a2hsIosStep2}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2">
        {canInstall && (
          <Button size="lg" block onClick={install} data-testid="a2hs-install">
            {t.a2hsInstall}
          </Button>
        )}
        <Button variant="ghost" block onClick={() => setOpen(false)} data-testid="a2hs-continue">
          {t.a2hsContinue}
        </Button>
      </div>
    </Dialog>
  );
}
