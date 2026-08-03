import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Surface";
import { Glyph } from "@/ui/Glyph";
import { t } from "@/lib/strings";
import { toast } from "sonner";
import { usePresence } from "@/hooks/usePresence";

type Room = NonNullable<FunctionReturnType<typeof api.games.getRoomState>>;
type AuthArgs = { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret: string };

/**
 * Shown to non-hosts when the host appears offline — lets anyone take over.
 *
 * Gold rather than amber: this design has no separate warning colour, and gold already
 * carries "something needs you" everywhere else.
 */
export function HostGoneBanner({ room, authArgs }: { room: Room; authArgs: AuthArgs }) {
  const claimHost = useMutation(api.games.claimHost);
  const isOnline = usePresence();
  const host = room.players.find((p) => p.isHost);
  const show = host && !isOnline(host) && room.myPlayerId !== host._id;
  if (!show) return null;

  return (
    <Card
      className="flex items-center gap-2.5 px-3 py-2.5"
      data-testid="host-gone"
      role="status"
    >
      <Glyph name="warn" className="text-gold shrink-0 text-base" />
      <span className="text-body-sm text-secondary min-w-0 flex-1">{t.hostGone}</span>
      <Button
        size="sm"
        variant="secondary"
        data-testid="claim-host"
        onClick={async () => {
          try {
            await claimHost(authArgs);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Fejl");
          }
        }}
      >
        {t.claimHost}
      </Button>
    </Card>
  );
}
