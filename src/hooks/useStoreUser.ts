import { useEffect, useState } from "react";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

/**
 * After Clerk sign-in, mirror the identity into Convex's `users` table.
 * Returns the Convex user id once stored (null while loading / signed out).
 */
export function useStoreUser() {
  const { isAuthenticated } = useConvexAuth();
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);

  useEffect(() => {
    if (!isAuthenticated) {
      setUserId(null);
      return;
    }
    let cancelled = false;
    void getOrCreateUser().then((id) => {
      if (!cancelled) setUserId(id);
    });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, getOrCreateUser]);

  return { userId, isStoring: isAuthenticated && userId === null };
}
