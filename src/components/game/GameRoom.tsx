import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";
import { useGameRoom } from "@/hooks/useGameRoom";
import { forgetRoomPlayer } from "@/lib/guest";
import { t } from "@/lib/strings";
import { LobbyView } from "./LobbyView";
import { RoleReveal } from "./RoleReveal";
import { CluePhase } from "./CluePhase";
import { VotePhase } from "./VotePhase";
import { RoundReveal } from "./RoundReveal";
import { MatchResults } from "./MatchResults";

export function GameRoom() {
  const { roomId: roomIdParam } = useParams();
  const roomId = roomIdParam as Id<"rooms"> | undefined;
  const navigate = useNavigate();
  const { room, round, authArgs } = useGameRoom(roomId);

  function leave() {
    if (roomId) forgetRoomPlayer(roomId);
    navigate("/");
  }

  if (room === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (room === null) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-muted-foreground">{t.roomNotFound}</p>
        <button className="text-primary underline" onClick={leave}>
          {t.back}
        </button>
      </div>
    );
  }

  if (!authArgs) return null;

  // Match finished.
  if (room.phase === "finished") {
    return (
      <MatchResults
        room={room}
        authArgs={authArgs}
        isHost={room.isHost}
        onLeave={leave}
      />
    );
  }

  // Lobby (pre-match or between matches).
  if (room.phase === "lobby") {
    return (
      <div className="p-4">
        <LobbyView room={room} authArgs={authArgs} onLeave={leave} />
      </div>
    );
  }

  // In-round phases need the round payload.
  if (round === undefined || round === null) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const header = (
    <div className="flex items-center justify-between border-b px-4 py-2 text-xs text-muted-foreground">
      <span className="font-mono">{room.code}</span>
      <span>
        {t.pass} {room.currentRoundNumber}/{room.settings.roundCount}
      </span>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col">
      {header}
      {round.phase === "reveal" && (
        <RoleReveal
          round={round}
          authArgs={authArgs}
          isHost={room.isHost}
          players={round.players}
        />
      )}
      {round.phase === "clues" && (
        <CluePhase round={round} authArgs={authArgs} isHost={room.isHost} />
      )}
      {round.phase === "vote" && (
        <VotePhase round={round} authArgs={authArgs} isHost={room.isHost} />
      )}
      {round.phase === "resolve" && (
        <RoundReveal round={round} authArgs={authArgs} isHost={room.isHost} />
      )}
    </div>
  );
}
