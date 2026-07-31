import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useGameRoom } from "@/hooks/useGameRoom";
import { forgetRoomPlayer, recallRoomPlayer } from "@/lib/guest";
import { feedback } from "@/lib/feedback";
import { t } from "@/lib/strings";
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
    // The room is gone (ended, or swept as abandoned). Drop the local pointer
    // so "Fortsæt spil" stops offering it on the home screen.
    if (roomId) forgetRoomPlayer(roomId);
    return (
      <InfoScreen
        emoji="🕳️"
        title={t.roomNotFound}
        actionLabel={t.goHome}
        onAction={() => navigate("/")}
        topInset
      />
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
        topInset
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

  // Joined mid-match (not dealt into this round) → wait for the next one.
  if (round.me && !round.me.isParticipant && round.phase !== "resolve") {
    return (
      <div className="cscreen s-home">
        <NeonBackdrop />
        <HostGoneBanner room={room} authArgs={authArgs} />
        <InfoScreen
          emoji="⏳"
          title={t.waitingTitle}
          body={t.waitingBody}
          actionLabel={t.leave}
          onAction={leave}
          topInset
        />
      </div>
    );
  }

  // Each phase screen owns its full concept layout (its own aurora, header
  // padding and footer), so there is no shared top bar here — the leave and
  // mute controls ride along inside each screen via PhaseChrome.
  return (
    <>
      {banner && (
        <PhaseBanner
          emoji={banner.emoji}
          label={banner.label}
          onDone={() => setBanner(null)}
        />
      )}
      <HostGoneBanner room={room} authArgs={authArgs} />
      {round.phase === "reveal" && (
        <RoleReveal
          round={round}
          authArgs={authArgs}
          isHost={room.isHost}
          players={round.players}
          totalRounds={room.settings.roundCount}
          onLeave={leave}
        />
      )}
      {round.phase === "clues" && (
        <CluePhase
          round={round}
          authArgs={authArgs}
          isHost={room.isHost}
          totalRounds={room.settings.roundCount}
          onLeave={leave}
        />
      )}
      {round.phase === "discussion" && (
        <DiscussionPhase round={round} authArgs={authArgs} isHost={room.isHost} onLeave={leave} />
      )}
      {round.phase === "vote" && (
        <VotePhase round={round} authArgs={authArgs} isHost={room.isHost} onLeave={leave} />
      )}
      {round.phase === "resolve" && (
        <RoundReveal round={round} authArgs={authArgs} isHost={room.isHost} onLeave={leave} />
      )}
    </>
  );
}
