import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

const HEARTBEAT_INTERVAL_MS = 4_000;

/**
 * While mounted (and the tab is visible), ping the presence heartbeat so other
 * players see this user as online. Pair with `PRESENCE_TIMEOUT_MS` in
 * convex/rooms.ts (4s interval vs 10s timeout leaves headroom for jitter).
 */
export function useHeartbeat(roomId: Id<"rooms"> | undefined) {
  const heartbeat = useMutation(api.presence.heartbeat);

  useEffect(() => {
    if (!roomId) return;

    const ping = () => {
      if (document.visibilityState === "visible") {
        void heartbeat({ roomId });
      }
    };

    ping(); // immediate, don't wait a full interval
    const interval = setInterval(ping, HEARTBEAT_INTERVAL_MS);
    document.addEventListener("visibilitychange", ping);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", ping);
    };
  }, [roomId, heartbeat]);
}
