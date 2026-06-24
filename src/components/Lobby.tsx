import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Plus, LogIn, Users } from "lucide-react";

export function Lobby() {
  const navigate = useNavigate();
  const myRooms = useQuery(api.rooms.myRooms);
  const createRoom = useMutation(api.rooms.createRoom);
  const joinRoom = useMutation(api.rooms.joinRoom);

  const [roomName, setRoomName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleCreate() {
    setBusy(true);
    try {
      const { roomId } = await createRoom({ name: roomName });
      navigate(`/room/${roomId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create room");
    } finally {
      setBusy(false);
    }
  }

  async function handleJoin() {
    if (joinCode.trim().length === 0) return;
    setBusy(true);
    try {
      const { roomId } = await joinRoom({ code: joinCode.trim() });
      navigate(`/room/${roomId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not join room");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="size-5" /> Create a room
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="room-name" className="mb-1.5 block">
              Room name
            </Label>
            <Input
              id="room-name"
              placeholder="Friday Night Match"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              maxLength={40}
            />
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleCreate} disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : "Create"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <LogIn className="size-5" /> Join a room
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="join-code" className="mb-1.5 block">
              Room code
            </Label>
            <Input
              id="join-code"
              placeholder="AB3K"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              className="font-mono tracking-widest uppercase"
              maxLength={6}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            />
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant="secondary"
              onClick={handleJoin}
              disabled={busy || joinCode.trim().length === 0}
            >
              Join
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div>
        <h2 className="mb-2 px-1 text-sm font-medium text-muted-foreground">
          Your rooms
        </h2>
        {myRooms === undefined ? (
          <div className="flex justify-center py-8 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : myRooms.length === 0 ? (
          <p className="px-1 py-6 text-sm text-muted-foreground">
            You haven't joined any rooms yet. Create one or join with a code.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {myRooms.map((room) => (
              <li key={room._id}>
                <button
                  onClick={() => navigate(`/room/${room._id}`)}
                  className="flex w-full items-center justify-between rounded-lg border bg-card p-3 text-left transition-colors hover:bg-accent"
                >
                  <div>
                    <p className="font-medium">{room.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {room.code}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Users className="size-3" />
                      {room.playerCount}
                    </Badge>
                    <Badge
                      variant={
                        room.status === "playing" ? "default" : "secondary"
                      }
                    >
                      {room.status}
                    </Badge>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
