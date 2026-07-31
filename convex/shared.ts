/**
 * Constants shared by the server and the browser.
 *
 * **This file must never import from `./_generated/*` or any module that
 * registers Convex functions.** Everything else under `convex/` transitively
 * pulls in server-only code, and importing that from the client trips Convex's
 * "Convex functions should not be imported in the browser" guard — as it did
 * when `usePresence` reached into `convex/lib.ts` for one number.
 *
 * If the client and server both need a value, it belongs here.
 */

/**
 * A player is present if their last heartbeat is newer than this.
 *
 * Lives here because presence is computed on the *client* (see
 * `src/hooks/usePresence.ts`) while the stall watchdog compares against it on
 * the server (`convex/round.ts`), and the two must agree.
 */
export const PRESENCE_TIMEOUT_MS = 25_000;

/**
 * The avatar palette.
 *
 * These previously lived in two places (`convex/games.ts` and
 * `src/lib/avatars.ts`) under a "keep in sync" comment, and had already drifted
 * to 12 emojis client-side against 8 server-side.
 */

export const AVATAR_EMOJIS = [
  "🦊", "🐼", "🐯", "🐸", "🦉", "🐙",
  "🦁", "🐧", "🐨", "🐵", "🦄", "🐢",
] as const;

export const AVATAR_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#6366f1", "#d946ef", "#ec4899",
] as const;

/**
 * Coerce a client-supplied avatar to a known value. The client sends whatever
 * it likes, so the server picks the fallback rather than storing arbitrary
 * strings (which would render as tofu boxes for everyone else in the room).
 */
export function safeAvatarEmoji(value: string): string {
  return (AVATAR_EMOJIS as readonly string[]).includes(value)
    ? value
    : AVATAR_EMOJIS[0];
}

export function safeAvatarColor(value: string): string {
  return (AVATAR_COLORS as readonly string[]).includes(value)
    ? value
    : AVATAR_COLORS[0];
}
