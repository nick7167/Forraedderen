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
import { useState } from "react";

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
  const playerById = (id: Id<"players">) => round.players.find((p) => p._id === id);
  const moreClues = round.currentPass < round.cluePasses;

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
          <Button size="hero" onClick={handleAdvance} disabled={busy}>
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
      <div className="flex items-center gap-2">
        <MessagesSquare className="size-5 text-primary" />
        <h2 className="text-lg font-bold">{t.discussTitle}</h2>
        {round.category && (
          <span className="ml-auto rounded-full bg-white/5 px-2.5 py-1 text-xs text-muted-foreground">
            {round.category}
          </span>
        )}
      </div>
      <p className="-mt-2 text-sm text-muted-foreground">{t.discussHint}</p>

      {/* Clue recap — every clue so far, attributed. */}
      <div className="flex flex-col gap-2">
        {round.clues.map((c) => {
          const p = playerById(c.playerId);
          if (!p) return null;
          return (
            <div key={c._id} className="glass flex items-center gap-3 rounded-2xl p-2.5">
              <Avatar emoji={p.avatarEmoji} color={p.avatarColor} size={36} />
              <span className="text-sm font-semibold">{p.name}</span>
              <span className="ml-auto rounded-lg bg-secondary px-3 py-1 text-sm font-medium">
                {c.text}
              </span>
            </div>
          );
        })}
      </div>
    </Screen>
  );
}
