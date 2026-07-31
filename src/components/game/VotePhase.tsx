import { useState } from "react";
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

  // Your current pick is private (the server never returns vote targets), so we
  // track it locally just to show/return your own selection on this device.
  const [myVote, setMyVote] = useState<Id<"players"> | null>(null);

  const myId = round.me?.playerId;
  const iAmEliminated = round.eliminatedPlayerIds.some((id) => id === myId);
  const playerById = (id: Id<"players">) => round.players.find((p) => p._id === id);

  // Eligible vote targets: active players not eliminated.
  const candidates = round.turnOrder.filter(
    (id) => !round.eliminatedPlayerIds.some((e) => e === id),
  );
  const voted = round.votedPlayerIds.length;
  const progress = candidates.length > 0 ? voted / candidates.length : 0;

  async function vote(targetPlayerId: Id<"players">) {
    setMyVote(targetPlayerId);
    try {
      await castVote({ ...authArgs, roundId: round.roundId, targetPlayerId });
      feedback.confirm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fejl");
    }
  }

  const header = (
    <div className="flex flex-col gap-3">
      <PhaseHero
        size="compact"
        icon={<Vote className="size-6" />}
        title={t.votePhase.toUpperCase()}
        pill={
          round.currentBallot > 1
            ? `${t.ballotNumber} ${round.currentBallot}`
            : undefined
        }
      />

      {/* Prompt modes: keep the real prompt in view while voting. */}
      {(round.gameMode === "questions" || round.gameMode === "scale") && round.sharedPrompt && (
        <p className="px-1 text-center text-sm font-semibold">
          <span className="text-muted-foreground">{t.theRealQuestion}: </span>
          {round.sharedPrompt}
        </p>
      )}

      {/* Slim, scrollable clue recap to inform the vote. */}
      {round.clues.length > 0 && (
        <div className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {round.clues.map((c) => {
            const p = playerById(c.playerId);
            return (
              <span
                key={c._id}
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs text-muted-foreground"
              >
                <span className="text-sm">{p?.avatarEmoji}</span>
                {c.text}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );

  const footer = (
    <div className="space-y-2.5">
      {/* Live vote-progress bar (who has voted — never whom they voted for). */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full gradient-primary transition-all duration-300"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
      <p className="text-center text-xs text-muted-foreground">
        {iAmEliminated ? t.eliminatedHint : t.voteChangeHint} · {voted}/{candidates.length}
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

  return (
    <Screen header={header} footer={footer}>
      <div className="grid grid-cols-2 gap-3">
        {candidates.map((id) => {
          const p = playerById(id);
          if (!p) return null;
          const isMe = id === myId;
          const disabled = iAmEliminated || isMe;
          const hasVoted = round.votedPlayerIds.some((v) => v === id);
          const isMyPick = !disabled && myVote === id;
          return (
            <button
              key={id}
              disabled={disabled}
              onClick={() => vote(id)}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                padding: "16px 12px 14px",
                borderRadius: 20,
                overflow: "hidden",
                border: isMyPick
                  ? "2px solid rgba(239,68,68,0.5)"
                  : "2px solid rgba(255,255,255,0.08)",
                background: isMyPick
                  ? "rgba(239,68,68,0.11)"
                  : "rgba(255,255,255,0.04)",
                boxShadow: isMyPick ? "0 0 24px rgba(239,68,68,0.18)" : "none",
                transform: isMyPick ? "scale(1.03)" : undefined,
                opacity: disabled && !isMe ? 0.4 : isMe ? 0.5 : 1,
                cursor: disabled ? "default" : "pointer",
                transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              {/* ANKLAGET banner */}
              {isMyPick && (
                <span style={{
                  position: "absolute", top: 0, left: 0, right: 0,
                  background: "rgba(239,68,68,0.88)",
                  fontSize: 10, fontWeight: 800, letterSpacing: "0.1em",
                  textTransform: "uppercase", padding: 5, color: "#fff",
                  textAlign: "center",
                }}>
                  {t.youVoted}
                </span>
              )}
              {/* has-voted check */}
              {hasVoted && (
                <span style={{
                  position: "absolute", right: 8, top: isMyPick ? 26 : 8,
                  width: 20, height: 20, borderRadius: "50%",
                  background: "#22c55e", border: "2px solid rgba(0,0,0,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Check style={{ width: 12, height: 12, color: "#fff", strokeWidth: 3 }} />
                </span>
              )}
              <span style={{ marginTop: isMyPick ? 16 : 0 }}>
                <Avatar emoji={p.avatarEmoji} color={p.avatarColor} size={56} ring={isMyPick} />
              </span>
              <span style={{
                fontSize: 14, fontWeight: 700,
                color: isMyPick ? "#fca5a5" : "rgba(245,243,255,0.9)",
              }}>
                {p.name}
                {isMe && <span style={{ opacity: 0.6 }}> ({t.you})</span>}
              </span>
            </button>
          );
        })}
      </div>
    </Screen>
  );
}
