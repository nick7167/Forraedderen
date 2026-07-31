import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import confetti from "canvas-confetti";
import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Avatar } from "./PlayerBadge";
import { Screen } from "./Screen";
import { NeonBackdrop } from "./NeonBackdrop";
import { t } from "@/lib/strings";
import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";

type Room = NonNullable<FunctionReturnType<typeof api.games.getRoomState>>;
type Player = Room["players"][number];
type Analytics = NonNullable<FunctionReturnType<typeof api.round.getMatchAnalytics>>;
type Highlight = Analytics["bestDetective"];
type AuthArgs = { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret: string };

const MEDALS = ["🥇", "🥈", "🥉"];
// Podium render order: 2nd, 1st, 3rd — with descending block heights.
const PODIUM_SLOTS = [
  { rank: 1, h: "h-20", grad: "from-slate-300/30 to-slate-400/10", size: 56 },
  { rank: 0, h: "h-28", grad: "from-amber-300/40 to-amber-500/10", size: 72 },
  { rank: 2, h: "h-16", grad: "from-orange-400/30 to-orange-600/10", size: 52 },
];

function HighlightCard({
  emoji,
  label,
  highlight,
  detail,
}: {
  emoji: string;
  label: string;
  highlight: Highlight;
  detail: (value: number) => string;
}) {
  if (!highlight) return null;
  return (
    <div className="glass flex items-center gap-3 rounded-2xl p-3">
      <span className="text-2xl">{emoji}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          {highlight.players.map((player) => (
            <span key={player.playerId} className="inline-flex items-center gap-1 text-sm font-bold">
              <Avatar emoji={player.avatarEmoji} color={player.avatarColor} size={24} />
              {player.name}
            </span>
          ))}
        </div>
      </div>
      <span className="shrink-0 text-right text-sm font-black text-primary">
        {detail(highlight.value)}
      </span>
    </div>
  );
}

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
  const analytics = useQuery(api.round.getMatchAnalytics, authArgs);
  const ranked = [...room.players].sort((a, b) => b.score - a.score);
  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  useEffect(() => {
    const id = setTimeout(
      () => void confetti({ particleCount: 180, spread: 100, origin: { y: 0.45 } }),
      200,
    );
    return () => clearTimeout(id);
  }, []);

  const header = (
    <div className="flex flex-col gap-5">
      <div className="p-in pt-2 text-center">
        <p className="p-float text-4xl">🏆</p>
        <h1 className="mt-1 text-2xl font-extrabold">{t.finalResults}</h1>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-2">
        {PODIUM_SLOTS.map((slot) => {
          const p = top3[slot.rank];
          if (!p) return <div key={slot.rank} className="flex-1" />;
          const isFirst = slot.rank === 0;
          return (
            <div key={slot.rank} className="flex flex-1 flex-col items-center">
              <div className="relative mb-2">
                {isFirst && (
                  <Crown className="absolute -top-5 left-1/2 size-6 -translate-x-1/2 text-amber-400" />
                )}
                <Avatar emoji={p.avatarEmoji} color={p.avatarColor} size={slot.size} ring={isFirst} />
              </div>
              <p className="max-w-full truncate text-sm font-bold">{p.name}</p>
              <p className="text-xs text-muted-foreground">
                {p.score} {t.points}
              </p>
              <div
                className={cn(
                  "mt-2 flex w-full items-start justify-center rounded-t-2xl bg-gradient-to-b pt-2 text-2xl font-black text-white/80",
                  slot.h,
                  slot.grad,
                )}
              >
                {slot.rank + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
    <NeonBackdrop density="full" variant="success" />
    <Screen
      header={header}
      topInset
      footer={
        <div className="space-y-2">
          {isHost && (
            <Button size="hero" onClick={() => backToLobby(authArgs)}>
              {t.playAgain}
            </Button>
          )}
          <Button variant="ghost" className="w-full text-muted-foreground" onClick={onLeave}>
            {t.leave}
          </Button>
        </div>
      }
    >
      {analytics && (
        <section className="space-y-2">
          <h2 className="px-1 text-sm font-semibold text-muted-foreground">
            {t.matchHighlights}
          </h2>
          <HighlightCard
            emoji="🔎"
            label={t.bestDetective}
            highlight={analytics.bestDetective}
            detail={(value) => `${value}% ${t.accuracy}`}
          />
          <HighlightCard
            emoji="🎯"
            label={t.mostCorrectVotes}
            highlight={analytics.mostCorrectVotes}
            detail={(value) => `${value} ${t.correctVotes}`}
          />
          <HighlightCard
            emoji="👀"
            label={t.mostSuspected}
            highlight={analytics.mostSuspected}
            detail={(value) => `${value} ${t.receivedVotes}`}
          />
          <HighlightCard
            emoji="🦎"
            label={t.bestBluff}
            highlight={analytics.bestBluff}
            detail={(value) => `${value} ${t.imposterWins}`}
          />
        </section>
      )}

      {/* Remaining ranks */}
      {rest.length > 0 && (
        <div className="space-y-1.5">
          {rest.map((p: Player, i) => (
            <div key={p._id} className="glass flex items-center gap-3 rounded-2xl p-2.5">
              <span className="w-6 text-center text-sm font-bold text-muted-foreground">
                {MEDALS[i + 3] ?? i + 4}
              </span>
              <Avatar emoji={p.avatarEmoji} color={p.avatarColor} size={36} />
              <span className="font-semibold">{p.name}</span>
              <span className="ml-auto font-black tabular-nums">
                {p.score}
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  {t.points}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </Screen>
    </>
  );
}
