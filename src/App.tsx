import { Routes, Route } from "react-router-dom";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useStoreUser } from "@/hooks/useStoreUser";
import { SignInScreen } from "@/components/SignInScreen";
import { Lobby } from "@/components/Lobby";
import { Room } from "@/components/Room";
import { AppHeader } from "@/components/AppHeader";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { InstallPrompt } from "@/components/InstallPrompt";
import { Loader2 } from "lucide-react";

function FullScreenSpinner({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground">
      <Loader2 className="size-8 animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

function AuthenticatedApp() {
  // Mirror the Clerk identity into Convex before rendering game screens.
  const { isStoring } = useStoreUser();
  if (isStoring) return <FullScreenSpinner label="Setting up your profile…" />;

  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col">
      <AppHeader />
      <main className="flex-1 overflow-y-auto p-4">
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="*" element={<Lobby />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <>
      <OfflineIndicator />
      <InstallPrompt />
      <AuthLoading>
        <FullScreenSpinner label="Loading…" />
      </AuthLoading>
      <Unauthenticated>
        <SignInScreen />
      </Unauthenticated>
      <Authenticated>
        <AuthenticatedApp />
      </Authenticated>
    </>
  );
}
