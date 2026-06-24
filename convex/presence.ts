import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireCurrentUser } from "./users";

/**
 * Presence heartbeat: the client calls this on an interval while viewing a
 * room. It refreshes `lastSeen` so `listPlayers` can derive online/offline.
 * This is intentionally simple; swap in the official Convex presence component
 * later if you need scale or typing/cursor presence.
 */
export const heartbeat = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    const user = await requireCurrentUser(ctx);
    const membership = await ctx.db
      .query("players")
      .withIndex("by_room_and_user", (q) =>
        q.eq("roomId", roomId).eq("userId", user._id),
      )
      .unique();
    if (membership === null) return; // not a member; nothing to update
    await ctx.db.patch(membership._id, { lastSeen: Date.now() });
  },
});
