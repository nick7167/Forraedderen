// Re-exported from the server so client and server can never drift — see
// convex/shared.ts for why.
export { AVATAR_EMOJIS, AVATAR_COLORS } from "../../convex/shared";

export function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
