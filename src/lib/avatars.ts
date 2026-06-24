// Keep in sync with the defaults in convex/games.ts.
export const AVATAR_EMOJIS = ["🦊", "🐼", "🐯", "🐸", "🦉", "🐙", "🦁", "🐧", "🐨", "🐵", "🦄", "🐢"];

export const AVATAR_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#6366f1", "#d946ef", "#ec4899",
];

export function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
