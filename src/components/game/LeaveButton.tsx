import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/strings";
import { LogOut } from "lucide-react";

/**
 * Consistent "leave to home" control. When `confirm` is true (a game is in
 * progress) it asks first; otherwise it leaves immediately. `onLeave` should
 * remove the player and navigate home.
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
    <Button
      variant="ghost"
      size="icon"
      className={className ?? "size-9 rounded-full text-muted-foreground"}
      aria-label={t.leave}
      onClick={() => (confirm ? setOpen(true) : onLeave())}
    >
      <LogOut className="size-5" />
    </Button>
  );

  if (!confirm) return trigger;

  return (
    <>
      {trigger}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xs rounded-3xl">
          <DialogHeader>
            <DialogTitle>{t.leaveConfirmTitle}</DialogTitle>
            <DialogDescription>{t.leaveConfirmBody}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:flex-col">
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => {
                setOpen(false);
                onLeave();
              }}
            >
              {t.leave}
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setOpen(false)}>
              {t.cancel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
