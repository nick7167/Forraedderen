import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireCurrentUser, getCurrentUser } from "./users";
import type { Doc, Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";

// A player is considered "online" if their heartbeat landed within this window.
export const PRESENCE_TIMEOUT_MS = 10_000;

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no easily-confused chars

function generateCode(length = 4): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

async function roomByCode(ctx: QueryCtx, code: string): Promise<Doc<"rooms"> | null> {
  return await ctx.db
    .query("rooms")
    .withIndex("by_code", (q) => q.eq("code", code.toUpperCase()))
    .unique();
}

/** Create a new room with the caller as host, and add them as the first player. */
export const createRoom = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const user = await requireCurrentUser(ctx);

    // Find an unused code (retry a few times on the rare collision).
    let code = generateCode();
    for (let i = 0; i < 5 && (await roomByCode(ctx, code)) !== null; i++) {
      code = generateCode();
    }

    const now = Date.now();
    const roomId = await ctx.db.insert("rooms", {
      code,
      name: name.trim() || "New Room",
      hostId: user._id,
      status: "lobby",
      createdAt: now,
    });

    await ctx.db.insert("players", {
      roomId,
      userId: user._id,
      name: user.name,
      imageUrl: user.imageUrl,
      isReady: false,
      joinedAt: now,
      lastSeen: now,
    });

    return { roomId, code };
  },
});

/** Join an existing room by its share code. Idempotent if already a member. */
export const joinRoom = mutation({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const user = await requireCurrentUser(ctx);
    const room = await roomByCode(ctx, code);
    if (room === null) throw new Error("No room found with that code.");

    const existing = await ctx.db
      .query("players")
      .withIndex("by_room_and_user", (q) =>
        q.eq("roomId", room._id).eq("userId", user._id),
      )
      .unique();

    const now = Date.now();
    if (existing !== null) {
      await ctx.db.patch(existing._id, { lastSeen: now });
      return { roomId: room._id };
    }

    await ctx.db.insert("players", {
      roomId: room._id,
      userId: user._id,
      name: user.name,
      imageUrl: user.imageUrl,
      isReady: false,
      joinedAt: now,
      lastSeen: now,
    });
    return { roomId: room._id };
  },
});

/** Leave a room. If the host leaves, hand off to another player or delete it. */
export const leaveRoom = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    const user = await requireCurrentUser(ctx);
    const membership = await ctx.db
      .query("players")
      .withIndex("by_room_and_user", (q) =>
        q.eq("roomId", roomId).eq("userId", user._id),
      )
      .unique();
    if (membership !== null) await ctx.db.delete(membership._id);

    const room = await ctx.db.get(roomId);
    if (room === null) return;

    const remaining = await ctx.db
      .query("players")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .collect();

    if (remaining.length === 0) {
      await ctx.db.delete(roomId);
    } else if (room.hostId === user._id) {
      await ctx.db.patch(roomId, { hostId: remaining[0].userId });
    }
  },
});

/** Toggle the caller's ready flag in a room. */
export const setReady = mutation({
  args: { roomId: v.id("rooms"), isReady: v.boolean() },
  handler: async (ctx, { roomId, isReady }) => {
    const user = await requireCurrentUser(ctx);
    const membership = await ctx.db
      .query("players")
      .withIndex("by_room_and_user", (q) =>
        q.eq("roomId", roomId).eq("userId", user._id),
      )
      .unique();
    if (membership === null) throw new Error("You are not in this room.");
    await ctx.db.patch(membership._id, { isReady, lastSeen: Date.now() });
  },
});

/** Host-only: move the room into the "playing" state. */
export const startGame = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    const user = await requireCurrentUser(ctx);
    const room = await ctx.db.get(roomId);
    if (room === null) throw new Error("Room not found.");
    if (room.hostId !== user._id) throw new Error("Only the host can start.");
    await ctx.db.patch(roomId, { status: "playing" });
  },
});

/** Live room details for the current viewer (null if gone). */
export const getRoom = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    const room = await ctx.db.get(roomId);
    if (room === null) return null;
    const me = await getCurrentUser(ctx);
    return {
      ...room,
      isHost: me !== null && me._id === room.hostId,
      viewerId: me?._id ?? null,
    };
  },
});

/** Live list of players in a room, with derived online status. */
export const listPlayers = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    const players = await ctx.db
      .query("players")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .collect();
    const now = Date.now();
    return players
      .map((p) => ({
        _id: p._id,
        userId: p.userId,
        name: p.name,
        imageUrl: p.imageUrl,
        isReady: p.isReady,
        joinedAt: p.joinedAt,
        isOnline: now - p.lastSeen < PRESENCE_TIMEOUT_MS,
      }))
      .sort((a, b) => a.joinedAt - b.joinedAt);
  },
});

/** Rooms the current user is a member of (for the lobby list). */
export const myRooms = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (user === null) return [];
    const memberships = await ctx.db
      .query("players")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const rooms = await Promise.all(
      memberships.map(async (m) => {
        const room = await ctx.db.get(m.roomId);
        if (room === null) return null;
        const count = (
          await ctx.db
            .query("players")
            .withIndex("by_room", (q) => q.eq("roomId", room._id as Id<"rooms">))
            .collect()
        ).length;
        return {
          _id: room._id,
          name: room.name,
          code: room.code,
          status: room.status,
          playerCount: count,
        };
      }),
    );
    return rooms.filter((r): r is NonNullable<typeof r> => r !== null);
  },
});
