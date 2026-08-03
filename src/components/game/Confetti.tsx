import { useMemo } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Falling confetti for a won round.
 *
 * Kept — a party game that never celebrates is a spreadsheet. Retuned to the palette:
 * the previous seven-colour set was the old neon ramp (#a78bfa, #06b6d4, #f472b6, …).
 * These are the design's own working colours plus paper, so the celebration is made of
 * the same material as the rest of the app.
 *
 * Squares only, no circles: a circle at 6px is a dot, and the mix read as noise.
 * Rendered as plain divs with a CSS animation rather than through motion/react — 38
 * independently-timed springs is a lot of JS for something nobody looks at directly.
 */
const COLORS = [
  "var(--color-gold)",
  "var(--color-teal)",
  "var(--color-paper)",
  "var(--color-secondary)",
  "var(--color-gold)",
];

export function Confetti({ count = 38 }: { count?: number }) {
  const reduced = usePrefersReducedMotion();

  // Randomised once per mount.
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const size = 5 + Math.random() * 7;
        return {
          left: `${Math.random() * 100}%`,
          background: COLORS[Math.floor(Math.random() * COLORS.length)],
          width: size,
          height: size,
          borderRadius: "1px",
          animationDuration: `${1.8 + Math.random() * 2.8}s`,
          animationDelay: `${Math.random() * 2.2}s`,
        };
      }),
    [count],
  );

  // The global reduced-motion block would freeze these mid-fall as a static field of
  // squares over the result, which is worse than not having them.
  if (reduced) return null;

  return (
    <div className="confetti-area" aria-hidden>
      {pieces.map((p, i) => (
        <div key={i} className="confetti-piece" style={p} />
      ))}
    </div>
  );
}
