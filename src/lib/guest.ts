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
export function rememberRoomPlayer(roomId: string, playerId: string) {
  localStorage.setItem(`forraeder.room.${roomId}`, playerId);
}

export function recallRoomPlayer(roomId: string): string | null {
  return localStorage.getItem(`forraeder.room.${roomId}`);
}

export function forgetRoomPlayer(roomId: string) {
  localStorage.removeItem(`forraeder.room.${roomId}`);
}
