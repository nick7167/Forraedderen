import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "../../../convex/_generated/dataModel";
import { NeonBackdrop } from "./NeonBackdrop";
import { PhaseChrome } from "./PhaseChrome";
import { Av } from "./Av";
import { t } from "@/lib/strings";
import { feedback } from "@/lib/feedback";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Round = NonNullable<FunctionReturnType<typeof api.round.getRoundState>>;
type AuthArgs = { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret: string };

/**
 * Discussion — no dedicated concept screen exists for this phase, so it's built
 * from the concept's clue-screen vocabulary (`.s-clue` surface, `.clue-header`
 * with phase-badge and `.phase-title`, `.player-card` rows, `.clue-text`
 * bubbles for each clue given) to stay consistent with the designed language.
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
    <div className="cscreen s-clue">
      <NeonBackdrop variant="clue" />
      <PhaseChrome onLeave={onLeave} />

      <div className="clue-header">
        <div className="phase-row">
          <div className="phase-badge">{t.discussTitle}</div>
          <div className="round-pill">
            {t.pass} {round.currentPass} / {round.cluePasses}
          </div>
        </div>
        <div className="phase-title">
          {isPromptMode ? t.discussPromptQuestions : t.discussPrompt} 🗣️
        </div>
      </div>

      <div className="clue-feed">
        {isPromptMode && round.sharedPrompt && (
          <div className="mode-desc-box text-center">
            <div className="sc-lbl">{t.theRealQuestion}</div>
            {round.sharedPrompt}
          </div>
        )}

        {cluesByPlayer.map(({ player, clues }) => (
          <div key={player._id} className="player-card">
            <Av emoji={player.avatarEmoji} color={player.avatarColor} size="sm" />
            <div className="player-name">{player.name}</div>
            <div className="flex flex-wrap justify-end gap-1.5">
              {clues.map((c) => (
                <span key={c._id} className="clue-text !max-w-none">
                  {c.text}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="clue-input-area">
        {isHost ? (
          <button
            className="btn btn-primary w-full"
            style={{ padding: 18, borderRadius: 20, fontSize: 17 }}
            onClick={handleAdvance}
            disabled={busy}
          >
            {busy ? (
              <Loader2 className="animate-spin" />
            ) : moreClues ? (
              `${t.nextClue} →`
            ) : (
              `${t.goToVoting} →`
            )}
          </button>
        ) : (
          <div className="waiting-row">
            <div className="pdot" />
            <div className="pdot" />
            <div className="pdot" />
            <div className="waiting-text">{t.waitingForHost}</div>
          </div>
        )}
      </div>
    </div>
  );
}
