import { SignInButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2 } from "lucide-react";

export function SignInScreen() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <Card className="w-full max-w-sm text-center">
        <CardHeader className="items-center">
          <div className="mx-auto mb-2 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Gamepad2 className="size-7" />
          </div>
          <CardTitle className="text-2xl">Game PWA</CardTitle>
          <p className="text-sm text-muted-foreground">
            Real-time multiplayer rooms powered by Convex &amp; Clerk.
          </p>
        </CardHeader>
        <CardContent>
          <SignInButton mode="modal">
            <Button size="lg" className="w-full">
              Sign in to play
            </Button>
          </SignInButton>
        </CardContent>
      </Card>
    </div>
  );
}
