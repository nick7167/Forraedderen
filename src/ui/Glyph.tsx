import type { ReactNode } from "react";

/**
 * The glyph set.
 *
 * The previous build carried its UI icons in a mix of `lucide-react` and stray emoji —
 * 🂠 ✓ 🕳️ 👋 ⏳ — which renders differently on every OS and never sat on the same optical
 * weight as the type around it.
 *
 * These are the marks the app actually needs, drawn on one 16×16 grid with one stroke
 * weight, sized in `em` so they scale with whatever text they sit in. No dependency, no
 * icon font, no network request.
 *
 * Game-meaningful emoji are NOT in scope here and stay as emoji: the twelve avatar faces,
 * the pack emoji, the four mode icons (🕵️ 🦎 ❓ 📊) and 🦎 as the brand mark. Those carry
 * content, and replacing them with monochrome strokes would flatten the thing that makes
 * the lobby readable at a glance.
 */

export type GlyphName =
  | "check"
  | "close"
  | "plus"
  | "minus"
  | "copy"
  | "share"
  | "search"
  | "settings"
  | "leave"
  | "history"
  | "mute"
  | "sound"
  | "chevron"
  | "user"
  | "users"
  | "warn"
  | "bot"
  | "host"
  | "timer"
  | "eye";

const PATHS: Record<GlyphName, ReactNode> = {
  check: <path d="M3 8.5 6.5 12 13 4.5" />,
  close: <path d="M4 4l8 8M12 4l-8 8" />,
  plus: <path d="M8 3.5v9M3.5 8h9" />,
  minus: <path d="M3.5 8h9" />,
  // Two offset sheets. The back one is only three sides, so the overlap stays legible.
  copy: (
    <>
      <path d="M5.5 5.5h7v8h-7z" />
      <path d="M10 3.5h-6.5v8" />
    </>
  ),
  // A node splitting into two — the invite link.
  share: (
    <>
      <circle cx="12" cy="4" r="1.75" />
      <circle cx="12" cy="12" r="1.75" />
      <circle cx="4" cy="8" r="1.75" />
      <path d="M10.5 4.9 5.5 7.1m0 1.8 5 2.2" />
    </>
  ),
  search: (
    <>
      <circle cx="7.25" cy="7.25" r="4.25" />
      <path d="M10.5 10.5 13.5 13.5" />
    </>
  ),
  // Sliders rather than a gear — a gear reads as machinery, sliders read as preferences.
  settings: (
    <>
      <path d="M2.5 5h11M2.5 11h11" />
      <circle cx="6" cy="5" r="1.6" />
      <circle cx="10.5" cy="11" r="1.6" />
    </>
  ),
  // Door with an arrow leaving it.
  leave: (
    <>
      <path d="M9.5 2.5h-6v11h6" />
      <path d="M12.5 8h-6m6 0-2.2-2.2M12.5 8l-2.2 2.2" />
    </>
  ),
  // A clock with the hand wound back — previous rounds.
  history: (
    <>
      <path d="M2.75 8a5.25 5.25 0 1 0 1.6-3.75" />
      <path d="M2.5 2.5v2.75h2.75" />
      <path d="M8 5.25V8l2 1.25" />
    </>
  ),
  mute: (
    <>
      <path d="M8 3.5 4.5 6.5H2.5v3h2L8 12.5z" />
      <path d="M11 6.5l3 3m0-3-3 3" />
    </>
  ),
  sound: (
    <>
      <path d="M8 3.5 4.5 6.5H2.5v3h2L8 12.5z" />
      <path d="M10.5 6a3 3 0 0 1 0 4" />
    </>
  ),
  // Direction of travel for a disclosure. Rotated by the caller when it points elsewhere.
  chevron: <path d="M4 6.5 8 10.5l4-4" />,
  user: (
    <>
      <circle cx="8" cy="5.5" r="2.75" />
      <path d="M2.75 14c0-2.9 2.35-5 5.25-5s5.25 2.1 5.25 5" />
    </>
  ),
  // Two heads, one behind — the player count.
  users: (
    <>
      <circle cx="6.25" cy="5.75" r="2.5" />
      <path d="M1.5 14c0-2.6 2.1-4.5 4.75-4.5S11 11.4 11 14" />
      <path d="M10.75 3.6a2.5 2.5 0 0 1 0 4.3M12 9.8c1.6.55 2.5 2.05 2.5 4.2" />
    </>
  ),
  warn: (
    <>
      <path d="M8 2.5 14.5 13.5h-13z" />
      <path d="M8 6.5v3.25M8 11.75h.01" strokeWidth="1.75" />
    </>
  ),
  // A blunt machine head: flat top, square eyes. Reads as "not a person" at 12px.
  bot: (
    <>
      <path d="M3.5 5.5h9v7h-9z" />
      <path d="M8 2v3.5" />
      <path d="M6 8.5h.01M10 8.5h.01" strokeWidth="2" />
    </>
  ),
  // A plain crown. The host is an ordinary player with one extra button, so this stays
  // quiet — three points, no jewels.
  host: <path d="M2.5 12h11M2.5 12 3.5 5l3 2.75L8 3.5l1.5 4.25L12.5 5l1 7" />,
  timer: (
    <>
      <circle cx="8" cy="9" r="5" />
      <path d="M8 6.5V9l2 1.5M6.5 2h3" />
    </>
  ),
  // Reveal / hide the role card.
  eye: (
    <>
      <path d="M1.5 8S4 3.75 8 3.75 14.5 8 14.5 8 12 12.25 8 12.25 1.5 8 1.5 8z" />
      <circle cx="8" cy="8" r="1.9" />
    </>
  ),
};

export function Glyph({
  name,
  className = "",
  filled = false,
}: {
  name: GlyphName;
  className?: string;
  /** Solid marks (check, warn, host) read better filled at small sizes. */
  filled?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={`size-[1em] shrink-0 ${className}`}
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name]}
    </svg>
  );
}
