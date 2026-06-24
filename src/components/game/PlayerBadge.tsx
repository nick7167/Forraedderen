import { cn } from "@/lib/utils";

export function Avatar({
  emoji,
  color,
  size = 40,
  dimmed = false,
  ring = false,
}: {
  emoji: string;
  color: string;
  size?: number;
  dimmed?: boolean;
  ring?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full transition-all",
        dimmed && "opacity-40 grayscale",
        ring && "ring-3 ring-offset-2 ring-offset-background",
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: size * 0.55,
        // @ts-expect-error CSS var for ring color
        "--tw-ring-color": color,
      }}
    >
      <span>{emoji}</span>
    </div>
  );
}

export function PlayerBadge({
  name,
  emoji,
  color,
  online = true,
  subtitle,
  className,
}: {
  name: string;
  emoji: string;
  color: string;
  online?: boolean;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <Avatar emoji={emoji} color={color} dimmed={!online} />
        <span
          className={cn(
            "absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-background",
            online ? "bg-green-500" : "bg-muted-foreground/40",
          )}
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{name}</p>
        {subtitle && (
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
