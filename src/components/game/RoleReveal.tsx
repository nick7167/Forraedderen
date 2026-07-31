import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "../../../convex/_generated/dataModel";
import { NeonBackdrop } from "./NeonBackdrop";
import { PhaseChrome } from "./PhaseChrome";
import { Av } from "./Av";
import { t } from "@/lib/strings";
import { feedback } from "@/lib/feedback";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Round = NonNullable<FunctionReturnType<typeof api.round.getRoundState>>;
type AuthArgs = { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret: string };

/**
 * Role reveal — concept screen 4 (`.s-reveal`).
 *
 * The concept's centrepiece: a real 3D flip card (perspective 1000px,
 * preserve-3d, cubic-bezier(.4,.2,.2,1.08)) with a shimmering holographic front
 * and a role-coloured back — blue `.card-back-crew`, red `.card-back-imp`.
 * Below it the `.ready-row` roster, then the footer CTA that turns into the
 * green `.btn-success` "✓ Klar!" once you're ready.
 */
export function RoleReveal({
  round,
  authArgs,
  isHost,
  players,
  totalRounds,
  onLeave,
}: {
  round: Round;
  authArgs: AuthArgs;
  isHost: boolean;
  players: Round["players"];
  totalRounds: number;
  onLeave: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const [answer, setAnswer] = useState("");
  const beginClues = useMutation(api.round.beginClues);
  const markReady = useMutation(api.round.markReady);
  const me = round.me;
  const isImposter = me?.isImposter ?? false;
  const isPromptMode =
    round.gameMode === "questions" || round.gameMode === "scale";
  const isScale = round.gameMode === "scale";
  // In prompt modes the player's own answer is visible in their clues row.
  const myAnswer = me
    ? round.clues.find((c) => c.playerId === me.playerId)?.text
    : undefined;

  const teammates = (me?.teammateIds ?? [])
    .map((id) => players.find((p) => p._id === id))
    .filter((p): p is Round["players"][number] => !!p);

  // Ready-up state: every participant taps "ready" and the round begins once
  // all are ready (bots are seeded ready server-side). Host can force-start.
  const participants = round.turnOrder
    .map((id) => players.find((p) => p._id === id))
    .filter((p): p is Round["players"][number] => !!p);
  const readySet = new Set(round.readyPlayerIds);
  const readyCount = participants.filter((p) => readySet.has(p._id)).length;
  const iAmReady = !!me && readySet.has(me.playerId);
  const allReady =
    participants.length > 0 && participants.every((p) => readySet.has(p._id));

  async function handleReady() {
    if (isPromptMode && !answer.trim()) return;
    feedback.tap();
    try {
      await markReady({
        ...authArgs,
        roundId: round.roundId,
        answerText: isPromptMode ? answer.trim() : undefined,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fejl");
    }
  }

  async function handleForceStart() {
    try {
      await beginClues({ ...authArgs, roundId: round.roundId });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fejl");
    }
  }

  /** The card back — one of the concept's three role treatments. */
  function CardBack() {
    if (isPromptMode) {
      return (
        <div className="card-face card-back-crew">
          <div className="card-role-lbl">{t.yourQuestion}</div>
          <div className="card-role-icon" aria-hidden>
            ❓
          </div>
          <div className="card-word" style={{ fontSize: 22, lineHeight: 1.25 }}>
            {me?.secretWord}
          </div>
          <div className="card-pill crew">
            {isScale ? t.scaleAnswerHint : t.questionAnswerHint}
          </div>
        </div>
      );
    }

    if (isImposter) {
      return (
        <div className="card-face card-back-imp">
          <div className="card-role-lbl">{t.yourRole}</div>
          <div className="card-role-icon" aria-hidden>
            🦎
          </div>
          <div className="card-role-title imp">Kamæleonen</div>
          <div className="card-word-lbl">Du kender ikke ordet</div>
          <div className="card-word unknown">— ? —</div>
          <div className="card-pill imp">
            {round.category ? `${t.category}: ${round.category}` : "Smelt ind — vind!  🎭"}
          </div>
        </div>
      );
    }

    return (
      <div className="card-face card-back-crew">
        <div className="card-role-lbl">{t.yourRole}</div>
        <div className="card-role-icon" aria-hidden>
          👥
        </div>
        <div className="card-role-title crew">Besætningsmedlem</div>
        <div className="card-word-lbl">Ordet er</div>
        <div className="card-word">{me?.secretWord}</div>
        <div className="card-pill crew">
          {round.category ?? "Behold det hemmeligt!"}
        </div>
      </div>
    );
  }

  return (
    <div className="cscreen s-reveal">
      <NeonBackdrop variant="reveal" />
      <PhaseChrome onLeave={onLeave} />

      <div className="content">
        <div className="round-info">
          <div className="round-lbl">{t.pass}</div>
          <div className="round-num">
            {round.roundNumber} / {totalRounds}
          </div>
        </div>

        <div
          className="card-scene"
          role="button"
          tabIndex={0}
          aria-label={t.tapToReveal}
          onClick={() => {
            if (flipped) return;
            setFlipped(true);
            feedback.reveal();
          }}
          onKeyDown={(e) => {
            if (flipped || (e.key !== "Enter" && e.key !== " ")) return;
            e.preventDefault();
            setFlipped(true);
            feedback.reveal();
          }}
        >
          <div className={cn("card-3d", flipped && "flipped")}>
            <div className="card-face card-front">
              <div className="card-shimmer" />
              <div className="card-front-icon" aria-hidden>
                🂠
              </div>
              <div className="tap-hint">
                <div className="tap-dot" />
                {t.tapToReveal}
              </div>
            </div>
            <CardBack />
          </div>
        </div>

        {flipped && teammates.length > 0 && (
          <div className="text-center">
            <div className="card-role-lbl mb-2">{t.yourTeammates}</div>
            <div className="ready-row">
              <div className="ready-avatars">
                {teammates.map((tm) => (
                  <Av key={tm._id} emoji={tm.avatarEmoji} color={tm.avatarColor} size="sm" />
                ))}
              </div>
            </div>
          </div>
        )}

        {flipped && (
          <div className="ready-row">
            <div className="ready-avatars">
              {participants.map((p) => {
                const isReady = readySet.has(p._id);
                return (
                  <div key={p._id} className="ready-av">
                    <Av
                      emoji={p.avatarEmoji}
                      color={p.avatarColor}
                      size="sm"
                      dimmed={!isReady}
                    />
                    {isReady && <div className="ready-ring-g" />}
                  </div>
                );
              })}
            </div>
            <div className="ready-count">
              {readyCount} / {participants.length} {t.readyCount}
            </div>
          </div>
        )}
      </div>

      {flipped && (
        <div className="footer">
          {/* Prompt modes answer before readying up. */}
          {!iAmReady && isPromptMode && (
            <div className="mb-3">
              {isScale ? (
                <>
                  <div className="turn-label">{t.chooseScale}</div>
                  <div className="scale-row">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        aria-label={String(value)}
                        onClick={() => setAnswer(String(value))}
                        className={cn(
                          "scale-cell",
                          answer === String(value) && "selected",
                        )}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <input
                  className="clue-input w-full"
                  value={answer}
                  maxLength={60}
                  placeholder={t.answerPlaceholder}
                  aria-label={t.answerPlaceholder}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReady()}
                />
              )}
            </div>
          )}

          {iAmReady ? (
            <>
              {isPromptMode && myAnswer && (
                <div className="turn-label">
                  {t.youAnswered}: <span>{myAnswer}</span>
                </div>
              )}
              <button
                className="btn btn-success w-full"
                style={{ padding: 18, borderRadius: 20, fontSize: 17 }}
                disabled
              >
                ✓ {t.ready}!
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary w-full"
              style={{ padding: 18, borderRadius: 20, fontSize: 17 }}
              disabled={isPromptMode && !answer.trim()}
              onClick={handleReady}
            >
              {t.ready} →
            </button>
          )}

          {/* Host can begin without waiting for stragglers (e.g. someone offline). */}
          {isHost && !allReady && (
            <button className="btn-ghost mt-2.5 w-full" onClick={handleForceStart}>
              {t.startNow}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
