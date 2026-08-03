import { useLayoutEffect, useState, type RefObject } from "react";
import { motion } from "motion/react";
import { Glyph } from "@/ui/Glyph";
import { ignite } from "@/ui/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { t } from "@/lib/strings";

/**
 * First-time host nudge: dims the lobby and spotlights the settings control with a bubble.
 * The highlighted button is rendered inside the overlay (so it sits above the dim layer
 * reliably) and opens the settings. Tapping the dim area dismisses.
 *
 * The spotlight is positioned by measuring the real settings button rather than by
 * duplicating the header's padding maths — any hardcoded offset drifts the moment the
 * header changes. Measuring keeps them locked together for free, and `coach.spec.ts`
 * asserts they agree to within 2px.
 *
 * The purple gradient bubble and the pulsing glow are gone. The spotlight is now the
 * ordinary gold control with its press edge, and the bubble is an ink card — which also
 * means the thing being pointed at looks like what it will look like once lit.
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
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const measure = () => {
      const el = anchor.current;
      if (el) setRect(el.getBoundingClientRect());
    };

    /**
     * Re-measure until the anchor stops moving.
     *
     * The lobby Stage enters with `y: 12` (see src/ui/motion.ts `settle`), so a single
     * measurement on mount catches the settings button mid-flight and pins the spotlight
     * 12px above where the button ends up. Track it across frames and stop once the
     * position has been stable for a few, rather than guessing a timeout that is either
     * too short on a slow device or a wasted delay on a fast one.
     */
    let frame = 0;
    let stable = 0;
    let last = "";
    const track = () => {
      const el = anchor.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const key = `${r.x},${r.y},${r.width},${r.height}`;
        if (key === last) {
          stable += 1;
        } else {
          stable = 0;
          last = key;
          setRect(r);
        }
      }
      if (stable < 3) frame = requestAnimationFrame(track);
    };

    measure();
    frame = requestAnimationFrame(track);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [anchor]);

  // Nothing to point at yet — don't flash a misplaced spotlight.
  if (!rect) return null;

  return (
    <div
      className="bg-ink-900/85 fixed inset-0 z-40"
      onClick={onDismiss}
      data-testid="settings-coach"
    >
      {/* Spotlight sitting exactly over the lobby's settings button. */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpenSettings();
        }}
        aria-label={t.settings}
        data-testid="coach-spotlight"
        className="press bg-gold text-ink-900 fixed flex items-center justify-center rounded-sm text-lg"
        style={
          {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            "--press-edge": "#9E7414",
          } as React.CSSProperties
        }
      >
        <Glyph name="settings" />
      </button>

      {/* Bubble hanging below the spotlight, arrow aimed at its centre. */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ignite}
        className="fixed flex flex-col items-end"
        style={{
          top: rect.bottom + 10,
          right: Math.max(8, window.innerWidth - rect.right),
        }}
      >
        <div
          className="bg-ink-700 border-line-strong rotate-45 rounded-[2px] border"
          style={{ width: 12, height: 12, marginRight: rect.width / 2 - 6 }}
          aria-hidden
        />
        <div className="bg-ink-700 border-line-strong sheen -mt-1.5 max-w-60 rounded-md border p-3 text-right">
          <p className="text-body text-paper font-semibold">{t.coachSettings}</p>
          <p className="text-body-sm text-muted mt-0.5">{t.coachSettingsSub}</p>
        </div>
        <p className="text-label text-faint mt-3 mr-1">Tryk for at lukke</p>
      </motion.div>
    </div>
  );
}
