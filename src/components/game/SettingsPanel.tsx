import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { PackPicker } from "./PackPicker";
import { cn } from "@/lib/utils";
import { t } from "@/lib/strings";
import { Button } from "@/ui/Button";
import { Glyph } from "@/ui/Glyph";
import { MODES } from "@/lib/modes";
import type { Doc } from "../../../convex/_generated/dataModel";

type Settings = Doc<"rooms">["settings"];

/**
 * Host settings, in a bottom sheet.
 *
 * Mode cards go four-up from `sm`. The steppers and the toggle are ordinary controls now
 * rather than bespoke `.step-btn` / `.c-switch` shapes.
 */


function Stepper({
  value,
  min,
  max,
  onChange,
  disabled,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  const step =
    "bg-ink-600 text-paper border-line-strong flex size-9 shrink-0 items-center justify-center " +
    "rounded-sm border text-lg transition-colors hover:bg-ink-500 disabled:opacity-35 " +
    "disabled:pointer-events-none";

  return (
    <div className="flex shrink-0 items-center gap-1.5" data-testid="stepper">
      <button
        type="button"
        className={step}
        data-testid="step-down"
        disabled={disabled || value <= min}
        onClick={() => onChange(value - 1)}
        aria-label="−"
      >
        <Glyph name="minus" />
      </button>
      <span
        data-testid="step-val"
        className="font-display text-numeral text-paper w-7 text-center font-bold tabular-nums"
      >
        {value}
      </span>
      <button
        type="button"
        className={step}
        data-testid="step-up"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        aria-label="+"
      >
        <Glyph name="plus" />
      </button>
    </div>
  );
}

function Toggle({
  value,
  onChange,
  disabled,
  label,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label}
      disabled={disabled}
      data-on={value}
      data-testid="toggle"
      onClick={() => onChange(!value)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full border transition-colors disabled:opacity-50",
        value ? "bg-teal border-teal" : "bg-ink-inset border-line-strong",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-0.5 size-4.5 rounded-full transition-[left]",
          value ? "bg-ink-900 left-[calc(100%-1.25rem)]" : "bg-line-strong left-0.5",
        )}
      />
    </button>
  );
}

function SettingRow({
  label,
  sub,
  children,
}: {
  label: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="border-line flex items-center justify-between gap-3 border-b py-3 last:border-b-0"
      data-testid="setting-row"
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-body text-paper font-semibold" data-testid="sr-label">
          {label}
        </span>
        {sub && <span className="text-body-sm text-muted">{sub}</span>}
      </div>
      {children}
    </div>
  );
}

export function SettingsPanel({
  settings,
  playerCount,
  editable,
  onChange,
}: {
  settings: Settings;
  playerCount: number;
  editable: boolean;
  onChange: (s: Settings) => void;
}) {
  const packs = useQuery(api.packs.listPacks);
  const [packOpen, setPackOpen] = useState(false);
  const maxImposters = Math.max(1, playerCount - 2);

  /**
   * Optimistic settings.
   *
   * Each edit used to be built from the `settings` prop — `onChange({ ...settings, [key]: v })`
   * — which is a lost-update race. The prop only refreshes once the Convex mutation has
   * round-tripped, so two taps inside that window both branch off the same stale snapshot
   * and the second silently reverts the first. Switching game mode and then immediately
   * changing the round count put the mode back.
   *
   * So edits compose against the local copy, and the local copy is dropped as soon as the
   * server sends a genuinely different value. Compared by value rather than identity
   * because Convex hands back a fresh object on every push.
   */
  const settingsKey = JSON.stringify(settings);
  const [seenKey, setSeenKey] = useState(settingsKey);
  const [optimistic, setOptimistic] = useState<Settings | null>(null);
  if (settingsKey !== seenKey) {
    setSeenKey(settingsKey);
    setOptimistic(null);
  }
  const current = optimistic ?? settings;

  const currentPack = packs?.find((p) => p._id === current.packId);
  const isPromptMode = current.gameMode === "questions" || current.gameMode === "scale";

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const next = { ...current, [key]: value };
    setOptimistic(next);
    onChange(next);
  };

  const modeDesc =
    current.gameMode === "spy"
      ? t.modeSpyDesc
      : current.gameMode === "undercover"
        ? t.modeUndercoverDesc
        : current.gameMode === "questions"
          ? t.modeQuestionsDesc
          : t.modeScaleDesc;

  return (
    <div
      className="no-scrollbar pb-safe flex flex-col gap-1 overflow-y-auto px-4 pb-6"
      data-testid="settings-panel"
    >
      <p className="font-display text-display-2 text-paper pb-2 font-extrabold">{t.settings}</p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            disabled={!editable}
            onClick={() => set("gameMode", m.id)}
            aria-pressed={current.gameMode === m.id}
            data-testid="mode-card"
            className={cn(
              "flex flex-col items-center gap-1 rounded-md border px-2 py-3 text-center transition-colors",
              current.gameMode === m.id
                ? "border-gold bg-ink-600"
                : "border-line bg-ink-700 hover:bg-ink-600",
              !editable && "opacity-50",
            )}
          >
            <span className="text-2xl" aria-hidden>
              {m.emoji}
            </span>
            <span className="text-body-sm text-paper font-semibold">{m.label}</span>
            <span className="text-label text-muted">{m.tagline}</span>
          </button>
        ))}
      </div>

      <p className="bg-ink-inset border-line text-body-sm text-secondary my-3 rounded-md border px-3 py-2.5">
        {modeDesc}
      </p>

      <SettingRow label={t.roundCount} sub={t.roundCountSub}>
        <Stepper
          value={current.roundCount}
          min={1}
          max={20}
          disabled={!editable}
          onChange={(v) => set("roundCount", v)}
        />
      </SettingRow>

      <SettingRow label={t.imposters} sub={t.impostersSub}>
        <Stepper
          value={current.imposterCount}
          min={1}
          max={maxImposters}
          disabled={!editable}
          onChange={(v) => set("imposterCount", v)}
        />
      </SettingRow>

      {!isPromptMode && (
        <SettingRow label={t.cluePasses} sub={t.cluePassesSub}>
          <Stepper
            value={current.cluePasses}
            min={1}
            max={3}
            disabled={!editable}
            onChange={(v) => set("cluePasses", v)}
          />
        </SettingRow>
      )}

      {/* Spy-mode-only rules. Both are honoured by the engine and snapshotted
          per round; `imposterSeesCategory` had no control at all for a while,
          leaving every room stuck on the default. */}
      {current.gameMode === "spy" && (
        <>
          <SettingRow label={t.imposterSeesCategory} sub={t.imposterSeesCategorySub}>
            <Toggle
              label={t.imposterSeesCategory}
              value={current.imposterSeesCategory}
              disabled={!editable}
              onChange={(v) => set("imposterSeesCategory", v)}
            />
          </SettingRow>
          <SettingRow
            label={t.impostersKnowEachOther}
            sub={t.impostersKnowEachOtherSub}
          >
            <Toggle
              label={t.impostersKnowEachOther}
              value={current.impostersKnowEachOther}
              disabled={!editable}
              onChange={(v) => set("impostersKnowEachOther", v)}
            />
          </SettingRow>
        </>
      )}

      {/* Categories are not used by the prompt-based modes. */}
      {!isPromptMode && (
        <SettingRow
          label={t.pack}
          sub={
            currentPack
              ? `${currentPack.emoji} ${currentPack.name} · ${currentPack.wordCount} ord`
              : t.randomCategoryOption
          }
        >
          <Button
            variant="secondary"
            size="sm"
            disabled={!editable}
            onClick={() => setPackOpen(true)}
            data-testid="change-pack"
          >
            {t.changePack}
          </Button>
        </SettingRow>
      )}

      <PackPicker
        open={packOpen}
        onOpenChange={setPackOpen}
        selectedPackId={current.packId}
        onSelect={(id) => set("packId", id)}
      />
    </div>
  );
}
