import { cn } from "@/lib/utils";

/**
 * The signature gradient banner used to head a game phase. Compact by default
 * (so the list below stays above the fold); pass size="lg" for the dramatic
 * full-size treatment used on the Discussion screen.
 */
export function PhaseHero({
  icon,
  title,
  subtitle,
  pill,
  size = "md",
}: {
  icon?: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  pill?: React.ReactNode;
  size?: "md" | "lg";
}) {
  const large = size === "lg";
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-center text-white gloss duration-500 animate-in fade-in zoom-in",
        large ? "p-6" : "p-5",
      )}
    >
      {icon && <div className="flex justify-center opacity-90">{icon}</div>}
      <h1
        className={cn(
          "font-black tracking-tight",
          large ? "mt-2 text-4xl" : "mt-1 text-3xl",
          icon ? "" : "mt-0",
        )}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-sm font-medium opacity-90">{subtitle}</p>
      )}
      {pill && (
        <span className="mt-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
          {pill}
        </span>
      )}
    </div>
  );
}
