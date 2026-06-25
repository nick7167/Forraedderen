import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";
import { DANISH_PACKS } from "./packData";
import type { MutationCtx } from "./_generated/server";

const wordValidator = v.object({ word: v.string(), hint: v.optional(v.string()) });

/**
 * Insert any missing built-in Danish packs into the `packs` table. Idempotent.
 * Called automatically on createRoom so a fresh deployment self-seeds — no
 * manual `convex run packs:seedBuiltInPacks` step needed.
 */
export async function ensureBuiltInPacks(ctx: MutationCtx): Promise<number> {
  const existing = await ctx.db
    .query("packs")
    .withIndex("by_owner", (q) => q.eq("ownerUserId", undefined))
    .collect();
  const have = new Set(existing.map((p) => p.name));
  let inserted = 0;
  for (const pack of DANISH_PACKS) {
    if (have.has(pack.name)) continue;
    await ctx.db.insert("packs", {
      ownerUserId: undefined,
      name: pack.name,
      language: "da",
      emoji: pack.emoji,
      isBuiltIn: true,
      words: pack.words.map((word) => ({ word })),
    });
    inserted++;
  }
  return inserted;
}

/** Built-in packs + the signed-in user's saved custom packs. */
export const listPacks = query({
  args: {},
  handler: async (ctx) => {
    const builtIn = (
      await ctx.db
        .query("packs")
        .withIndex("by_owner", (q) => q.eq("ownerUserId", undefined))
        .collect()
    ).filter((p) => p.isBuiltIn); // exclude guests' one-off packs (also ownerless)

    const user = await getCurrentUser(ctx);
    const mine = user
      ? await ctx.db
          .query("packs")
          .withIndex("by_owner", (q) => q.eq("ownerUserId", user._id))
          .collect()
      : [];

    return [...builtIn, ...mine].map((p) => ({
      _id: p._id,
      name: p.name,
      emoji: p.emoji,
      wordCount: p.words.length,
      isBuiltIn: p.isBuiltIn,
      isMine: !p.isBuiltIn,
    }));
  },
});

/**
 * Create a custom pack. Signed-in users save it (reusable across games);
 * guests create a one-off (ownerUserId undefined but isBuiltIn=false so it
 * isn't offered as a built-in to others — it's referenced directly by id).
 */
export const createCustomPack = mutation({
  args: {
    name: v.string(),
    emoji: v.optional(v.string()),
    words: v.array(wordValidator),
  },
  handler: async (ctx, args) => {
    const cleanWords = args.words
      .map((w) => ({ word: w.word.trim(), hint: w.hint?.trim() || undefined }))
      .filter((w) => w.word.length > 0);
    if (cleanWords.length < 3) {
      throw new Error("En pakke skal have mindst 3 ord.");
    }
    const user = await getCurrentUser(ctx);
    return await ctx.db.insert("packs", {
      ownerUserId: user?._id, // undefined for guests → one-off, not listed as built-in
      name: args.name.trim().slice(0, 40) || "Min pakke",
      language: "da",
      emoji: args.emoji || "✨",
      isBuiltIn: false,
      words: cleanWords,
    });
  },
});

/**
 * Seed the built-in Danish packs. Idempotent — safe to run anytime; it only
 * inserts packs that aren't already present (matched by name).
 */
export const seedBuiltInPacks = mutation({
  args: {},
  handler: async (ctx) => {
    const inserted = await ensureBuiltInPacks(ctx);
    return { inserted, total: DANISH_PACKS.length };
  },
});
