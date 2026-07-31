/**
 * The concept's `.aurora` layer (ui-concepts/kamaeleon-polish-concepts.html).
 *
 * The concept scopes an aurora inside each screen — not one fixed backdrop —
 * and re-tints the blobs per screen: purple/cyan on home and lobby, a deeper
 * purple + blue on reveal, red-tinted on vote, green-tinted on results. This
 * renders that layer; every screen mounts its own with the matching variant.
 *
 * The blob geometry and animations live in concept.css (`.ab1/.ab2/.ab3`,
 * `@keyframes ad1/ad2/ad3`); only the per-variant gradient overrides are here.
 */
export type AuroraVariant = "default" | "reveal" | "danger" | "success" | "clue" | "subtle";

export function NeonBackdrop({ variant = "default" }: { variant?: AuroraVariant }) {
  // Concept, screen 3 (settings): `<div class="aurora" style="opacity:.3">`
  // with a single blob behind the scrim.
  if (variant === "subtle") {
    return (
      <div className="aurora" style={{ opacity: 0.3 }} aria-hidden>
        <div className="ab ab1" />
      </div>
    );
  }

  // Concept, screen 4 (reveal).
  if (variant === "reveal") {
    return (
      <div className="aurora" aria-hidden>
        <div
          className="ab ab1"
          style={{ background: "radial-gradient(circle,rgba(100,30,210,.5) 0%,transparent 70%)" }}
        />
        <div
          className="ab ab2"
          style={{ background: "radial-gradient(circle,rgba(6,100,200,.2) 0%,transparent 70%)" }}
        />
      </div>
    );
  }

  // Concept, screen 5 (clue).
  if (variant === "clue") {
    return (
      <div className="aurora" aria-hidden>
        <div
          className="ab ab1"
          style={{
            background: "radial-gradient(circle,rgba(124,58,237,.35) 0%,transparent 70%)",
            width: 360,
            height: 360,
            top: -90,
            left: -80,
          }}
        />
        <div className="ab ab3" />
      </div>
    );
  }

  // Concept, screen 6 (vote) — red blob top-right.
  if (variant === "danger") {
    return (
      <div className="aurora" aria-hidden>
        <div
          className="ab"
          style={{
            width: 320,
            height: 320,
            background: "radial-gradient(circle,rgba(239,68,68,.2) 0%,transparent 70%)",
            top: -60,
            right: -60,
            left: "auto",
            filter: "blur(64px)",
            animation: "ad1 9s ease-in-out infinite",
          }}
        />
        <div className="ab ab2" />
      </div>
    );
  }

  // Concept, screen 7 (results) — green blob top-right over a purple wash.
  if (variant === "success") {
    return (
      <div className="aurora" aria-hidden>
        <div
          className="ab"
          style={{
            width: 300,
            height: 300,
            background: "radial-gradient(circle,rgba(34,197,94,.2) 0%,transparent 70%)",
            top: -40,
            right: -40,
            left: "auto",
            filter: "blur(64px)",
            animation: "ad2 12s ease-in-out infinite",
          }}
        />
        <div
          className="ab ab1"
          style={{ background: "radial-gradient(circle,rgba(124,58,237,.28) 0%,transparent 70%)" }}
        />
      </div>
    );
  }

  // Concept, screen 1 (home) — the full three-blob aurora.
  return (
    <div className="aurora" aria-hidden>
      <div className="ab ab1" />
      <div className="ab ab2" />
      <div className="ab ab3" />
    </div>
  );
}
