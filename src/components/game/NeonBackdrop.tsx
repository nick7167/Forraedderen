/**
 * Animated aurora background — large drifting colour blobs on a near-black
 * base, matching the interactive mockup exactly. Fixed behind all screens.
 * variant="danger" re-tints to red (voting), variant="success" to green (results).
 */
export function NeonBackdrop({
  variant,
}: {
  density?: "full" | "subtle";
  variant?: "danger" | "success";
}) {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* blob 1 — large purple, top-left */}
      <div
        style={{
          position: "absolute",
          width: 520, height: 520,
          borderRadius: "50%",
          background: variant === "danger"
            ? "radial-gradient(circle, rgba(239,68,68,0.42) 0%, transparent 70%)"
            : variant === "success"
            ? "radial-gradient(circle, rgba(34,197,94,0.38) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(124,58,237,0.44) 0%, transparent 70%)",
          filter: "blur(64px)",
          top: -130, left: -110,
          animation: "ab1drift 9s ease-in-out infinite",
        }}
      />
      {/* blob 2 — cyan/accent, bottom-right */}
      <div
        style={{
          position: "absolute",
          width: 360, height: 360,
          borderRadius: "50%",
          background: variant === "danger"
            ? "radial-gradient(circle, rgba(239,68,68,0.22) 0%, transparent 70%)"
            : variant === "success"
            ? "radial-gradient(circle, rgba(34,197,94,0.22) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(6,182,212,0.26) 0%, transparent 70%)",
          filter: "blur(64px)",
          bottom: -90, right: -60,
          animation: "ab2drift 12s ease-in-out infinite",
        }}
      />
      {/* blob 3 — small purple, mid */}
      <div
        style={{
          position: "absolute",
          width: 240, height: 240,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,85,247,0.22) 0%, transparent 70%)",
          filter: "blur(48px)",
          top: "42%", left: "42%",
          animation: "ab3drift 7s ease-in-out infinite",
        }}
      />
    </div>
  );
}
