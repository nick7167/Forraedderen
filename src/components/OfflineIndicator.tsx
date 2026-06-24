import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

/**
 * Shows a banner when the browser goes offline. Real-time multiplayer needs a
 * live connection, so this is the user-facing signal that play is paused.
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
    <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2 bg-destructive px-4 py-2 text-sm font-medium text-white">
      <WifiOff className="size-4" />
      You're offline — reconnecting…
    </div>
  );
}
