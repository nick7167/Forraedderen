import { Routes, Route } from "react-router-dom";
import { HomeScreen } from "@/components/game/HomeScreen";
import { GameRoom } from "@/components/game/GameRoom";
import { JoinRoute } from "@/components/game/JoinRoute";
import { OfflineIndicator } from "@/components/OfflineIndicator";

export default function App() {
  return (
    <div
      className="mx-auto flex w-full max-w-md flex-col"
      style={{
        // Height is driven from JS (`--app-h`, set in main.tsx) so it's correct on
        // first paint — `100dvh` is the pre-JS fallback. iOS doesn't finalize the
        // CSS dvh unit until a scroll, which caused the "fixes itself on scroll" bug.
        // The shell fills the viewport EDGE-TO-EDGE (no safe-area padding here):
        // top bars and footers apply the insets internally (.pt-safe/.pb-safe).
        height: "var(--app-h, 100dvh)",
      }}
    >
      <OfflineIndicator />

      {/* Bounded routing region. Each screen manages its own internal scroll. */}
      <div className="flex min-h-0 flex-1 flex-col">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          {/* Invite link — see JoinRoute. Short path because it gets pasted
              into group chats and read aloud. */}
          <Route path="/j/:code" element={<JoinRoute />} />
          <Route path="/room/:roomId" element={<GameRoom />} />
          <Route path="*" element={<HomeScreen />} />
        </Routes>
      </div>
    </div>
  );
}
