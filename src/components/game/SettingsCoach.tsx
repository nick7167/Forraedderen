import { Settings2 } from "lucide-react";
import { t } from "@/lib/strings";

/**
 * First-time host nudge: dims the lobby and spotlights the settings gear with
 * a bubble. The glowing gear here is rendered inside the overlay (so it sits
 * above the dim layer reliably) and opens the settings. Tapping the dim area
 * dismisses.
 */
export function SettingsCoach({
  onDismiss,
  onOpenSettings,
}: {
  onDismiss: () => void;
  onOpenSettings: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-40 bg-black/65 backdrop-blur-[2px] duration-300 animate-in fade-in"
      onClick={onDismiss}
    >
      {/* Glowing gear over the real one (top-right of the TopBar). Positioned
          with the safe-area inset so it lines up below the notch on PWAs. */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenSettings();
        }}
        aria-label={t.settings}
        style={{ top: "calc(env(safe-area-inset-top) + 0.375rem)" }}
        className="absolute right-3 flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background animate-pulse gloss"
      >
        <Settings2 className="size-5" />
      </button>

      {/* Bubble pointing up at the gear. */}
      <div
        style={{ top: "calc(env(safe-area-inset-top) + 3.25rem)" }}
        className="absolute right-3 flex flex-col items-end duration-300 animate-in fade-in slide-in-from-top-2"
      >
        <div className="mr-2.5 size-3 rotate-45 rounded-[3px] bg-primary" />
        <div className="-mt-1.5 max-w-[15rem] rounded-2xl bg-primary p-3 text-right text-primary-foreground shadow-xl gloss">
          <p className="font-bold">{t.coachSettings} →</p>
          <p className="text-xs opacity-90">{t.coachSettingsSub}</p>
        </div>
        <p className="mt-3 mr-1 text-xs text-white/70">Tryk for at lukke</p>
      </div>
    </div>
  );
}
