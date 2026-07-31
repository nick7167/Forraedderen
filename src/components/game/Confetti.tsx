import { useMemo } from "react";

/**
 * The concept's `.confetti-area` (screen 7) — 38 DOM particles falling with
 * `@keyframes confetti-fall`, randomised in colour, size, shape, duration and
 * delay. Ported from the concept's `spawnConfetti()`.
 */
const COLORS = ["#a78bfa", "#06b6d4", "#f472b6", "#fbbf24", "#4ade80", "#fb923c", "#c4b5fd"];

export function Confetti({ count = 38 }: { count?: number }) {
  // Randomised once per mount, exactly like the concept spawning on screen entry.
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const size = 5 + Math.random() * 9;
        return {
          left: `${Math.random() * 100}%`,
          background: COLORS[Math.floor(Math.random() * COLORS.length)],
          width: size,
          height: size,
          borderRadius: Math.random() > 0.5 ? "50%" : "3px",
          animationDuration: `${1.8 + Math.random() * 2.8}s`,
          animationDelay: `${Math.random() * 2.2}s`,
        };
      }),
    [count],
  );

  return (
    <div className="confetti-area" aria-hidden>
      {pieces.map((p, i) => (
        <div key={i} className="cp" style={p} />
      ))}
    </div>
  );
}
