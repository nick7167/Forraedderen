import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "../../../convex/_generated/dataModel";
import { NeonBackdrop } from "./NeonBackdrop";
import { PhaseChrome } from "./PhaseChrome";
import { Confetti } from "./Confetti";
import { Av } from "./Av";
import { Announce } from "./Announce";
import { t } from "@/lib/strings";
import { feedback } from "@/lib/feedback";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Round = NonNullable<FunctionReturnType<typeof api.round.getRoundState>>;
type AuthArgs = { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret: string };

/**
 * Round result — concept screen 7 (`.s-results`).
 *
 * Concept structure: `.confetti-area` + green/purple aurora → `.content`
 * (`.result-banner` headline, the red `.imposter-card` reveal, a `.scores-list`,
 * then `.stat-chips`) → `.footer` with the primary "next" action.
 *
 * The concept's list is a per-player point update; this screen's equivalent
 * payload is the vote breakdown, so the same `.score-row` treatment carries
 * vote counts — the chameleon's row is highlighted rather than the winner's.
 */
export function RoundReveal({
  round,
  authArgs,
  isHost,
  onLeave,
}: {
  round: Round;
  authArgs: AuthArgs;
  isHost: boolean;
  onLeave: () => void;
}) {
  const nextRound = useMutation(api.round.nextRound);
  const reveal = round.reveal;
  const crewWon = reveal?.outcome === "crew";
  // Did *this* player end up on the winning side?
  const iWon =
    reveal !== null &&
    (round.me?.isImposter ? reveal.outcome === "imposters" : crewWon);

  useEffect(() => {
    if (reveal) feedback[iWon ? "win" : "lose"]();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crewWon]);

  if (!reveal) return null;

  const playerById = (id: Id<"players">) => round.players.find((p) => p._id === id);
  const imposters = reveal.imposterPlayerIds
    .map(playerById)
    .filter((p): p is Round["players"][number] => !!p);

  const deltaByPlayer = new Map(
    reveal.scoreDeltas.map((d) => [d.playerId, d.delta] as const),
  );

  // Tally votes per target across all ballots for the breakdown.
  const voteCounts = new Map<Id<"players">, number>();
  for (const v of reveal.voteBreakdown) {
    voteCounts.set(v.targetPlayerId, (voteCounts.get(v.targetPlayerId) ?? 0) + 1);
  }

  const isPromptMode = reveal.gameMode === "questions" || reveal.gameMode === "scale";
  const wordLabel = isPromptMode ? t.theCrewQuestion : t.theWord;
  const decoyLabel = isPromptMode ? t.theImposterQuestion : t.imposterWordWas;
  const showDecoy =
    (reveal.gameMode === "undercover" || isPromptMode) && reveal.decoyWord;

  async function handleNext() {
    try {
      await nextRound(authArgs);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fejl");
    }
  }

  return (
    <div className="cscreen s-results">
      {/* The concept only celebrates when the chameleon is caught. */}
      {crewWon && <Confetti />}
      <NeonBackdrop variant="success" />
      <PhaseChrome onLeave={onLeave} />
      <Announce message={crewWon ? t.a11yResultCrew : t.a11yResultImposters} />

      <div className="content">
        <div className="result-banner">
          <div className="result-top-lbl">
            {imposters.length > 1 ? t.theImpostersWere : t.theImposterWas}
          </div>
          <div className={cn("result-headline", crewWon ? "caught" : "escaped")}>
            {crewWon ? `✓ ${t.caught}` : `🔥 ${t.escaped}`}
          </div>
        </div>

        {imposters.map((p) => (
          <div key={p._id} className="imposter-card">
            <Av emoji={p.avatarEmoji} color={p.avatarColor} size="md" />
            <div className="imp-info">
              <div className="imp-role">{t.roleImposter}</div>
              <div className="imp-name">{p.name}</div>
              <div className="imp-word">
                {wordLabel}: <span>{reveal.secretWord}</span>
              </div>
              {showDecoy && (
                <div className="imp-word">
                  {decoyLabel}: <span>{reveal.decoyWord}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* The concept's "Pointopdatering" list. Showing the delta next to the
            vote count is the only place scoring is ever explained in play — see
            HowToPlay for the rules themselves. */}
        <div className="scores-list">
          <div className="scores-lbl">{t.scoreUpdate}</div>
          {round.turnOrder.map((id) => {
            const p = playerById(id);
            if (!p) return null;
            const count = voteCounts.get(id) ?? 0;
            const delta = deltaByPlayer.get(id) ?? 0;
            const wasImposter = reveal.imposterPlayerIds.some((im) => im === id);
            return (
              <div key={id} className={cn("score-row", delta > 0 && "winner")}>
                <Av emoji={p.avatarEmoji} color={p.avatarColor} size="xs" />
                <div className="score-pname">
                  {p.name} {wasImposter && "🦎"}
                </div>
                <div className="vote-psub shrink-0 tabular-nums">
                  {count} {count === 1 ? t.vote : t.votes}
                </div>
                <div className={cn("score-delta tabular-nums", delta === 0 && "neg")}>
                  +{delta}
                </div>
                <div className="score-total tabular-nums">
                  {p.score} {t.pointsShort}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="footer">
        {isHost ? (
          <button
            className="btn btn-primary w-full"
            style={{ padding: 16, borderRadius: 18, fontSize: 16 }}
            onClick={handleNext}
          >
            {t.nextRound} →
          </button>
        ) : (
          <div className="waiting-row">
            <div className="pdot" />
            <div className="pdot" />
            <div className="pdot" />
            <div className="waiting-text">{t.waitingForHost}</div>
          </div>
        )}
      </div>
    </div>
  );
}
