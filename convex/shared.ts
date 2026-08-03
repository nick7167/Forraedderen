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

/**
 * Identity colours.
 *
 * Retuned for the "Pressing" design system. The previous set was eight saturated neons
 * (#ef4444, #f97316, #eab308, …) which fought the flat ink surfaces and — worse — put a
 * pure red in the identity palette, where the design reserves red (`--color-signal`) to
 * mean "imposter". A player whose avatar happened to be red read as accused.
 *
 * These are muted, evenly spread around the wheel, and deliberately avoid the three
 * colours that carry meaning elsewhere: gold #f0b429 (primary action), signal #e03a2f
 * (imposter) and teal #1f9e8c (crew / live). They are only ever drawn as a hairline ring
 * or a small fill, so they are tuned to read against ink-700 rather than to pass body-text
 * contrast.
 *
 * NOTE: changing this list means players whose stored `avatarColor` is an old value fall
 * through `safeAvatarColor` to the first entry. Accepted — rooms in this game are
 * short-lived, and the alternative is carrying the neon palette forever.
 */
export const AVATAR_COLORS = [
  "#c96f4a", "#b8894a", "#8a9a4b", "#5fc4b8",
  "#8aacf5", "#9b7fd4", "#c77fa8", "#9fb0c4",
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
