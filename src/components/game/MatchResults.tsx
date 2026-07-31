import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "../../../convex/_generated/dataModel";
import { NeonBackdrop } from "./NeonBackdrop";
import { Confetti } from "./Confetti";
import { Av } from "./Av";
import { t } from "@/lib/strings";
import { cn } from "@/lib/utils";

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
    <div className="stat-chip">
      <div className="sc-lbl">{label}</div>
      <div className="sc-val">{names}</div>
      <div className="vote-psub mt-0.5">{detail(highlight.value)}</div>
    </div>
  );
}

/**
 * Match results — concept screen 7 (`.s-results`), the end-of-match variant.
 *
 * Same skeleton as RoundReveal: confetti + success aurora → `.result-banner`
 * → a champion card (green `.winner-card`, the concept's `.imposter-card`
 * geometry) → the full `.scores-list` with real point totals → `.stat-chips`
 * pairs carrying the match highlights → footer actions.
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
    <div className="cscreen s-results">
      <Confetti count={56} />
      <NeonBackdrop variant="success" />

      <div className="content">
        <div className="result-banner">
          <div className="result-top-lbl">{t.finalResults}</div>
          <div className="result-headline caught">🏆 {champion?.name}</div>
        </div>

        {champion && (
          <div className="winner-card">
            <Av emoji={champion.avatarEmoji} color={champion.avatarColor} size="md" />
            <div className="imp-info">
              <div className="imp-role">{t.winner}</div>
              <div className="imp-name">{champion.name}</div>
              <div className="imp-word">
                <span>
                  {champion.score} {t.points}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="scores-list">
          <div className="scores-lbl">{t.scoreboard}</div>
          {ranked.map((p, i) => (
            <div key={p._id} className={cn("score-row", i === 0 && "winner")}>
              <span className="score-total !min-w-0 !text-left">
                {MEDALS[i] ?? `${i + 1}.`}
              </span>
              <Av emoji={p.avatarEmoji} color={p.avatarColor} size="xs" />
              <div className="score-pname">{p.name}</div>
              <div className="score-total tabular-nums">
                {p.score} {t.points}
              </div>
            </div>
          ))}
        </div>

        {/* Every highlight can legitimately be null — `bestBluff` is null in a
            match the crew swept, and `bestDetective` is null if nobody ever
            voted correctly. Rendering the heading regardless left it stranded
            over two empty rows, so the section only appears if a chip will. */}
        {highlights.length > 0 && (
          <div className="w-full">
            <div className="scores-lbl">{t.matchHighlights}</div>
            {/* Paired into rows of two, matching the concept's `.stat-chips`. */}
            {Array.from({ length: Math.ceil(highlights.length / 2) }, (_, row) => (
              <div key={row} className="stat-chips mb-2.5">
                {highlights.slice(row * 2, row * 2 + 2).map((h) => (
                  <StatChip
                    key={h.label}
                    label={h.label}
                    highlight={h.highlight}
                    detail={h.detail}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="footer">
        {isHost && (
          <button
            className="btn btn-primary w-full"
            style={{ padding: 16, borderRadius: 18, fontSize: 16 }}
            onClick={() => backToLobby(authArgs)}
          >
            {t.playAgain} →
          </button>
        )}
        <button className="btn btn-ghost w-full" onClick={onLeave}>
          {t.leave}
        </button>
      </div>
    </div>
  );
}
