import { useEffect, useState } from "react";
import { PRESENCE_TIMEOUT_MS } from "../../convex/shared";

/**
 * Derives online/offline from each player's `lastSeen` on the client.
 *
 * Presence used to be computed server-side, which meant `getRoomState` called
 * `Date.now()` — making the query uncacheable and re-running it on every
 * heartbeat write. Since "is this player still here?" is a question about the
 * current time rather than about stored data, it belongs on the client, where a
 * cheap local interval can answer it without touching the backend at all.
 *
 * Returns a predicate that re-renders on its own schedule, so a player greys
 * out when they go quiet even though nothing in the room actually changed.
 */
export function usePresence() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    // Half the timeout, so a player is flagged within a beat of going quiet.
    const id = setInterval(() => setNow(Date.now()), PRESENCE_TIMEOUT_MS / 2);
    return () => clearInterval(id);
  }, []);

  return (player: { lastSeen: number }) =>
    now - player.lastSeen < PRESENCE_TIMEOUT_MS;
}
