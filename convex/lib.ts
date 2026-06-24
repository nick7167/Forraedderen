import type { QueryCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { getCurrentUser } from "./users";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no easily-confused chars

export function generateCode(length = 4): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

/** Fisher–Yates shuffle returning a new array. */
export function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Shape of a player as exposed to clients — never includes `guestSecret`. */
export type PublicPlayer = {
  _id: Id<"players">;
  name: string;
  avatarEmoji: string;
  avatarColor: string;
  score: number;
  activeFromRound: number;
  joinedAt: number;
  isOnline: boolean;
  isHost: boolean;
};

export const PRESENCE_TIMEOUT_MS = 12_000;

export function toPublicPlayer(
  player: Doc<"players">,
  hostPlayerId: Id<"players"> | undefined,
  now: number,
): PublicPlayer {
  return {
    _id: player._id,
    name: player.name,
    avatarEmoji: player.avatarEmoji,
    avatarColor: player.avatarColor,
    score: player.score,
    activeFromRound: player.activeFromRound,
    joinedAt: player.joinedAt,
    isOnline: now - player.lastSeen < PRESENCE_TIMEOUT_MS,
    isHost: hostPlayerId !== undefined && player._id === hostPlayerId,
  };
}

/**
 * Authorize and resolve the acting player in a room. A caller proves identity
 * one of two ways:
 *   - signed in via Clerk (matched by userId), or
 *   - a guest, by passing the playerId + the guestSecret stored locally.
 * Throws if the player can't be verified as a member of the room.
 */
export async function requirePlayer(
  ctx: QueryCtx,
  args: { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret?: string },
): Promise<Doc<"players">> {
  const user = await getCurrentUser(ctx);

  if (user !== null) {
    const byUser = await ctx.db
      .query("players")
      .withIndex("by_room_and_user", (q) =>
        q.eq("roomId", args.roomId).eq("userId", user._id),
      )
      .unique();
    if (byUser !== null) return byUser;
  }

  if (args.playerId && args.guestSecret) {
    const byId = await ctx.db.get(args.playerId);
    if (
      byId !== null &&
      byId.roomId === args.roomId &&
      byId.guestSecret === args.guestSecret
    ) {
      return byId;
    }
  }

  throw new Error("Not a member of this room (or invalid credentials).");
}

/**
 * Resolve the acting player without throwing — for read queries that should
 * tolerate spectators / not-yet-joined / loading states. Returns null if the
 * caller isn't a verified member.
 */
export async function resolvePlayer(
  ctx: QueryCtx,
  args: { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret?: string },
): Promise<Doc<"players"> | null> {
  try {
    return await requirePlayer(ctx, args);
  } catch {
    return null;
  }
}

/** Players in a room who are active for the given round number. */
export async function activePlayers(
  ctx: QueryCtx,
  roomId: Id<"rooms">,
  roundNumber: number,
): Promise<Doc<"players">[]> {
  const all = await ctx.db
    .query("players")
    .withIndex("by_room", (q) => q.eq("roomId", roomId))
    .collect();
  return all.filter((p) => p.activeFromRound <= roundNumber);
}
