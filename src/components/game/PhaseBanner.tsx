import { motion } from "motion/react";
import { snap } from "@/ui/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Brief full-bleed splash announcing a new phase.
 *
 * `pointer-events-none` is load-bearing, not polish. This sits at z-40 over every phase
 * screen for 1.3s after each transition; while it was interactive it swallowed the first
 * tap after arriving on a screen — landing on the vote grid and tapping straight away
 * simply did nothing, which read to players as "I can't vote". The timer in GameRoom
 * clears it, and at 1.3s skipping it isn't worth eating a tap for.
 *
 * The label was a cyan→fuchsia→purple gradient with a purple drop-shadow on the emoji.
 * Both are gone: flat ink scrim, paper type, one struck arrival.
 */
export function PhaseBanner({ emoji, label }: { emoji: string; label: string }) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      aria-hidden
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="bg-ink-900/92 pointer-events-none fixed inset-0 z-40 flex flex-col items-center justify-center gap-4"
      data-testid="phase-banner"
    >
      <motion.span
        initial={reduced ? false : { scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={snap}
        className="text-7xl"
      >
        {emoji}
      </motion.span>
      <motion.span
        initial={reduced ? false : { scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={snap}
        className="font-display text-display-1 text-paper font-extrabold tracking-tight"
      >
        {label}
      </motion.span>
    </motion.div>
  );
}
