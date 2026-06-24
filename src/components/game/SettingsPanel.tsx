import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { t } from "@/lib/strings";
import type { Doc } from "../../../convex/_generated/dataModel";

type Settings = Doc<"rooms">["settings"];

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
    <div className="flex items-center gap-2">
      <Button
        size="icon"
        variant="outline"
        className="size-8"
        disabled={disabled || value <= min}
        onClick={() => onChange(value - 1)}
      >
        −
      </Button>
      <span className="w-6 text-center font-bold tabular-nums">{value}</span>
      <Button
        size="icon"
        variant="outline"
        className="size-8"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
      >
        +
      </Button>
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
        "relative h-6 w-11 rounded-full transition-colors disabled:opacity-50",
        value ? "bg-primary" : "bg-muted-foreground/30",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-transform",
          value && "translate-x-5",
        )}
      />
    </button>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  );
}

export function SettingsPanel({
  settings,
  playerCount,
  editable,
  onChange,
  onPickPack,
}: {
  settings: Settings;
  playerCount: number;
  editable: boolean;
  onChange: (s: Settings) => void;
  onPickPack: () => void;
}) {
  const packs = useQuery(api.packs.listPacks);
  const currentPack = packs?.find((p) => p._id === settings.packId);
  const maxImposters = Math.max(1, playerCount - 2);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    onChange({ ...settings, [key]: value });

  return (
    <div className="divide-y rounded-xl border bg-card px-4">
      <button
        onClick={editable ? onPickPack : undefined}
        disabled={!editable}
        className="flex w-full items-center justify-between py-3 text-left"
      >
        <Label className="text-sm">{t.pack}</Label>
        <span className="text-sm font-semibold">
          {currentPack ? `${currentPack.emoji} ${currentPack.name}` : t.choosePack}
        </span>
      </button>
      <div className="py-2">
        <Row label={t.imposters}>
          <Stepper
            value={settings.imposterCount}
            min={1}
            max={maxImposters}
            disabled={!editable}
            onChange={(v) => set("imposterCount", v)}
          />
        </Row>
        <Row label={t.cluePasses}>
          <Stepper
            value={settings.cluePasses}
            min={1}
            max={3}
            disabled={!editable}
            onChange={(v) => set("cluePasses", v)}
          />
        </Row>
        <Row label={t.roundCount}>
          <Stepper
            value={settings.roundCount}
            min={1}
            max={20}
            disabled={!editable}
            onChange={(v) => set("roundCount", v)}
          />
        </Row>
        <Row label={t.imposterSeesCategory}>
          <Toggle
            value={settings.imposterSeesCategory}
            disabled={!editable}
            onChange={(v) => set("imposterSeesCategory", v)}
          />
        </Row>
        <Row label={t.impostersKnowEachOther}>
          <Toggle
            value={settings.impostersKnowEachOther}
            disabled={!editable}
            onChange={(v) => set("impostersKnowEachOther", v)}
          />
        </Row>
        <Row label={t.timers}>
          <Toggle
            value={settings.timersEnabled}
            disabled={!editable}
            onChange={(v) => set("timersEnabled", v)}
          />
        </Row>
      </div>
    </div>
  );
}
