import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { t } from "@/lib/strings";
import { toast } from "sonner";
import { Check, Plus, Loader2, Search } from "lucide-react";

export function PackPicker({
  open,
  onOpenChange,
  selectedPackId,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  selectedPackId?: Id<"packs">;
  onSelect: (id: Id<"packs"> | undefined) => void;
}) {
  const packs = useQuery(api.packs.listPacks);
  const createPack = useMutation(api.packs.createCustomPack);

  const [creating, setCreating] = useState(false);
  const [packName, setPackName] = useState("");
  const [wordsText, setWordsText] = useState("");
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = (packs ?? []).filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const showRandom = query.trim().length === 0;

  async function handleCreate() {
    const words = wordsText
      .split(/[\n,]/)
      .map((w) => ({ word: w.trim() }))
      .filter((w) => w.word.length > 0);
    if (words.length < 3) return toast.error("Mindst 3 ord.");
    setBusy(true);
    try {
      const id = await createPack({ name: packName, words });
      onSelect(id);
      toast.success("Pakke oprettet");
      setCreating(false);
      setPackName("");
      setWordsText("");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fejl");
    } finally {
      setBusy(false);
    }
  }

  function choose(id: Id<"packs"> | undefined) {
    onSelect(id);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85dvh] flex-col gap-0 p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>{creating ? "Ny pakke" : t.choosePack}</DialogTitle>
        </DialogHeader>

        {creating ? (
          <div className="space-y-3 px-5 pb-5 pt-3">
            <div>
              <Label className="mb-1.5 block">Navn</Label>
              <Input
                value={packName}
                maxLength={40}
                placeholder="Vores pakke"
                onChange={(e) => setPackName(e.target.value)}
                className="glass-input border-0"
              />
            </div>
            <div>
              <Label className="mb-1.5 block">Ord (ét pr. linje)</Label>
              <textarea
                value={wordsText}
                onChange={(e) => setWordsText(e.target.value)}
                rows={7}
                placeholder={"Æble\nBanan\nKiwi"}
                className="glass-input no-scrollbar w-full resize-none rounded-xl p-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setCreating(false)}>
                {t.back}
              </Button>
              <Button className="flex-1" onClick={handleCreate} disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : t.create}
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Search */}
            <div className="px-5 pt-3">
              <div className="glass-input flex items-center gap-2 rounded-xl px-3">
                <Search className="size-4 shrink-0 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Søg kategori…"
                  className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Scrollable grid */}
            <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-3">
              {packs === undefined ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  {showRandom && (
                    <PackCard
                      emoji="🎲"
                      name={t.randomCategoryOption}
                      sub={t.randomCategoryNote}
                      selected={selectedPackId === undefined}
                      onClick={() => choose(undefined)}
                    />
                  )}
                  {filtered.map((p) => (
                    <PackCard
                      key={p._id}
                      emoji={p.emoji}
                      name={p.name}
                      sub={`${p.wordCount} ord${p.isMine ? " · egen" : ""}`}
                      selected={selectedPackId === p._id}
                      onClick={() => choose(p._id)}
                    />
                  ))}
                  {filtered.length === 0 && !showRandom && (
                    <p className="col-span-2 py-6 text-center text-sm text-muted-foreground">
                      Ingen kategorier matcher "{query}".
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 pb-5 pt-1">
              <Button variant="outline" className="w-full" onClick={() => setCreating(true)}>
                <Plus className="size-4" /> Lav egen pakke
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PackCard({
  emoji,
  name,
  sub,
  selected,
  onClick,
}: {
  emoji: string;
  name: string;
  sub: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "glass relative flex items-center gap-2.5 rounded-2xl p-3 text-left transition-all active:scale-95",
        selected && "glow-ring ring-2 ring-primary",
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-xl">
        {emoji}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{sub}</p>
      </div>
      {selected && (
        <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-white">
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      )}
    </button>
  );
}
