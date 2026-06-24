import { useState } from "react";
import { useMutation } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { api } from "../../../convex/_generated/api";
import type { Doc, Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Screen } from "./Screen";
import { TopBar } from "./TopBar";
import { Avatar } from "./PlayerBadge";
import { SettingsPanel } from "./SettingsPanel";
import { t } from "@/lib/strings";
import { feedback } from "@/lib/feedback";
import { toast } from "sonner";
import { Copy, Crown, LogOut, X, Loader2, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

type RoomShape = NonNullable<FunctionReturnType<typeof api.games.getRoomState>>;
type AuthArgs = { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret: string };

export function LobbyView({
  room,
  authArgs,
  onLeave,
}: {
  room: RoomShape;
  authArgs: AuthArgs;
  onLeave: () => void;
}) {
  const updateSettings = useMutation(api.games.updateSettings);
  const startMatch = useMutation(api.round.startMatch);
  const kickPlayer = useMutation(api.games.kickPlayer);
  const [starting, setStarting] = useState(false);

  const canStart = room.isHost && room.players.length >= 3 && !!room.settings.packId;

  async function copyCode() {
    await navigator.clipboard.writeText(room.code);
    feedback.tap();
    toast.success(t.copied);
  }

  async function saveSettings(settings: Doc<"rooms">["settings"]) {
    try {
      await updateSettings({ ...authArgs, settings });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fejl");
    }
  }

  async function handleStart() {
    setStarting(true);
    feedback.tap();
    try {
      await startMatch(authArgs);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fejl");
    } finally {
      setStarting(false);
    }
  }

  const startLabel =
    room.players.length < 3
      ? "Mindst 3 spillere"
      : !room.settings.packId
        ? t.choosePack
        : t.startGame;

  return (
    <>
      <TopBar
        title={t.lobby}
        left={
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-full text-muted-foreground"
            onClick={onLeave}
            aria-label={t.leave}
          >
            <LogOut className="size-5" />
          </Button>
        }
        right={
          room.isHost ? (
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-full text-muted-foreground"
                  aria-label={t.settings}
                >
                  <Settings2 className="size-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>{t.settings}</DrawerTitle>
                </DrawerHeader>
                <div className="px-4 pb-8">
                  <SettingsPanel
                    settings={room.settings}
                    playerCount={room.players.length}
                    editable
                    onChange={saveSettings}
                  />
                </div>
              </DrawerContent>
            </Drawer>
          ) : null
        }
      />

      <Screen
        footer={
          room.isHost ? (
            <Button size="hero" disabled={!canStart || starting} onClick={handleStart}>
              {starting ? <Loader2 className="animate-spin" /> : startLabel}
            </Button>
          ) : (
            <p className="py-3 text-center text-sm text-muted-foreground">
              {t.waitingForHost}
            </p>
          )
        }
      >
        {/* Room code hero */}
        <button
          onClick={copyCode}
          className="w-full rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-600 p-6 text-center text-white gloss active:scale-[0.99]"
        >
          <p className="text-xs font-medium opacity-80">{t.shareCode}</p>
          <p className="mt-1 inline-flex items-center gap-2 text-5xl font-extrabold tracking-[0.15em]">
            {room.code}
            <Copy className="size-5 opacity-80" />
          </p>
        </button>

        {/* Players */}
        <div>
          <h2 className="mb-2 px-1 text-sm font-semibold text-muted-foreground">
            {t.players} · {room.players.length}/12
          </h2>
          <div className="flex flex-col gap-1.5">
            {room.players.map((p) => (
              <div
                key={p._id}
                className={cn(
                  "glass flex items-center gap-3 rounded-2xl p-2.5",
                  !p.isOnline && "opacity-50",
                )}
              >
                <Avatar emoji={p.avatarEmoji} color={p.avatarColor} dimmed={!p.isOnline} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate font-semibold">
                    {p.name}
                    {p.isHost && <Crown className="size-4 text-amber-400" />}
                  </p>
                  {p._id === room.myPlayerId ? (
                    <p className="text-xs text-muted-foreground">{t.you}</p>
                  ) : p.activeFromRound > Math.max(1, room.currentRoundNumber) ? (
                    <p className="text-xs text-muted-foreground">{t.waitingNextRound}</p>
                  ) : null}
                </div>
                {room.isHost && p._id !== room.myPlayerId && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 rounded-full text-muted-foreground"
                    onClick={() => kickPlayer({ ...authArgs, targetPlayerId: p._id })}
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </Screen>
    </>
  );
}
