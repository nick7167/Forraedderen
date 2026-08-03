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
import { AddToHomeScreen } from "@/components/AddToHomeScreen";
import { AvatarPicker } from "./AvatarPicker";
import { HowToPlay } from "./HowToPlay";
import { Av } from "./Av";
import { Wordmark } from "./Wordmark";
import { Stage, StageFooter } from "@/ui/Stage";
import { Button } from "@/ui/Button";
import { Card, SectionLabel } from "@/ui/Surface";
import { Input } from "@/ui/Input";
import { Glyph } from "@/ui/Glyph";
import { AVATAR_COLORS, AVATAR_EMOJIS, randomFrom } from "@/lib/avatars";
import { MODES } from "@/lib/modes";
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

/**
 * Home.
 *
 * One hero Card carries the whole setup — avatar, name, create-or-join, code — and the
 * single gold CTA sits below it. The create/join pair is a segmented control on the inset
 * surface rather than two buttons: it sets a mode, it does not perform an action, and
 * giving it button weight was making the screen read as having three primary actions.
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
          ? await createRoom({
              name: name.trim(),
              avatarEmoji: emoji,
              avatarColor: color,
              guestSecret,
            })
          : await joinRoom({
              code: code.trim(),
              name: name.trim(),
              avatarEmoji: emoji,
              avatarColor: color,
              guestSecret,
            });
      rememberRoomPlayer(res.roomId, res.playerId);
      navigate(`/room/${res.roomId}`, { state: { justCreated: mode === "create" } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fejl");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Stage keyName="home" width="max-w-2xl">
      <AddToHomeScreen />

      {rememberedRoom && (
        <Button
          variant="ghost"
          size="sm"
          className="self-center"
          data-testid="continue-game"
          onClick={() => navigate(`/room/${rememberedRoom}`)}
        >
          <Glyph name="chevron" className="rotate-90" />
          {t.continueGame}
        </Button>
      )}

      <div className="flex flex-col items-center gap-2 text-center">
        <Wordmark size="hero" />
        <p className="text-body text-muted max-w-sm" data-testid="tagline">
          {t.tagline}
        </p>
      </div>

      <Card variant="hero" className="flex flex-col gap-4 p-4 sm:gap-5 sm:p-6">
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
            placeholder={t.yourName}
            aria-label={t.yourName}
            data-testid="name-input"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="bg-line h-px" aria-hidden />

        {/*
          Segmented control. Sets a mode; it is not one of the screen's actions — the gold
          CTA below is. Plain toggle buttons with `aria-pressed` rather than a tablist:
          these select which thing the CTA will do, they do not swap a panel, and a `tab`
          with no `tabpanel` promises a screen reader something that never arrives.
        */}
        <div
          className="bg-ink-inset border-line grid grid-cols-2 gap-1 rounded-md border p-1"
          role="group"
          aria-label={t.createGame + " / " + t.joinGame}
        >
          {(["create", "join"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              data-testid={`mode-${m}`}
              className={`text-body min-h-10 rounded-sm font-semibold transition-colors ${
                mode === m
                  ? "bg-ink-600 text-paper"
                  : "text-muted hover:text-secondary hover:bg-ink-700"
              }`}
              onClick={() => {
                feedback.tap();
                setMode(m);
              }}
            >
              {m === "create" ? t.createGame : t.joinGame}
            </button>
          ))}
        </div>

        {mode === "join" && (
          <Input
            size="lg"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder={t.codePlaceholder}
            aria-label={t.roomCode}
            maxLength={6}
            data-testid="code-input"
            onKeyDown={(e) => e.key === "Enter" && go()}
            className="font-display text-center text-2xl font-extrabold tracking-[0.4em] uppercase"
          />
        )}
      </Card>

      {/*
        What the game actually is, for someone who was handed a link and has never played.
        A round in three steps, then the four modes — the two questions a new player has,
        in the order they have them. The exhaustive rules (ties, scoring) stay in the
        drawer, so there is no second copy of them to keep in sync.
      */}
      <section className="flex flex-col gap-3" data-testid="home-how">
        <SectionLabel>{t.homeHowLabel}</SectionLabel>

        {/* Numbered because a round is a sequence, not a list of facts. The numeral is the
            display face on the inset surface — the same treatment the room code gets. */}
        <ol className="grid gap-2 sm:grid-cols-3">
          {[t.homeSteps.word, t.homeSteps.clue, t.homeSteps.vote].map((step, i) => (
            <Card as="li" key={step.title} className="flex flex-col gap-1.5 p-3.5">
              <span
                aria-hidden
                className="bg-ink-inset text-gold font-display border-line flex size-7 items-center justify-center rounded-sm border text-body font-bold tabular-nums"
              >
                {i + 1}
              </span>
              <span className="text-body text-paper font-semibold">{step.title}</span>
              <span className="text-body-sm text-muted">{step.body}</span>
            </Card>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-3" data-testid="home-modes">
        <div className="flex items-baseline justify-between gap-2">
          <SectionLabel>{t.homeModesLabel}</SectionLabel>
          <span className="text-label text-faint">{t.homeModesNote}</span>
        </div>

        {/* Same list the host picks from in the lobby — see src/lib/modes.ts. Two-up on a
            phone so all four are visible without scrolling past the fold. */}
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {MODES.map((m) => (
            <Card as="li" key={m.id} className="flex flex-col items-center gap-1 p-3 text-center">
              <span className="text-2xl" aria-hidden>
                {m.emoji}
              </span>
              <span className="text-body-sm text-paper font-semibold">{m.label}</span>
              <span className="text-label text-muted">{m.tagline}</span>
            </Card>
          ))}
        </ul>

        <HowToPlay
          trigger={
            <Button variant="secondary" block data-testid="home-how-to">
              <Glyph name="help" />
              {t.homeRulesCta}
            </Button>
          }
        />
      </section>

      <StageFooter>
        <Button size="lg" block loading={busy} onClick={go} data-testid="home-cta">
          {mode === "create" ? t.createGame : t.joinGame}
        </Button>
      </StageFooter>
    </Stage>
  );
}
