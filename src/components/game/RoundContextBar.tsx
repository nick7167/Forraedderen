import type { FunctionReturnType } from "convex/server";
import { api } from "../../../convex/_generated/api";
import { t } from "@/lib/strings";

type Round = NonNullable<FunctionReturnType<typeof api.round.getRoundState>>;

/**
 * Persistent reminder of what the player needs to know during a round, so the
 * word/category never has to be memorised. Crew (and undercover imposters, who
 * hold a decoy and don't know it) see their word; spy imposters see only that
 * they're the imposter. Everyone in the round sees the category.
 */
export function RoundContextBar({ round }: { round: Round }) {
  const me = round.me;
  const category = round.category;

  // Spectators (not dealt in) have no word and aren't flagged imposter.
  if (!me || (!me.secretWord && !me.isImposter)) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 px-3 pb-2">
      {me.secretWord ? (
        <span className="max-w-[70%] truncate rounded-full bg-primary/20 px-3 py-1 text-sm font-bold text-primary">
          {me.secretWord}
        </span>
      ) : (
        <span className="rounded-full bg-destructive/20 px-3 py-1 text-sm font-bold text-red-300">
          🕵️ {t.youAreImposter}
        </span>
      )}
      {category && (
        <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-muted-foreground">
          {category}
        </span>
      )}
    </div>
  );
}
