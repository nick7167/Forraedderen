import { Fragment, useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "../../../convex/_generated/dataModel";
import { NeonBackdrop } from "./NeonBackdrop";
import { PhaseChrome } from "./PhaseChrome";
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
 * Clue phase — concept screen 5 (`.s-clue`).
 *
 * Concept structure: aurora → `.clue-header` (phase-badge · round-pill, big
 * `.phase-title`, then the `.player-seq` turn-order strip: ✓ for done, pulsing
 * purple ring for active, opacity .4 for pending) → scrolling `.clue-feed` of
 * chat bubbles (own clues purple and right-aligned) with a typing bubble for
 * whoever is on the clock → `.clue-input-area` (turn label + input + send).
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

  const canCompose = iAmParticipant && !iCluedThisPass;

  return (
    <div className="cscreen s-clue">
      <NeonBackdrop variant="clue" />
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

      <div className="clue-header">
        <div className="phase-row">
          {/* The concept's badge is just "Spor"; the clue-pass counter is folded
              into it when a round has more than one pass. */}
          <div className="phase-badge">
            {t.cluePhase}
            {round.cluePasses > 1 && ` ${round.currentPass}/${round.cluePasses}`}
          </div>
          <div className="round-pill">
            {t.pass} {round.roundNumber} / {totalRounds}
          </div>
        </div>
        <div className="phase-title">{t.cluePhaseTitle}</div>

        <div className="player-seq">
          {round.turnOrder.map((id, i) => {
            const p = playerById(id);
            if (!p) return null;
            const clued = cluesThisPass.some((c) => c.playerId === id);
            const isCurrent = round.currentTurnPlayerId === id;
            return (
              <Fragment key={id}>
                <div className={cn("pseq-item", !clued && !isCurrent && "pseq-pending")}>
                  <Av emoji={p.avatarEmoji} color={p.avatarColor} size="xs" />
                  {isCurrent && !clued && <div className="pseq-active-ring" />}
                  {clued && <div className="pseq-check">✓</div>}
                </div>
                {i < round.turnOrder.length - 1 && <div className="pseq-arrow">›</div>}
              </Fragment>
            );
          })}
        </div>
      </div>

      <div className="clue-feed" ref={feedRef}>
        {cluesThisPass.map((clue) => {
          const p = playerById(clue.playerId as Id<"players">);
          if (!p) return null;
          const mine = clue.playerId === myId;
          return (
            <div key={clue._id} className={cn("clue-bubble", mine && "me")}>
              <div className="clue-col" style={mine ? { textAlign: "right" } : undefined}>
                <div className="clue-text">{clue.text}</div>
                <div className="clue-meta">
                  {p.name} · {p.avatarEmoji}
                </div>
              </div>
              <div className="clue-av">
                <Av emoji={p.avatarEmoji} color={p.avatarColor} size="xs" />
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
              <div className="clue-bubble">
                <div className="clue-av">
                  <Av emoji={p.avatarEmoji} color={p.avatarColor} size="xs" />
                </div>
                <div>
                  <div className="typing-bubble">
                    <div className="tdot" />
                    <div className="tdot" />
                    <div className="tdot" />
                  </div>
                  <div className="clue-meta">
                    {p.name} {t.thinking}
                  </div>
                </div>
              </div>
            );
          })()}
      </div>

      {/* The concept always keeps the composer on screen, disabling it when it
          isn't your turn, so the layout never shifts under the player. */}
      <div className="clue-input-area">
        <div className="turn-label">
          {!canCompose ? (
            <>
              {t.waitingFor} <span>{currentName}</span>
            </>
          ) : isMyTurn ? (
            clueHint
          ) : (
            <>
              Det er <span>{currentName}s</span> tur — forbered dit svar
            </>
          )}
        </div>
        <div className="clue-input-row">
          <input
            className="clue-input"
            value={text}
            maxLength={60}
            placeholder={t.cluePlaceholder}
            aria-label={t.yourClue}
            disabled={!canCompose}
            style={canCompose ? undefined : { opacity: 0.4 }}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && isMyTurn && send()}
          />
          <button
            className="clue-send"
            onClick={send}
            disabled={!canCompose || !isMyTurn || busy || !text.trim()}
            aria-label={t.submitClue}
          >
            ➤
          </button>
        </div>

        {isHost && round.currentTurnPlayerId && (
          <button
            className="btn-ghost mt-2.5 w-full"
            onClick={() => skipPhase({ ...authArgs, roundId: round.roundId })}
          >
            ⏭{" "}
            {t.skipTurn.replace(
              "{name}",
              playerById(round.currentTurnPlayerId)?.name ?? "spilleren",
            )}
          </button>
        )}
      </div>
    </div>
  );
}
