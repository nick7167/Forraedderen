import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { feedback, isMuted, setMuted } from "@/lib/feedback";
import { LeaveButton } from "./LeaveButton";

/**
 * Leave + mute controls for the in-round screens.
 *
 * The concept's phase screens (reveal, vote, results) have no top bar at all —
 * their headers are centered text with generous top padding. Rather than adding
 * a bar the concept doesn't have, these two app-only controls are absolutely
 * positioned into the corners of that existing top band, using the concept's
 * own `.icon-btn`. The designed layout underneath is untouched.
 */
export function PhaseChrome({ onLeave }: { onLeave: () => void }) {
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
      <button
        className="icon-btn pointer-events-auto"
        onClick={() => {
          setMuted(!muted);
          setMutedState(!muted);
          if (muted) feedback.tap();
        }}
        aria-label={muted ? "Slå lyd til" : "Slå lyd fra"}
      >
        {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
      </button>
    </div>
  );
}
