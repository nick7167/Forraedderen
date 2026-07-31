import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "./PlayerBadge";
import { t } from "@/lib/strings";
import { feedback } from "@/lib/feedback";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Check } from "lucide-react";

type Round = NonNullable<FunctionReturnType<typeof api.round.getRoundState>>;
type AuthArgs = { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret: string };

export function RoleReveal({
  round,
  authArgs,
  isHost,
  players,
}: {
  round: Round;
  authArgs: AuthArgs;
  isHost: boolean;
  players: Round["players"];
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

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 overflow-y-auto p-4">
      <span className="rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {isPromptMode ? t.yourQuestion : t.yourRole} · {t.pass} {round.roundNumber}
      </span>

      <button
        onClick={() => {
          if (flipped) return;
          setFlipped(true);
          feedback.reveal();
        }}
        disabled={flipped}
        className="p-card-scene relative aspect-[3/4] w-64 max-w-full"
        aria-label={t.tapToReveal}
      >
        <div className={cn("p-card-3d", flipped && "flipped")}>
          {/* Front — holographic shimmer, prompts a tap */}
          <div className="p-card-face p-card-front text-white">
            <div className="p-card-shimmer" />
            <span className="p-card-front-icon" style={{ fontSize: 60, position: "relative", zIndex: 1 }}>🦎</span>
            <span className="p-tap-hint" style={{ position: "relative", zIndex: 1 }}>
              <span className="p-tap-dot" />
              {t.tapToReveal}
            </span>
          </div>

          {/* Back — role-coloured (crew = blue, kamæleon = red) */}
          <div
            className={cn(
              "p-card-face p-card-back text-white",
              isImposter ? "p-card-back-imp" : "p-card-back-crew",
            )}
          >
            {isPromptMode ? (
              <div className="flex flex-col items-center gap-2 px-4 text-center" style={{ position: "relative", zIndex: 1 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,243,255,0.38)" }}>
                  {t.yourQuestion}
                </span>
                <span style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.25 }}>{me?.secretWord}</span>
                <span style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
                  {isScale ? t.scaleAnswerHint : t.questionAnswerHint}
                </span>
              </div>
            ) : isImposter ? (
              <div className="flex flex-col items-center gap-3 px-4 text-center" style={{ position: "relative", zIndex: 1 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(252,165,165,0.55)" }}>ROLLE</span>
                <span style={{ fontSize: 52 }}>🦎</span>
                <span style={{ fontSize: 24, fontWeight: 800, color: "#fca5a5", letterSpacing: "-0.025em" }}>KAMÆLEON</span>
                {round.category && (
                  <span style={{ padding: "7px 18px", borderRadius: 50, background: "rgba(239,68,68,0.14)", border: "1px solid rgba(239,68,68,0.3)", fontSize: 12, fontWeight: 600, color: "#fca5a5" }}>
                    {t.category}: {round.category}
                  </span>
                )}
                <span style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{t.imposterHint}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 px-4 text-center" style={{ position: "relative", zIndex: 1 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(125,211,252,0.55)" }}>ROLLE</span>
                <span style={{ fontSize: 52 }}>👤</span>
                <span style={{ fontSize: 24, fontWeight: 800, color: "#7dd3fc", letterSpacing: "-0.025em" }}>MEDSPILLER</span>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,243,255,0.32)", marginTop: 6 }}>{t.theWord}</span>
                <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.025em" }}>{me?.secretWord}</span>
                {round.category && (
                  <span style={{ padding: "7px 18px", borderRadius: 50, background: "rgba(6,182,212,0.14)", border: "1px solid rgba(6,182,212,0.3)", fontSize: 12, fontWeight: 600, color: "#7dd3fc" }}>
                    {round.category}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </button>

      {flipped && teammates.length > 0 && (
        <div className="text-center">
          <p className="mb-1 text-xs text-muted-foreground">{t.yourTeammates}</p>
          <div className="flex justify-center gap-2">
            {teammates.map((tm) => (
              <div key={tm._id} className="flex flex-col items-center gap-1">
                <Avatar emoji={tm.avatarEmoji} color={tm.avatarColor} size={36} />
                <span className="text-xs">{tm.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {flipped && (
        <div className="w-full max-w-xs space-y-3 text-center">
          {/* Ready roster — everyone sees who's ready. */}
          <div className="flex flex-wrap justify-center gap-2">
            {participants.map((p) => {
              const isReady = readySet.has(p._id);
              return (
                <div key={p._id} className="relative">
                  {isReady && <span className="p-ready-ring" />}
                  <Avatar
                    emoji={p.avatarEmoji}
                    color={p.avatarColor}
                    size={32}
                    dimmed={!isReady}
                  />
                  {isReady && (
                    <span className="absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full bg-green-500 text-white">
                      <Check className="size-3" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            {readyCount}/{participants.length} {t.readyCount}
          </p>

          {iAmReady ? (
            <div className="space-y-1">
              {isPromptMode && myAnswer && (
                <p className="text-sm text-muted-foreground">
                  {t.youAnswered}: <b className="text-foreground">{myAnswer}</b>
                </p>
              )}
              <p className="text-sm font-medium text-green-400">
                <Check className="mr-1 inline size-4" /> {t.ready} · {t.readyWaiting}
              </p>
            </div>
          ) : isPromptMode ? (
            <div className="space-y-2">
              {isScale ? (
                <>
                  <p className="text-sm text-muted-foreground">{t.chooseScale}</p>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        aria-label={String(value)}
                        onClick={() => setAnswer(String(value))}
                        className={cn(
                          "glass aspect-square rounded-2xl text-xl font-black transition-all active:scale-95",
                          answer === String(value) && "gradient-primary glow-ring text-white",
                        )}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <Input
                  value={answer}
                  maxLength={60}
                  placeholder={t.answerPlaceholder}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReady()}
                />
              )}
              <Button
                size="lg"
                className="w-full font-bold"
                disabled={!answer.trim()}
                onClick={handleReady}
              >
                {t.ready}
              </Button>
            </div>
          ) : (
            <Button size="lg" className="w-full font-bold" onClick={handleReady}>
              {t.ready}
            </Button>
          )}

          {/* Host can begin without waiting for stragglers (e.g. someone offline). */}
          {isHost && !allReady && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
              onClick={handleForceStart}
            >
              {t.startNow}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
