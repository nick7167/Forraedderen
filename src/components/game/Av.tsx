import { cn } from "@/lib/utils";

/**
 * A player's avatar.
 *
 * The previous version was a translucent tinted disc with a soft border — the glass
 * language. In Pressing an avatar is a solid ink tile with the player's colour as a
 * hairline ring: opaque, blur-free, and the ring is the only place identity colour appears
 * at this size.
 *
 * `rounded-md` rather than a circle, so avatars sit on the same 12px radius as every other
 * surface. `you` swaps to the chamfered plate — the same shape Card `you` uses — because
 * "which one is me" has exactly one answer in this design and it is the struck corner.
 */
export type AvSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZES: Record<AvSize, string> = {
  xs: "size-6 text-[13px]",
  sm: "size-8 text-[17px]",
  md: "size-10 text-[21px]",
  lg: "size-14 text-[30px]",
  xl: "size-20 text-[44px]",
};

export function Av({
  emoji,
  color,
  size = "sm",
  dimmed = false,
  you = false,
  className,
  style,
}: {
  emoji: string;
  color: string;
  size?: AvSize;
  /** Absent or not-yet-ready. Dimmed rather than hidden — the seat still exists. */
  dimmed?: boolean;
  /** Draws the chamfered plate instead of the rounded tile. */
  you?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  if (you) {
    return (
      <div
        className={cn(
          "relative isolate flex shrink-0 items-center justify-center leading-none select-none",
          SIZES[size],
          dimmed && "opacity-40",
          className,
        )}
        style={style}
        aria-hidden
      >
        <span
          className="plate absolute inset-0 -z-10"
          style={{ backgroundColor: color, "--plate-cut": "6px" } as React.CSSProperties}
        />
        <span
          className="plate bg-ink-600 absolute inset-[1.5px] -z-10"
          style={{ "--plate-cut": "5px" } as React.CSSProperties}
        />
        {emoji}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-ink-600 flex shrink-0 items-center justify-center rounded-md leading-none select-none",
        SIZES[size],
        dimmed && "opacity-40",
        className,
      )}
      style={{ border: `1.5px solid ${color}`, ...style }}
      aria-hidden
    >
      {emoji}
    </div>
  );
}
