import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Avatar } from "./PlayerBadge";
import { t } from "@/lib/strings";
import { feedback } from "@/lib/feedback";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Eye } from "lucide-react";

type Round = NonNullable<FunctionReturnType<typeof api.round.getRoundState>>;
type AuthArgs = { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret: string };

export function RoleReveal({
  round,
  authArgs,
  isHost,
  players,
}: {
  round: Round;
  authArgs: AuthArgs;
  isHost: boolean;
  players: Round["players"];
}) {
  const [flipped, setFlipped] = useState(false);
  const beginClues = useMutation(api.round.beginClues);
  const me = round.me;
  const isImposter = me?.isImposter ?? false;

  const teammates = (me?.teammateIds ?? [])
    .map((id) => players.find((p) => p._id === id))
    .filter((p): p is Round["players"][number] => !!p);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-4">
      <span className="rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {t.yourRole} · {t.pass} {round.roundNumber}
      </span>

      <button
        onClick={() => {
          setFlipped(true);
          feedback.reveal();
        }}
        disabled={flipped}
        className={cn(
          "relative flex aspect-[3/4] w-64 max-w-full items-center justify-center rounded-3xl shadow-xl transition-all duration-500",
          !flipped &&
            "cursor-pointer bg-gradient-to-br from-slate-700 to-slate-900 text-white hover:scale-[1.02] active:scale-95",
          flipped &&
            (isImposter
              ? "bg-gradient-to-br from-red-500 to-rose-700 text-white"
              : "bg-gradient-to-br from-emerald-400 to-teal-600 text-white"),
        )}
      >
        {!flipped ? (
          <div className="flex flex-col items-center gap-3">
            <Eye className="size-10 opacity-90" />
            <span className="px-6 text-center text-lg font-semibold">
              {t.tapToReveal}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 px-6 text-center duration-300 animate-in fade-in zoom-in">
            {isImposter ? (
              <>
                <span className="text-5xl">🕵️</span>
                <span className="text-2xl font-black">{t.youAreImposter}</span>
                {round.category && (
                  <span className="mt-1 text-sm opacity-90">
                    {t.category}: <b>{round.category}</b>
                  </span>
                )}
                <span className="mt-1 text-xs opacity-80">{t.imposterHint}</span>
              </>
            ) : (
              <>
                <span className="text-xs font-medium uppercase opacity-80">
                  {t.theWord}
                </span>
                <span className="text-3xl font-black">{me?.secretWord}</span>
                {round.category && (
                  <span className="mt-1 text-sm opacity-90">
                    {round.category}
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </button>

      {flipped && teammates.length > 0 && (
        <div className="text-center">
          <p className="mb-1 text-xs text-muted-foreground">{t.yourTeammates}</p>
          <div className="flex justify-center gap-2">
            {teammates.map((tm) => (
              <div key={tm._id} className="flex flex-col items-center gap-1">
                <Avatar emoji={tm.avatarEmoji} color={tm.avatarColor} size={36} />
                <span className="text-xs">{tm.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {flipped && (
        <div className="w-full max-w-xs text-center">
          {isHost ? (
            <Button
              size="lg"
              className="w-full font-bold"
              onClick={async () => {
                try {
                  await beginClues({ ...authArgs, roundId: round.roundId });
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Fejl");
                }
              }}
            >
              {t.startClues}
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">{t.waitingForHost}</p>
          )}
        </div>
      )}
    </div>
  );
}
