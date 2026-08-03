import { useEffect, useState, useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

/**
 * Live `prefers-reduced-motion`.
 *
 * Subscribed rather than read once, because the OS setting can change while the app is
 * open and a party game gets left running for an hour at a time.
 *
 * The global `@media (prefers-reduced-motion)` block in index.css is the backstop for
 * everything CSS-driven; this is for the motion/react call sites, which have to be told
 * in JS. Convention, matching SnapArena: `initial={reduced ? false : {...}}` — `false`
 * tells motion/react to mount at the animate state instead of animating into it.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/**
 * A clock ticked into state.
 *
 * So `Date.now()` is never read during render — a component that derives its output from
 * a bare `Date.now()` is not a pure function of its props and will not re-render when the
 * time it displayed goes stale.
 */
export function useNow(intervalMs = 200) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
