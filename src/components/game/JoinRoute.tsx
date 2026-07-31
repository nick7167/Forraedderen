import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { NeonBackdrop } from "./NeonBackdrop";
import { AvatarPicker } from "./AvatarPicker";
import { Av } from "./Av";
import { AVATAR_COLORS, AVATAR_EMOJIS, randomFrom } from "@/lib/avatars";
import {
  getGuestSecret,
  loadProfile,
  saveProfile,
  rememberRoomPlayer,
} from "@/lib/guest";
import { t } from "@/lib/strings";
import { feedback } from "@/lib/feedback";
import { toast } from "sonner";

/**
 * `/j/:code` — the invite link.
 *
 * Joining used to mean: open the app, tap "Deltag i spil", read a 4-character
 * code off someone's screen and type it in. For a game whose whole distribution
 * model is "send this to the group chat", that was the longest path in the app.
 *
 * A returning player (saved profile) is dropped straight into the lobby. A
 * first-timer gets just the name field, with the code already applied — no
 * transcription, no typos, no "is that an I or a 1".
 */
export function JoinRoute() {
  const navigate = useNavigate();
  const { code: rawCode } = useParams();
  const code = (rawCode ?? "").toUpperCase().trim();
  const saved = loadProfile();

  const [name, setName] = useState(saved?.name ?? "");
  const [emoji, setEmoji] = useState(saved?.avatarEmoji ?? randomFrom(AVATAR_EMOJIS));
  const [color, setColor] = useState(saved?.avatarColor ?? randomFrom(AVATAR_COLORS));
  const [busy, setBusy] = useState(false);

  const joinRoom = useMutation(api.games.joinRoom);
  const guestSecret = getGuestSecret();
  // A saved profile means we can join without asking anything.
  const autoJoined = useRef(false);

  async function join(withName: string) {
    const trimmed = withName.trim();
    if (trimmed.length === 0) return toast.error(t.namePlaceholder);
    if (code.length === 0) {
      navigate("/", { replace: true });
      return;
    }
    setBusy(true);
    saveProfile({ name: trimmed, avatarEmoji: emoji, avatarColor: color });
    try {
      const res = await joinRoom({
        code,
        name: trimmed,
        avatarEmoji: emoji,
        avatarColor: color,
        guestSecret,
      });
      rememberRoomPlayer(res.roomId, res.playerId);
      feedback.tap();
      navigate(`/room/${res.roomId}`, { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fejl");
      // Bad or expired code — fall back to the normal entry point rather than
      // stranding them on a dead link.
      navigate("/", { replace: true });
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (autoJoined.current) return;
    if (saved?.name && saved.name.trim().length > 0) {
      autoJoined.current = true;
      void join(saved.name);
    }
    // Runs once on mount; `join` intentionally not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Returning player: nothing to ask, just show progress.
  if (saved?.name && saved.name.trim().length > 0) {
    return (
      <div className="cscreen s-home">
        <NeonBackdrop />
        <div className="content items-center justify-center text-center">
          <div className="logo-area">
            <span className="logo-emoji" aria-hidden>
              🦎
            </span>
            <div className="logo-text">{code}</div>
            <p className="logo-tagline">{t.joiningRoom}</p>
          </div>
          <Loader2 className="mx-auto size-6 animate-spin text-[rgba(245,243,255,0.4)]" />
        </div>
      </div>
    );
  }

  // First-timer: name + avatar only. The code is already known.
  return (
    <div className="cscreen s-home">
      <NeonBackdrop />

      <div className="content">
        <div className="logo-area">
          <span className="logo-emoji" aria-hidden>
            🦎
          </span>
          <h1 className="logo-text">{t.appName}</h1>
          <p className="logo-tagline">{t.joinPrompt}</p>
        </div>

        <div className="c-glass identity-card">
          <div className="rc-top">
            <span className="rc-label">{t.roomCode}</span>
          </div>
          <div className="rc-cells mb-4">
            {code.split("").map((char, i) => (
              <span key={i} className="rc-cell">
                {char}
              </span>
            ))}
          </div>

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
              autoFocus
              placeholder={t.yourName}
              aria-label={t.yourName}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && join(name)}
            />
          </div>
        </div>
      </div>

      <div className="footer">
        <button
          className="btn btn-primary hero-btn glow-pulse"
          onClick={() => join(name)}
          disabled={busy}
        >
          {busy ? <Loader2 className="animate-spin" /> : t.joinGame}
        </button>
      </div>
    </div>
  );
}
