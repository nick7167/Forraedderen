import type { ReactNode } from "react";

/**
 * Surfaces, chips and meters.
 *
 * Ported from SnapArena. These replace the copy-paste the previous build had accumulated:
 * `.c-glass`, `.glass-deep`, `.identity-card`, `.player-card`, `.mode-card`,
 * `.room-code-card`, `.stat-chip`, `.host-badge`, `.bot-badge`, `.count-badge` and
 * `.phase-badge` were eleven separately hand-tuned takes on two ideas.
 */

/**
 * A raised panel. The default container for anything grouped.
 *
 * `variant` and `you` are deliberately separate axes:
 *
 *   variant="hero"   importance. A brighter surface and a 1px top sheen.
 *   you              identity. The struck plate — the app's brand geometry.
 *
 * `you` wins outright rather than composing with `variant`. The sheen is a hairline along
 * a rectangular top edge, and the plate's visible surface is not rectangular — drawing
 * both puts a lit stub outside the chamfer at each cut corner. No surface in this app
 * needs to be simultaneously the most important thing on screen and the row that is you.
 *
 * In Kamæleon `you` marks your own row in the lobby roster, the vote grid and the
 * scoreboard. It is the single highest-value borrow from SnapArena: "which one am I" is
 * asked constantly in a game where everyone is staring at the same list of names.
 */
export function Card({
  children,
  className = "",
  variant = "default",
  /**
   * "This one is you." Draws the chamfered plate with a hairline in `accent`, which
   * should be the player's own avatar colour — so your row is marked in your colour.
   */
  you = false,
  accent,
  as: Tag = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  variant?: "default" | "hero";
  you?: boolean;
  accent?: string;
  as?: "div" | "section" | "li" | "article";
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">) {
  /**
   * The plate is drawn as two stacked fills rather than a clip on a bordered box,
   * because `clip-path` cuts the border away at the two chamfers and leaves the corners
   * hanging open. Fill, inset by a hairline, fill again.
   */
  if (you) {
    return (
      /**
       * `isolate` is load-bearing. The two fills are positioned and the content is not,
       * and a positioned element paints above static in-flow content regardless of DOM
       * order — so without a stacking context here the plate covers the row. Isolating
       * lets the fills sit at -z-10 behind the content without falling behind the page.
       *
       * The caller's className still lands on this element, so every existing layout
       * class (padding, flex, gap) keeps working and children stay direct flex items.
       */
      <Tag className={`relative isolate ${className}`} {...rest}>
        <span
          aria-hidden="true"
          className="plate absolute inset-0 -z-10"
          style={{ backgroundColor: accent ?? "var(--color-line-strong)" }}
        />
        <span aria-hidden="true" className="plate bg-ink-600 absolute inset-[1.5px] -z-10" />
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      className={`rounded-md border ${
        variant === "hero" ? "bg-ink-700 border-line-strong sheen" : "bg-ink-700 border-line"
      } ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Section heading. The only place uppercase tracking is used. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-label text-muted font-semibold tracking-[0.12em] uppercase">
      {children}
    </h2>
  );
}

export type ChipTone = "neutral" | "gold" | "signal" | "teal" | "paper";

const CHIP_TONES: Record<ChipTone, string> = {
  neutral: "bg-ink-600 text-secondary",
  gold: "bg-gold text-ink-900",
  signal: "bg-signal text-paper",
  teal: "bg-teal text-ink-900",
  // Pure paper is reserved for the match winner. Nothing else in the app is this bright,
  // which is what makes the final scoreboard unmistakable at a glance.
  paper: "bg-paper text-ink-900",
};

export function Chip({
  children,
  tone = "neutral",
  size = "md",
  className = "",
  title,
  ...rest
}: {
  children: ReactNode;
  tone?: ChipTone;
  size?: "sm" | "md";
  className?: string;
  title?: string;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "className" | "children" | "title">) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 rounded-xs font-semibold whitespace-nowrap
                  ${CHIP_TONES[tone]}
                  ${size === "sm" ? "text-label px-1.5 py-0.5" : "text-body-sm px-2 py-1"}
                  ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}

/**
 * Progress meter.
 *
 * One implementation for the ready count, the clue progress and the vote tally. `tone` is
 * passed rather than derived so the caller owns the meaning, and the meter stays dumb.
 *
 * Announced via role="progressbar" so a screen reader user hears progress; the label is
 * required for that reason.
 */
export function Meter({
  value,
  max,
  tone = "teal",
  height = "md",
  label,
  className = "",
  children,
}: {
  value: number;
  max: number;
  tone?: "teal" | "gold" | "signal" | "paper" | "muted";
  height?: "xs" | "sm" | "md" | "lg";
  /** Required — this is the accessible name for the progressbar. */
  label: string;
  className?: string;
  children?: ReactNode;
}) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;

  const fills = {
    teal: "bg-teal",
    gold: "bg-gold",
    signal: "bg-signal",
    paper: "bg-paper",
    muted: "bg-muted",
  } as const;

  const heights = { xs: "h-1", sm: "h-1.5", md: "h-2.5", lg: "h-4" } as const;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      /**
       * The hairline is what makes an EMPTY meter legible. `--color-ink-inset` is #0a0c12
       * against a #14171f page, so a bar at 0% would otherwise render as nothing at all.
       * Drawn as an inset shadow rather than a border so it costs no layout at any of the
       * four heights; `h-1` has no room to give.
       */
      className={`bg-ink-inset relative overflow-hidden rounded-full
                  shadow-[inset_0_0_0_1px_var(--color-line)]
                  ${heights[height]} ${className}`}
    >
      {children}
      <div
        className={`absolute inset-y-0 left-0 rounded-full ${fills[tone]}`}
        style={{ width: `${pct}%`, transition: "width 700ms var(--ease-drain)" }}
      />
    </div>
  );
}

/**
 * Loading placeholder.
 *
 * Replaces the bare `Loader2` spinners the previous build dropped into empty screens. A
 * shape that matches what is coming reads as the page arriving; a spinner reads as a stall.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`bg-ink-600 animate-pulse rounded-sm ${className}`} />;
}

/**
 * Empty state.
 *
 * Deliberately has no illustration — the "line-art robot" empty state is exactly the
 * corporate-SaaS default this design is avoiding.
 */
export function Empty({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="border-line flex flex-col items-center gap-3 rounded-md border border-dashed px-6 py-12 text-center">
      <p className="text-body-lg text-paper font-semibold">{title}</p>
      {body && <p className="text-body text-muted max-w-sm">{body}</p>}
      {action}
    </div>
  );
}
