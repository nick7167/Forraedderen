import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { resolvePlayer } from "./lib";

/**
 * Presence heartbeat: the client calls this on an interval while in a room so
 * `lastSeen` stays fresh and others see online/offline + reconnection works.
 */
export const heartbeat = mutation({
  args: {
    roomId: v.id("rooms"),
    playerId: v.optional(v.id("players")),
    guestSecret: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const me = await resolvePlayer(ctx, args);
    if (me === null) return;
    await ctx.db.patch(me._id, { lastSeen: Date.now() });
  },
});
