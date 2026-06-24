import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useStoreUser } from "@/hooks/useStoreUser";
import { HomeScreen } from "@/components/game/HomeScreen";
import { GameRoom } from "@/components/game/GameRoom";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { InstallPrompt } from "@/components/InstallPrompt";
import { Button } from "@/components/ui/button";
import { isMuted, setMuted } from "@/lib/feedback";
import { LogIn, Volume2, VolumeX } from "lucide-react";

export default function App() {
  // Mirror Clerk identity into Convex when signed in (no-op for guests).
  useStoreUser();
  const [muted, setMutedState] = useState(isMuted());

  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col">
      <OfflineIndicator />
      <InstallPrompt />

      {/* Slim top bar: mute toggle + optional sign-in (unlocks saving packs). */}
      <div className="flex items-center justify-end gap-1 px-3 py-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground"
          aria-label={muted ? "Slå lyd til" : "Slå lyd fra"}
          onClick={() => {
            const next = !muted;
            setMuted(next);
            setMutedState(next);
          }}
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </Button>
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <LogIn className="size-4" /> Log ind
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

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
