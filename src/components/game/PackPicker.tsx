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
import { Check, Plus, Loader2 } from "lucide-react";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{creating ? "Ny pakke" : t.choosePack}</DialogTitle>
        </DialogHeader>

        {creating ? (
          <div className="space-y-3">
            <div>
              <Label className="mb-1.5 block">Navn</Label>
              <Input
                value={packName}
                maxLength={40}
                placeholder="Vores pakke"
                onChange={(e) => setPackName(e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-1.5 block">Ord (ét pr. linje)</Label>
              <textarea
                value={wordsText}
                onChange={(e) => setWordsText(e.target.value)}
                rows={8}
                placeholder={"Æble\nBanan\nKiwi"}
                className="w-full resize-none rounded-md border bg-transparent p-2 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setCreating(false)}>
                {t.back}
              </Button>
              <Button className="flex-1" onClick={handleCreate} disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : t.create}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {packs === undefined ? (
              <div className="flex justify-center py-6">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onSelect(undefined);
                    onOpenChange(false);
                  }}
                  className={cn(
                    "glass relative flex flex-col items-start rounded-2xl p-3 text-left transition-all active:scale-95",
                    selectedPackId === undefined && "ring-2 ring-primary glow-ring",
                  )}
                >
                  {selectedPackId === undefined && (
                    <Check className="absolute top-2 right-2 size-4 text-primary" />
                  )}
                  <span className="text-2xl">🎲</span>
                  <span className="mt-1 text-sm font-semibold">{t.randomCategoryOption}</span>
                  <span className="text-xs text-muted-foreground">Skifter hver runde</span>
                </button>
                {packs.map((p) => (
                  <button
                    key={p._id}
                    onClick={() => {
                      onSelect(p._id);
                      onOpenChange(false);
                    }}
                    className={cn(
                      "glass relative flex flex-col items-start rounded-2xl p-3 text-left transition-all active:scale-95",
                      selectedPackId === p._id && "ring-2 ring-primary glow-ring",
                    )}
                  >
                    {selectedPackId === p._id && (
                      <Check className="absolute top-2 right-2 size-4 text-primary" />
                    )}
                    <span className="text-2xl">{p.emoji}</span>
                    <span className="mt-1 text-sm font-semibold">{p.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {p.wordCount} ord{p.isMine ? " · egen" : ""}
                    </span>
                  </button>
                ))}
              </div>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setCreating(true)}
            >
              <Plus className="size-4" /> Lav egen pakke
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
