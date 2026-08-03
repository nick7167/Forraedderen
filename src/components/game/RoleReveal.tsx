import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "../../../convex/_generated/dataModel";
import { PhaseChrome } from "./PhaseChrome";
import { Av } from "./Av";
import { Announce } from "./Announce";
import { Stage, StageFooter } from "@/ui/Stage";
import { Button } from "@/ui/Button";
import { Chip } from "@/ui/Surface";
import { Input } from "@/ui/Input";
import { Glyph } from "@/ui/Glyph";
import { t } from "@/lib/strings";
import { feedback } from "@/lib/feedback";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Round = NonNullable<FunctionReturnType<typeof api.round.getRoundState>>;
type AuthArgs = { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret: string };

/**
 * Step the secret word's type down for long entries.
 *
 * The card's own container query can't see how much text it is holding, and a word can be
 * up to 24 characters (the custom-pack cap in convex/packs.ts). A length bucket is enough
 * here precisely because it's a single word — see the note on `.reveal-card__word`.
 *
 * Returned as a class name rather than a size because `word-reveal-fit.spec.ts` swaps
 * these classes directly to exercise the worst case without needing a matching pack.
 */
function wordLengthClass(word: string | null | undefined) {
  const n = word?.length ?? 0;
  if (n > 18) return "len-xl";
  if (n > 12) return "len-l";
  return undefined;
}

/**
 * Role reveal.
 *
 * The centrepiece, and the one licensed exception to the design's no-gradient law: the
 * face-down card carries a moving specular sweep (`--reveal-sweep`). Everything else about
 * it obeys the ordinary rules — flat ink faces, the chamfered plate, a hairline in the role
 * colour, no glow behind the card.
 *
 * The Stage is `fit`, so this screen never scrolls. That is a hard requirement, not a
 * preference: you are holding the phone out for the person next to you, and a card that is
 * half off-screen defeats the whole mechanic. The card takes the leftover height and
 * derives its width from the aspect ratio, so it shrinks rather than overflowing.
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
  // Latch: once revealed, the roster and footer stay mounted even if the player flips the
  // card face-down again. Unmounting them would jump the layout and hide an answer input
  // someone may be halfway through using.
  const [hasRevealed, setHasRevealed] = useState(false);
  const [answer, setAnswer] = useState("");
  const beginClues = useMutation(api.round.beginClues);
  const markReady = useMutation(api.round.markReady);
  const me = round.me;
  const isImposter = me?.isImposter ?? false;
  const isPromptMode = round.gameMode === "questions" || round.gameMode === "scale";
  const isScale = round.gameMode === "scale";
  // In prompt modes the player's own answer is visible in their clues row.
  const myAnswer = me ? round.clues.find((c) => c.playerId === me.playerId)?.text : undefined;

  const teammates = (me?.teammateIds ?? [])
    .map((id) => players.find((p) => p._id === id))
    .filter((p): p is Round["players"][number] => !!p);

  // Ready-up state: every participant taps "ready" and the round begins once all are ready
  // (bots are seeded ready server-side). Host can force-start.
  const participants = round.turnOrder
    .map((id) => players.find((p) => p._id === id))
    .filter((p): p is Round["players"][number] => !!p);
  const readySet = new Set(round.readyPlayerIds);
  const readyCount = participants.filter((p) => readySet.has(p._id)).length;
  const iAmReady = !!me && readySet.has(me.playerId);
  const allReady = participants.length > 0 && participants.every((p) => readySet.has(p._id));

  /** Tap to reveal, tap again to hide — it's a pass-the-phone game. */
  function toggleFlip() {
    setFlipped((f) => !f);
    if (hasRevealed) {
      feedback.tap();
    } else {
      setHasRevealed(true);
      feedback.reveal();
    }
  }

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

  /**
   * The card back.
   *
   * Called as a plain function, not rendered as `<CardBack />`. It's declared inside the
   * component (it closes over the round), so as a component it would be a new type on every
   * render and React would remount the whole face — on every Convex update, which lands
   * each time someone readies up, mid-flip.
   *
   * `inert` while face-down does more than manage the tab order: without it the secret is
   * in the DOM and readable by a screen reader before the player has tapped.
   * `backface-visibility` only hides it from sighted users.
   */
  function cardBack({ inert }: { inert: boolean }) {
    // The hairline colour carries the role. Teal for anything the crew sees, signal for
    // the imposter — the same two colours the vote and the resolve screens use.
    const edge = isImposter && !isPromptMode ? "var(--color-signal)" : "var(--color-teal)";

    return (
      <span
        className="reveal-card__face reveal-card__face--back"
        style={{ "--reveal-edge": edge } as React.CSSProperties}
        inert={inert}
        data-testid="card-back"
        data-role={isPromptMode ? "prompt" : isImposter ? "imposter" : "crew"}
      >
        <span aria-hidden className="reveal-card__edge plate" />
        <span aria-hidden className="reveal-card__fill plate" />
        <span className="reveal-card__body plate gap-2 px-5 text-center">
          {isPromptMode ? (
            <>
              <span className="text-label text-muted font-semibold tracking-[0.12em] uppercase">
                {t.yourQuestion}
              </span>
              <span
                className="reveal-card__prompt font-display text-paper my-1 font-extrabold"
                data-testid="card-word"
              >
                {me?.secretWord}
              </span>
              <Chip tone="teal" size="sm">
                {isScale ? t.scaleAnswerHint : t.questionAnswerHint}
              </Chip>
            </>
          ) : isImposter ? (
            <>
              <span className="text-label text-muted font-semibold tracking-[0.12em] uppercase">
                {t.yourRole}
              </span>
              <span data-testid="card-role" className="reveal-card__role font-display text-signal-text font-extrabold">
                {t.roleImposter}
              </span>
              <span className="text-label text-muted mt-3 font-semibold tracking-[0.12em] uppercase">
                {t.imposterNoWord}
              </span>
              <span
                className="reveal-card__word unknown font-display text-paper font-extrabold"
                data-testid="card-word"
              >
                — ? —
              </span>
              <Chip tone="signal" size="sm" className="mt-3">
                {round.category ? `${t.category}: ${round.category}` : t.blendIn}
              </Chip>
            </>
          ) : (
            <>
              <span className="text-label text-muted font-semibold tracking-[0.12em] uppercase">
                {t.yourRole}
              </span>
              <span data-testid="card-role" className="reveal-card__role font-display text-teal font-extrabold">
                {t.roleCrew}
              </span>
              <span className="text-label text-muted mt-3 font-semibold tracking-[0.12em] uppercase">
                {t.theWordIs}
              </span>
              <span
                className={cn(
                  "reveal-card__word font-display text-paper font-extrabold",
                  wordLengthClass(me?.secretWord),
                )}
                data-testid="card-word"
              >
                {me?.secretWord}
              </span>
              <Chip tone="teal" size="sm" className="mt-3">
                {round.category ?? t.keepItSecret}
              </Chip>
            </>
          )}
        </span>
      </span>
    );
  }

  return (
    <Stage keyName="reveal" width="max-w-md" fit testId="s-reveal">
      <PhaseChrome onLeave={onLeave} />
      <Announce
        message={t.a11yRevealPhase
          .replace("{ready}", String(readyCount))
          .replace("{total}", String(participants.length))}
      />

      <div
        className="flex shrink-0 items-baseline justify-center gap-2"
        data-testid="round-info"
      >
        <span className="text-label text-muted font-semibold tracking-[0.12em] uppercase">
          {t.pass}
        </span>
        <span className="font-display text-numeral text-paper font-bold tabular-nums">
          {round.roundNumber} / {totalRounds}
        </span>
      </div>

      {/* The card takes the leftover height; width follows from the aspect ratio, so it
          shrinks on a short phone rather than pushing the footer off-screen. Prompt modes
          are width-first because they hold a sentence, not a word. */}
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div
          className={cn(
            "reveal-card",
            isPromptMode
              ? // Prompt modes hold a sentence, so the card is width-first: take the
                // column (capped so it doesn't sprawl on a laptop) and whatever height
                // is left. No fixed ratio — a question needs width, not proportion.
                "h-full max-h-[300px] w-full max-w-[340px]"
              : // Word modes keep a portrait card. Height-first with the width derived
                // from the ratio, so it shrinks on a short phone instead of overflowing.
                "aspect-[286/402] h-full max-h-[402px] w-auto max-w-full",
          )}
          data-testid="card-scene"
        >
          <button
            type="button"
            className="reveal-card__inner block w-full cursor-pointer text-left"
            data-testid="card-inner"
            data-flipped={flipped}
            aria-pressed={flipped}
            aria-label={flipped ? t.tapToHide : t.tapToReveal}
            onClick={toggleFlip}
          >
            <span className="reveal-card__face" inert={flipped} data-testid="card-front">
              <span aria-hidden className="reveal-card__edge plate" />
              <span aria-hidden className="reveal-card__fill plate" />
              <span className="reveal-card__body plate gap-4">
                <span className="reveal-card__sweep" />
                <span className="text-6xl" aria-hidden>
                  🦎
                </span>
                <span className="text-body-sm text-muted flex items-center gap-1.5">
                  <Glyph name="eye" />
                  {t.tapToReveal}
                </span>
              </span>
            </span>
            {cardBack({ inert: !flipped })}
          </button>
        </div>
      </div>

      {hasRevealed && teammates.length > 0 && (
        <div className="flex shrink-0 flex-col items-center gap-1.5">
          <span className="text-label text-muted font-semibold tracking-[0.12em] uppercase">
            {t.yourTeammates}
          </span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {teammates.map((tm) => (
              <Av key={tm._id} emoji={tm.avatarEmoji} color={tm.avatarColor} size="sm" />
            ))}
          </div>
        </div>
      )}

      {hasRevealed && (
        <div className="flex shrink-0 flex-col items-center gap-1.5" data-testid="ready-row">
          <div className="flex flex-wrap justify-center gap-1.5">
            {participants.map((p) => {
              const isReady = readySet.has(p._id);
              return (
                <div key={p._id} className="relative">
                  <Av
                    emoji={p.avatarEmoji}
                    color={p.avatarColor}
                    size="sm"
                    dimmed={!isReady}
                  />
                  {/* Not ring-colour alone — a tick is legible without colour vision. */}
                  {isReady && (
                    <span
                      aria-hidden
                      className="bg-teal text-ink-900 absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full text-[9px]"
                    >
                      <Glyph name="check" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <span
            className="text-label text-muted font-semibold tabular-nums"
            data-testid="ready-count"
          >
            {readyCount} / {participants.length} {t.readyCount}
          </span>
        </div>
      )}

      {hasRevealed && (
        <StageFooter testId="reveal-footer">
          {/* Prompt modes answer before readying up. */}
          {!iAmReady && isPromptMode && (
            <div className="flex flex-col gap-1.5">
              {isScale ? (
                <>
                  <span className="text-label text-muted text-center font-semibold tracking-[0.12em] uppercase">
                    {t.chooseScale}
                  </span>
                  <div className="grid grid-cols-5 gap-1.5" data-testid="scale-row">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        aria-label={String(value)}
                        aria-pressed={answer === String(value)}
                        data-testid="scale-cell"
                        onClick={() => setAnswer(String(value))}
                        className={cn(
                          "font-display min-h-12 rounded-md border text-xl font-extrabold transition-colors",
                          answer === String(value)
                            ? "bg-gold text-ink-900 border-gold"
                            : "bg-ink-inset border-line-strong text-secondary hover:bg-ink-700",
                        )}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <Input
                  size="lg"
                  value={answer}
                  maxLength={60}
                  placeholder={t.answerPlaceholder}
                  aria-label={t.answerPlaceholder}
                  data-testid="answer-input"
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReady()}
                />
              )}
            </div>
          )}

          {iAmReady ? (
            <>
              {isPromptMode && myAnswer && (
                <p className="text-body-sm text-muted text-center">
                  {t.youAnswered}: <span className="text-paper font-semibold">{myAnswer}</span>
                </p>
              )}
              <div
                className="bg-ink-700 border-teal text-teal text-body-lg flex min-h-13 items-center justify-center gap-2 rounded-md border font-semibold"
                data-testid="ready-confirmed"
              >
                <Glyph name="check" />
                {t.ready}!
              </div>
            </>
          ) : (
            <Button
              size="lg"
              block
              disabled={isPromptMode && !answer.trim()}
              onClick={handleReady}
              data-testid="ready-button"
            >
              {t.ready}
            </Button>
          )}

          {/* Host can begin without waiting for stragglers (e.g. someone offline). */}
          {isHost && !allReady && (
            <Button variant="ghost" block onClick={handleForceStart} data-testid="force-start">
              {t.startNow}
            </Button>
          )}
        </StageFooter>
      )}
    </Stage>
  );
}
