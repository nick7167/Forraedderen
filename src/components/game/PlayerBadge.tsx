import { cn } from "@/lib/utils";

export function Avatar({
  emoji,
  color,
  size = 40,
  dimmed = false,
  ring = false,
}: {
  emoji: string;
  color: string;
  size?: number;
  dimmed?: boolean;
  ring?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full transition-all",
        dimmed && "opacity-40 grayscale",
        ring && "ring-3 ring-offset-2 ring-offset-background",
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: size * 0.55,
        // @ts-expect-error CSS var for ring color
        "--tw-ring-color": color,
      }}
    >
      <span>{emoji}</span>
    </div>
  );
}
