import { AVATAR_EMOJIS, AVATAR_COLORS } from "@/lib/avatars";
import { cn } from "@/lib/utils";

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
    <div className="space-y-3">
      <div className="grid grid-cols-6 gap-2">
        {AVATAR_EMOJIS.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => onEmoji(e)}
            className={cn(
              "glass flex aspect-square items-center justify-center rounded-2xl text-2xl transition-all active:scale-95",
              emoji === e && "ring-2 ring-primary scale-105",
            )}
          >
            {e}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {AVATAR_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onColor(c)}
            style={
              { backgroundColor: c, "--tw-ring-color": c } as React.CSSProperties
            }
            className={cn(
              "size-8 rounded-full transition-all",
              color === c
                ? "ring-3 ring-offset-2 ring-offset-background scale-110"
                : "opacity-80 hover:opacity-100",
            )}
          />
        ))}
      </div>
    </div>
  );
}
