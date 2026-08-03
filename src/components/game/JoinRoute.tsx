import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { AvatarPicker } from "./AvatarPicker";
import { Av } from "./Av";
import { Wordmark } from "./Wordmark";
import { Stage } from "@/ui/Stage";
import { Button, Spinner } from "@/ui/Button";
import { Card } from "@/ui/Surface";
import { Input } from "@/ui/Input";
import { Glyph } from "@/ui/Glyph";
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
      <Stage keyName="joining" width="max-w-md" className="min-h-[70dvh] justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-5xl" aria-hidden>
            🦎
          </span>
          <p className="font-display text-display-1 text-paper font-extrabold tracking-[0.2em]">
            {code}
          </p>
          <p className="text-body text-muted">{t.joiningRoom}</p>
          <span className="text-muted mt-2">
            <Spinner className="size-6" />
          </span>
        </div>
      </Stage>
    );
  }

  // First-timer: name + avatar only. The code is already known.
  return (
    <Stage keyName="join" width="max-w-md" className="justify-center sm:min-h-[90dvh]">
      <div className="flex flex-col items-center gap-2 text-center">
        <Wordmark size="hero" />
        <p className="text-body text-muted">{t.joinPrompt}</p>
      </div>

      <Card variant="hero" className="flex flex-col gap-4 p-4 sm:p-6">
        <div className="flex flex-col gap-1.5">
          <span className="text-label text-muted font-semibold tracking-[0.12em] uppercase">
            {t.roomCode}
          </span>
          <div className="flex gap-1.5" data-testid="join-code-cells">
            {code.split("").map((char, i) => (
              <span
                key={i}
                data-testid="room-code-cell"
                className="bg-ink-inset border-line font-display text-paper flex flex-1 items-center justify-center rounded-sm border py-2.5 text-2xl font-extrabold"
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-line h-px" aria-hidden />

        <div className="flex items-center gap-3">
          <Drawer>
            <DrawerTrigger asChild>
              <button
                type="button"
                className="relative shrink-0 rounded-md"
                aria-label={t.chooseAvatar}
                data-testid="avatar-edit"
              >
                <Av emoji={emoji} color={color} size="lg" />
                <span
                  className="bg-ink-600 border-line-strong text-secondary absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full border text-[10px]"
                  aria-hidden
                >
                  <Glyph name="settings" />
                </span>
              </button>
            </DrawerTrigger>
            <DrawerContent data-testid="avatar-picker">
              <DrawerHeader>
                <DrawerTitle>{t.chooseAvatar}</DrawerTitle>
              </DrawerHeader>
              <div className="pb-safe px-4 pb-6">
                <AvatarPicker emoji={emoji} color={color} onEmoji={setEmoji} onColor={setColor} />
              </div>
            </DrawerContent>
          </Drawer>

          <Input
            size="lg"
            wrapperClassName="flex-1"
            value={name}
            maxLength={20}
            autoFocus
            placeholder={t.yourName}
            aria-label={t.yourName}
            data-testid="name-input"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && join(name)}
          />
        </div>
      </Card>

      <Button size="lg" block loading={busy} onClick={() => join(name)} data-testid="join-cta">
        {t.joinGame}
      </Button>
    </Stage>
  );
}
