import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { AvatarPicker } from "./AvatarPicker";
import { Avatar } from "./PlayerBadge";
import { AVATAR_COLORS, AVATAR_EMOJIS, randomFrom } from "@/lib/avatars";
import {
  getGuestSecret,
  loadProfile,
  saveProfile,
  rememberRoomPlayer,
} from "@/lib/guest";
import { t } from "@/lib/strings";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function HomeScreen() {
  const navigate = useNavigate();
  const saved = loadProfile();

  const [name, setName] = useState(saved?.name ?? "");
  const [emoji, setEmoji] = useState(saved?.avatarEmoji ?? randomFrom(AVATAR_EMOJIS));
  const [color, setColor] = useState(saved?.avatarColor ?? randomFrom(AVATAR_COLORS));
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const createRoom = useMutation(api.games.createRoom);
  const joinRoom = useMutation(api.games.joinRoom);

  const guestSecret = getGuestSecret();

  function persist() {
    saveProfile({ name: name.trim(), avatarEmoji: emoji, avatarColor: color });
  }

  async function handleCreate() {
    if (name.trim().length === 0) return toast.error(t.namePlaceholder);
    setBusy(true);
    persist();
    try {
      const res = await createRoom({
        name: name.trim(),
        avatarEmoji: emoji,
        avatarColor: color,
        guestSecret,
      });
      rememberRoomPlayer(res.roomId, res.playerId);
      navigate(`/room/${res.roomId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fejl");
    } finally {
      setBusy(false);
    }
  }

  async function handleJoin() {
    if (name.trim().length === 0) return toast.error(t.namePlaceholder);
    if (code.trim().length === 0) return toast.error(t.codePlaceholder);
    setBusy(true);
    persist();
    try {
      const res = await joinRoom({
        code: code.trim(),
        name: name.trim(),
        avatarEmoji: emoji,
        avatarColor: color,
        guestSecret,
      });
      rememberRoomPlayer(res.roomId, res.playerId);
      navigate(`/room/${res.roomId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fejl");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-5 p-5">
      <div className="text-center">
        <div className="mx-auto mb-3 flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-5xl shadow-lg">
          🕵️
        </div>
        <h1 className="text-3xl font-black tracking-tight">{t.appName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.tagline}</p>
      </div>

      <Card className="w-full max-w-sm">
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center gap-3">
            <Avatar emoji={emoji} color={color} size={56} />
            <div className="flex-1">
              <Label htmlFor="name" className="mb-1.5 block">
                {t.yourName}
              </Label>
              <Input
                id="name"
                value={name}
                maxLength={20}
                placeholder={t.namePlaceholder}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label className="mb-1.5 block">{t.chooseAvatar}</Label>
            <AvatarPicker
              emoji={emoji}
              color={color}
              onEmoji={setEmoji}
              onColor={setColor}
            />
          </div>

          <Button
            size="lg"
            className="w-full text-base font-bold"
            onClick={handleCreate}
            disabled={busy}
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : t.createGame}
          </Button>

          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">eller</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="flex gap-2">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder={t.codePlaceholder}
              maxLength={6}
              className="font-mono text-center text-lg tracking-[0.3em] uppercase"
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            />
            <Button variant="secondary" onClick={handleJoin} disabled={busy}>
              {t.join}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
