import { Routes, Route } from "react-router-dom";
import { useStoreUser } from "@/hooks/useStoreUser";
import { HomeScreen } from "@/components/game/HomeScreen";
import { GameRoom } from "@/components/game/GameRoom";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { InstallPrompt } from "@/components/InstallPrompt";

export default function App() {
  // Mirror Clerk identity into Convex when signed in (no-op for guests).
  useStoreUser();

  return (
    <div
      className="mx-auto flex w-full max-w-md flex-col"
      style={{
        // Fixed viewport height (not min-height) so inner regions can own their
        // own scrolling — this is what makes per-screen sticky footers work.
        height: "100dvh",
        // Keep content clear of the notch / rounded corners on installed PWAs.
        paddingTop: "env(safe-area-inset-top)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      <OfflineIndicator />
      <InstallPrompt />

      {/* Bounded routing region. Each screen manages its own internal scroll. */}
      <div className="flex min-h-0 flex-1 flex-col">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/room/:roomId" element={<GameRoom />} />
          <Route path="*" element={<HomeScreen />} />
        </Routes>
      </div>
    </div>
  );
}
