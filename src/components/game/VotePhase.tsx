import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Avatar } from "./PlayerBadge";
import { PhaseTimer } from "./PhaseTimer";
import { t } from "@/lib/strings";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Check, SkipForward } from "lucide-react";

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
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fejl");
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{t.voteInstruction}</h2>
        {round.phaseDeadline && <PhaseTimer deadline={round.phaseDeadline} />}
      </div>

      {round.currentBallot > 1 && (
        <p className="text-xs text-muted-foreground">
          {t.ballotNumber} {round.currentBallot} ·{" "}
          {round.eliminatedPlayerIds.length} {t.eliminated.toLowerCase()}
        </p>
      )}

      {/* Clue recap to inform the vote */}
      <div className="rounded-xl border bg-card p-3">
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
                "flex flex-col items-center gap-2 rounded-xl border p-3 transition-all",
                disabled
                  ? "opacity-50"
                  : "hover:border-primary hover:bg-primary/5 active:scale-95",
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

      <div className="mt-auto space-y-2 text-center">
        {iAmEliminated ? (
          <p className="text-sm text-muted-foreground">{t.eliminated}</p>
        ) : iVoted ? (
          <p className="text-sm text-muted-foreground">
            <Check className="mr-1 inline size-4 text-green-500" />
            {t.youVoted} · {t.changeVote.toLowerCase()}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">{t.voteInstruction}</p>
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
            <SkipForward className="size-4" /> {t.skip}
          </Button>
        )}
      </div>
    </div>
  );
}
