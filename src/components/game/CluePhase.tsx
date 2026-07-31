import { Fragment, useEffect, useRef, useState } from "react";
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
import { Check, Lightbulb, Send, SkipForward } from "lucide-react";

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
      {/* Player sequence bar — who has clued (✓), who's up (ring), who's pending */}
      <div className="p-seq justify-center py-1">
        {round.turnOrder.map((id, i) => {
          const p = playerById(id);
          if (!p) return null;
          const clued = cluesThisPass.some((c) => c.playerId === id);
          const isCurrent = round.currentTurnPlayerId === id;
          return (
            <Fragment key={id}>
              <div className={cn("p-seq-item", !clued && !isCurrent && "p-seq-pending")}>
                {isCurrent && !clued && <span className="p-seq-ring" />}
                <Avatar emoji={p.avatarEmoji} color={p.avatarColor} size={36} />
                {clued && (
                  <span className="p-seq-check">
                    <Check className="size-2.5" />
                  </span>
                )}
              </div>
              {i < round.turnOrder.length - 1 && <span className="p-seq-arrow">›</span>}
            </Fragment>
          );
        })}
      </div>

      {/* Chat-bubble clue feed for this pass */}
      <div className="flex flex-col gap-3">
        {cluesThisPass.map((clue) => {
          const p = playerById(clue.playerId as Id<"players">);
          if (!p) return null;
          const mine = clue.playerId === myId;
          return (
            <div key={clue._id} className={cn("p-clue-bubble", mine && "me")}>
              <Avatar emoji={p.avatarEmoji} color={p.avatarColor} size={34} />
              <div className={cn(mine && "flex flex-col items-end")}>
                <div className="p-clue-text">{clue.text}</div>
                <p className="p-clue-meta">
                  {mine ? t.you : p.name}
                </p>
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
              <div className="p-clue-bubble">
                <Avatar emoji={p.avatarEmoji} color={p.avatarColor} size={34} />
                <div>
                  <span className="p-typing">
                    <i />
                    <i />
                    <i />
                  </span>
                  <p className="p-clue-meta">
                    {p.name} {t.thinking}
                  </p>
                </div>
              </div>
            );
          })()}
      </div>
    </Screen>
  );
}
