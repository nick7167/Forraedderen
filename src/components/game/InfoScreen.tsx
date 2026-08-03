import { Button } from "@/ui/Button";
import { Stage } from "@/ui/Stage";

/**
 * Centered title/body with one action — the waiting, removed and not-found states.
 *
 * Previously wrapped the old `Screen` primitive, which existed only for this one caller.
 * It is a Stage like everything else now.
 */
export function InfoScreen({
  emoji,
  title,
  body,
  actionLabel,
  onAction,
}: {
  emoji: string;
  title: string;
  body?: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <Stage keyName="info" width="max-w-md" className="min-h-[70dvh] justify-center">
      <div className="flex flex-col items-center gap-3 text-center" data-testid="info-screen">
        <p className="text-6xl" aria-hidden>
          {emoji}
        </p>
        <h1 className="font-display text-display-2 text-paper font-extrabold">{title}</h1>
        {body && <p className="text-body text-muted max-w-sm">{body}</p>}
      </div>
      <Button size="lg" block onClick={onAction} data-testid="info-action">
        {actionLabel}
      </Button>
    </Stage>
  );
}
