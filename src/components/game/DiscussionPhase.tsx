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
import { toast } from "sonner";

type Round = NonNullable<FunctionReturnType<typeof api.round.getRoundState>>;
type AuthArgs = { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret: string };

/**
 * Discussion.
 *
 * The clue feed, regrouped by player rather than by turn — this is the screen people argue
 * over, and comparing two players means having their clues next to each other.
 */
export function DiscussionPhase({
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
  const advance = useMutation(api.round.advanceDiscussion);
  const [busy, setBusy] = useState(false);
  const moreClues = round.currentPass < round.cluePasses;
  const isPromptMode = round.gameMode === "questions" || round.gameMode === "scale";

  // One row per player (in turn order), with all the clues they've given.
  const cluesByPlayer = round.turnOrder
    .map((id) => {
      const player = round.players.find((p) => p._id === id);
      if (!player) return null;
      const clues = round.clues
        .filter((c) => c.playerId === id)
        .sort((a, b) => a.passNumber - b.passNumber);
      return { player, clues };
    })
    .filter(
      (x): x is { player: Round["players"][number]; clues: Round["clues"] } =>
        x !== null && x.clues.length > 0,
    );

  async function handleAdvance() {
    setBusy(true);
    feedback.tap();
    try {
      await advance({ ...authArgs, roundId: round.roundId });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fejl");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Stage keyName="discussion" width="max-w-2xl" fit>
      <PhaseChrome
        onLeave={onLeave}
        history={<RoundHistory authArgs={authArgs} players={round.players} />}
      />
      <Announce message={t.a11yDiscussPhase} />

      <div className="flex shrink-0 flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Chip tone="gold" size="sm" data-testid="phase-badge">
            {t.discussTitle}
          </Chip>
          <span className="text-label text-muted font-semibold tabular-nums">
            {t.pass} {round.currentPass} / {round.cluePasses}
          </span>
        </div>
        <p className="font-display text-display-2 text-paper font-extrabold">
          {isPromptMode ? t.discussPromptQuestions : t.discussPrompt}
        </p>
      </div>

      <StageScroll className="flex flex-col gap-2 py-1" testId="discussion-feed">
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

        {cluesByPlayer.map(({ player, clues }) => (
          <Card key={player._id} className="flex items-center gap-2.5 px-3 py-2.5">
            <Av emoji={player.avatarEmoji} color={player.avatarColor} size="sm" />
            <span className="text-body text-paper shrink-0 font-semibold">{player.name}</span>
            <div className="flex flex-1 flex-wrap justify-end gap-1.5">
              {clues.map((c) => (
                <Chip key={c._id} tone="neutral" data-testid="clue-text">
                  {c.text}
                </Chip>
              ))}
            </div>
          </Card>
        ))}
      </StageScroll>

      <StageFooter>
        {isHost ? (
          <Button
            size="lg"
            block
            onClick={handleAdvance}
            loading={busy}
            data-testid="discussion-advance"
          >
            {moreClues ? t.nextClue : t.goToVoting}
          </Button>
        ) : (
          <p className="text-body-sm text-muted py-2 text-center">{t.waitingForHost}</p>
        )}
      </StageFooter>
    </Stage>
  );
}
