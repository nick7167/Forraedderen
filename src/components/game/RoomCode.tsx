import { useEffect, useRef, useState } from "react";
import { Glyph } from "@/ui/Glyph";
import { t } from "@/lib/strings";
import { feedback } from "@/lib/feedback";
import { cn } from "@/lib/utils";

/**
 * The lobby's room code.
 *
 * One character per cell — the verification-code pattern people already know. It's
 * unambiguous to read aloud (which is how codes actually get shared), the cells scale with
 * the container, and the whole card is one large copy target.
 *
 * The cells are inset (`ink-inset`) rather than raised: the code is something you read off
 * the screen, not something you press. The card around them is the press target.
 *
 * Copy falls back to a hidden textarea + `execCommand` because `navigator.clipboard` is
 * unavailable on insecure origins and in some in-app browsers — exactly where a guest is
 * most likely to be opening a shared game link.
 */
export function RoomCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Resolved once: `navigator.share` is absent on most desktop browsers, and showing a
  // share button that throws is worse than not showing one.
  const [canShare] = useState(
    () => typeof navigator !== "undefined" && typeof navigator.share === "function",
  );

  /** The invite link — see JoinRoute. */
  const inviteUrl = `${window.location.origin}/j/${code}`;

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function share() {
    try {
      await navigator.share({
        title: t.shareTitle,
        text: t.shareText.replace("{code}", code),
        url: inviteUrl,
      });
      feedback.tap();
    } catch {
      // The user dismissed the sheet, or the platform refused — not an error.
    }
  }

  async function copy() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      ok = true;
    } catch {
      ok = legacyCopy(inviteUrl);
    }
    if (!ok) return;

    feedback.tap();
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={copy}
      data-testid="room-code"
      style={{ "--press-edge": "#171B25" } as React.CSSProperties}
      className="press bg-ink-700 border-line-strong sheen flex w-full flex-col gap-2.5 rounded-md border p-3 text-left"
      aria-label={`${t.roomCode} ${code.split("").join(" ")} — ${t.copyCode}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-label text-muted font-semibold tracking-[0.12em] uppercase">
          {t.roomCode}
        </span>
        <span className="flex items-center gap-1">
          {canShare && (
            // `span` not `button`: this sits inside the card's button, and nesting
            // interactive elements is invalid HTML.
            <span
              role="button"
              tabIndex={0}
              data-testid="share-invite"
              className="text-label text-secondary hover:text-paper hover:bg-ink-600 inline-flex items-center gap-1 rounded-xs px-1.5 py-1 font-semibold transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                void share();
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter" && e.key !== " ") return;
                e.preventDefault();
                e.stopPropagation();
                void share();
              }}
            >
              <Glyph name="share" /> {t.shareInvite}
            </span>
          )}
          <span
            className={cn(
              "text-label inline-flex items-center gap-1 rounded-xs px-1.5 py-1 font-semibold",
              copied ? "text-teal" : "text-secondary",
            )}
          >
            <Glyph name={copied ? "check" : "copy"} /> {copied ? t.copied : t.copyCode}
          </span>
        </span>
      </div>

      <div className="flex gap-1.5" data-testid="room-code-cells">
        {code.split("").map((char, i) => (
          <span
            key={i}
            data-testid="room-code-cell"
            className="bg-ink-inset border-line font-display text-paper flex flex-1 items-center justify-center rounded-sm border py-2.5 text-2xl font-extrabold tabular-nums"
          >
            {char}
          </span>
        ))}
      </div>
    </button>
  );
}

/** Clipboard fallback for insecure origins / in-app browsers. */
function legacyCopy(text: string): boolean {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
