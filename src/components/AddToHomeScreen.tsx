import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/strings";
import { Share, Plus, X } from "lucide-react";

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
 * Pop-up that nudges browser users to install the PWA. Never shows in the
 * installed app (standalone), shows once per browser session, and is dismissible.
 * Android/desktop Chrome gets a native install button; iOS Safari (no
 * programmatic install) gets the Share → "Føj til hjemmeskærm" steps.
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
    <div
      onClick={() => setOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm duration-200 animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass relative w-full max-w-sm rounded-[1.75rem] p-6 text-center duration-200 animate-in zoom-in-95"
      >
        <button
          aria-label={t.a2hsContinue}
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full text-muted-foreground active:scale-90"
        >
          <X className="size-5" />
        </button>

        <div className="neon-tile mx-auto size-20">
          <div className="flex size-full items-center justify-center text-4xl">🦎</div>
        </div>

        <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-glow">{t.a2hsTitle}</h2>
        <p className="mx-auto mt-2 max-w-[18rem] text-sm text-muted-foreground">{t.a2hsBody}</p>

        {ios && (
          <div className="mt-5 space-y-2 text-left">
            <p className="px-1 text-xs font-medium text-muted-foreground">{t.a2hsIosIntro}</p>
            <div className="glass-input flex items-center gap-3 rounded-2xl p-3 text-sm font-medium">
              <Share className="size-5 shrink-0 text-primary" /> {t.a2hsIosStep1}
            </div>
            <div className="glass-input flex items-center gap-3 rounded-2xl p-3 text-sm font-medium">
              <Plus className="size-5 shrink-0 text-primary" /> {t.a2hsIosStep2}
            </div>
          </div>
        )}

        <div className="mt-6 space-y-2">
          {canInstall && (
            <Button size="hero" onClick={install}>
              {t.a2hsInstall}
            </Button>
          )}
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => setOpen(false)}
          >
            {t.a2hsContinue}
          </Button>
        </div>
      </div>
    </div>
  );
}
