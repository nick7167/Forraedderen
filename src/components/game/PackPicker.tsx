import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Dialog } from "@/ui/Dialog";
import { Button, Spinner } from "@/ui/Button";
import { Input, Textarea, Field } from "@/ui/Input";
import { Empty } from "@/ui/Surface";
import { Glyph } from "@/ui/Glyph";
import { cn } from "@/lib/utils";
import { t } from "@/lib/strings";
import { toast } from "sonner";

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
    // Mirrors the server-side cap in convex/packs.ts — tell the player rather
    // than silently truncating their word.
    if (words.some((w) => w.word.length > 24)) {
      return toast.error("Ord må højst være 24 tegn.");
    }
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
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      title={creating ? "Ny pakke" : t.choosePack}
      className="max-w-lg"
      testId="pack-picker"
    >
      <div className="mt-4">
        {creating ? (
          <div className="flex flex-col gap-4">
            <Field label="Navn" htmlFor="pack-name">
              <Input
                id="pack-name"
                value={packName}
                maxLength={40}
                placeholder="Vores pakke"
                data-testid="pack-name"
                onChange={(e) => setPackName(e.target.value)}
              />
            </Field>
            <Field label="Ord (ét pr. linje)" htmlFor="pack-words">
              <Textarea
                id="pack-words"
                value={wordsText}
                onChange={(e) => setWordsText(e.target.value)}
                rows={7}
                data-testid="pack-words"
                placeholder={"Æble\nBanan\nKiwi"}
              />
            </Field>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setCreating(false)}
                data-testid="pack-back"
              >
                {t.back}
              </Button>
              <Button
                className="flex-1"
                onClick={handleCreate}
                loading={busy}
                data-testid="pack-create"
              >
                {t.create}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Søg kategori…"
              aria-label="Søg kategori"
              data-testid="pack-search"
              prefix={<Glyph name="search" />}
            />

            <div className="no-scrollbar max-h-[45dvh] min-h-0 overflow-y-auto">
              {packs === undefined ? (
                <div className="text-muted flex justify-center py-8">
                  <Spinner className="size-5" />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
                    <div className="sm:col-span-2">
                      <Empty title={`Ingen kategorier matcher "${query}".`} />
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button
              variant="secondary"
              block
              onClick={() => setCreating(true)}
              data-testid="pack-create-open"
            >
              <Glyph name="plus" /> Lav egen pakke
            </Button>
          </div>
        )}
      </div>
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
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      data-testid="pack-card"
      className={cn(
        "relative flex items-center gap-2.5 rounded-md border p-3 text-left transition-colors",
        selected ? "border-gold bg-ink-600" : "border-line bg-ink-700 hover:bg-ink-600",
      )}
    >
      <span className="bg-ink-inset flex size-10 shrink-0 items-center justify-center rounded-sm text-xl">
        {emoji}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body text-paper truncate font-semibold">{name}</p>
        <p className="text-label text-muted truncate">{sub}</p>
      </div>
      {selected && (
        <span className="bg-gold text-ink-900 absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full text-[10px]">
          <Glyph name="check" />
        </span>
      )}
    </button>
  );
}
