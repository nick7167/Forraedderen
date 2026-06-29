import { cn } from "@/lib/utils";

/**
 * Standard screen layout: a bounded-height column with three regions —
 *
 *   - `header`  : fixed at the top, never scrolls (e.g. PhaseHero, room-code hero).
 *   - children  : the ONLY scrolling region (the list/grid for this screen).
 *   - `footer`  : pinned at the bottom, never scrolls (the primary action).
 *
 * This keeps the primary action always reachable no matter how long the list is
 * (e.g. 12 players in the lobby). Requires a height-bounded parent (the app
 * shell gives the routing region a fixed `100dvh`).
 */
export function Screen({
  children,
  header,
  footer,
  className,
  center = false,
  topInset = false,
}: {
  children: React.ReactNode;
  /** Fixed, non-scrolling content above the scroll region. */
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  /** Vertically center the body (for hero-style screens). */
  center?: boolean;
  /** Add a safe-area top inset — for screens where Screen is the topmost
   *  element (no TopBar / GameRoom header above it) so content clears the notch. */
  topInset?: boolean;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {header ? (
        <div className={cn("shrink-0 px-5 pt-2", topInset && "pt-safe")}>{header}</div>
      ) : null}
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-2 pb-4",
          // No footer → the scroll area owns the bottom safe-area inset.
          !footer && "pb-safe",
          // No header → the scroll area owns the top safe-area inset.
          topInset && !header && "pt-safe",
          className,
        )}
      >
        {/* Auto-margin centering (not `justify-center`) so tall content still
            scrolls cleanly instead of clipping its top on short viewports. */}
        <div className={cn("flex w-full flex-col gap-4", center && "m-auto")}>
          {children}
        </div>
      </div>
      {footer && (
        <div className="pb-safe shrink-0 bg-gradient-to-t from-background via-background/95 to-transparent px-5 pt-6">
          {footer}
        </div>
      )}
    </div>
  );
}
