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
        className="flex size-8 items-center justify-center rounded-full bg-secondary text-foreground disabled:opacity-40 active:scale-90"
        disabled={disabled || value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Minus className="size-4" />
      </button>
      <span className="w-5 text-center text-lg font-bold tabular-nums">{value}</span>
      <button
        className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40 active:scale-90"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
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
        value ? "bg-primary" : "bg-white/15",
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
    <div className="flex items-center justify-between py-3">
      <Label className="text-[15px] font-medium">{label}</Label>
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

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    onChange({ ...settings, [key]: value });

  return (
    <div className="glass divide-y divide-border rounded-3xl px-4">
      <button
        onClick={editable ? () => setPackOpen(true) : undefined}
        disabled={!editable}
        className="flex w-full items-center justify-between py-3.5 text-left"
      >
        <Label className="text-[15px] font-medium">{t.pack}</Label>
        <span className="flex items-center gap-1 font-semibold">
          {currentPack ? `${currentPack.emoji} ${currentPack.name}` : t.choosePack}
          {editable && <ChevronRight className="size-4 text-muted-foreground" />}
        </span>
      </button>

      <Row label={t.imposters}>
        <Stepper value={settings.imposterCount} min={1} max={maxImposters}
          disabled={!editable} onChange={(v) => set("imposterCount", v)} />
      </Row>
      <Row label={t.cluePasses}>
        <Stepper value={settings.cluePasses} min={1} max={3}
          disabled={!editable} onChange={(v) => set("cluePasses", v)} />
      </Row>
      <Row label={t.roundCount}>
        <Stepper value={settings.roundCount} min={1} max={20}
          disabled={!editable} onChange={(v) => set("roundCount", v)} />
      </Row>
      <Row label={t.imposterSeesCategory}>
        <Toggle value={settings.imposterSeesCategory}
          disabled={!editable} onChange={(v) => set("imposterSeesCategory", v)} />
      </Row>
      <Row label={t.impostersKnowEachOther}>
        <Toggle value={settings.impostersKnowEachOther}
          disabled={!editable} onChange={(v) => set("impostersKnowEachOther", v)} />
      </Row>
      <Row label={t.timers}>
        <Toggle value={settings.timersEnabled}
          disabled={!editable} onChange={(v) => set("timersEnabled", v)} />
      </Row>

      <PackPicker
        open={packOpen}
        onOpenChange={setPackOpen}
        selectedPackId={settings.packId}
        onSelect={(id) => set("packId", id)}
      />
    </div>
  );
}
