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
        minHeight: "100dvh",
        // Keep content clear of the notch / rounded corners on installed PWAs.
        paddingTop: "env(safe-area-inset-top)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      <OfflineIndicator />
      <InstallPrompt />

      <div className="flex flex-1 flex-col overflow-y-auto">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/room/:roomId" element={<GameRoom />} />
          <Route path="*" element={<HomeScreen />} />
        </Routes>
      </div>
    </div>
  );
}
