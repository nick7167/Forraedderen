import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import {
  getGuestSecret,
  recallRoomPlayer,
  rememberRoomPlayer,
} from "@/lib/guest";

// Paced against PRESENCE_TIMEOUT_MS (25s) so a player is marked away within
// roughly one missed beat. The old 4s interval meant a full 12-player room
// wrote to `players` three times a second — into the very table every client
// subscribes to for room state.
const HEARTBEAT_MS = 10_000;

/**
 * Subscribes to a room (and its active round) as the current device's player,
 * and keeps a presence heartbeat alive. Returns live room + round state plus
 * the identity args every game mutation needs.
 */
export function useGameRoom(roomId: Id<"rooms"> | undefined) {
  const guestSecret = getGuestSecret();
  const playerId = roomId
    ? (recallRoomPlayer(roomId) as Id<"players"> | null)
    : null;

  const auth = roomId
    ? { roomId, playerId: playerId ?? undefined, guestSecret }
    : "skip";

  const room = useQuery(api.games.getRoomState, auth === "skip" ? "skip" : auth);

  const roundId = room?.currentRoundId ?? null;
  const round = useQuery(
    api.round.getRoundState,
    roundId && roomId
      ? { roomId, roundId, playerId: playerId ?? undefined, guestSecret }
      : "skip",
  );

  // Persist the resolved player id (e.g. for signed-in users we may learn it
  // from the server) so reconnection works.
  useEffect(() => {
    if (roomId && room?.myPlayerId) {
      rememberRoomPlayer(roomId, room.myPlayerId);
    }
  }, [roomId, room?.myPlayerId]);

  // Presence heartbeat.
  const heartbeat = useMutation(api.presence.heartbeat);
  useEffect(() => {
    if (!roomId) return;
    const ping = () => {
      if (document.visibilityState === "visible") {
        void heartbeat({ roomId, playerId: playerId ?? undefined, guestSecret });
      }
    };
    ping();
    const id = setInterval(ping, HEARTBEAT_MS);
    document.addEventListener("visibilitychange", ping);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", ping);
    };
  }, [roomId, playerId, guestSecret, heartbeat]);

  const authArgs = roomId
    ? { roomId, playerId: playerId ?? undefined, guestSecret }
    : null;

  return { room, round, authArgs, playerId, guestSecret };
}
