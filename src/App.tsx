import { Routes, Route } from "react-router-dom";
import { HomeScreen } from "@/components/game/HomeScreen";
import { GameRoom } from "@/components/game/GameRoom";
import { JoinRoute } from "@/components/game/JoinRoute";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { DesignGallery } from "@/components/DesignGallery";

export default function App() {
  return (
    <div
      /**
       * The shell no longer imposes a width. Each screen picks its own column via `Stage`
       * — the lobby and the results want the room a laptop gives them, while the role
       * reveal deliberately stays phone-sized because you are physically handing the
       * device to the person next to you.
       *
       * Height is still driven from JS (`--app-h`, set in main.tsx) so it is correct on
       * first paint. `100dvh` is the pre-JS fallback: iOS doesn't finalize the CSS dvh
       * unit until a scroll, which caused the "fixes itself on scroll" bug.
       *
       * Edge-to-edge on purpose — top bars and footers apply the safe-area insets
       * internally via .pt-safe/.pb-safe.
       */
      className="flex w-full flex-col"
      style={{ minHeight: "var(--app-h, 100dvh)" }}
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
          {/* The design system's verification harness. Dev-only: it is not part of the
              product, and shipping it would put a second, fixture-driven copy of every
              component into the production bundle. */}
          {import.meta.env.DEV && <Route path="/design" element={<DesignGallery />} />}
          <Route path="*" element={<HomeScreen />} />
        </Routes>
      </div>
    </div>
  );
}
