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
import { NeonBackdrop } from "./NeonBackdrop";
import { Av } from "./Av";
import { RoomCode } from "./RoomCode";
import { SettingsPanel } from "./SettingsPanel";
import { HowToPlay } from "./HowToPlay";
import { SettingsCoach } from "./SettingsCoach";
import { HostGoneBanner } from "./HostGoneBanner";
import { t } from "@/lib/strings";
import { feedback } from "@/lib/feedback";
import { toast } from "sonner";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

type RoomShape = NonNullable<FunctionReturnType<typeof api.games.getRoomState>>;
type AuthArgs = { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret: string };

/**
 * Lobby — concept screen 2 (`.s-lobby`).
 *
 * Concept structure: aurora → .header (icon-btn · room-code-pill · icon-btn) →
 * .content (sec-header, .player-card list, waiting dots, dashed add-bot) →
 * .footer (glow-pulsing start button).
 *
 * One deviation from the concept: it draws a single icon button on the right,
 * but the app needs both help and host settings there, so the right slot holds
 * two. Everything else is the concept verbatim.
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

  const startLabel = room.players.length < 3 ? "Mindst 3 spillere" : t.startGame;

  return (
    <div className="cscreen s-lobby">
      <NeonBackdrop />

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
        <DrawerContent className="c-drawer-shell">
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

      <div className="header">
        <button className="icon-btn" onClick={onLeave} aria-label={t.leave}>
          ←
        </button>

        <div className="flex items-center gap-1.5">
          <HowToPlay
            trigger={
              <button className="icon-btn" aria-label={t.howToTitle}>
                ?
              </button>
            }
          />
          {room.isHost && (
            <button
              ref={settingsBtnRef}
              className="icon-btn"
              aria-label={t.settings}
              onClick={() => {
                dismissCoach();
                setSettingsOpen(true);
              }}
            >
              <SlidersHorizontal className="size-5" />
            </button>
          )}
        </div>
      </div>

      <div className="content">
        <HostGoneBanner room={room} authArgs={authArgs} />

        <RoomCode code={room.code} />

        <div className="sec-header">
          <div className="sec-label">{t.players}</div>
          <div className="count-badge">{room.players.length} / 12</div>
        </div>

        {room.players.map((p) => (
          <div
            key={p._id}
            className={cn("player-card", p.isHost && "host", !p.isOnline && "opacity-50")}
          >
            <Av emoji={p.avatarEmoji} color={p.avatarColor} size="sm" dimmed={!p.isOnline} />
            <div className="player-name">
              {p.name}
              {p._id === room.myPlayerId && (
                <span className="text-[rgba(245,243,255,0.38)]"> ({t.you})</span>
              )}
            </div>
            {p.isHost && <div className="host-badge">{t.host} 👑</div>}
            {p.isBot && <div className="bot-badge">Bot</div>}
            {room.isHost && p._id !== room.myPlayerId && (
              <button
                className="rcp-copy shrink-0 px-1 text-lg leading-none"
                aria-label={t.kick}
                onClick={() => kickPlayer({ ...authArgs, targetPlayerId: p._id })}
              >
                ×
              </button>
            )}
          </div>
        ))}

        {room.players.length < 3 && (
          <div className="waiting-row">
            <div className="pdot" />
            <div className="pdot" />
            <div className="pdot" />
            <div className="waiting-text">Venter på spillere…</div>
          </div>
        )}

        {room.isHost && room.players.length < 12 && (
          <button className="add-bot-btn" onClick={handleAddBot}>
            ＋ {t.addBot}
          </button>
        )}
      </div>

      <div className="footer">
        {room.isHost ? (
          <button
            className={cn("btn btn-primary start-btn", canStart && !starting && "glow-pulse")}
            disabled={!canStart || starting}
            onClick={handleStart}
            style={!canStart || starting ? { opacity: 0.55 } : undefined}
          >
            {starting ? <Loader2 className="animate-spin" /> : startLabel}
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
