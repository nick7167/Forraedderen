// Lightweight guest identity stored in localStorage. Lets players join and
// act without a Clerk account; the secret authorizes their mutations.

const SECRET_KEY = "forraeder.guestSecret";
const PROFILE_KEY = "forraeder.profile";

export type GuestProfile = {
  name: string;
  avatarEmoji: string;
  avatarColor: string;
};

export function getGuestSecret(): string {
  let secret = localStorage.getItem(SECRET_KEY);
  if (!secret) {
    secret = crypto.randomUUID();
    localStorage.setItem(SECRET_KEY, secret);
  }
  return secret;
}

export function loadProfile(): GuestProfile | null {
  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GuestProfile;
  } catch {
    return null;
  }
}

export function saveProfile(profile: GuestProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

// Remember which player row we are in which room (so reopening reconnects).
//
// Stored as `{playerId, ts}`. The timestamp is what makes "continue game"
// trustworthy: without it there is no way to tell the room you were in ten
// seconds ago from one you abandoned last week, and the old implementation
// simply returned whichever key localStorage happened to iterate first.
const ROOM_PREFIX = "forraeder.room.";

/** Entries older than this are treated as dead and swept on next read. */
const ROOM_TTL_MS = 12 * 60 * 60 * 1000;

type RoomEntry = { playerId: string; ts: number };

function readEntry(key: string): RoomEntry | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<RoomEntry>;
    if (typeof parsed?.playerId === "string") {
      return { playerId: parsed.playerId, ts: Number(parsed.ts) || 0 };
    }
    return null;
  } catch {
    // Pre-timestamp format: a bare playerId string. Treat as ancient so it
    // still reconnects an open session but never wins "continue game".
    return { playerId: raw, ts: 0 };
  }
}

export function rememberRoomPlayer(roomId: string, playerId: string) {
  const entry: RoomEntry = { playerId, ts: Date.now() };
  localStorage.setItem(ROOM_PREFIX + roomId, JSON.stringify(entry));
}

export function recallRoomPlayer(roomId: string): string | null {
  return readEntry(ROOM_PREFIX + roomId)?.playerId ?? null;
}

export function forgetRoomPlayer(roomId: string) {
  localStorage.removeItem(ROOM_PREFIX + roomId);
}

/**
 * The genuinely most-recent room (for the "Fortsæt spil" affordance), or null.
 * Expired entries are removed as a side effect, so the key set can't grow
 * without bound the way it used to.
 */
export function findRememberedRoom(): string | null {
  const now = Date.now();
  const stale: string[] = [];
  let best: { roomId: string; ts: number } | null = null;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith(ROOM_PREFIX)) continue;
    const entry = readEntry(key);
    const roomId = key.slice(ROOM_PREFIX.length);
    if (!entry || now - entry.ts > ROOM_TTL_MS) {
      stale.push(key);
      continue;
    }
    if (best === null || entry.ts > best.ts) best = { roomId, ts: entry.ts };
  }

  for (const key of stale) localStorage.removeItem(key);
  return best?.roomId ?? null;
}
