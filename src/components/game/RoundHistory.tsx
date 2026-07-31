import { useQuery } from "convex/react";
import { History } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Av } from "./Av";
import { t } from "@/lib/strings";
import { cn } from "@/lib/utils";

type AuthArgs = { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret: string };
type Player = { _id: Id<"players">; name: string; avatarEmoji: string; avatarColor: string };

/**
 * Earlier rounds of the current match.
 *
 * "You said 'bitter' last round!" was previously unverifiable — clues vanished
 * the moment a round resolved, so the thing players argue about hardest was the
 * one thing the app wouldn't show them. Only resolved rounds appear, so nothing
 * in-flight can leak.
 */
export function RoundHistory({
  authArgs,
  players,
}: {
  authArgs: AuthArgs;
  players: readonly Player[];
}) {
  const history = useQuery(api.round.getRoundHistory, authArgs);
  const playerById = (id: Id<"players">) => players.find((p) => p._id === id);
  const count = history?.length ?? 0;

  // Nothing to look back on during round one.
  if (count === 0) return null;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="icon-btn" aria-label={t.historyTitle}>
          <History className="size-5" />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t.historyTitle}</DrawerTitle>
        </DrawerHeader>
        <div className="no-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-[max(2rem,env(safe-area-inset-bottom))]">
          {history?.map((round) => {
            const isPrompt =
              round.gameMode === "questions" || round.gameMode === "scale";
            return (
              <div key={round.roundNumber} className="c-glass rounded-2xl p-4">
                <div className="mb-2.5 flex items-center justify-between gap-2">
                  <span className="sec-label">
                    {t.pass} {round.roundNumber}
                  </span>
                  <span
                    className={cn(
                      "count-badge",
                      round.outcome === "crew"
                        ? "!border-[rgba(74,222,128,.3)] !bg-[rgba(34,197,94,.14)] !text-[#4ade80]"
                        : "!border-[rgba(252,165,165,.3)] !bg-[rgba(239,68,68,.14)] !text-[#fca5a5]",
                    )}
                  >
                    {round.outcome === "crew" ? t.caught : t.escaped}
                  </span>
                </div>

                <div className="imp-word mb-3">
                  {isPrompt ? t.theCrewQuestion : t.theWord}:{" "}
                  <span>{round.secretWord}</span>
                  {round.decoyWord && (
                    <>
                      {" · "}
                      {isPrompt ? t.theImposterQuestion : t.imposterWordWas}:{" "}
                      <span>{round.decoyWord}</span>
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {round.clues.map((clue, i) => {
                    const p = playerById(clue.playerId);
                    if (!p) return null;
                    const wasImposter = round.imposterPlayerIds.some(
                      (id) => id === clue.playerId,
                    );
                    return (
                      <div key={i} className="flex items-center gap-2.5">
                        <Av emoji={p.avatarEmoji} color={p.avatarColor} size="xs" />
                        <span className="vote-psub shrink-0">
                          {p.name}
                          {wasImposter && " 🦎"}
                        </span>
                        <span className="clue-text !max-w-none !py-1.5 text-[13px]">
                          {clue.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
