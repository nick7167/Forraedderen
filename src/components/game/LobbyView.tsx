import { useState } from "react";
import { useMutation } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { api } from "../../../convex/_generated/api";
import type { Doc, Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Avatar } from "./PlayerBadge";
import { SettingsPanel } from "./SettingsPanel";
import { PackPicker } from "./PackPicker";
import { t } from "@/lib/strings";
import { toast } from "sonner";
import { Copy, Crown, LogOut, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type RoomShape = NonNullable<FunctionReturnType<typeof api.games.getRoomState>>;

type AuthArgs = {
  roomId: Id<"rooms">;
  playerId?: Id<"players">;
  guestSecret: string;
};

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

  const [packOpen, setPackOpen] = useState(false);
  const [starting, setStarting] = useState(false);

  const canStart =
    room.isHost && room.players.length >= 3 && !!room.settings.packId;

  async function copyCode() {
    await navigator.clipboard.writeText(room.code);
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
    try {
      await startMatch(authArgs);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fejl");
    } finally {
      setStarting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 p-5 text-center text-white">
        <p className="text-xs font-medium opacity-80">{t.shareCode}</p>
        <button
          onClick={copyCode}
          className="mt-1 inline-flex items-center gap-2 text-4xl font-black tracking-[0.2em]"
        >
          {room.code}
          <Copy className="size-5 opacity-80" />
        </button>
      </div>

      <div>
        <h2 className="mb-2 px-1 text-sm font-semibold text-muted-foreground">
          {t.players} ({room.players.length}/12)
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {room.players.map((p) => (
            <div
              key={p._id}
              className={cn(
                "flex items-center gap-2 rounded-xl border bg-card p-2.5",
                !p.isOnline && "opacity-60",
              )}
            >
              <Avatar emoji={p.avatarEmoji} color={p.avatarColor} dimmed={!p.isOnline} />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1 truncate text-sm font-semibold">
                  {p.name}
                  {p.isHost && <Crown className="size-3.5 text-amber-500" />}
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
                  className="size-7 text-muted-foreground"
                  onClick={() => kickPlayer({ ...authArgs, targetPlayerId: p._id })}
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-2 px-1 text-sm font-semibold text-muted-foreground">
          {t.settings}
        </h2>
        <SettingsPanel
          settings={room.settings}
          playerCount={room.players.length}
          editable={room.isHost}
          onChange={saveSettings}
          onPickPack={() => setPackOpen(true)}
        />
      </div>

      {room.isHost ? (
        <Button
          size="lg"
          className="w-full text-base font-bold"
          disabled={!canStart || starting}
          onClick={handleStart}
        >
          {starting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : room.players.length < 3 ? (
            "Mindst 3 spillere"
          ) : !room.settings.packId ? (
            t.choosePack
          ) : (
            t.startGame
          )}
        </Button>
      ) : (
        <p className="py-2 text-center text-sm text-muted-foreground">
          {t.waitingForHost}
        </p>
      )}

      <Button variant="ghost" className="text-muted-foreground" onClick={onLeave}>
        <LogOut className="size-4" /> {t.leave}
      </Button>

      <PackPicker
        open={packOpen}
        onOpenChange={setPackOpen}
        selectedPackId={room.settings.packId}
        onSelect={(id) => saveSettings({ ...room.settings, packId: id })}
      />
    </div>
  );
}
