import type { Transition } from "motion/react";

/**
 * The motion vocabulary.
 *
 * Ported from SnapArena. Four named motions are the whole language — the previous build
 * carried fifteen hand-written keyframes (`float`, `pulse-green`, `pulse-purple`,
 * `tap-hint`, `glow-pulse`, `shimmer`, `dots`, `pdot`, `ad1/2/3`, …) chosen ad hoc, which
 * is why the app read as busy rather than as intentional.
 *
 * `drain` and `ignite` mirror `--ease-drain` / `--ease-ignite` in index.css exactly, so a
 * CSS transition and a motion/react one land in the same place.
 */

/** Arrivals that should feel struck: the flipped role, a vote landing, the winner. */
export const snap: Transition = { type: "spring", stiffness: 320, damping: 20 };

/** Stage enter/exit — the phase machine. */
export const settle: Transition = { type: "spring", stiffness: 260, damping: 26 };

/** Anything that empties: timers, ready meters. Slow out, so the loss is legible. */
export const drain: Transition = { duration: 0.7, ease: [0.16, 1, 0.3, 1] };

/** Short and sharp: chips appearing, clue rows arriving, press feedback. */
export const ignite: Transition = { duration: 0.18, ease: [0.2, 0, 0, 1] };

/**
 * Reduced-motion helper.
 *
 * Returns `false` for `initial` — which motion/react reads as "start at the animate
 * state" — so a component mounts already in position rather than animating into it.
 */
export function enter<T extends object>(reduced: boolean, from: T): T | false {
  return reduced ? false : from;
}
