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
      /**
       * `--stage-pb` publishes this stage's own bottom padding so `StageFooter` can cancel
       * it exactly and sit flush on the bottom edge. A hardcoded `-mb-*` on the footer
       * would be right for one branch and wrong for the other — the fit stage pads 12px,
       * the scrolling stage 24px — and the two would drift apart silently.
       */
      style={
        {
          ...(fit ? { height: "var(--app-h, 100dvh)" } : null),
          "--stage-pb": fit ? "0.75rem" : "1.5rem",
        } as React.CSSProperties
      }
      /**
       * `flex-1` on the scrolling branch so the stage fills the routing region even when
       * its content is short. Without it the stage ends where the content does, and the
       * sticky footer — which cannot escape its own container — sits mid-screen with a
       * dead band of page below it instead of on the bottom edge.
       */
      className={`mx-auto flex w-full flex-col px-4 pb-[var(--stage-pb)] ${width} ${
        fit
          ? "max-h-[var(--app-h,100dvh)] gap-3 overflow-hidden pt-3"
          : "flex-1 gap-6 pt-6 sm:pt-8"
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
      /**
       * `[&>*]:shrink-0` is load-bearing. This is a flex column with a definite height, so
       * its children default to `flex-shrink: 1` and get *squeezed* when the content is
       * taller than the box — instead of overflowing and letting this element scroll,
       * which is its entire job. It showed up as the vote screen's clue-chip strip being
       * sliced in half: that row is `overflow-x-auto`, which makes `overflow-y` compute to
       * `auto` as well, so once squeezed it clipped its own content rather than spilling.
       */
      className={`no-scrollbar min-h-0 flex-1 overflow-y-auto [&>*]:shrink-0 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * The bottom action bar.
 *
 * Ported from SnapArena's `TabBar` recipe (`bg-ink-900 border-line ... border-t
 * pb-[env(safe-area-inset-bottom)]`): the primary action of a screen lives in a bar pinned
 * to the bottom edge, always in reach of a thumb.
 *
 * `sticky`, not `fixed`. In a `fit` stage there is nothing to scroll and sticky is inert —
 * the bar simply sits at the bottom as before. In a scrolling stage (lobby, home, results)
 * it pins, which is the bug this fixes: the CTA used to be the last element in the column
 * and scrolled off the screen with everything else.
 *
 * Sticky also keeps the bar inside the column, so on a laptop it aligns with the content
 * instead of spanning the whole window. On a phone the column *is* the viewport, so it is
 * full-bleed — the SnapArena behaviour.
 *
 * `-mx-4` bleeds the fill past the Stage's horizontal padding, and the negative bottom
 * margin cancels its bottom padding so the bar sits on the edge rather than floating above
 * it. The latter reads `--stage-pb` from the Stage rather than hardcoding a value, because
 * the fit and scrolling branches pad differently.
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
    <div
      data-testid={testId}
      style={{ marginBottom: "calc(var(--stage-pb, 0px) * -1)" }}
      /**
       * `mt-auto` pushes the bar to the bottom of a stage that is taller than its content;
       * `sticky` then holds it there once the content is tall enough to scroll. The two
       * together cover both cases — neither does on its own.
       */
      className={`bg-ink-900 border-line pb-safe sticky bottom-0 z-20 mt-auto -mx-4
                  flex shrink-0 flex-col gap-2 border-t px-4 pt-3 ${className}`}
    >
      {children}
    </div>
  );
}
