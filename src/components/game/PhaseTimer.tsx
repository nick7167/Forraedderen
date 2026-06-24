import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { cn } from "@/lib/utils";

/** Counts down to an epoch-ms deadline. Display-only; the server enforces. */
export function PhaseTimer({ deadline }: { deadline: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);
  const secs = Math.max(0, Math.ceil((deadline - now) / 1000));
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-semibold tabular-nums",
        secs <= 5 ? "bg-destructive/15 text-destructive" : "bg-secondary",
      )}
    >
      <Timer className="size-3.5" />
      {secs}s
    </span>
  );
}
