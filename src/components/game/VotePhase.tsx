import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "../../../convex/_generated/dataModel";
import { PhaseChrome } from "./PhaseChrome";
import { Stage, StageScroll, StageFooter } from "@/ui/Stage";
import { Button } from "@/ui/Button";
import { Card, Chip } from "@/ui/Surface";
import { Av } from "./Av";
import { Announce } from "./Announce";
import { RoundHistory } from "./RoundHistory";
import { t } from "@/lib/strings";
import { feedback } from "@/lib/feedback";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Round = NonNullable<FunctionReturnType<typeof api.round.getRoundState>>;
type AuthArgs = { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret: string };

/**
 * Vote.
 *
 * Three-up from `sm`. The confirm bar is always in the layout and only becomes enabled
 * once a candidate is picked — revealing it on selection shifted the grid under the
 * player's thumb at exactly the moment they were aiming at it.
 */
export function VotePhase({
  round,
  authArgs,
  isHost,
  onLeave,
}: {
  round: Round;
  authArgs: AuthArgs;
  isHost: boolean;
  onLeave: () => void;
}) {
  const castVote = useMutation(api.round.castVote);
  const skipPhase = useMutation(api.round.skipPhase);

  // Your pick is private (the server never returns vote targets), so it's
  // tracked locally purely to render your own selection on this device.
  const [selected, setSelected] = useState<Id<"players"> | null>(null);
  const [confirmed, setConfirmed] = useState<Id<"players"> | null>(null);

  const myId = round.me?.playerId;
  const iAmEliminated = round.eliminatedPlayerIds.some((id) => id === myId);
  const playerById = (id: Id<"players">) => round.players.find((p) => p._id === id);

  // Eligible vote targets: active players not eliminated.
  const candidates = round.turnOrder.filter(
    (id) => !round.eliminatedPlayerIds.some((e) => e === id),
  );
  const voted = round.votedPlayerIds.length;

  async function confirmVote() {
    if (!selected) return;
    try {
      await castVote({ ...authArgs, roundId: round.roundId, targetPlayerId: selected });
      setConfirmed(selected);
      feedback.confirm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fejl");
    }
  }

  async function endVote() {
    try {
      await skipPhase({ ...authArgs, roundId: round.roundId });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fejl");
    }
  }

  const selectedName = selected ? (playerById(selected)?.name ?? "") : "";
  const isPromptMode = round.gameMode === "questions" || round.gameMode === "scale";

  return (
    <Stage keyName="vote" width="max-w-2xl" fit>
      <PhaseChrome
        onLeave={onLeave}
        history={<RoundHistory authArgs={authArgs} players={round.players} />}
      />
      <Announce
        message={
          confirmed
            ? t.a11yYouVoted
            : t.a11yVotePhase
                .replace("{done}", String(voted))
                .replace("{total}", String(candidates.length))
        }
      />

      <div className="flex shrink-0 flex-col gap-1">
        <span className="text-label text-muted font-semibold tracking-[0.12em] uppercase">
          {round.currentBallot > 1 ? `${t.ballotNumber} ${round.currentBallot}` : "Fase"}
        </span>
        <p className="font-display text-display-2 text-paper font-extrabold">{t.votePhase}</p>
        <p className="text-body-sm text-muted">
          {isPromptMode ? t.voteInstructionQuestions : t.voteInstruction}
        </p>
      </div>

      <StageScroll className="flex flex-col gap-3 py-1">
        {/* Prompt modes: keep the real prompt in view while voting. */}
        {/* The crew's question, teal — the same colour it will be at the resolve.
            The chameleon's variant is never shown here: that is the whole mode. */}
        {isPromptMode && round.sharedPrompt && (
          <Card
            variant="hero"
            className="border-teal flex flex-col gap-1 p-3 text-center"
            data-testid="shared-prompt"
          >
            <span className="text-label text-teal font-semibold tracking-[0.12em] uppercase">
              {t.theRealQuestion}
            </span>
            <span className="text-body-lg text-paper font-semibold">{round.sharedPrompt}</span>
          </Card>
        )}

        {/* Clue recap — informs the vote (see note above). */}
        {round.clues.length > 0 && (
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
            {round.clues.map((c) => {
              const p = playerById(c.playerId);
              return (
                <Chip key={c._id} tone="neutral" className="shrink-0">
                  {p?.avatarEmoji} {c.text}
                </Chip>
              );
            })}
          </div>
        )}

        {/* Three-up once there is room. Twelve candidates two-up is a scroll on a laptop
            for no reason. */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" data-testid="vote-grid">
          {candidates.map((id) => {
            const p = playerById(id);
            if (!p) return null;
            const isMe = id === myId;
            const disabled = iAmEliminated || isMe;
            const hasVoted = round.votedPlayerIds.some((v) => v === id);
            const isSelected = !disabled && selected === id;
            return (
              <button
                key={id}
                type="button"
                disabled={disabled}
                data-testid="vote-card"
                data-self={isMe || undefined}
                aria-pressed={isSelected}
                onClick={() => {
                  setSelected(id);
                  feedback.tap();
                }}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 rounded-md border px-2 py-3 transition-colors",
                  isSelected
                    ? "border-signal bg-ink-600"
                    : "border-line bg-ink-700 hover:bg-ink-600",
                  disabled && "opacity-45",
                )}
              >
                {isSelected && (
                  <Chip tone="signal" size="sm" className="absolute -top-2">
                    {t.accused}
                  </Chip>
                )}
                <Av emoji={p.avatarEmoji} color={p.avatarColor} size="md" />
                <span className="text-body text-paper max-w-full truncate font-semibold">
                  {p.name}
                </span>
                <span className="text-label text-muted">
                  {isMe ? t.voteSelf : hasVoted ? t.voteHasVoted : t.voteSuspect}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-body-sm text-muted text-center">
          {iAmEliminated ? t.eliminatedHint : t.voteChangeHint} ·{" "}
          <span className="text-paper font-semibold tabular-nums">
            {voted}/{candidates.length}
          </span>
        </p>

        {isHost && (
          <Button variant="ghost" block onClick={endVote} data-testid="end-vote">
            {t.endVote}
          </Button>
        )}
      </StageScroll>

      {/* The confirm bar is always in the layout and only becomes usable once a candidate
          is picked — revealing it on selection shifted the grid under the player's thumb
          at exactly the moment they were aiming at it. */}
      <StageFooter testId="confirm-wrap">
        <Button
          variant="destructive"
          size="lg"
          block
          onClick={confirmVote}
          disabled={!selected || confirmed === selected}
          data-testid="confirm-vote"
        >
          {confirmed && confirmed === selected ? `✓ ${t.youVoted}` : `${t.voteFor} ${selectedName}`}
        </Button>
      </StageFooter>
    </Stage>
  );
}
