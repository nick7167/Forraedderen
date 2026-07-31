import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Screen } from "./Screen";
import { NeonBackdrop } from "./NeonBackdrop";
import { AddToHomeScreen } from "@/components/AddToHomeScreen";
import { AvatarPicker } from "./AvatarPicker";
import { Avatar } from "./PlayerBadge";
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
import { Loader2, Pencil } from "lucide-react";
// Clerk auth UI removed — Clerk is not active; re-add when authentication is wired up.

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
    <div className="relative flex min-h-0 flex-1 flex-col">
      <NeonBackdrop density="full" />
      <AddToHomeScreen />


      {/* Account button placeholder — Clerk auth disabled; re-enable when authentication is wired up. */}

      <Screen
        center
        topInset
        footer={
          <Button
            size="hero"
            variant="default"
            className={cn("bottom-btn-glow", !busy && "p-glow-pulse")}
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
          </Button>
        }
      >
        {rememberedRoom && (
          <button
            onClick={() => navigate(`/room/${rememberedRoom}`)}
            className="glass-pill mx-auto -mt-2 mb-1 px-4 py-1.5 text-sm font-semibold text-foreground/90 active:scale-95"
          >
            ↩ {t.continueGame}
          </button>
        )}

        {/* Hero — floating gecko emoji + gradient wordmark (mockup logo-area) */}
        <div className="p-in text-center">
          <span
            className="p-float block text-[70px] leading-none drop-shadow-[0_0_30px_rgba(124,58,237,0.65)]"
            aria-hidden
          >
            🦎
          </span>
          <h1 className="mt-1 bg-gradient-to-br from-[#c4b5fd] via-[#a78bfa] to-[#7c3aed] bg-clip-text text-[30px] font-extrabold tracking-[-0.035em] text-transparent">
            {t.appName}
          </h1>
          <p className="mx-auto mt-1.5 max-w-[18rem] text-[14.5px] font-medium text-[rgba(245,243,255,0.4)]">
            {t.tagline}
          </p>
        </div>

        {/* Identity + mode panel */}
        <div className="glass p-in-2 space-y-5 rounded-3xl p-5">
          {/* Identity: large avatar (tap to edit) + name */}
          <div className="glass-input flex items-center gap-3 rounded-2xl p-3">
            <Drawer>
              <DrawerTrigger asChild>
                <button className="relative shrink-0 active:scale-95">
                  <Avatar emoji={emoji} color={color} size={52} />
                  <span className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full gradient-primary text-white">
                    <Pencil className="size-3" />
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
            <Input
              value={name}
              maxLength={20}
              placeholder={t.yourName}
              onChange={(e) => setName(e.target.value)}
              className="h-11 border-0 bg-transparent text-lg font-semibold focus-visible:ring-0"
            />
          </div>

          {/* Create / Join — two 3D buttons (purple + blue), like the design */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="default"
              className={cn(
                "h-auto rounded-[1rem] py-3.5 text-base",
                mode !== "create" && "opacity-70",
              )}
              onClick={() => {
                feedback.tap();
                setMode("create");
              }}
            >
              {t.createGame}
            </Button>
            <Button
              variant="accent"
              className={cn(
                "h-auto rounded-[1rem] py-3.5 text-base",
                mode !== "join" && "opacity-80",
              )}
              onClick={() => {
                feedback.tap();
                setMode("join");
              }}
            >
              {t.joinGame}
            </Button>
          </div>

          {mode === "join" && (
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder={t.codePlaceholder}
              maxLength={6}
              className="glass-input h-14 rounded-[1rem] border-0 text-center text-2xl font-bold tracking-[0.4em] uppercase"
              onKeyDown={(e) => e.key === "Enter" && go()}
            />
          )}
        </div>
      </Screen>
    </div>
  );
}
