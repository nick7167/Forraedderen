import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Label } from "@/components/ui/label";
import { PackPicker } from "./PackPicker";
import { cn } from "@/lib/utils";
import { t } from "@/lib/strings";
import { ChevronRight, Minus, Plus } from "lucide-react";
import type { Doc } from "../../../convex/_generated/dataModel";

type Settings = Doc<"rooms">["settings"];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  );
}

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
    <div className="flex items-center gap-3">
      <button
        className="glass flex size-9 items-center justify-center rounded-full text-foreground disabled:opacity-30 active:scale-90"
        disabled={disabled || value <= min}
        onClick={() => onChange(value - 1)}
        aria-label="−"
      >
        <Minus className="size-4" />
      </button>
      <span className="w-6 text-center text-lg font-bold tabular-nums">{value}</span>
      <button
        className="gradient-primary glow-primary flex size-9 items-center justify-center rounded-full text-white disabled:opacity-30 active:scale-90"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        aria-label="+"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

function Toggle({
  value,
  onChange,
  disabled,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!value)}
      className={cn(
        "relative h-7 w-12 rounded-full transition-colors disabled:opacity-50",
        value ? "gradient-primary glow-primary" : "bg-white/15",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow transition-transform",
          value && "translate-x-5",
        )}
      />
    </button>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <Label className="text-[15px] font-medium">{label}</Label>
      {children}
    </div>
  );
}

const MODES = [
  { id: "spy", emoji: "🦎", label: t.modeSpy, tagline: "Spot løgneren" },
  { id: "undercover", emoji: "🎭", label: t.modeUndercover, tagline: "Falsk identitet" },
  { id: "questions", emoji: "❓", label: t.modeQuestions, tagline: "Find det skæve svar" },
  { id: "scale", emoji: "📊", label: t.modeScale, tagline: "Hvem passer ikke ind?" },
] as const;

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
    <div className="space-y-5">
      {/* Game mode */}
      <section className="space-y-2">
        <SectionLabel>{t.mode}</SectionLabel>
        <div className="grid grid-cols-2 gap-2.5">
          {MODES.map((m) => {
            const active = settings.gameMode === m.id;
            return (
              <button
                key={m.id}
                disabled={!editable}
                onClick={() => set("gameMode", m.id)}
                className={cn("p-mode-card rounded-2xl", active && "active")}
                style={{
                  textAlign: "left",
                  padding: "15px 13px",
                  border: active ? "2px solid rgba(167,139,250,0.5)" : "2px solid rgba(255,255,255,0.07)",
                  background: active ? "rgba(124,58,237,0.14)" : "rgba(255,255,255,0.04)",
                  boxShadow: active ? "0 0 22px rgba(124,58,237,0.14), 0 0 0 1px rgba(167,139,250,0.18) inset" : "none",
                  transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
                  cursor: editable ? "pointer" : "default",
                }}
              >
                <span style={{ fontSize: 26, display: "block", marginBottom: 8 }}>{m.emoji}</span>
                <span
                  className="p-mode-name"
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 700,
                    marginBottom: 3,
                    color: active ? "#c4b5fd" : "rgba(245,243,255,0.85)",
                  }}
                >
                  {m.label}
                </span>
                <span
                  className="p-mode-tagline"
                  style={{
                    display: "block",
                    fontSize: 11,
                    lineHeight: 1.4,
                    color: active ? "rgba(196,181,253,0.65)" : "rgba(245,243,255,0.38)",
                  }}
                >
                  {m.tagline}
                </span>
              </button>
            );
          })}
        </div>
        {/* Mode description box */}
        <div style={{
          padding: "13px 15px",
          borderRadius: 15,
          background: "rgba(124,58,237,0.07)",
          border: "1px solid rgba(167,139,250,0.13)",
          fontSize: 13,
          color: "rgba(245,243,255,0.6)",
          lineHeight: 1.55,
        }}>
          {modeDesc}
        </div>
      </section>

      {/* Categories are not used by the prompt-based modes. */}
      {!isPromptMode && (
        <section className="space-y-2">
          <SectionLabel>{t.pack}</SectionLabel>
          <button
            onClick={editable ? () => setPackOpen(true) : undefined}
            disabled={!editable}
            className="glass flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all active:scale-[0.99]"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-2xl">
              {currentPack ? currentPack.emoji : "🎲"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">
                {currentPack ? currentPack.name : t.randomCategory}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {currentPack ? `${currentPack.wordCount} ord` : t.randomCategoryNote}
              </p>
            </div>
            {editable && <ChevronRight className="size-5 shrink-0 text-muted-foreground" />}
          </button>
        </section>
      )}

      {/* Round settings */}
      <section className="space-y-2">
        <SectionLabel>{t.settings}</SectionLabel>
        <div className="glass divide-y divide-white/5 rounded-2xl px-4">
          <Row label={t.imposters}>
            <Stepper
              value={settings.imposterCount}
              min={1}
              max={maxImposters}
              disabled={!editable}
              onChange={(v) => set("imposterCount", v)}
            />
          </Row>
          {!isPromptMode && (
            <Row label={t.cluePasses}>
              <Stepper
                value={settings.cluePasses}
                min={1}
                max={3}
                disabled={!editable}
                onChange={(v) => set("cluePasses", v)}
              />
            </Row>
          )}
          <Row label={t.roundCount}>
            <Stepper
              value={settings.roundCount}
              min={1}
              max={20}
              disabled={!editable}
              onChange={(v) => set("roundCount", v)}
            />
          </Row>
          {settings.gameMode === "spy" && (
            <Row label={t.impostersKnowEachOther}>
              <Toggle
                value={settings.impostersKnowEachOther}
                disabled={!editable}
                onChange={(v) => set("impostersKnowEachOther", v)}
              />
            </Row>
          )}
        </div>
      </section>

      <PackPicker
        open={packOpen}
        onOpenChange={setPackOpen}
        selectedPackId={settings.packId}
        onSelect={(id) => set("packId", id)}
      />
    </div>
  );
}
