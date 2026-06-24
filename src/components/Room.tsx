import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useHeartbeat } from "@/hooks/useHeartbeat";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Copy, Check, Loader2, Play } from "lucide-react";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Room() {
  const { roomId: roomIdParam } = useParams();
  const roomId = roomIdParam as Id<"rooms">;
  const navigate = useNavigate();

  const room = useQuery(api.rooms.getRoom, { roomId });
  const players = useQuery(api.rooms.listPlayers, { roomId });
  const setReady = useMutation(api.rooms.setReady);
  const leaveRoom = useMutation(api.rooms.leaveRoom);
  const startGame = useMutation(api.rooms.startGame);

  // Keep this player's presence fresh while viewing the room.
  useHeartbeat(roomId);

  if (room === undefined || players === undefined) {
    return (
      <div className="flex justify-center py-12 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  if (room === null) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className="text-muted-foreground">This room no longer exists.</p>
        <Button onClick={() => navigate("/")}>Back to lobby</Button>
      </div>
    );
  }

  const me = players.find((p) => p.userId === room.viewerId);
  const everyoneReady =
    players.length > 0 && players.every((p) => p.isReady && p.isOnline);

  async function copyCode() {
    await navigator.clipboard.writeText(room!.code);
    toast.success("Room code copied");
  }

  async function handleLeave() {
    await leaveRoom({ roomId });
    navigate("/");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={handleLeave}>
          <ArrowLeft className="size-4" /> Leave
        </Button>
        <Badge variant={room.status === "playing" ? "default" : "secondary"}>
          {room.status}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{room.name}</span>
            <Button
              variant="outline"
              size="sm"
              className="font-mono tracking-widest"
              onClick={copyCode}
            >
              {room.code}
              <Copy className="size-3.5" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-muted-foreground">
            {players.length} player{players.length === 1 ? "" : "s"} in this room
          </p>
          <ul className="flex flex-col gap-2">
            {players.map((p) => (
              <li
                key={p._id}
                className="flex items-center justify-between rounded-lg border p-2.5"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="size-9">
                      <AvatarImage src={p.imageUrl} alt={p.name} />
                      <AvatarFallback>{initials(p.name)}</AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-card ${
                        p.isOnline ? "bg-green-500" : "bg-muted-foreground/40"
                      }`}
                      title={p.isOnline ? "online" : "offline"}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {p.name}
                      {p.userId === room.viewerId && (
                        <span className="text-muted-foreground"> (you)</span>
                      )}
                      {p.userId === room.hostId && (
                        <Badge variant="outline" className="ml-2 text-[10px]">
                          host
                        </Badge>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {p.isOnline ? "online" : "away"}
                    </p>
                  </div>
                </div>
                <Badge variant={p.isReady ? "default" : "outline"}>
                  {p.isReady ? (
                    <>
                      <Check className="size-3" /> ready
                    </>
                  ) : (
                    "not ready"
                  )}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        {me && (
          <Button
            variant={me.isReady ? "secondary" : "default"}
            onClick={() => setReady({ roomId, isReady: !me.isReady })}
          >
            {me.isReady ? "I'm not ready" : "I'm ready"}
          </Button>
        )}
        {room.isHost && room.status === "lobby" && (
          <Button
            disabled={!everyoneReady}
            onClick={() => startGame({ roomId })}
          >
            <Play className="size-4" />
            {everyoneReady
              ? "Start game"
              : "Waiting for all players to be ready…"}
          </Button>
        )}
        {room.status === "playing" && (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            🎮 Game in progress. This is where your game UI mounts — replace this
            block with your gameplay component.
          </div>
        )}
      </div>
    </div>
  );
}
