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
import { feedback } from "@/lib/feedback";
import { toast } from "sonner";
import { Loader2, Pencil, LogIn } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

export function HomeScreen() {
  const navigate = useNavigate();
  const saved = loadProfile();

  const [name, setName] = useState(saved?.name ?? "");
  const [emoji, setEmoji] = useState(saved?.avatarEmoji ?? randomFrom(AVATAR_EMOJIS));
  const [color, setColor] = useState(saved?.avatarColor ?? randomFrom(AVATAR_COLORS));
  const [mode, setMode] = useState<"create" | "join">("create");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

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
      // Flag a freshly-created lobby so the host gets the settings spotlight
      // (every new lobby, not just the first ever).
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
    <div className="relative flex min-h-full flex-1 flex-col">
      {/* Optional account (unlocks saving custom packs). */}
      <div className="absolute top-2 right-4 z-10">
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <LogIn className="size-4" /> Log ind
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

      <Screen
      center
      footer={
        <Button size="hero" onClick={go} disabled={busy}>
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
      {/* Hero */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-violet-500 to-fuchsia-600 text-6xl shadow-xl gloss">
          🕵️
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">{t.appName}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.tagline}</p>
      </div>

      {/* Identity: large avatar (tap to edit) + name */}
      <div className="glass flex items-center gap-3 rounded-3xl p-3">
        <Drawer>
          <DrawerTrigger asChild>
            <button className="relative shrink-0 active:scale-95">
              <Avatar emoji={emoji} color={color} size={56} />
              <span className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground gloss">
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
          className="h-12 border-0 bg-transparent text-lg font-semibold focus-visible:ring-0"
        />
      </div>

      {/* Create / Join segmented toggle */}
      <div className="glass flex gap-1 rounded-2xl p-1">
        {(["create", "join"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
              mode === m
                ? "bg-primary text-primary-foreground gloss"
                : "text-muted-foreground"
            }`}
          >
            {m === "create" ? t.createGame : t.joinGame}
          </button>
        ))}
      </div>

      {mode === "join" && (
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder={t.codePlaceholder}
          maxLength={6}
          className="glass h-14 rounded-2xl border-0 text-center text-2xl font-bold tracking-[0.4em] uppercase"
          onKeyDown={(e) => e.key === "Enter" && go()}
        />
      )}
      </Screen>
    </div>
  );
}
