import { useEffect, useState } from "react";
import { Glyph } from "@/ui/Glyph";
import { t } from "@/lib/strings";

/**
 * Shows a banner when the browser goes offline. Real-time multiplayer needs a live
 * connection, so this is the user-facing signal that play is paused.
 */
export function OfflineIndicator() {
  const [online, setOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div
      role="status"
      data-testid="offline-indicator"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.5rem)" }}
      className="bg-signal text-paper text-body-sm fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2 px-4 pb-2 font-semibold"
    >
      <Glyph name="warn" />
      {t.offline}
    </div>
  );
}
