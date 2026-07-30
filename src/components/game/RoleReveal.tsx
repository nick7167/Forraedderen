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
import { Check, Eye } from "lucide-react";

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
          setFlipped(true);
          feedback.reveal();
        }}
        disabled={flipped}
        className={cn(
          "relative flex aspect-[3/4] w-64 max-w-full items-center justify-center rounded-3xl shadow-xl transition-all duration-500",
          !flipped &&
            "cursor-pointer bg-gradient-to-br from-slate-800 to-slate-950 text-white ring-1 ring-white/10 hover:scale-[1.02] active:scale-95",
          flipped &&
            (isImposter
              ? "bg-gradient-to-br from-red-500 to-rose-700 text-white glow-danger"
              : "bg-gradient-to-br from-emerald-400 to-teal-600 text-white glow-crew"),
        )}
      >
        {!flipped ? (
          <div className="flex flex-col items-center gap-3">
            <Eye className="size-10 opacity-90" />
            <span className="px-6 text-center text-lg font-semibold">
              {t.tapToReveal}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 px-6 text-center duration-300 animate-in fade-in zoom-in">
            {isPromptMode ? (
              <>
                <span className="text-xs font-medium uppercase opacity-80">
                  {t.yourQuestion}
                </span>
                <span className="text-xl font-extrabold leading-snug">
                  {me?.secretWord}
                </span>
                <span className="mt-1 text-xs opacity-80">
                  {isScale ? t.scaleAnswerHint : t.questionAnswerHint}
                </span>
              </>
            ) : isImposter ? (
              <>
                <span className="text-5xl">🦎</span>
                <span className="text-2xl font-black">{t.youAreImposter}</span>
                {round.category && (
                  <span className="mt-1 text-sm opacity-90">
                    {t.category}: <b>{round.category}</b>
                  </span>
                )}
                <span className="mt-1 text-xs opacity-80">{t.imposterHint}</span>
              </>
            ) : (
              <>
                <span className="text-xs font-medium uppercase opacity-80">
                  {t.theWord}
                </span>
                <span className="text-3xl font-black">{me?.secretWord}</span>
                {round.category && (
                  <span className="mt-1 text-sm opacity-90">
                    {round.category}
                  </span>
                )}
              </>
            )}
          </div>
        )}
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
