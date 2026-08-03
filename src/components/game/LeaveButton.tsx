import { useState } from "react";
import { Dialog } from "@/ui/Dialog";
import { Button } from "@/ui/Button";
import { Glyph } from "@/ui/Glyph";
import { t } from "@/lib/strings";

/**
 * Consistent "leave to home" control. When `confirm` is true (a game is in progress) it
 * asks first; otherwise it leaves immediately. `onLeave` should remove the player and
 * navigate home.
 *
 * The trigger is a bare icon button rather than a `Button variant="ghost"`: it sits in the
 * phase bar next to mute, and the two have to be the same shape.
 */
export function LeaveButton({
  onLeave,
  confirm = false,
  className,
}: {
  onLeave: () => void;
  confirm?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const trigger = (
    <button
      type="button"
      className={
        className ??
        "text-secondary hover:text-paper hover:bg-ink-700 flex size-9 shrink-0 items-center justify-center rounded-sm text-lg transition-colors"
      }
      aria-label={t.leave}
      data-testid="leave-button"
      onClick={() => (confirm ? setOpen(true) : onLeave())}
    >
      <Glyph name="leave" />
    </button>
  );

  if (!confirm) return trigger;

  return (
    <>
      {trigger}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={t.leaveConfirmTitle}
        description={t.leaveConfirmBody}
        testId="leave-confirm"
      >
        <div className="mt-5 flex flex-col gap-2">
          <Button
            variant="destructive"
            block
            data-testid="leave-confirm-yes"
            onClick={() => {
              setOpen(false);
              onLeave();
            }}
          >
            <Glyph name="leave" />
            {t.leave}
          </Button>
          <Button variant="ghost" block onClick={() => setOpen(false)}>
            {t.cancel}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
