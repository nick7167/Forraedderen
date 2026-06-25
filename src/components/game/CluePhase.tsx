import { useEffect, useRef, useState } from "react";
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
import { Send, SkipForward } from "lucide-react";

type Round = NonNullable<FunctionReturnType<typeof api.round.getRoundState>>;
type AuthArgs = { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret: string };

export function CluePhase({
  round,
  authArgs,
  isHost,
}: {
  round: Round;
  authArgs: AuthArgs;
  isHost: boolean;
}) {
  const submitClue = useMutation(api.round.submitClue);
  const skipPhase = useMutation(api.round.skipPhase);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

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

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">
          {t.cluePhase}{" "}
          <span className="text-muted-foreground">
            · {t.pass} {round.currentPass}/{round.cluePasses}
          </span>
        </h2>
      </div>

      {/* Turn order with clue status */}
      <div className="flex flex-col gap-2">
        {round.turnOrder.map((id) => {
          const p = playerById(id);
          if (!p) return null;
          const clue = cluesThisPass.find((c) => c.playerId === id);
          const isCurrent = round.currentTurnPlayerId === id;
          return (
            <div
              key={id}
              className={cn(
                "glass flex items-center gap-3 rounded-2xl p-2.5 transition-all",
                isCurrent && "ring-2 ring-primary/70 shadow-[0_0_24px_-6px] shadow-primary/60",
              )}
            >
              <Avatar emoji={p.avatarEmoji} color={p.avatarColor} size={36} />
              <span className="text-sm font-semibold">
                {p.name}
                {id === myId && (
                  <span className="text-muted-foreground"> ({t.you})</span>
                )}
              </span>
              <div className="ml-auto">
                {clue ? (
                  <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-medium">
                    {clue.text}
                  </span>
                ) : isCurrent ? (
                  <span className="text-xs text-primary">{t.thinking}</span>
                ) : (
                  <span className="text-xs text-muted-foreground">…</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto space-y-2">
        {isMyTurn ? (
          <div className="space-y-1.5">
            <p className="px-1 text-xs text-muted-foreground">{clueHint}</p>
            <div className="flex gap-2">
              <Input
                autoFocus
                value={text}
                maxLength={60}
                placeholder={t.cluePlaceholder}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <Button onClick={send} disabled={busy || !text.trim()}>
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            {t.waitingFor}{" "}
            <b>{playerById(round.currentTurnPlayerId as Id<"players">)?.name ?? "…"}</b>
          </p>
        )}
        {isHost && round.currentTurnPlayerId && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground"
            onClick={() => skipPhase({ ...authArgs, roundId: round.roundId })}
          >
            <SkipForward className="size-4" />{" "}
            {t.skipTurn.replace(
              "{name}",
              playerById(round.currentTurnPlayerId)?.name ?? "spilleren",
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
