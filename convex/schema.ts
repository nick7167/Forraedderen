import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // App users, mirrored from Clerk identities on first sign-in.
  users: defineTable({
    // Clerk's stable subject claim (identity.subject).
    clerkId: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),

  // A game room / lobby.
  rooms: defineTable({
    code: v.string(), // short shareable join code, e.g. "AB3K"
    name: v.string(),
    hostId: v.id("users"),
    status: v.union(
      v.literal("lobby"),
      v.literal("playing"),
      v.literal("finished"),
    ),
    createdAt: v.number(),
  }).index("by_code", ["code"]),

  // Membership + live presence within a room.
  players: defineTable({
    roomId: v.id("rooms"),
    userId: v.id("users"),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    isReady: v.boolean(),
    joinedAt: v.number(),
    lastSeen: v.number(), // updated by the presence heartbeat
  })
    .index("by_room", ["roomId"])
    .index("by_room_and_user", ["roomId", "userId"])
    .index("by_user", ["userId"]),
});
