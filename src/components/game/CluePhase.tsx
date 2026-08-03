import { Fragment, useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "../../../convex/_generated/dataModel";
import { PhaseChrome } from "./PhaseChrome";
import { Stage, StageScroll, StageFooter } from "@/ui/Stage";
import { Button } from "@/ui/Button";
import { Chip } from "@/ui/Surface";
import { Input } from "@/ui/Input";
import { Glyph } from "@/ui/Glyph";
import { Av } from "./Av";
import { Announce } from "./Announce";
import { RoundHistory } from "./RoundHistory";
import { t } from "@/lib/strings";
import { feedback } from "@/lib/feedback";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Round = NonNullable<FunctionReturnType<typeof api.round.getRoundState>>;
type AuthArgs = { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret: string };

/**
 * Clue phase.
 *
 * A chat feed: your own clues are gold and right-aligned, everyone else's are ink cards on
 * the left. The composer stays mounted and disables when it isn't your turn, so the layout
 * never shifts under the player mid-round.
 */
export function CluePhase({
  round,
  authArgs,
  isHost,
  totalRounds,
  onLeave,
}: {
  round: Round;
  authArgs: AuthArgs;
  isHost: boolean;
  totalRounds: number;
  onLeave: () => void;
}) {
  const submitClue = useMutation(api.round.submitClue);
  const skipPhase = useMutation(api.round.skipPhase);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  const myId = round.me?.playerId;
  const isMyTurn = round.currentTurnPlayerId === myId;
  const playerById = (id: Id<"players">) => round.players.find((p) => p._id === id);

  // Broad-clue guidance, tailored to the player's (apparent) role.
  const clueHint =
    round.me?.isImposter && round.gameMode === "spy"
      ? t.clueHintSpyImposter
      : round.gameMode === "undercover"
        ? t.clueHintUndercover
        : t.clueHintCrew;

  // Cue the player when it becomes their turn.
  const wasMyTurn = useRef(false);
  useEffect(() => {
    if (isMyTurn && !wasMyTurn.current) feedback.yourTurn();
    wasMyTurn.current = isMyTurn;
  }, [isMyTurn]);

  const cluesThisPass = round.clues.filter((c) => c.passNumber === round.currentPass);

  // Keep the newest bubble in view, like a chat thread.
  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
  }, [cluesThisPass.length]);

  const iAmParticipant = !!myId && round.turnOrder.some((id) => id === myId);
  const iCluedThisPass = !!myId && cluesThisPass.some((c) => c.playerId === myId);
  const currentName =
    playerById(round.currentTurnPlayerId as Id<"players">)?.name ?? "…";

  async function send() {
    const value = text.trim();
    if (!value) return;
    setBusy(true);
    try {
      await submitClue({ ...authArgs, roundId: round.roundId, text: value });
      setText("");
      feedback.confirm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fejl");
    } finally {
      setBusy(false);
    }
  }

  async function skipTurn() {
    try {
      await skipPhase({ ...authArgs, roundId: round.roundId });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fejl");
    }
  }

  const canCompose = iAmParticipant && !iCluedThisPass;

  return (
    <Stage keyName="clues" width="max-w-2xl" fit>
      <PhaseChrome
        onLeave={onLeave}
        history={<RoundHistory authArgs={authArgs} players={round.players} />}
      />
      <Announce
        message={
          isMyTurn
            ? t.a11yYourTurn
            : `${t.a11yWaitingTurn.replace("{name}", currentName)} ${t.a11yClueCount
                .replace("{done}", String(cluesThisPass.length))
                .replace("{total}", String(round.turnOrder.length))}`
        }
      />

      <div className="flex shrink-0 flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Chip tone="gold" size="sm" data-testid="phase-badge">
            {t.cluePhase}
            {round.cluePasses > 1 && ` ${round.currentPass}/${round.cluePasses}`}
          </Chip>
          <span className="text-label text-muted font-semibold tabular-nums">
            {t.pass} {round.roundNumber} / {totalRounds}
          </span>
        </div>
        <p className="font-display text-display-2 text-paper font-extrabold">
          {t.cluePhaseTitle}
        </p>

        {/* Turn order. The arrow separators are gone — the row reads left-to-right
            without being told to, and eleven chevrons is a lot of ink for that. */}
        <div className="flex flex-wrap items-center gap-1.5" data-testid="player-seq">
          {round.turnOrder.map((id) => {
            const p = playerById(id);
            if (!p) return null;
            const clued = cluesThisPass.some((c) => c.playerId === id);
            const isCurrent = round.currentTurnPlayerId === id;
            return (
              <Fragment key={id}>
                <div
                  className={cn(
                    "relative",
                    isCurrent && !clued && "ring-teal rounded-md ring-2 ring-offset-0",
                  )}
                >
                  <Av
                    emoji={p.avatarEmoji}
                    color={p.avatarColor}
                    size="xs"
                    dimmed={!clued && !isCurrent}
                  />
                  {clued && (
                    <span
                      aria-hidden
                      className="bg-teal text-ink-900 absolute -right-1 -bottom-1 flex size-3.5 items-center justify-center rounded-full text-[8px]"
                    >
                      <Glyph name="check" />
                    </span>
                  )}
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>

      <StageScroll className="flex flex-col gap-2 py-1" testId="clue-feed" scrollRef={feedRef}>
        {cluesThisPass.map((clue) => {
          const p = playerById(clue.playerId as Id<"players">);
          if (!p) return null;
          const mine = clue.playerId === myId;
          return (
            <div
              key={clue._id}
              className={cn("flex items-end gap-2", mine && "flex-row-reverse")}
            >
              <Av emoji={p.avatarEmoji} color={p.avatarColor} size="xs" />
              <div className={cn("flex min-w-0 flex-col gap-0.5", mine && "items-end")}>
                <span
                  data-testid="clue-text"
                  className={cn(
                    "text-body max-w-[70vw] rounded-md px-3 py-2 font-medium break-words sm:max-w-sm",
                    mine
                      ? "bg-gold text-ink-900"
                      : "bg-ink-700 border-line text-paper border",
                  )}
                >
                  {clue.text}
                </span>
                <span className="text-label text-muted">{p.name}</span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator for the player currently on the clock */}
        {round.currentTurnPlayerId &&
          !cluesThisPass.some((c) => c.playerId === round.currentTurnPlayerId) &&
          (() => {
            const p = playerById(round.currentTurnPlayerId as Id<"players">);
            if (!p) return null;
            return (
              <div className="flex items-end gap-2">
                <Av emoji={p.avatarEmoji} color={p.avatarColor} size="xs" />
                <div className="flex flex-col gap-0.5">
                  <span className="bg-ink-700 border-line text-muted text-body inline-flex rounded-md border px-3 py-2">
                    <span className="animate-pulse">···</span>
                  </span>
                  <span className="text-label text-muted">
                    {p.name} {t.thinking}
                  </span>
                </div>
              </div>
            );
          })()}
      </StageScroll>

      {/* The composer stays on screen and disables when it isn't your turn, so the layout
          never shifts under the player mid-round. */}
      <StageFooter>
        <p className="text-body-sm text-muted text-center">
          {!canCompose ? (
            <>
              {t.waitingFor}{" "}
              <span className="text-paper font-semibold">{currentName}</span>
            </>
          ) : isMyTurn ? (
            clueHint
          ) : (
            <>
              Det er{" "}
              <span className="text-paper font-semibold">{currentName}s</span> tur —
              forbered dit svar
            </>
          )}
        </p>
        <div className="flex items-center gap-2">
          <Input
            size="lg"
            wrapperClassName="flex-1"
            value={text}
            maxLength={60}
            placeholder={t.cluePlaceholder}
            aria-label={t.yourClue}
            data-testid="clue-input"
            disabled={!canCompose}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && isMyTurn && send()}
          />
          <Button
            size="lg"
            onClick={send}
            loading={busy}
            disabled={!canCompose || !isMyTurn || !text.trim()}
            aria-label={t.submitClue}
            data-testid="clue-send"
            className="px-5"
          >
            <Glyph name="chevron" className="-rotate-90" />
          </Button>
        </div>

        {isHost && round.currentTurnPlayerId && (
          <Button variant="ghost" block onClick={skipTurn} data-testid="skip-turn">
            {t.skipTurn.replace(
              "{name}",
              playerById(round.currentTurnPlayerId)?.name ?? "spilleren",
            )}
          </Button>
        )}
      </StageFooter>
    </Stage>
  );
}
