import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "../../../convex/_generated/dataModel";
import { PhaseChrome } from "./PhaseChrome";
import { Stage, StageScroll, StageFooter } from "@/ui/Stage";
import { Button } from "@/ui/Button";
import { Card, Chip, SectionLabel } from "@/ui/Surface";
import { Glyph } from "@/ui/Glyph";
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
 * Round result.
 *
 * Teal headline when the chameleon is caught, signal when it escapes — the same two colours
 * the role card used. Confetti only for a catch.
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
    <Stage keyName="resolve" width="max-w-2xl" fit className="relative">
      {/* Only celebrate when the chameleon is caught. */}
      {crewWon && <Confetti />}
      <PhaseChrome onLeave={onLeave} />
      <Announce message={crewWon ? t.a11yResultCrew : t.a11yResultImposters} />

      <StageScroll className="flex flex-col gap-3 py-1">
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-label text-muted font-semibold tracking-[0.12em] uppercase">
            {imposters.length > 1 ? t.theImpostersWere : t.theImposterWas}
          </span>
          <p
            data-testid="result-headline"
            data-outcome={crewWon ? "caught" : "escaped"}
            className={cn(
              "font-display text-display-1 font-extrabold tracking-tight",
              crewWon ? "text-teal" : "text-signal-text",
            )}
          >
            {crewWon ? t.caught : t.escaped}
          </p>
        </div>

        {imposters.map((p) => (
          <Card
            key={p._id}
            variant="hero"
            className="flex items-center gap-3 p-3"
            data-testid="imposter-card"
          >
            <Av emoji={p.avatarEmoji} color={p.avatarColor} size="lg" />
            <div className="flex min-w-0 flex-col gap-0.5">
              <Chip tone="signal" size="sm" className="self-start">
                {t.roleImposter}
              </Chip>
              <span className="font-display text-display-2 text-paper font-extrabold">
                {p.name}
              </span>
              {/* The crew's word/question in teal, the chameleon's in signal — the same
                  two colours the role card used, so the reveal pays off what players were
                  looking at all round. `signal-text` not `signal`: this is body size, and
                  the design reserves the darker red for >=24px. */}
              <span className="text-body-sm text-muted">
                {wordLabel}:{" "}
                <span className="text-teal font-semibold" data-testid="crew-word">
                  {reveal.secretWord}
                </span>
              </span>
              {showDecoy && (
                <span className="text-body-sm text-muted">
                  {decoyLabel}:{" "}
                  <span className="text-signal-text font-semibold" data-testid="decoy-word">
                    {reveal.decoyWord}
                  </span>
                </span>
              )}
            </div>
          </Card>
        ))}

        {/* The concept's "Pointopdatering" list. Showing the delta next to the
            vote count is the only place scoring is ever explained in play — see
            HowToPlay for the rules themselves. */}
        <div className="flex flex-col gap-1.5">
          <SectionLabel>{t.scoreUpdate}</SectionLabel>
          {round.turnOrder.map((id) => {
            const p = playerById(id);
            if (!p) return null;
            const count = voteCounts.get(id) ?? 0;
            const delta = deltaByPlayer.get(id) ?? 0;
            const wasImposter = reveal.imposterPlayerIds.some((im) => im === id);
            return (
              <div
                key={id}
                data-testid="score-row"
                className={cn(
                  "border-line flex items-center gap-2 rounded-md border px-2.5 py-2",
                  delta > 0 ? "bg-ink-600" : "bg-ink-700",
                )}
              >
                <Av emoji={p.avatarEmoji} color={p.avatarColor} size="xs" />
                <span className="text-body text-paper min-w-0 flex-1 truncate font-semibold">
                  {p.name} {wasImposter && "🦎"}
                </span>
                <span className="text-label text-muted shrink-0 tabular-nums">
                  {count} {count === 1 ? t.vote : t.votes}
                </span>
                <span
                  data-testid="score-delta"
                  className={cn(
                    "font-display text-body shrink-0 font-bold tabular-nums",
                    delta > 0 ? "text-gold" : "text-muted",
                  )}
                >
                  +{delta}
                </span>
                <span className="font-display text-body text-secondary shrink-0 font-bold tabular-nums">
                  {p.score} {t.pointsShort}
                </span>
              </div>
            );
          })}
        </div>
      </StageScroll>

      <StageFooter>
        {isHost ? (
          <Button size="lg" block onClick={handleNext} data-testid="next-round">
            <Glyph name="chevron" className="-rotate-90" />
            {t.nextRound}
          </Button>
        ) : (
          <p className="text-body-sm text-muted py-2 text-center">{t.waitingForHost}</p>
        )}
      </StageFooter>
    </Stage>
  );
}
