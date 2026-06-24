import { cn } from "@/lib/utils";

/**
 * Standard screen layout: a full-height column with consistent padding and an
 * optional bottom-pinned action area. Encodes the "lots of breathing room,
 * one primary action per screen" pattern from the redesign.
 */
export function Screen({
  children,
  footer,
  className,
  center = false,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  /** Vertically center the body (for hero-style screens). */
  center?: boolean;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <div
        className={cn(
          "flex flex-1 flex-col gap-5 px-5 pt-2 pb-4",
          center && "justify-center",
          className,
        )}
      >
        {children}
      </div>
      {footer && (
        <div className="sticky bottom-0 z-10 px-5 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {footer}
        </div>
      )}
    </div>
  );
}
