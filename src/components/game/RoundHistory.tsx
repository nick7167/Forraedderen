import { useQuery } from "convex/react";
import { Glyph } from "@/ui/Glyph";
import { Chip } from "@/ui/Surface";
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
        <button
          type="button"
          className="text-secondary hover:text-paper hover:bg-ink-700 flex size-9 items-center justify-center rounded-sm text-lg transition-colors"
          aria-label={t.historyTitle}
          data-testid="round-history"
        >
          <Glyph name="history" />
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
              <div key={round.roundNumber} className="bg-ink-700 border-line rounded-md border p-4">
                <div className="mb-2.5 flex items-center justify-between gap-2">
                  <span className="text-label text-muted font-semibold tracking-[0.12em] uppercase">
                    {t.pass} {round.roundNumber}
                  </span>
                  <Chip tone={round.outcome === "crew" ? "teal" : "signal"} size="sm">
                    {round.outcome === "crew" ? t.caught : t.escaped}
                  </Chip>
                </div>

                <div className="text-body-sm text-muted mb-3">
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
                        <span className="text-label text-muted shrink-0">
                          {p.name}
                          {wasImposter && " 🦎"}
                        </span>
                        <span className="bg-ink-600 text-body-sm text-paper rounded-sm px-2 py-1">
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
