import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "./PlayerBadge";
import { Screen } from "./Screen";
import { PhaseHero } from "./PhaseHero";
import { t } from "@/lib/strings";
import { feedback } from "@/lib/feedback";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Lightbulb, Send, SkipForward } from "lucide-react";

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

  const footer = (
    <div className="space-y-2">
      {iAmParticipant && !iCluedThisPass ? (
        <div className="space-y-1.5">
          {/* You can prepare your clue while waiting; Send unlocks on your turn. */}
          <p className="px-1 text-xs text-muted-foreground">
            {isMyTurn ? clueHint : t.prepareTurn.replace("{name}", currentName)}
          </p>
          <div className="flex gap-2">
            <Input
              value={text}
              maxLength={60}
              placeholder={t.cluePlaceholder}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && isMyTurn && send()}
            />
            <Button onClick={send} disabled={!isMyTurn || busy || !text.trim()}>
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          {t.waitingFor} <b>{currentName}</b>
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
  );

  return (
    <Screen
      header={
        <PhaseHero
          size="compact"
          icon={<Lightbulb className="size-6" />}
          title={t.cluePhase.toUpperCase()}
          pill={`${t.pass} ${round.currentPass}/${round.cluePasses}`}
        />
      }
      footer={footer}
    >
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
                isCurrent && "glow-ring",
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
    </Screen>
  );
}
