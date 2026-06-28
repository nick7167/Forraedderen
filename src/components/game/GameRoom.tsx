import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "convex/react";
import { Loader2, Volume2, VolumeX } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useGameRoom } from "@/hooks/useGameRoom";
import { forgetRoomPlayer, recallRoomPlayer } from "@/lib/guest";
import { feedback, isMuted, setMuted } from "@/lib/feedback";
import { t } from "@/lib/strings";
import { LeaveButton } from "./LeaveButton";
import { InfoScreen } from "./InfoScreen";
import { HostGoneBanner } from "./HostGoneBanner";
import { LobbyView } from "./LobbyView";
import { RoleReveal } from "./RoleReveal";
import { CluePhase } from "./CluePhase";
import { DiscussionPhase } from "./DiscussionPhase";
import { VotePhase } from "./VotePhase";
import { RoundReveal } from "./RoundReveal";
import { MatchResults } from "./MatchResults";
import { PhaseBanner } from "./PhaseBanner";
import { RoundContextBar } from "./RoundContextBar";
import { NeonBackdrop } from "./NeonBackdrop";

// Phases that get an announcing banner when entered.
const PHASE_BANNERS: Record<string, { emoji: string; label: string }> = {
  clues: { emoji: "💬", label: t.bannerClues },
  discussion: { emoji: "🗣️", label: t.bannerDiscuss },
  vote: { emoji: "🗳️", label: t.bannerVote },
};

export function GameRoom() {
  const { roomId: roomIdParam } = useParams();
  const roomId = roomIdParam as Id<"rooms"> | undefined;
  const navigate = useNavigate();
  const { room, round, authArgs } = useGameRoom(roomId);

  const [muted, setMutedState] = useState(isMuted());

  // Announce phase changes with a brief banner.
  const phase = round?.phase ?? null;
  const prevPhase = useRef<string | null>(null);
  const [banner, setBanner] =
    useState<{ emoji: string; label: string } | null>(null);
  useEffect(() => {
    if (phase && prevPhase.current && prevPhase.current !== phase) {
      const b = PHASE_BANNERS[phase];
      if (b) {
        setBanner(b);
        feedback.tap();
      }
    }
    prevPhase.current = phase;
  }, [phase]);
  useEffect(() => {
    if (!banner) return;
    const id = setTimeout(() => setBanner(null), 1300);
    return () => clearTimeout(id);
  }, [banner]);

  const leaveRoom = useMutation(api.games.leaveRoom);
  async function leave() {
    try {
      if (authArgs) await leaveRoom(authArgs);
    } catch {
      // best-effort — always get the user home regardless
    }
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

  // We had a seat here but the server no longer knows us → we were kicked/removed.
  if (roomId && room.myPlayerId === null && recallRoomPlayer(roomId)) {
    return (
      <InfoScreen
        emoji="👋"
        title={t.removedTitle}
        body={t.removedBody}
        actionLabel={t.goHome}
        onAction={leave}
      />
    );
  }

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
    return <LobbyView room={room} authArgs={authArgs} onLeave={leave} />;
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
    <div className="flex items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground">
      <div className="flex items-center gap-2">
        <LeaveButton onLeave={leave} confirm />
        <span className="rounded-full bg-white/5 px-2.5 py-1 font-mono tracking-wider">
          {room.code}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-white/5 px-2.5 py-1">
          Runde {room.currentRoundNumber}/{room.settings.roundCount}
        </span>
        <button
          onClick={() => {
            setMuted(!muted);
            setMutedState(!muted);
          }}
          aria-label={muted ? "Slå lyd til" : "Slå lyd fra"}
          className="flex size-7 items-center justify-center rounded-full bg-white/5 text-muted-foreground active:scale-90"
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
      </div>
    </div>
  );

  // Joined mid-match (not dealt into this round) → wait for the next one.
  if (round.me && !round.me.isParticipant && round.phase !== "resolve") {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="z-20 shrink-0 bg-background/80 backdrop-blur-md">
          {header}
        </div>
        <HostGoneBanner room={room} authArgs={authArgs} />
        <InfoScreen
          emoji="⏳"
          title={t.waitingTitle}
          body={t.waitingBody}
          actionLabel={t.leave}
          onAction={leave}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <NeonBackdrop density="subtle" />
      {banner && (
        <PhaseBanner
          emoji={banner.emoji}
          label={banner.label}
          onDone={() => setBanner(null)}
        />
      )}
      <div className="z-20 shrink-0 bg-background/80 backdrop-blur-md">
        {header}
        {(round.phase === "clues" ||
          round.phase === "discussion" ||
          round.phase === "vote") && <RoundContextBar round={round} />}
      </div>
      <HostGoneBanner room={room} authArgs={authArgs} />
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
      {round.phase === "discussion" && (
        <DiscussionPhase round={round} authArgs={authArgs} isHost={room.isHost} />
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
