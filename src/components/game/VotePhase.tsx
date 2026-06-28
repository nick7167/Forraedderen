import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Avatar } from "./PlayerBadge";
import { Screen } from "./Screen";
import { PhaseHero } from "./PhaseHero";
import { t } from "@/lib/strings";
import { feedback } from "@/lib/feedback";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Check, SkipForward, Vote } from "lucide-react";

type Round = NonNullable<FunctionReturnType<typeof api.round.getRoundState>>;
type AuthArgs = { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret: string };

export function VotePhase({
  round,
  authArgs,
  isHost,
}: {
  round: Round;
  authArgs: AuthArgs;
  isHost: boolean;
}) {
  const castVote = useMutation(api.round.castVote);
  const skipPhase = useMutation(api.round.skipPhase);

  const myId = round.me?.playerId;
  const iAmEliminated = round.eliminatedPlayerIds.some((id) => id === myId);
  const iVoted = !!myId && round.votedPlayerIds.some((id) => id === myId);
  const playerById = (id: Id<"players">) => round.players.find((p) => p._id === id);

  // Eligible vote targets: active players not eliminated.
  const candidates = round.turnOrder.filter(
    (id) => !round.eliminatedPlayerIds.some((e) => e === id),
  );

  async function vote(targetPlayerId: Id<"players">) {
    try {
      await castVote({ ...authArgs, roundId: round.roundId, targetPlayerId });
      feedback.confirm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fejl");
    }
  }

  const footer = (
    <div className="space-y-2 text-center">
      {iAmEliminated ? (
        <p className="text-sm text-muted-foreground">{t.eliminatedHint}</p>
      ) : iVoted ? (
        <p className="text-sm text-muted-foreground">
          <Check className="mr-1 inline size-4 text-green-500" />
          {t.youVoted} · {t.changeVote.toLowerCase()}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">{t.voteChangeHint}</p>
      )}
      <p className="text-xs text-muted-foreground">
        {round.votedPlayerIds.length}/{candidates.length} {t.votes}
      </p>
      {isHost && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground"
          onClick={() => skipPhase({ ...authArgs, roundId: round.roundId })}
        >
          <SkipForward className="size-4" /> {t.endVote}
        </Button>
      )}
    </div>
  );

  const header = (
    <div className="flex flex-col gap-5">
      <PhaseHero
        icon={<Vote className="size-7" />}
        title={t.votePhase.toUpperCase()}
        subtitle={
          round.gameMode === "questions"
            ? t.voteInstructionQuestions
            : t.voteInstruction
        }
        pill={
          round.currentBallot > 1
            ? `${t.ballotNumber} ${round.currentBallot} · ${round.eliminatedPlayerIds.length} ${t.eliminated.toLowerCase()}`
            : undefined
        }
      />

      {/* Questions mode: keep the real question in view while voting. */}
      {round.gameMode === "questions" && round.sharedPrompt && (
        <div className="glass rounded-2xl p-3 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t.theRealQuestion}
          </p>
          <p className="mt-0.5 text-base font-bold leading-snug">
            {round.sharedPrompt}
          </p>
        </div>
      )}

      {/* Clue recap to inform the vote */}
      <div className="glass rounded-2xl p-3">
        <div className="flex flex-wrap gap-1.5">
          {round.clues.map((c) => {
            const p = playerById(c.playerId);
            return (
              <span
                key={c._id}
                className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs"
              >
                <span>{p?.avatarEmoji}</span>
                {c.text}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <Screen header={header} footer={footer}>
      <div className="grid grid-cols-2 gap-2">
        {candidates.map((id) => {
          const p = playerById(id);
          if (!p) return null;
          const isMe = id === myId;
          const disabled = iAmEliminated || isMe;
          return (
            <button
              key={id}
              disabled={disabled}
              onClick={() => vote(id)}
              className={cn(
                "glass flex flex-col items-center gap-2 rounded-2xl p-3 transition-all",
                disabled
                  ? "opacity-50"
                  : "hover:ring-2 hover:ring-primary/60 active:scale-95",
              )}
            >
              <Avatar emoji={p.avatarEmoji} color={p.avatarColor} size={48} />
              <span className="text-sm font-semibold">
                {p.name}
                {isMe && <span className="text-muted-foreground"> ({t.you})</span>}
              </span>
              {round.votedPlayerIds.some((v) => v === id) && (
                <span className="text-[10px] text-muted-foreground">
                  <Check className="inline size-3" /> {t.youVoted.toLowerCase()}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </Screen>
  );
}
