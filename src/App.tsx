import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useStoreUser } from "@/hooks/useStoreUser";
import { HomeScreen } from "@/components/game/HomeScreen";
import { GameRoom } from "@/components/game/GameRoom";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { InstallPrompt } from "@/components/InstallPrompt";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isMuted, setMuted } from "@/lib/feedback";
import { MoreHorizontal, Volume2, VolumeX, LogIn } from "lucide-react";

export default function App() {
  // Mirror Clerk identity into Convex when signed in (no-op for guests).
  useStoreUser();
  const [muted, setMutedState] = useState(isMuted());

  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col">
      <OfflineIndicator />
      <InstallPrompt />

      {/* Slim top bar: a single utility menu keeps the screens uncluttered. */}
      <div className="flex items-center justify-end px-3 py-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-full text-muted-foreground"
              aria-label="Menu"
            >
              <MoreHorizontal className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              onClick={() => {
                const next = !muted;
                setMuted(next);
                setMutedState(next);
              }}
            >
              {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              {muted ? "Lyd fra" : "Lyd til"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <SignedOut>
              <SignInButton mode="modal">
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <LogIn className="size-4" /> Log ind
                </DropdownMenuItem>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
                <UserButton /> Din konto
              </div>
            </SignedIn>
          </DropdownMenuContent>
        </DropdownMenu>
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
