import { mutation, query, type QueryCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";

/**
 * Look up the Convex user row for the currently authenticated Clerk identity.
 * Returns null when signed out or not yet stored.
 */
export async function getCurrentUser(
  ctx: QueryCtx,
): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();
}

/** Same as getCurrentUser but throws — use inside mutations that require auth. */
export async function requireCurrentUser(
  ctx: QueryCtx,
): Promise<Doc<"users">> {
  const user = await getCurrentUser(ctx);
  if (user === null) {
    throw new Error("Not authenticated or user not stored yet.");
  }
  return user;
}

/** The currently authenticated user, or null. Used by the client after sign-in. */
export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

/**
 * Mirror the Clerk identity into the `users` table. Idempotent: called by the
 * client right after sign-in and whenever the profile changes.
 */
export const getOrCreateUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Called getOrCreateUser without authentication.");
    }

    const name =
      identity.name ??
      identity.nickname ??
      identity.givenName ??
      identity.email ??
      "Player";

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (existing !== null) {
      // Keep the cached profile fresh.
      if (existing.name !== name || existing.imageUrl !== identity.pictureUrl) {
        await ctx.db.patch(existing._id, {
          name,
          imageUrl: identity.pictureUrl,
        });
      }
      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkId: identity.subject,
      name,
      imageUrl: identity.pictureUrl,
    });
  },
});
