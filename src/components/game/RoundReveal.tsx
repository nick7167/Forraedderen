import { useEffect } from "react";
import { useMutation } from "convex/react";
import confetti from "canvas-confetti";
import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Avatar } from "./PlayerBadge";
import { Screen } from "./Screen";
import { t } from "@/lib/strings";
import { feedback } from "@/lib/feedback";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Round = NonNullable<FunctionReturnType<typeof api.round.getRoundState>>;
type AuthArgs = { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret: string };

export function RoundReveal({
  round,
  authArgs,
  isHost,
}: {
  round: Round;
  authArgs: AuthArgs;
  isHost: boolean;
}) {
  const nextRound = useMutation(api.round.nextRound);
  const reveal = round.reveal;
  const crewWon = reveal?.outcome === "crew";
  // Did *this* player end up on the winning side?
  const iWon =
    reveal !== null &&
    (round.me?.isImposter ? reveal.outcome === "imposters" : crewWon);

  useEffect(() => {
    if (crewWon) {
      void confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }
    if (reveal) feedback[iWon ? "win" : "lose"]();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crewWon]);

  if (!reveal) return null;

  const playerById = (id: Id<"players">) => round.players.find((p) => p._id === id);
  const imposters = reveal.imposterPlayerIds
    .map(playerById)
    .filter((p): p is Round["players"][number] => !!p);

  // Tally votes per target across all ballots for the breakdown.
  const voteCounts = new Map<Id<"players">, number>();
  for (const v of reveal.voteBreakdown) {
    voteCounts.set(v.targetPlayerId, (voteCounts.get(v.targetPlayerId) ?? 0) + 1);
  }

  const footer = isHost ? (
    <Button
      size="hero"
      className="w-full font-bold"
      onClick={async () => {
        try {
          await nextRound(authArgs);
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Fejl");
        }
      }}
    >
      {t.nextRound}
    </Button>
  ) : (
    <p className="py-3 text-center text-sm text-muted-foreground">
      {t.waitingForHost}
    </p>
  );

  const header = (
    <div
      className={cn(
        "p-in w-full rounded-3xl p-6 text-center text-white",
        crewWon
          ? "bg-gradient-to-br from-emerald-400 to-teal-600 glow-crew"
          : "bg-gradient-to-br from-red-500 to-rose-700 glow-danger",
      )}
    >
      <p className="text-3xl font-black drop-shadow-[0_0_18px_rgba(0,0,0,0.35)]">
        {crewWon ? t.crewWon : t.impostersWon}
      </p>
      <p className="mt-3 text-sm opacity-90">
        {imposters.length > 1 ? t.theImpostersWere : t.theImposterWas}
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        {imposters.map((p) => (
          <div key={p._id} className="flex flex-col items-center gap-1">
            <Avatar emoji={p.avatarEmoji} color={p.avatarColor} size={48} ring />
            <span className="text-sm font-bold">{p.name}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <div className="inline-block rounded-xl bg-white/20 px-4 py-2">
          <span className="text-xs opacity-80">
            {reveal.gameMode === "questions" || reveal.gameMode === "scale"
              ? t.theCrewQuestion
              : t.theWord}
          </span>
          <p className="text-xl font-black">{reveal.secretWord}</p>
        </div>
        {(reveal.gameMode === "undercover" ||
          reveal.gameMode === "questions" ||
          reveal.gameMode === "scale") &&
          reveal.decoyWord && (
            <div className="inline-block rounded-xl bg-black/25 px-4 py-2">
              <span className="text-xs opacity-80">
                {reveal.gameMode === "questions" || reveal.gameMode === "scale"
                  ? t.theImposterQuestion
                  : t.imposterWordWas}
              </span>
              <p className="text-xl font-black">{reveal.decoyWord}</p>
            </div>
          )}
      </div>
    </div>
  );

  return (
    <Screen header={header} className="items-center text-center" footer={footer}>
      {/* Vote breakdown */}
      <div className="w-full">
        <p className="mb-2 text-sm font-semibold text-muted-foreground">
          {t.votes}
        </p>
        <div className="flex flex-col gap-1.5">
          {round.turnOrder.map((id) => {
            const p = playerById(id);
            if (!p) return null;
            const count = voteCounts.get(id) ?? 0;
            const wasImposter = reveal.imposterPlayerIds.some((im) => im === id);
            return (
              <div
                key={id}
                className={cn(
                  "glass flex items-center gap-2 rounded-xl p-2",
                  wasImposter && "ring-1 ring-red-400/50",
                )}
              >
                <Avatar emoji={p.avatarEmoji} color={p.avatarColor} size={28} />
                <span className="text-sm font-medium">{p.name}</span>
                {wasImposter && <span className="text-xs">🦎</span>}
                <span className="ml-auto text-sm font-bold tabular-nums">
                  {count} {t.votes}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}
