import { cn } from "@/lib/utils";

/**
 * The concept's `.av` avatar (ui-concepts/kamaeleon-polish-concepts.html).
 *
 * Every avatar in the concept is a tinted translucent disc with a matching
 * 1.5px border — never a solid fill:
 *
 *   background: rgba(124,58,237,.22); border: 1.5px solid rgba(196,181,253,.3)
 *
 * Players carry a solid hex `color`, so the tint and border are derived from it
 * at the concept's alphas. Sizes are the concept's `.av-xs/sm/md/lg/xl`.
 */
export type AvSize = "xs" | "sm" | "md" | "lg" | "xl";

/** Concept tint alpha (.22) and border alpha (.30) as hex suffixes. */
const TINT = "38";
const EDGE = "4d";

export function Av({
  emoji,
  color,
  size = "sm",
  dimmed = false,
  className,
  style,
}: {
  emoji: string;
  color: string;
  size?: AvSize;
  /** Pending/inactive treatment — the concept uses opacity .4. */
  dimmed?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn("av", `av-${size}`, className)}
      style={{
        background: `${color}${TINT}`,
        border: `1.5px solid ${color}${EDGE}`,
        ...(dimmed ? { opacity: 0.4 } : null),
        ...style,
      }}
      aria-hidden
    >
      {emoji}
    </div>
  );
}
