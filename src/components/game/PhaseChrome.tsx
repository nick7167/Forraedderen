import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { feedback, isMuted, setMuted } from "@/lib/feedback";
import { LeaveButton } from "./LeaveButton";
import { t } from "@/lib/strings";

/**
 * Leave + mute controls for the in-round screens.
 *
 * The concept's phase screens (reveal, vote, results) have no top bar at all —
 * their headers are centered text with generous top padding. Rather than adding
 * a bar the concept doesn't have, these two app-only controls are absolutely
 * positioned into the corners of that existing top band, using the concept's
 * own `.icon-btn`. The designed layout underneath is untouched.
 */
export function PhaseChrome({
  onLeave,
  history,
}: {
  onLeave: () => void;
  /** Optional round-history trigger, rendered next to mute. */
  history?: React.ReactNode;
}) {
  const [muted, setMutedState] = useState(isMuted());

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between"
      style={{
        padding: "max(16px, calc(env(safe-area-inset-top) + 8px)) 18px 0",
      }}
    >
      <div className="pointer-events-auto">
        <LeaveButton onLeave={onLeave} confirm className="icon-btn" />
      </div>
      <div className="pointer-events-auto flex items-center gap-1.5">
        {history}
        <button
          className="icon-btn"
          onClick={() => {
            setMuted(!muted);
            setMutedState(!muted);
            if (muted) feedback.tap();
          }}
          aria-label={muted ? t.soundOn : t.soundOff}
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
      </div>
    </div>
  );
}
