import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Avatar } from "./PlayerBadge";
import { Screen } from "./Screen";
import { t } from "@/lib/strings";
import { feedback } from "@/lib/feedback";
import { toast } from "sonner";
import { Loader2, MessagesSquare } from "lucide-react";

type Round = NonNullable<FunctionReturnType<typeof api.round.getRoundState>>;
type AuthArgs = { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret: string };

export function DiscussionPhase({
  round,
  authArgs,
  isHost,
}: {
  round: Round;
  authArgs: AuthArgs;
  isHost: boolean;
}) {
  const advance = useMutation(api.round.advanceDiscussion);
  const [busy, setBusy] = useState(false);
  const moreClues = round.currentPass < round.cluePasses;

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
    .filter((x): x is { player: Round["players"][number]; clues: Round["clues"] } => x !== null && x.clues.length > 0);

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
    <Screen
      footer={
        isHost ? (
          <Button
            size="hero"
            onClick={handleAdvance}
            disabled={busy}
            className="animate-pulse"
          >
            {busy ? (
              <Loader2 className="animate-spin" />
            ) : moreClues ? (
              t.nextClue
            ) : (
              t.goToVoting
            )}
          </Button>
        ) : (
          <p className="py-3 text-center text-sm text-muted-foreground">
            {t.waitingForHost}
          </p>
        )
      }
    >
      {/* Dramatic hero banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-600 p-6 text-center text-white gloss duration-500 animate-in fade-in zoom-in">
        <MessagesSquare className="mx-auto size-9 opacity-90" />
        <h1 className="mt-2 text-4xl font-black tracking-tight">
          {t.discussTitle.toUpperCase()}
        </h1>
        <p className="mt-1 text-sm font-medium opacity-90">{t.discussPrompt}</p>
        {round.category && (
          <span className="mt-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
            {round.category}
          </span>
        )}
      </div>

      {/* Evidence list — one row per player with their clue(s). */}
      <div className="flex flex-col gap-2">
        {cluesByPlayer.map(({ player, clues }) => (
          <div key={player._id} className="glass flex items-center gap-3 rounded-2xl p-3">
            <Avatar emoji={player.avatarEmoji} color={player.avatarColor} size={40} />
            <span className="font-semibold">{player.name}</span>
            <div className="ml-auto flex flex-wrap justify-end gap-1.5">
              {clues.map((c) => (
                <span
                  key={c._id}
                  className="rounded-lg bg-secondary px-3 py-1 text-sm font-medium"
                >
                  {c.text}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );
}
