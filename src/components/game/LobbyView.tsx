import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useMutation } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { api } from "../../../convex/_generated/api";
import type { Doc, Id } from "../../../convex/_generated/dataModel";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Av } from "./Av";
import { RoomCode } from "./RoomCode";
import { usePresence } from "@/hooks/usePresence";
import { SettingsPanel } from "./SettingsPanel";
import { HowToPlay } from "./HowToPlay";
import { SettingsCoach } from "./SettingsCoach";
import { HostGoneBanner } from "./HostGoneBanner";
import { Stage, StageFooter } from "@/ui/Stage";
import { Button } from "@/ui/Button";
import { Card, Chip, SectionLabel } from "@/ui/Surface";
import { Glyph } from "@/ui/Glyph";
import { t } from "@/lib/strings";
import { feedback } from "@/lib/feedback";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type RoomShape = NonNullable<FunctionReturnType<typeof api.games.getRoomState>>;
type AuthArgs = { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret: string };

/**
 * Lobby.
 *
 * The widest column in the app (max-w-3xl): the roster goes two-up from `sm` because a
 * twelve-player list in one column pushes the start button off a laptop screen entirely.
 * Your own row wears the chamfered plate in your avatar colour — "which one am I" gets
 * asked constantly here.
 */
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
  const isOnline = usePresence();
  // The coach spotlight measures this button so the two stay aligned.
  const settingsBtnRef = useRef<HTMLButtonElement>(null);

  // Host nudge toward the settings gear — shown on every freshly-created lobby
  // (HomeScreen passes `justCreated` via router state on create).
  //
  // Driven by an effect, not a lazy useState initialiser: `room.isHost` is
  // false on the first render while the Convex snapshot still resolves this
  // device's player, and an initialiser only runs once — so the nudge was
  // being latched off before it could ever show. `settled` keeps it to one
  // appearance per lobby, and makes dismissal stick.
  const location = useLocation();
  const justCreated = (location.state as { justCreated?: boolean } | null)?.justCreated === true;
  const [coach, setCoach] = useState(false);
  const coachSettled = useRef(false);

  useEffect(() => {
    if (coachSettled.current) return;
    if (room.isHost && justCreated) {
      coachSettled.current = true;
      setCoach(true);
    }
  }, [room.isHost, justCreated]);

  function dismissCoach() {
    coachSettled.current = true;
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

  async function handleKick(targetPlayerId: Id<"players">) {
    try {
      await kickPlayer({ ...authArgs, targetPlayerId });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fejl");
    }
  }

  // Random category is valid, so no pack pick is required to start.
  const canStart = room.isHost && room.players.length >= 3;

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

  const startLabel = room.players.length < 3 ? t.needMorePlayers : t.startGame;

  return (
    <Stage keyName="lobby" width="max-w-3xl" testId="s-lobby">
      {coach && (
        <SettingsCoach
          anchor={settingsBtnRef}
          onDismiss={dismissCoach}
          onOpenSettings={() => {
            dismissCoach();
            setSettingsOpen(true);
          }}
        />
      )}

      {/* Host settings, controlled so the coach can open it too. */}
      <Drawer open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DrawerContent data-testid="settings-drawer">
          <DrawerHeader className="sr-only">
            <DrawerTitle>{t.settings}</DrawerTitle>
          </DrawerHeader>
          <SettingsPanel
            settings={room.settings}
            playerCount={room.players.length}
            editable
            onChange={saveSettings}
          />
        </DrawerContent>
      </Drawer>

      <div className="pt-safe flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="text-secondary hover:text-paper hover:bg-ink-700 flex size-9 shrink-0 items-center justify-center rounded-sm text-lg transition-colors"
          onClick={onLeave}
          aria-label={t.leave}
          data-testid="lobby-back"
        >
          <Glyph name="chevron" className="rotate-90" />
        </button>

        <div className="bg-line h-4 w-px shrink-0" aria-hidden />
        <p className="text-body-sm text-secondary min-w-0 flex-1 truncate font-semibold">
          {t.lobby}
        </p>

        <div className="flex items-center gap-1">
          <HowToPlay
            trigger={
              <button
                type="button"
                className="text-secondary hover:text-paper hover:bg-ink-700 flex size-9 items-center justify-center rounded-sm text-lg transition-colors"
                aria-label={t.howToTitle}
                data-testid="how-to-play"
              >
                <Glyph name="help" />
              </button>
            }
          />
          {room.isHost && (
            <button
              ref={settingsBtnRef}
              type="button"
              className="text-secondary hover:text-paper hover:bg-ink-700 flex size-9 items-center justify-center rounded-sm text-lg transition-colors"
              aria-label={t.settings}
              data-testid="settings-button"
              onClick={() => {
                dismissCoach();
                setSettingsOpen(true);
              }}
            >
              <Glyph name="settings" />
            </button>
          )}
        </div>
      </div>

      <HostGoneBanner room={room} authArgs={authArgs} />

      <RoomCode code={room.code} />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <SectionLabel>{t.players}</SectionLabel>
          <Chip tone="neutral" size="sm" data-testid="player-count">
            <Glyph name="users" />
            {room.players.length} / 12
          </Chip>
        </div>

        {/* Two-up on anything wider than a phone — a twelve-player roster in one column
            pushes the start button off a laptop screen entirely. */}
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {room.players.map((p) => {
            const isMe = p._id === room.myPlayerId;
            return (
              <Card
                as="li"
                key={p._id}
                you={isMe}
                accent={p.avatarColor}
                data-testid="player-card"
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5",
                  !isOnline(p) && "opacity-50",
                )}
              >
                <Av
                  emoji={p.avatarEmoji}
                  color={p.avatarColor}
                  size="sm"
                  dimmed={!isOnline(p)}
                />
                <span className="text-body text-paper min-w-0 flex-1 truncate font-semibold">
                  {p.name}
                  {isMe && <span className="text-muted font-normal"> ({t.you})</span>}
                </span>
                {p.isHost && (
                  <Chip tone="gold" size="sm" data-testid="host-badge">
                    <Glyph name="host" filled />
                    {t.host}
                  </Chip>
                )}
                {p.isBot && (
                  <Chip tone="neutral" size="sm" data-testid="bot-badge">
                    <Glyph name="bot" />
                    Bot
                  </Chip>
                )}
                {room.isHost && !isMe && (
                  <button
                    type="button"
                    className="text-muted hover:text-signal-text flex size-7 shrink-0 items-center justify-center rounded-xs transition-colors"
                    aria-label={`${t.kick} ${p.name}`}
                    data-testid="kick-player"
                    onClick={() => handleKick(p._id)}
                  >
                    <Glyph name="close" />
                  </button>
                )}
              </Card>
            );
          })}
        </ul>

        {room.players.length < 3 && (
          <p className="text-body-sm text-muted py-1 text-center" data-testid="waiting-players">
            {t.waitingForPlayers}
          </p>
        )}

        {room.isHost && room.players.length < 12 && (
          <Button
            variant="secondary"
            block
            onClick={handleAddBot}
            data-testid="add-bot"
            className="mt-1"
          >
            <Glyph name="plus" />
            {t.addBot}
          </Button>
        )}
      </div>

      <StageFooter>
        {room.isHost ? (
          <Button
            size="lg"
            block
            loading={starting}
            disabled={!canStart}
            onClick={handleStart}
            data-testid="start-game"
          >
            {startLabel}
          </Button>
        ) : (
          <p className="text-body-sm text-muted py-2 text-center" data-testid="waiting-host">
            {t.waitingForHost}
          </p>
        )}
      </StageFooter>
    </Stage>
  );
}
