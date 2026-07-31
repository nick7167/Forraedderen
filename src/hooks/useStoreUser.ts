import type { Id } from "../../convex/_generated/dataModel";

/**
 * Syncs Clerk auth identity into Convex's `users` table.
 * Clerk is currently disabled — this hook is a no-op until authentication is
 * re-wired. Re-enable by restoring the useConvexAuth + getOrCreateUser logic.
 */
export function useStoreUser() {
  // Clerk not active — always unauthenticated.
  return { userId: null as Id<"users"> | null, isStoring: false };
}
