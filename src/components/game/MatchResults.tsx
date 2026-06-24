import { useEffect } from "react";
import { useMutation } from "convex/react";
import confetti from "canvas-confetti";
import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Avatar } from "./PlayerBadge";
import { t } from "@/lib/strings";
import { cn } from "@/lib/utils";

type Room = NonNullable<FunctionReturnType<typeof api.games.getRoomState>>;
type AuthArgs = { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret: string };

const MEDALS = ["🥇", "🥈", "🥉"];

export function MatchResults({
  room,
  authArgs,
  isHost,
  onLeave,
}: {
  room: Room;
  authArgs: AuthArgs;
  isHost: boolean;
  onLeave: () => void;
}) {
  const backToLobby = useMutation(api.round.backToLobby);
  const ranked = [...room.players].sort((a, b) => b.score - a.score);
  const topScore = ranked[0]?.score ?? 0;

  useEffect(() => {
    const id = setTimeout(
      () => void confetti({ particleCount: 160, spread: 90, origin: { y: 0.5 } }),
      200,
    );
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center gap-5 p-4">
      <div className="pt-4 text-center">
        <p className="text-5xl">🏆</p>
        <h1 className="mt-2 text-2xl font-black">{t.finalResults}</h1>
      </div>

      <div className="w-full space-y-2">
        {ranked.map((p, i) => (
          <div
            key={p._id}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-3",
              p.score === topScore && topScore > 0 &&
                "border-amber-300 bg-amber-50 dark:bg-amber-950/30",
            )}
          >
            <span className="w-7 text-center text-lg font-bold">
              {MEDALS[i] ?? i + 1}
            </span>
            <Avatar emoji={p.avatarEmoji} color={p.avatarColor} size={40} />
            <span className="font-semibold">{p.name}</span>
            <span className="ml-auto text-lg font-black tabular-nums">
              {p.score}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                {t.points}
              </span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto w-full space-y-2">
        {isHost && (
          <Button
            size="lg"
            className="w-full font-bold"
            onClick={() => backToLobby(authArgs)}
          >
            {t.playAgain}
          </Button>
        )}
        <Button variant="ghost" className="w-full text-muted-foreground" onClick={onLeave}>
          {t.leave}
        </Button>
      </div>
    </div>
  );
}
