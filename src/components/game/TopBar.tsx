import { cn } from "@/lib/utils";

/**
 * Minimal context bar: optional left slot (back/leave), a centered title, and
 * an optional right slot (a single menu/gear). Keeps utility actions out of the
 * main content so each screen stays focused.
 */
export function TopBar({
  title,
  left,
  right,
  className,
}: {
  title?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex h-12 items-center justify-between px-3", className)}>
      <div className="flex w-16 justify-start">{left}</div>
      <div className="truncate text-sm font-semibold text-foreground/90">
        {title}
      </div>
      <div className="flex w-16 justify-end">{right}</div>
    </div>
  );
}
