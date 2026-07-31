/**
 * Ambient background behind every screen — the calm, animated "aurora" from the
 * mockup: a few large, slowly drifting colour blobs (purple + cyan) under a
 * near-black base. No loose shapes; purely decorative, fixed and non-interactive.
 * `variant` re-tints the mood (danger = red for voting, success = green for
 * results). `density` is accepted for API compatibility but no longer varies the
 * look — the aurora is intentionally consistent across screens.
 */
export function NeonBackdrop({
  variant,
}: {
  density?: "full" | "subtle";
  variant?: "danger" | "success";
}) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div
        className={
          "aurora-bg" +
          (variant === "danger" ? " aurora-danger" : variant === "success" ? " aurora-success" : "")
        }
      >
        <div className="ab ab1" />
        <div className="ab ab2" />
        <div className="ab ab3" />
      </div>
    </div>
  );
}
