import { useLayoutEffect, useState, type RefObject } from "react";
import { SlidersHorizontal } from "lucide-react";
import { t } from "@/lib/strings";

/**
 * First-time host nudge: dims the lobby and spotlights the settings control
 * with a bubble. The highlighted button is rendered inside the overlay (so it
 * sits above the dim layer reliably) and opens the settings. Tapping the dim
 * area dismisses.
 *
 * The spotlight is positioned by measuring the real settings button rather than
 * by duplicating the header's padding maths — the concept's header centres its
 * 42px `.icon-btn`s against the taller room-code pill, so any hardcoded offset
 * drifts the moment that pill changes size. Measuring keeps them locked
 * together for free.
 *
 * The icon matches the lobby's own settings button (`SlidersHorizontal`) so the
 * spotlight reads as that button lit up rather than as a different control.
 */
export function SettingsCoach({
  anchor,
  onDismiss,
  onOpenSettings,
}: {
  /** The lobby's real settings button — the spotlight mirrors its rect. */
  anchor: RefObject<HTMLButtonElement | null>;
  onDismiss: () => void;
  onOpenSettings: () => void;
}) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const el = anchor.current;
      if (el) setRect(el.getBoundingClientRect());
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [anchor]);

  // Nothing to point at yet — don't flash a misplaced spotlight.
  if (!rect) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/65 backdrop-blur-[2px] duration-300 animate-in fade-in"
      onClick={onDismiss}
    >
      {/* Spotlight sitting exactly over the lobby's settings icon-btn. */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenSettings();
        }}
        aria-label={t.settings}
        className="glow-pulse fixed flex items-center justify-center text-white"
        style={{
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          borderRadius: 14,
          background: "linear-gradient(155deg,#9333ea,#7c3aed)",
          border: "1px solid rgba(196,181,253,.45)",
        }}
      >
        <SlidersHorizontal className="size-5" />
      </button>

      {/* Bubble hanging below the spotlight, arrow aimed at its centre. */}
      <div
        className="fixed flex flex-col items-end duration-300 animate-in fade-in slide-in-from-top-2"
        style={{
          top: rect.bottom + 10,
          right: Math.max(8, window.innerWidth - rect.right),
        }}
      >
        <div
          className="rotate-45 rounded-[3px]"
          style={{
            width: 12,
            height: 12,
            marginRight: rect.width / 2 - 6,
            background: "#8b3ce8",
          }}
        />
        <div
          className="-mt-1.5 max-w-[15rem] rounded-2xl p-3 text-right text-white"
          style={{
            background: "linear-gradient(155deg,#9333ea,#7c3aed)",
            boxShadow: "0 4px 22px rgba(124,58,237,.55), 0 1px 0 rgba(255,255,255,.18) inset",
          }}
        >
          <p className="font-bold">{t.coachSettings} →</p>
          <p className="text-xs opacity-90">{t.coachSettingsSub}</p>
        </div>
        <p className="mt-3 mr-1 text-xs text-white/70">Tryk for at lukke</p>
      </div>
    </div>
  );
}
