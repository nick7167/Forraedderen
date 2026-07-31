import { internalMutation } from "./_generated/server";
import { clearRounds } from "./round";

/**
 * Abandoned-room sweep.
 *
 * A room was only ever torn down when the last human pressed *leave*
 * (`reassignHostIfNeeded`). Everyone closing the tab — which is what actually
 * happens at the end of a party — left the room, its players, rounds, clues and
 * votes in the database forever. This is the garbage collector for that.
 *
 * A room is swept when it is older than ROOM_MAX_AGE_MS **and** every player in
 * it has been silent for PLAYER_IDLE_MS. Both conditions matter: the age check
 * stops a fresh room being collected during a network blip, and the presence
 * check stops a long-running game being collected mid-play.
 */

/** Rooms younger than this are never touched, however quiet. */
const ROOM_MAX_AGE_MS = 24 * 60 * 60 * 1000;

/** Every player must have been silent at least this long. */
const PLAYER_IDLE_MS = 2 * 60 * 60 * 1000;

/** Bounded per run so a single invocation can't blow the mutation limits. */
const MAX_ROOMS_PER_RUN = 100;

export const sweepAbandonedRooms = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const rooms = await ctx.db.query("rooms").take(MAX_ROOMS_PER_RUN * 5);

    let removed = 0;
    let playersRemoved = 0;

    for (const room of rooms) {
      if (removed >= MAX_ROOMS_PER_RUN) break;
      if (now - room.createdAt < ROOM_MAX_AGE_MS) continue;

      const players = await ctx.db
        .query("players")
        .withIndex("by_room", (q) => q.eq("roomId", room._id))
        .collect();

      // Bots have no heartbeat of their own, so they never keep a room alive.
      const humans = players.filter((p) => p.isBot !== true);
      const stillActive = humans.some((p) => now - p.lastSeen < PLAYER_IDLE_MS);
      if (stillActive) continue;

      await clearRounds(ctx, room._id);
      for (const player of players) {
        await ctx.db.delete(player._id);
        playersRemoved++;
      }
      await ctx.db.delete(room._id);
      removed++;
    }

    return { scanned: rooms.length, removed, playersRemoved };
  },
});
