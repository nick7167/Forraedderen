import { t } from "@/lib/strings";

/**
 * The brand mark.
 *
 * Mark left of the word, horizontal, never stacked — the same construction SnapArena uses,
 * so the two apps are recognisably a pair. The previous version was a 70px floating emoji
 * above a gradient-clipped wordmark with a purple drop-shadow; both the float and the
 * gradient are gone. Prominence here is size and space, not light.
 */
export function Wordmark({ size = "bar" }: { size?: "bar" | "brand" | "hero" }) {
  // The hero step is responsive: "Kamæleon" is a long word, and display-1 (56px) runs off
  // the edge of a 390px phone.
  const mark = size === "hero" ? "text-4xl sm:text-5xl" : size === "brand" ? "text-3xl" : "text-xl";
  const word =
    size === "hero"
      ? "text-display-2 sm:text-display-1"
      : size === "brand"
        ? "text-display-2 leading-none"
        : "text-xl";

  return (
    <span data-testid="wordmark" className={`inline-flex items-center ${size === "bar" ? "gap-2" : "gap-3"}`}>
      <span className={`${mark} shrink-0 leading-none select-none`} aria-hidden>
        🦎
      </span>
      <span data-testid="wordmark-text" className={`font-display text-paper font-extrabold tracking-tight ${word}`}>
        {t.appName}
      </span>
    </span>
  );
}
