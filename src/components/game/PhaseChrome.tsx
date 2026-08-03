import { useState } from "react";
import { feedback, isMuted, setMuted } from "@/lib/feedback";
import { LeaveButton } from "./LeaveButton";
import { Glyph } from "@/ui/Glyph";
import { t } from "@/lib/strings";

/**
 * The in-round top bar.
 *
 * Previously absolutely positioned into the top band of each screen, because the mockup's
 * phase screens had no bar and the two app-only controls had to be smuggled in without
 * disturbing the designed layout. That constraint is gone with the mockup, so this is now
 * an ordinary flex row at the top of the Stage — which means it can never overlap content,
 * and the reveal card no longer has to leave a hole for it.
 *
 * `pt-safe` so the controls clear the notch. Deliberately quiet: leaving and muting are
 * both things you do rarely and by accident-avoidance, so neither gets a filled button.
 */
export function PhaseChrome({
  onLeave,
  title,
  history,
}: {
  onLeave: () => void;
  /** The phase name. A <p>, not a heading — the screen's real heading is its content. */
  title?: string;
  /** Optional round-history trigger, rendered next to mute. */
  history?: React.ReactNode;
}) {
  const [muted, setMutedState] = useState(isMuted());

  return (
    <div className="pt-safe flex shrink-0 items-center gap-2" data-testid="phase-chrome">
      <LeaveButton onLeave={onLeave} confirm />

      {title && (
        <>
          <div className="bg-line h-4 w-px shrink-0" aria-hidden />
          <p className="text-body-sm text-secondary min-w-0 flex-1 truncate font-semibold">
            {title}
          </p>
        </>
      )}

      <div className="ml-auto flex items-center gap-1">
        {history}
        <button
          type="button"
          className="text-secondary hover:text-paper hover:bg-ink-700 flex size-9 items-center justify-center rounded-sm text-lg transition-colors"
          data-testid="mute-toggle"
          onClick={() => {
            setMuted(!muted);
            setMutedState(!muted);
            if (muted) feedback.tap();
          }}
          aria-label={muted ? t.soundOn : t.soundOff}
        >
          <Glyph name={muted ? "mute" : "sound"} />
        </button>
      </div>
    </div>
  );
}
