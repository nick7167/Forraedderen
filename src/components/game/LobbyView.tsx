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
} from "@/components/ui/drawer";
import { Screen } from "./Screen";
import { TopBar } from "./TopBar";
import { Avatar } from "./PlayerBadge";
import { SettingsPanel } from "./SettingsPanel";
import { HowToPlay } from "./HowToPlay";
import { SettingsCoach } from "./SettingsCoach";
import { hasSeenSettingsCoach, markSettingsCoachSeen } from "@/lib/guest";
import { t } from "@/lib/strings";
import { feedback } from "@/lib/feedback";
import { toast } from "sonner";
import { Copy, Crown, LogOut, X, Loader2, Settings2, Bot, HelpCircle } from "lucide-react";
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
  const addBot = useMutation(api.games.addBot);
  const [starting, setStarting] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // First-time host nudge toward the settings gear.
  const [coach, setCoach] = useState(
    () => room.isHost && room.phase === "lobby" && !hasSeenSettingsCoach(),
  );
  function dismissCoach() {
    if (!coach) return;
    markSettingsCoachSeen();
    setCoach(false);
  }

  async function handleAddBot() {
    feedback.tap();
    try {
      await addBot(authArgs);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fejl");
    }
  }

  // Random category is valid, so no pack pick is required to start.
  const canStart = room.isHost && room.players.length >= 3;

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
    room.players.length < 3 ? "Mindst 3 spillere" : t.startGame;

  return (
    <>
      {coach && (
        <SettingsCoach
          onDismiss={dismissCoach}
          onOpenSettings={() => {
            dismissCoach();
            setSettingsOpen(true);
          }}
        />
      )}
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
          <div className="flex items-center gap-1">
            <HowToPlay
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-full text-muted-foreground"
                  aria-label={t.howToTitle}
                >
                  <HelpCircle className="size-5" />
                </Button>
              }
            />
            {room.isHost && (
              <Button
                variant="ghost"
                size="icon"
                className="size-9 rounded-full text-muted-foreground"
                aria-label={t.settings}
                onClick={() => {
                  dismissCoach();
                  setSettingsOpen(true);
                }}
              >
                <Settings2 className="size-5" />
              </Button>
            )}
          </div>
        }
      />

      {/* Host settings, controlled so the coach can open it too. */}
      <Drawer open={settingsOpen} onOpenChange={setSettingsOpen}>
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
                    {p.isBot && (
                      <span className="rounded-md bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                        {t.bot}
                      </span>
                    )}
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

          {room.isHost && room.players.length < 12 && (
            <button
              onClick={handleAddBot}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-white/5 active:scale-[0.99]"
            >
              <Bot className="size-4" /> {t.addBot}
            </button>
          )}
        </div>
      </Screen>
    </>
  );
}
