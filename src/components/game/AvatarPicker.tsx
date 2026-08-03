import { AVATAR_EMOJIS, AVATAR_COLORS } from "@/lib/avatars";
import { cn } from "@/lib/utils";
import { SectionLabel } from "@/ui/Surface";

/**
 * Emoji + colour picker.
 *
 * Selection is a solid `line-strong`→`paper` border swap rather than a glow ring: the ring
 * was the only place in the app using `--glow-ring`, and a 3:1 border is both legible and
 * consistent with every other selected state here.
 */
export function AvatarPicker({
  emoji,
  color,
  onEmoji,
  onColor,
}: {
  emoji: string;
  color: string;
  onEmoji: (e: string) => void;
  onColor: (c: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <SectionLabel>Figur</SectionLabel>
        <div className="grid grid-cols-6 gap-2">
          {AVATAR_EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => onEmoji(e)}
              aria-pressed={emoji === e}
              data-testid="avatar-emoji"
              className={cn(
                "bg-ink-700 flex aspect-square items-center justify-center rounded-md border text-2xl transition-colors",
                emoji === e ? "border-paper bg-ink-600" : "border-line hover:bg-ink-600",
              )}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel>Farve</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {AVATAR_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onColor(c)}
              aria-pressed={color === c}
              aria-label={`Farve ${c}`}
              data-testid="avatar-color"
              style={{ backgroundColor: c }}
              className={cn(
                "size-9 rounded-md transition-[box-shadow]",
                color === c && "shadow-[0_0_0_2px_var(--color-ink-800),0_0_0_4px_var(--color-paper)]",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
