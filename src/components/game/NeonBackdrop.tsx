/**
 * Ambient decoration behind a screen: a soft purple glow plus scattered static
 * neon shapes (outlined triangles, filled squares, line strokes) — the look
 * from the home-screen reference. Purely decorative: fixed, behind content, and
 * non-interactive. `density="subtle"` thins it out for busy gameplay screens.
 */
export function NeonBackdrop({ density = "full" }: { density?: "full" | "subtle" }) {
  const shapes = density === "full" ? FULL : SUBTLE;
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Extra bottom-center glow layered over the base html gradient. */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/3"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 100%, oklch(0.5 0.22 308 / 0.35), transparent 70%)",
        }}
      />
      {shapes.map((s, i) => (
        <Shape key={i} {...s} delay={(i % 4) * 1.3} />
      ))}
    </div>
  );
}

type ShapeDef = {
  kind: "triangle" | "square" | "line";
  top: string;
  left: string;
  size: number;
  rotate: number;
  color: string;
  opacity: number;
};

function Shape({ kind, top, left, size, rotate, color, opacity, delay }: ShapeDef & { delay: number }) {
  // Inner element carries the base rotation + look; the wrapper carries the
  // float animation (so the keyframe's transform doesn't clobber the rotation).
  const inner: React.CSSProperties = {
    transform: `rotate(${rotate}deg)`,
    filter: "drop-shadow(0 0 6px currentColor)",
    color,
  };

  let el: React.ReactNode;
  if (kind === "triangle") {
    el = (
      <svg width={size} height={size} viewBox="0 0 24 24" style={inner} fill="none">
        <path d="M12 3 L21 20 L3 20 Z" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
      </svg>
    );
  } else if (kind === "square") {
    el = (
      <div style={{ ...inner, width: size, height: size, borderRadius: Math.max(2, size * 0.18), background: "currentColor" }} />
    );
  } else {
    el = (
      <div style={{ ...inner, width: size, height: Math.max(3, size * 0.14), borderRadius: 999, background: "currentColor" }} />
    );
  }

  return (
    <div
      className="floating-shape absolute"
      style={{ top, left, opacity, animationDelay: `${delay}s` }}
    >
      {el}
    </div>
  );
}

const V = "oklch(0.66 0.24 305)"; // neon violet
const M = "oklch(0.64 0.26 330)"; // neon magenta

const FULL: ShapeDef[] = [
  { kind: "triangle", top: "8%", left: "16%", size: 34, rotate: 12, color: V, opacity: 0.7 },
  { kind: "triangle", top: "14%", left: "8%", size: 48, rotate: -18, color: V, opacity: 0.55 },
  { kind: "triangle", top: "10%", left: "72%", size: 26, rotate: 28, color: M, opacity: 0.6 },
  { kind: "square", top: "20%", left: "20%", size: 12, rotate: 18, color: M, opacity: 0.7 },
  { kind: "square", top: "9%", left: "84%", size: 18, rotate: 24, color: V, opacity: 0.6 },
  { kind: "square", top: "26%", left: "86%", size: 22, rotate: 14, color: V, opacity: 0.5 },
  { kind: "line", top: "23%", left: "10%", size: 40, rotate: -28, color: V, opacity: 0.55 },
  { kind: "line", top: "12%", left: "60%", size: 24, rotate: 40, color: M, opacity: 0.55 },
  { kind: "line", top: "30%", left: "70%", size: 34, rotate: -12, color: V, opacity: 0.45 },
  { kind: "square", top: "5%", left: "44%", size: 9, rotate: 0, color: M, opacity: 0.6 },
];

const SUBTLE: ShapeDef[] = [
  { kind: "triangle", top: "9%", left: "10%", size: 30, rotate: -16, color: V, opacity: 0.35 },
  { kind: "square", top: "7%", left: "86%", size: 14, rotate: 20, color: V, opacity: 0.35 },
  { kind: "line", top: "16%", left: "78%", size: 28, rotate: 36, color: M, opacity: 0.3 },
  { kind: "triangle", top: "13%", left: "70%", size: 22, rotate: 24, color: M, opacity: 0.3 },
];
