import { Button } from "@/components/ui/button";
import { Screen } from "./Screen";

/** Centered title/body with one action — used for waiting/removed states. */
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
    <Screen center footer={<Button size="hero" onClick={onAction}>{actionLabel}</Button>}>
      <div className="text-center">
        <p className="text-5xl">{emoji}</p>
        <h1 className="mt-3 text-2xl font-extrabold">{title}</h1>
        {body && <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">{body}</p>}
      </div>
    </Screen>
  );
}
