import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/strings";
import { toast } from "sonner";
import { UserX } from "lucide-react";
import { usePresence } from "@/hooks/usePresence";

type Room = NonNullable<FunctionReturnType<typeof api.games.getRoomState>>;
type AuthArgs = { roomId: Id<"rooms">; playerId?: Id<"players">; guestSecret: string };

/** Shown to non-hosts when the host appears offline — lets anyone take over. */
export function HostGoneBanner({ room, authArgs }: { room: Room; authArgs: AuthArgs }) {
  const claimHost = useMutation(api.games.claimHost);
  const isOnline = usePresence();
  const host = room.players.find((p) => p.isHost);
  const show = host && !isOnline(host) && room.myPlayerId !== host._id;
  if (!show) return null;

  return (
    <div className="mx-3 mt-2 flex items-center gap-2 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-3 py-2">
      <UserX className="size-4 shrink-0 text-amber-400" />
      <span className="text-sm text-amber-200">{t.hostGone}</span>
      <Button
        size="sm"
        className="ml-auto"
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
    </div>
  );
}
