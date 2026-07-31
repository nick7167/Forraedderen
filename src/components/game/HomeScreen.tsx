import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { NeonBackdrop } from "./NeonBackdrop";
import { AddToHomeScreen } from "@/components/AddToHomeScreen";
import { AvatarPicker } from "./AvatarPicker";
import { Av } from "./Av";
import { AVATAR_COLORS, AVATAR_EMOJIS, randomFrom } from "@/lib/avatars";
import {
  getGuestSecret,
  loadProfile,
  saveProfile,
  rememberRoomPlayer,
  findRememberedRoom,
} from "@/lib/guest";
import { t } from "@/lib/strings";
import { feedback } from "@/lib/feedback";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
// Clerk auth UI removed — Clerk is not active; re-add when authentication is wired up.

/**
 * Home — concept screen 1 (`.s-home`).
 *
 * Structure is the concept's verbatim: aurora → .content (logo-area +
 * .identity-card holding the avatar row, divider and the create/join pair) →
 * .footer with the glow-pulsing hero CTA.
 */
export function HomeScreen() {
  const navigate = useNavigate();
  const saved = loadProfile();

  const [name, setName] = useState(saved?.name ?? "");
  const [emoji, setEmoji] = useState(saved?.avatarEmoji ?? randomFrom(AVATAR_EMOJIS));
  const [color, setColor] = useState(saved?.avatarColor ?? randomFrom(AVATAR_COLORS));
  const [mode, setMode] = useState<"create" | "join">("create");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const rememberedRoom = findRememberedRoom();

  const createRoom = useMutation(api.games.createRoom);
  const joinRoom = useMutation(api.games.joinRoom);
  const guestSecret = getGuestSecret();

  function persist() {
    saveProfile({ name: name.trim(), avatarEmoji: emoji, avatarColor: color });
  }

  async function go() {
    if (name.trim().length === 0) return toast.error(t.namePlaceholder);
    if (mode === "join" && code.trim().length === 0) return toast.error(t.codePlaceholder);
    setBusy(true);
    persist();
    feedback.tap();
    try {
      const res =
        mode === "create"
          ? await createRoom({ name: name.trim(), avatarEmoji: emoji, avatarColor: color, guestSecret })
          : await joinRoom({ code: code.trim(), name: name.trim(), avatarEmoji: emoji, avatarColor: color, guestSecret });
      rememberRoomPlayer(res.roomId, res.playerId);
      navigate(`/room/${res.roomId}`, {
        state: { justCreated: mode === "create" },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fejl");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="cscreen s-home">
      <NeonBackdrop />

      <AddToHomeScreen />

      <div className="content">
        {rememberedRoom && (
          <button
            onClick={() => navigate(`/room/${rememberedRoom}`)}
            className="btn-ghost mx-auto mb-3 shrink-0 font-semibold active:scale-95"
          >
            ↩ {t.continueGame}
          </button>
        )}

        <div className="logo-area">
          <span className="logo-emoji" aria-hidden>
            🦎
          </span>
          <h1 className="logo-text">{t.appName}</h1>
          <p className="logo-tagline">{t.tagline}</p>
        </div>

        <div className="c-glass identity-card">
          <div className="avatar-row">
            <Drawer>
              <DrawerTrigger asChild>
                <button className="avatar-edit-btn" aria-label={t.chooseAvatar}>
                  <Av emoji={emoji} color={color} size="md" />
                  <span className="avatar-edit-badge" aria-hidden>
                    ✏️
                  </span>
                </button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>{t.chooseAvatar}</DrawerTitle>
                </DrawerHeader>
                <div className="px-4 pb-8">
                  <AvatarPicker
                    emoji={emoji}
                    color={color}
                    onEmoji={setEmoji}
                    onColor={setColor}
                  />
                </div>
              </DrawerContent>
            </Drawer>
            <input
              className="name-input"
              value={name}
              maxLength={20}
              placeholder={t.yourName}
              aria-label={t.yourName}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="divider" />

          <div className="mode-buttons">
            <button
              className={cn("mode-btn create", mode !== "create" && "opacity-[.78]")}
              onClick={() => {
                feedback.tap();
                setMode("create");
              }}
            >
              {t.createGame}
            </button>
            <button
              className={cn("mode-btn join", mode !== "join" && "opacity-[.78]")}
              onClick={() => {
                feedback.tap();
                setMode("join");
              }}
            >
              {t.joinGame}
            </button>
          </div>

          {mode === "join" && (
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder={t.codePlaceholder}
              aria-label={t.roomCode}
              maxLength={6}
              onKeyDown={(e) => e.key === "Enter" && go()}
              className="clue-input mt-2.5 w-full text-center text-2xl font-extrabold tracking-[0.4em] uppercase"
            />
          )}
        </div>
      </div>

      <div className="footer">
        <button
          className={cn("btn btn-primary hero-btn", !busy && "glow-pulse")}
          onClick={go}
          disabled={busy}
        >
          {busy ? (
            <Loader2 className="animate-spin" />
          ) : mode === "create" ? (
            t.createGame
          ) : (
            t.joinGame
          )}
        </button>
      </div>
    </div>
  );
}
