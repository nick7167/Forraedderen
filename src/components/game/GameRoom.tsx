import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "convex/react";
import { AnimatePresence } from "motion/react";
import { Spinner } from "@/ui/Button";
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

  // Radix's dismissable layer parks `pointer-events: none` on <body> while a
  // drawer or dialog is open and restores it on close. A phase change can rip
  // one out from under it — the round-history drawer lives on the vote screen
  // and unmounts when voting resolves — and the restore is skipped, leaving the
  // whole app unclickable until reload. Sweep it whenever no layer is mounted.
  useEffect(() => {
    if (document.body.style.pointerEvents !== "none") return;
    if (document.querySelector("[data-radix-dismissable-layer],[data-vaul-drawer]")) return;
    document.body.style.pointerEvents = "";
  });

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
      <div className="text-muted flex flex-1 items-center justify-center py-24">
        <Spinner className="size-6" />
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
        onAction={() => navigate("/")}      />
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
        onAction={leave}      />
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
      <div className="text-muted flex flex-1 items-center justify-center py-24">
        <Spinner className="size-6" />
      </div>
    );
  }

  // Joined mid-match (not dealt into this round) → wait for the next one.
  if (round.me && !round.me.isParticipant && round.phase !== "resolve") {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col px-4">
        <HostGoneBanner room={room} authArgs={authArgs} />
        <InfoScreen
          emoji="⏳"
          title={t.waitingTitle}
          body={t.waitingBody}
          actionLabel={t.leave}
          onAction={leave}        />
      </div>
    );
  }

  // Each phase screen is a Stage and owns its own column width, top bar (PhaseChrome)
  // and footer. AnimatePresence with mode="wait" runs the outgoing screen's exit before
  // the incoming one enters, so phases cross-fade instead of stacking for a frame.
  return (
    <>
      {banner && <PhaseBanner emoji={banner.emoji} label={banner.label} />}
      <div className="mx-auto w-full max-w-3xl px-4">
        <HostGoneBanner room={room} authArgs={authArgs} />
      </div>
      <AnimatePresence mode="wait" initial={false}>
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
        // Keyed by ballot: multi-imposter rounds run successive ballots without
        // ever leaving the "vote" phase, so without a remount VotePhase carried
        // its local `selected`/`confirmed` into the next ballot and left the
        // confirm button stuck disabled on "✓ Du stemte".
        <VotePhase
          key={round.currentBallot}
          round={round}
          authArgs={authArgs}
          isHost={room.isHost}
          onLeave={leave}
        />
      )}
      {round.phase === "resolve" && (
        <RoundReveal round={round} authArgs={authArgs} isHost={room.isHost} onLeave={leave} />
      )}
      </AnimatePresence>
    </>
  );
}
