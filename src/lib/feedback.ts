// Subtle, asset-free feedback: short Web Audio tones + light haptics.
// Honors a persisted mute preference. Kept minimal by design.

const MUTE_KEY = "forraeder.muted";

export function isMuted(): boolean {
  return localStorage.getItem(MUTE_KEY) === "1";
}
export function setMuted(muted: boolean) {
  localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
}

let ctx: AudioContext | null = null;
function audio(): AudioContext | null {
  if (isMuted()) return null;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, durationMs: number, when = 0, gain = 0.04) {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  const t0 = ac.currentTime + when;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + durationMs / 1000);
  osc.connect(g).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + durationMs / 1000);
}

function vibrate(pattern: number | number[]) {
  if (isMuted()) return;
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* not supported */
  }
}

export const feedback = {
  /** A light tap — turn changes, taps. */
  tap() {
    tone(440, 80);
    vibrate(8);
  },
  /** It's your turn / your move is requested. */
  yourTurn() {
    tone(660, 120);
    vibrate([0, 30, 40, 30]);
  },
  /** Confirm an action (vote cast, clue sent). */
  confirm() {
    tone(560, 90);
    vibrate(12);
  },
  /** Dramatic reveal flip. */
  reveal() {
    tone(330, 140);
    tone(495, 160, 0.08);
    vibrate(20);
  },
  /** Positive outcome (crew win / match win). */
  win() {
    tone(523, 140);
    tone(659, 160, 0.12);
    tone(784, 220, 0.24);
    vibrate([0, 40, 50, 40]);
  },
  /** Negative outcome (imposters win). */
  lose() {
    tone(392, 180);
    tone(294, 260, 0.14);
    vibrate(60);
  },
};
