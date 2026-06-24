import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Gamepad2 } from "lucide-react";

export function AppHeader() {
  return (
    <header className="flex items-center justify-between border-b px-4 py-3">
      <Link to="/" className="flex items-center gap-2 font-semibold">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Gamepad2 className="size-4" />
        </span>
        Game PWA
      </Link>
      <UserButton />
    </header>
  );
}
