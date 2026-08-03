import { motion } from "motion/react";
import type { ReactNode } from "react";
import { settle } from "./motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * The screen wrapper. Every screen renders inside one of these, so transitions between
 * phases are consistent and the layout never jumps.
 *
 * Ported from SnapArena's `Stage`. It replaces the previous `.cscreen .s-*` pattern, where
 * each of the seven screens hand-rolled its own full-height flex column and its own
 * padding, and they had drifted apart.
 */
export function Stage({
  children,
  keyName,
  className = "",
  width = "max-w-2xl",
  fit = false,
  testId,
}: {
  children: ReactNode;
  /** Drives the enter/exit animation when phases swap. Pass the phase name. */
  keyName: string;
  className?: string;
  /**
   * An explicit prop rather than a `max-w-*` in `className`, because two width utilities
   * on one element resolve by stylesheet order rather than by which was written last —
   * so an override silently wins or loses depending on where Tailwind happens to sort it.
   */
  width?: string;
  /**
   * Bind the stage to the viewport instead of letting it run as long as it likes. Used by
   * the role reveal, which must never scroll — you are holding the phone out for someone
   * else to look at, and a card that is half off-screen defeats the entire mechanic.
   *
   * A prop for the same reason `width` is one. Note this uses `--app-h`, not `h-dvh`:
   * iOS does not finalize the dvh unit until a scroll, and this is exactly the screen
   * where that bug was visible. See main.tsx.
   *
   * Children need `min-h-0` to be allowed to shrink — flex items refuse to go below their
   * content size without it. `overflow-hidden` is the backstop, not the plan: if content
   * is being clipped the composition is wrong, not the container.
   */
  fit?: boolean;
  /** See the note on StageScroll's `testId`. */
  testId?: string;
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      key={keyName}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: -12 }}
      transition={settle}
      data-testid={testId}
      style={fit ? { height: "var(--app-h, 100dvh)" } : undefined}
      className={`mx-auto flex w-full flex-col px-4 ${width} ${
        fit ? "max-h-[var(--app-h,100dvh)] gap-3 overflow-hidden py-3" : "gap-6 py-6 sm:py-8"
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * The scrolling region of a stage.
 *
 * Only needed on stages that also have a pinned footer — otherwise let the page scroll.
 * `min-h-0` is the load-bearing class: without it this refuses to shrink below its content
 * and the footer gets pushed off the bottom instead of the list scrolling.
 */
export function StageScroll({
  children,
  className = "",
  testId,
  scrollRef,
}: {
  children: ReactNode;
  className?: string;
  /**
   * Forwarded to `data-testid`. An explicit prop because TypeScript does not check
   * hyphenated JSX attributes against a component's prop type — passing `data-testid`
   * directly compiles fine and then silently never reaches the DOM.
   */
  testId?: string;
  /** For feeds that auto-scroll to the newest entry. */
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={scrollRef}
      data-testid={testId}
      className={`no-scrollbar min-h-0 flex-1 overflow-y-auto ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * The pinned action area at the bottom of a stage.
 *
 * `pb-safe` rather than a fixed padding, so the primary CTA clears the iPhone home
 * indicator without leaving a visible band on every other device.
 */
export function StageFooter({
  children,
  className = "",
  testId,
}: {
  children: ReactNode;
  className?: string;
  /** See the note on StageScroll's `testId`. */
  testId?: string;
}) {
  return (
    <div data-testid={testId} className={`pb-safe flex shrink-0 flex-col gap-2 pt-1 ${className}`}>
      {children}
    </div>
  );
}
