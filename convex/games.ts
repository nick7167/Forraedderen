import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";
import { settingsValidator } from "./schema";
import {
  generateCode,
  requirePlayer,
  resolvePlayer,
  toPublicPlayer,
} from "./lib";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";

const DEFAULT_SETTINGS = {
  imposterCount: 1,
  cluePasses: 1,
  imposterSeesCategory: true,
  impostersKnowEachOther: true,
  timersEnabled: false,
  clueSecs: 30,
  voteSecs: 45,
  roundCount: 5,
  packId: undefined as Id<"packs"> | undefined,
};

const AVATAR_EMOJIS = ["🦊", "🐼", "🐯", "🐸", "🦉", "🐙", "🦁", "🐧"];
const AVATAR_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#6366f1", "#d946ef", "#ec4899"];

const joinArgs = {
  name: v.string(),
  avatarEmoji: v.string(),
  avatarColor: v.string(),
  guestSecret: v.string(), // client-generated; ignored if signed in
};

// ---------------------------------------------------------------------------
// Lobby lifecycle
// ---------------------------------------------------------------------------

/** Create a room and join it as the host. */
export const createRoom = mutation({
  args: joinArgs,
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    let code = generateCode();
    for (let i = 0; i < 5 && (await roomByCode(ctx, code)) !== null; i++) {
      code = generateCode();
    }
    const now = Date.now();
    const roomId = await ctx.db.insert("rooms", {
      code,
      phase: "lobby",
      currentRoundNumber: 0,
      settings: DEFAULT_SETTINGS,
      createdAt: now,
    });
    const playerId = await insertPlayer(ctx, roomId, args, user, 1, now);
    await ctx.db.patch(roomId, { hostPlayerId: playerId });
    return { roomId, code, playerId };
  },
});

/** Join an existing room by code. Latecomers (mid-match) sit out until next round. */
export const joinRoom = mutation({
  args: { code: v.string(), ...joinArgs },
  handler: async (ctx, args) => {
    const room = await roomByCode(ctx, args.code);
    if (room === null) throw new Error("Ingen rum med den kode.");

    const user = await getCurrentUser(ctx);
    const now = Date.now();

    // Rejoin if a signed-in user is already in this room.
    if (user !== null) {
      const existing = await ctx.db
        .query("players")
        .withIndex("by_room_and_user", (q) =>
          q.eq("roomId", room._id).eq("userId", user._id),
        )
        .unique();
      if (existing !== null) {
        await ctx.db.patch(existing._id, { lastSeen: now });
        return { roomId: room._id, playerId: existing._id };
      }
    }

    const all = await ctx.db
      .query("players")
      .withIndex("by_room", (q) => q.eq("roomId", room._id))
      .collect();
    if (all.length >= 12) throw new Error("Rummet er fuldt (maks 12).");

    const activeFrom =
      room.currentRoundNumber === 0 ? 1 : room.currentRoundNumber + 1;
    const playerId = await insertPlayer(ctx, room._id, args, user, activeFrom, now);
    return { roomId: room._id, playerId };
  },
});

/** Host updates settings (only in the lobby or between rounds). */
export const updateSettings = mutation({
  args: {
    roomId: v.id("rooms"),
    playerId: v.optional(v.id("players")),
    guestSecret: v.optional(v.string()),
    settings: settingsValidator,
  },
  handler: async (ctx, args) => {
    const room = await requireHost(ctx, args);
    if (room.phase !== "lobby" && room.phase !== "scoreboard") {
      throw new Error("Indstillinger kan kun ændres mellem runder.");
    }
    await ctx.db.patch(args.roomId, { settings: args.settings });
  },
});

/** Leave a room. If the host leaves, hand off; if empty, delete. */
export const leaveRoom = mutation({
  args: {
    roomId: v.id("rooms"),
    playerId: v.optional(v.id("players")),
    guestSecret: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const me = await resolvePlayer(ctx, args);
    if (me === null) return;
    await ctx.db.delete(me._id);
    await reassignHostIfNeeded(ctx, args.roomId, me._id);
  },
});

/** Host removes another player. */
export const kickPlayer = mutation({
  args: {
    roomId: v.id("rooms"),
    playerId: v.optional(v.id("players")),
    guestSecret: v.optional(v.string()),
    targetPlayerId: v.id("players"),
  },
  handler: async (ctx, args) => {
    await requireHost(ctx, args);
    const target = await ctx.db.get(args.targetPlayerId);
    if (target !== null && target.roomId === args.roomId) {
      await ctx.db.delete(target._id);
      await reassignHostIfNeeded(ctx, args.roomId, target._id);
    }
  },
});

// ---------------------------------------------------------------------------
// Read model
// ---------------------------------------------------------------------------

/** Everything the client needs to render the lobby + current phase header. */
export const getRoomState = query({
  args: {
    roomId: v.id("rooms"),
    playerId: v.optional(v.id("players")),
    guestSecret: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (room === null) return null;
    const me = await resolvePlayer(ctx, args);
    const now = Date.now();
    const players = (
      await ctx.db
        .query("players")
        .withIndex("by_room", (q) => q.eq("roomId", room._id))
        .collect()
    )
      .sort((a, b) => a.joinedAt - b.joinedAt)
      .map((p) => toPublicPlayer(p, room.hostPlayerId, now));

    let pack: { name: string; emoji: string } | null = null;
    if (room.settings.packId) {
      const p = await ctx.db.get(room.settings.packId);
      if (p) pack = { name: p.name, emoji: p.emoji };
    }

    // Id of the round currently in play (for the client to subscribe to).
    let currentRoundId: Id<"rounds"> | null = null;
    if (room.currentRoundNumber > 0) {
      const round = await ctx.db
        .query("rounds")
        .withIndex("by_room_and_number", (q) =>
          q.eq("roomId", room._id).eq("roundNumber", room.currentRoundNumber),
        )
        .unique();
      currentRoundId = round?._id ?? null;
    }

    return {
      _id: room._id,
      code: room.code,
      phase: room.phase,
      currentRoundNumber: room.currentRoundNumber,
      currentRoundId,
      settings: room.settings,
      pack,
      players,
      hostPlayerId: room.hostPlayerId ?? null,
      myPlayerId: me?._id ?? null,
      isHost: me !== null && me._id === room.hostPlayerId,
    };
  },
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function roomByCode(ctx: QueryCtx, code: string): Promise<Doc<"rooms"> | null> {
  return await ctx.db
    .query("rooms")
    .withIndex("by_code", (q) => q.eq("code", code.toUpperCase().trim()))
    .unique();
}

async function insertPlayer(
  ctx: MutationCtx,
  roomId: Id<"rooms">,
  args: { name: string; avatarEmoji: string; avatarColor: string; guestSecret: string },
  user: Doc<"users"> | null,
  activeFromRound: number,
  now: number,
): Promise<Id<"players">> {
  const name = args.name.trim().slice(0, 20) || user?.name || "Spiller";
  return await ctx.db.insert("players", {
    roomId,
    userId: user?._id,
    guestSecret: user === null ? args.guestSecret : undefined,
    name,
    avatarEmoji: args.avatarEmoji || AVATAR_EMOJIS[0],
    avatarColor: args.avatarColor || AVATAR_COLORS[0],
    score: 0,
    activeFromRound,
    joinedAt: now,
    lastSeen: now,
  });
}

async function requireHost(
  ctx: QueryCtx,
  args: { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret?: string },
): Promise<Doc<"rooms">> {
  const room = await ctx.db.get(args.roomId);
  if (room === null) throw new Error("Rummet findes ikke.");
  const me = await requirePlayer(ctx, args);
  if (room.hostPlayerId !== me._id) throw new Error("Kun værten kan gøre det.");
  return room;
}

async function reassignHostIfNeeded(
  ctx: MutationCtx,
  roomId: Id<"rooms">,
  removedPlayerId: Id<"players">,
) {
  const room = await ctx.db.get(roomId);
  if (room === null) return;
  const remaining = await ctx.db
    .query("players")
    .withIndex("by_room", (q) => q.eq("roomId", roomId))
    .collect();
  if (remaining.length === 0) {
    await ctx.db.delete(roomId);
    return;
  }
  if (room.hostPlayerId === removedPlayerId) {
    const next = remaining.sort((a, b) => a.joinedAt - b.joinedAt)[0];
    await ctx.db.patch(roomId, { hostPlayerId: next._id });
  }
}

export { AVATAR_EMOJIS, AVATAR_COLORS };
