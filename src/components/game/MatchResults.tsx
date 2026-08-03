import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "../../../convex/_generated/dataModel";
import { Confetti } from "./Confetti";
import { Stage, StageScroll, StageFooter } from "@/ui/Stage";
import { Button } from "@/ui/Button";
import { Card, Chip, SectionLabel } from "@/ui/Surface";
import { Av } from "./Av";
import { t } from "@/lib/strings";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Room = NonNullable<FunctionReturnType<typeof api.games.getRoomState>>;
type Analytics = NonNullable<FunctionReturnType<typeof api.round.getMatchAnalytics>>;
type Highlight = Analytics["bestDetective"];
type AuthArgs = { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret: string };

const MEDALS = ["🥇", "🥈", "🥉"];

/** The concept's `.stat-chip` — a small labelled highlight ("Bedste detektiv"). */
function StatChip({
  label,
  highlight,
  detail,
}: {
  label: string;
  highlight: Highlight;
  detail: (value: number) => string;
}) {
  if (!highlight || highlight.players.length === 0) return null;
  const names = highlight.players
    .map((p) => `${p.avatarEmoji} ${p.name}`)
    .join(", ");
  return (
    <Card className="flex flex-col gap-0.5 p-3" data-testid="stat-chip">
      <span className="text-label text-muted font-semibold tracking-[0.12em] uppercase">
        {label}
      </span>
      <span className="text-body text-paper font-semibold">{names}</span>
      <span className="text-label text-muted">{detail(highlight.value)}</span>
    </Card>
  );
}

/**
 * Match results.
 *
 * The winner's name is `paper` — the brightest value in the system, reserved for exactly
 * this and nothing else, the same way SnapArena reserves it for the top of a ladder.
 */
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
  const champion = ranked[0];

  async function handlePlayAgain() {
    try {
      await backToLobby(authArgs);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fejl");
    }
  }

  // Only the highlights that actually have a winner this match.
  const highlights = (
    analytics
      ? [
          {
            label: t.bestDetective,
            highlight: analytics.bestDetective,
            detail: (v: number) => `${v}% ${t.accuracy}`,
          },
          {
            label: t.mostCorrectVotes,
            highlight: analytics.mostCorrectVotes,
            detail: (v: number) => `${v} ${t.correctVotes}`,
          },
          {
            label: t.mostSuspected,
            highlight: analytics.mostSuspected,
            detail: (v: number) => `${v} ${t.receivedVotes}`,
          },
          {
            label: t.bestBluff,
            highlight: analytics.bestBluff,
            detail: (v: number) => `${v} ${t.imposterWins}`,
          },
        ]
      : []
  ).filter((h) => h.highlight !== null && h.highlight.players.length > 0);

  return (
    <Stage keyName="finished" width="max-w-3xl" className="relative">
      <Confetti count={56} />

      <StageScroll className="flex flex-col gap-4 py-1">
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-label text-muted font-semibold tracking-[0.12em] uppercase">
            {t.finalResults}
          </span>
          {/* Paper, not gold — the winner is the one place in this app allowed the
              brightest value, exactly as SnapArena reserves it for the top of a ladder. */}
          <p
            data-testid="result-headline"
            className="font-display text-display-1 text-paper font-extrabold tracking-tight"
          >
            {champion?.name}
          </p>
        </div>

        {champion && (
          <Card
            you
            accent={champion.avatarColor}
            className="flex items-center gap-3 p-3"
            data-testid="winner-card"
          >
            <Av emoji={champion.avatarEmoji} color={champion.avatarColor} size="lg" />
            <div className="flex min-w-0 flex-col gap-0.5">
              <Chip tone="paper" size="sm" className="self-start">
                {t.winner}
              </Chip>
              <span className="font-display text-display-2 text-paper font-extrabold">
                {champion.name}
              </span>
              <span className="font-display text-body text-secondary font-bold tabular-nums">
                {champion.score} {t.points}
              </span>
            </div>
          </Card>
        )}

        <div className="flex flex-col gap-1.5">
          <SectionLabel>{t.scoreboard}</SectionLabel>
          {ranked.map((p, i) => (
            <div
              key={p._id}
              data-testid="score-row"
              className={cn(
                "border-line flex items-center gap-2.5 rounded-md border px-2.5 py-2",
                i === 0 ? "bg-ink-600" : "bg-ink-700",
              )}
            >
              <span className="font-display text-body w-7 shrink-0 text-center font-bold tabular-nums">
                {MEDALS[i] ?? `${i + 1}.`}
              </span>
              <Av emoji={p.avatarEmoji} color={p.avatarColor} size="xs" />
              <span className="text-body text-paper min-w-0 flex-1 truncate font-semibold">
                {p.name}
              </span>
              <span
                className={cn(
                  "font-display text-body shrink-0 font-bold tabular-nums",
                  i === 0 ? "text-paper" : "text-secondary",
                )}
              >
                {p.score} {t.points}
              </span>
            </div>
          ))}
        </div>

        {/* Every highlight can legitimately be null — `bestBluff` is null in a
            match the crew swept, and `bestDetective` is null if nobody ever
            voted correctly. Rendering the heading regardless left it stranded
            over two empty rows, so the section only appears if a chip will. */}
        {highlights.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <SectionLabel>{t.matchHighlights}</SectionLabel>
            {/* A grid rather than hand-paired rows — the old version chunked them into
                rows of two in JS, which left a half-width orphan on an odd count. */}
            <div className="grid gap-2 sm:grid-cols-2">
              {highlights.map((h) => (
                <StatChip
                  key={h.label}
                  label={h.label}
                  highlight={h.highlight}
                  detail={h.detail}
                />
              ))}
            </div>
          </div>
        )}
      </StageScroll>

      <StageFooter>
        {isHost && (
          <Button size="lg" block onClick={handlePlayAgain} data-testid="play-again">
            {t.playAgain}
          </Button>
        )}
        <Button variant="ghost" block onClick={onLeave} data-testid="leave-match">
          {t.leave}
        </Button>
      </StageFooter>
    </Stage>
  );
}
