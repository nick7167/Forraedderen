import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { t } from "@/lib/strings";
import { feedback } from "@/lib/feedback";
import { cn } from "@/lib/utils";

/**
 * The lobby's room code.
 *
 * One character per cell — the verification-code pattern people already know.
 * It's unambiguous to read aloud (which is how codes actually get shared), the
 * cells scale with the container instead of competing with the header's icon
 * buttons for width, and the whole card is one large copy target.
 *
 * Copy falls back to a hidden textarea + `execCommand` because
 * `navigator.clipboard` is unavailable on insecure origins and in some
 * in-app browsers — exactly where a guest is most likely to be opening a
 * shared game link.
 */
export function RoomCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copy() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(code);
      ok = true;
    } catch {
      ok = legacyCopy(code);
    }
    if (!ok) return;

    feedback.tap();
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      className="room-code-card"
      onClick={copy}
      aria-label={`${t.roomCode} ${code.split("").join(" ")} — ${t.copyCode}`}
    >
      <div className="rc-top">
        <span className="rc-label">{t.roomCode}</span>
        <span className={cn("rc-action", copied && "copied")}>
          {copied ? (
            <>
              <Check className="size-3.5" /> {t.copied}
            </>
          ) : (
            <>
              <Copy className="size-3.5" /> {t.copyCode}
            </>
          )}
        </span>
      </div>

      <div className="rc-cells">
        {code.split("").map((char, i) => (
          <span key={i} className="rc-cell">
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
