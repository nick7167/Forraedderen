import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { PackPicker } from "./PackPicker";
import { cn } from "@/lib/utils";
import { t } from "@/lib/strings";
import type { Doc } from "../../../convex/_generated/dataModel";

type Settings = Doc<"rooms">["settings"];

/**
 * Settings — concept screen 3 (`.settings-drawer`).
 *
 * Renders the concept drawer body: handle → title → 2×2 `.mode-cards` →
 * `.mode-desc-box` → a stack of `.setting-row`s. Mount inside a DrawerContent
 * carrying `c-drawer-shell` so this is the only visible surface.
 */

/** Mode icons and taglines are the concept's verbatim (screen 3). */
const MODES = [
  { id: "spy", emoji: "🕵️", label: t.modeSpy, tagline: t.modeSpyTag },
  { id: "undercover", emoji: "🦎", label: t.modeUndercover, tagline: t.modeUndercoverTag },
  { id: "questions", emoji: "❓", label: t.modeQuestions, tagline: t.modeQuestionsTag },
  { id: "scale", emoji: "📊", label: t.modeScale, tagline: t.modeScaleTag },
] as const;

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
  return (
    <div className="stepper">
      <button
        className="step-btn"
        disabled={disabled || value <= min}
        onClick={() => onChange(value - 1)}
        aria-label="−"
      >
        −
      </button>
      <div className="step-val tabular-nums">{value}</div>
      <button
        className="step-btn"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        aria-label="+"
      >
        +
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
      onClick={() => onChange(!value)}
      className="c-switch disabled:opacity-50"
    />
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
    <div className="setting-row">
      <div>
        <div className="sr-label">{label}</div>
        {sub && <div className="sr-sub">{sub}</div>}
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
  const currentPack = packs?.find((p) => p._id === settings.packId);
  const [packOpen, setPackOpen] = useState(false);
  const maxImposters = Math.max(1, playerCount - 2);
  const isPromptMode =
    settings.gameMode === "questions" || settings.gameMode === "scale";

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    onChange({ ...settings, [key]: value });

  const modeDesc =
    settings.gameMode === "spy"
      ? t.modeSpyDesc
      : settings.gameMode === "undercover"
        ? t.modeUndercoverDesc
        : settings.gameMode === "questions"
          ? t.modeQuestionsDesc
          : t.modeScaleDesc;

  return (
    <div className="settings-drawer">
      <div className="drawer-handle" />
      <div className="drawer-title">{t.settings}</div>

      <div className="mode-cards">
        {MODES.map((m) => (
          <button
            key={m.id}
            disabled={!editable}
            onClick={() => set("gameMode", m.id)}
            className={cn("mode-card", settings.gameMode === m.id && "active")}
          >
            <span className="mode-icon" aria-hidden>
              {m.emoji}
            </span>
            <div className="mode-name">{m.label}</div>
            <div className="mode-tagline">{m.tagline}</div>
          </button>
        ))}
      </div>

      <div className="mode-desc-box">{modeDesc}</div>

      <SettingRow label={t.roundCount} sub={t.roundCountSub}>
        <Stepper
          value={settings.roundCount}
          min={1}
          max={20}
          disabled={!editable}
          onChange={(v) => set("roundCount", v)}
        />
      </SettingRow>

      <SettingRow label={t.imposters} sub={t.impostersSub}>
        <Stepper
          value={settings.imposterCount}
          min={1}
          max={maxImposters}
          disabled={!editable}
          onChange={(v) => set("imposterCount", v)}
        />
      </SettingRow>

      {!isPromptMode && (
        <SettingRow label={t.cluePasses} sub={t.cluePassesSub}>
          <Stepper
            value={settings.cluePasses}
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
      {settings.gameMode === "spy" && (
        <>
          <SettingRow label={t.imposterSeesCategory} sub={t.imposterSeesCategorySub}>
            <Toggle
              label={t.imposterSeesCategory}
              value={settings.imposterSeesCategory}
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
              value={settings.impostersKnowEachOther}
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
          <button
            className="btn-ghost shrink-0"
            disabled={!editable}
            onClick={() => setPackOpen(true)}
          >
            {t.changePack}
          </button>
        </SettingRow>
      )}

      <PackPicker
        open={packOpen}
        onOpenChange={setPackOpen}
        selectedPackId={settings.packId}
        onSelect={(id) => set("packId", id)}
      />
    </div>
  );
}
