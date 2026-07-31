import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "../../../convex/_generated/dataModel";
import { NeonBackdrop } from "./NeonBackdrop";
import { PhaseChrome } from "./PhaseChrome";
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
 * Vote — concept screen 6 (`.s-vote`).
 *
 * Concept structure: red-tinted aurora → centered `.header` (ph-label /
 * ph-title / ph-sub) → `.vote-grid` of `.vote-card`s → `.footer` holding the
 * `.confirm-wrap`, which springs up from translateY(72px) once a card is
 * picked.
 *
 * The concept's two-step select-then-confirm is implemented as designed (its
 * note: "forhindrer utilsigtede stemmer fra en hurtig finger"). Picking a card
 * only selects it — `castVote` fires on confirm — and you can re-pick and
 * confirm again, preserving the app's change-your-vote behaviour.
 *
 * One addition the concept doesn't show: the clue recap strip. Voting without
 * the clues in view is unplayable, so it's kept, styled with concept tokens.
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

  const selectedName = selected ? (playerById(selected)?.name ?? "") : "";
  const isPromptMode = round.gameMode === "questions" || round.gameMode === "scale";

  return (
    <div className="cscreen s-vote">
      <NeonBackdrop variant="danger" />
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

      <div className="header">
        <div className="ph-label">
          {round.currentBallot > 1 ? `${t.ballotNumber} ${round.currentBallot}` : "Fase"}
        </div>
        <div className="ph-title">{t.votePhase} 🗳️</div>
        <div className="ph-sub">
          {isPromptMode ? t.voteInstructionQuestions : t.voteInstruction}
        </div>
      </div>

      <div className="content">
        {/* Prompt modes: keep the real prompt in view while voting. */}
        {isPromptMode && round.sharedPrompt && (
          <div className="mode-desc-box mb-3 text-center">
            <span className="opacity-60">{t.theRealQuestion}: </span>
            {round.sharedPrompt}
          </div>
        )}

        {/* Clue recap — informs the vote (see note above). */}
        {round.clues.length > 0 && (
          <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {round.clues.map((c) => {
              const p = playerById(c.playerId);
              return (
                <span key={c._id} className="phase-badge shrink-0 !normal-case !tracking-normal">
                  {p?.avatarEmoji} {c.text}
                </span>
              );
            })}
          </div>
        )}

        <div className="vote-grid">
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
                disabled={disabled}
                onClick={() => {
                  setSelected(id);
                  feedback.tap();
                }}
                className={cn("vote-card", isSelected && "selected", isMe && "self")}
              >
                {/* Absolutely positioned in the concept — it overlays the card
                    top rather than pushing the avatar down. */}
                {isSelected && <div className="accused-banner">{t.accused}</div>}
                <Av
                  emoji={p.avatarEmoji}
                  color={p.avatarColor}
                  size="md"
                  style={{ margin: "0 auto" }}
                />
                <div className="vote-pname">{p.name}</div>
                <div className="vote-psub">
                  {isMe ? t.voteSelf : hasVoted ? t.voteHasVoted : t.voteSuspect}
                </div>
              </button>
            );
          })}
        </div>

        <p className="turn-label mt-4">
          {iAmEliminated ? t.eliminatedHint : t.voteChangeHint} ·{" "}
          <span>
            {voted}/{candidates.length}
          </span>
        </p>

        {isHost && (
          <button
            className="btn-ghost mt-2 w-full"
            onClick={() => skipPhase({ ...authArgs, roundId: round.roundId })}
          >
            ⏭ {t.endVote}
          </button>
        )}
      </div>

      <div className="footer">
        <div className={cn("confirm-wrap", selected && "visible")}>
          <button
            className="btn btn-danger w-full"
            style={{
              padding: 16,
              borderRadius: 18,
              fontSize: 16,
              // Concept's locked state: `btn.style.opacity = '.55'`.
              ...(confirmed === selected ? { opacity: 0.55 } : null),
            }}
            onClick={confirmVote}
            disabled={!selected || confirmed === selected}
          >
            {confirmed && confirmed === selected
              ? `✓ ${t.youVoted}`
              : `${t.voteFor} ${selectedName} →`}
          </button>
        </div>
      </div>
    </div>
  );
}
