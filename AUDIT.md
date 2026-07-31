# Kamæleon — full audit

Scope: `convex/` game engine, `src/` client, PWA/build config, e2e, game design.
Every claim below was verified against the code, not inferred.

Severity: **P0** breaks or loses data · **P1** architecture/maintainability ·
**P2** accessibility · **P3** UX & journeys · **P4** game design · **P5** polish.

---

## P0 — Correctness and data integrity

### 0.1 Room-code collision permanently breaks a code
`convex/games.ts:46` retries `generateCode()` 5 times, then **inserts anyway**.
`roomByCode` uses `.unique()`, which *throws* on duplicates — so once two rooms
share a code, every future `joinRoom` for it fails forever, for both rooms.
32⁴ = 1,048,576 combinations makes it rare, but the failure is silent and
permanent.

**Fix:** loop until unique (or add a unique index and retry on conflict); as a
backstop, make `roomByCode` use `.first()` ordered by `createdAt` desc so a
collision degrades to "newest room wins" instead of a hard failure.

### 0.2 Rooms and players are never cleaned up
There is no `convex/crons.ts`. A room is only torn down when the *last human
explicitly presses leave* (`reassignHostIfNeeded`). Everyone closing the tab —
the overwhelmingly common case — leaves the room, its players, rounds, clues and
votes in the database forever.

**Fix:** a daily cron deleting rooms whose `createdAt` is older than ~24h and
whose players' `lastSeen` are all stale. `clearRounds` already exists to reuse.

### 0.3 Avatar lists are out of sync despite a "keep in sync" comment
`src/lib/avatars.ts` has **12** emojis; `convex/games.ts:26` has **8**. The
comment on the client list says "Keep in sync with the defaults in
convex/games.ts". They already aren't.

**Fix:** single source — export from one place, or have the client read the
allowed set from the server. Also validate `avatarEmoji`/`avatarColor` server-side
(currently any string is accepted and stored).

### 0.4 "Fortsæt spil" points at dead rooms
`findRememberedRoom` (`src/lib/guest.ts:50`) is documented as "the
most-recently-remembered room" but returns **the first key localStorage happens
to iterate** — arbitrary order, not recency. Keys are never removed except on an
explicit leave, so the Home screen offers to rejoin rooms that were deleted days
ago; tapping it lands on "Rummet findes ikke."

**Fix:** store `{roomId, ts}` and pick max `ts`; drop entries older than ~12h;
verify the room still exists before showing the button.

### 0.5 A stalled player deadlocks the round — with no host recourse if it's the host
Every timer was removed (`timersEnabled`/`clueSecs`/`voteSecs` are deprecated
schema fields; `phaseDeadline` is **written as `undefined` on every single code
path** and only ever read back out). The clue phase is strictly sequential and
`maybeResolveBallot` requires *all* eligible voters. So one AFK player blocks the
game until the host presses skip — and **if the host is the one who's AFK,
nothing can advance at all.** `claimHost` needs the host offline for 15s, which
doesn't help a host who is online but idle.

**Fix:** reinstate `phaseDeadline` with a scheduled auto-advance (it's already in
the schema and read model), or let a majority vote to skip. This is the single
most likely way a real game dies.

### 0.6 A configured game setting is unreachable
`imposterSeesCategory` is in the schema, in `DEFAULT_SETTINGS`, snapshotted per
round, honoured by the engine, and has a Danish label in `strings.ts:44` — but no
control renders it. **I dropped it during the concept port.** Rooms are stuck on
the default `true` forever.

### 0.7 Self-votes are allowed server-side
`castVote` checks the target is in `voters(round)`, which includes the caller.
Only the UI prevents it. A crafted request lets an imposter vote for themselves.

### 0.8 An English error message reaches users
`convex/lib.ts:95` — `"Not a member of this room (or invalid credentials)."` is
surfaced verbatim by every `toast.error(err.message)`. Every other error in the
codebase is Danish and user-facing.

### 0.9 No error boundary
A single render throw blanks the entire app with no recovery path. For a PWA
people open mid-party, that's a dead end.

---

## P1 — Architecture

### 1.1 Presence writes are the app's hottest path
`HEARTBEAT_MS = 4000` per client. A 12-player room writes to the `players` table
**3× per second, forever**, and `players` is exactly what `getRoomState`
subscribes to. Every heartbeat invalidates the room query for all 12 subscribers.

Compounding it: `getRoomState` calls `Date.now()` (`games.ts:235`), so its result
is time-dependent and can't be cached by Convex.

**Fix:** move presence to its own table (or Convex's presence component) so
heartbeats don't invalidate room state; raise the interval to ~10s with a 25s
timeout; derive `isOnline` client-side from a returned `lastSeen` timestamp
instead of computing it server-side with `Date.now()`.

### 1.2 Duplicated backend helpers
`requireHost` is defined **twice, identically** (`games.ts:316`, `round.ts:596`),
as are `hostArgs()`/`playerArgs()`. They will drift.

### 1.3 Dead dependencies and dead code
- `@clerk/clerk-react` — zero imports anywhere in `src/` or `convex/`.
- `canvas-confetti` + `@types/canvas-confetti` — zero imports since I replaced it
  with the concept's DOM confetti.
- `useStoreUser` is a no-op stub still called on every App render.
- `convex/auth.config.ts` configures a provider nothing uses.
- `Screen.tsx` now has exactly one consumer (`InfoScreen`).
- Custom packs are keyed by `ownerUserId` — with Clerk disabled there is no way
  to own one, so **the custom-pack feature in `PackPicker` may be dead in
  practice**. Worth confirming before shipping it in the UI.

### 1.4 The riskiest logic has no tests
`resolveBallot` encodes all the win rules — tie handling, single vs. iterative
elimination, scoring — and has **zero** test coverage. The e2e suite drives the
happy path through a real browser but can't enumerate these branches. Pure
functions extracted from `round.ts` + a unit test file would be cheap and high
value.

### 1.5 e2e configuration is inconsistent
`playwright.config.ts` sets `baseURL` to the deployed URL; my three new specs
default to `http://127.0.0.1:5173`. There's no `webServer` block, so a plain
`pnpm test:e2e` silently tests production. Add projects for `local` and `deployed`.

### 1.6 Bundle
496 KB JS (152 KB gzip) in one chunk, no route splitting. Dropping Clerk and
canvas-confetti is free; `PackPicker`/`HowToPlay` are lazy-loadable.

---

## P2 — Accessibility

### 2.1 Zoom is disabled — WCAG 1.4.4 failure
`index.html` — `maximum-scale=1.0, user-scalable=no`. Remove both.

### 2.2 Wrong document language — WCAG 3.1.1 failure
`<html lang="en">` on an entirely Danish app. Screen readers will use English
pronunciation for every string.

### 2.3 No focus-visible styles anywhere
`grep -c focus-visible src/concept.css` → **0**. The concept mockup never needed
them (it's mouse-only), so nothing I ported defines them: `.btn`, `.icon-btn`,
`.vote-card`, `.mode-card`, `.scale-cell`, `.room-code-card`, `.add-bot-btn`.
Keyboard users navigate blind on dark custom surfaces.

### 2.4 Nothing is announced
No `aria-live` regions. Turn changes, phase transitions, vote tallies, ready
counts and the round result are all silent to screen readers — in a game whose
entire loop is "wait for a state change".

### 2.5 Contrast
`.vote-card.self` (opacity .38), `.pseq-pending` (.4) and `.rcp`-family muted
greys (`rgba(245,243,255,.3)`) fall below 4.5:1 on the near-black base.

### 2.6 Ready state is colour-only
The ready roster distinguishes ready/not-ready by a green ring and 40% opacity
alone — no text or icon alternative.

---

## P3 — UX and user journeys

### 3.1 There is no join link — the biggest single win available
A party game's core loop is "send this to your friends". Today the only path is:
open app → tap Deltag → type a 4-character code. There's no `/join/ABCD` route,
no `?code=` prefill, and no `navigator.share`.

**Fix:** a `/j/:code` route that prefills and auto-joins after the name prompt,
plus a share button next to the room code. This shortens the highest-traffic
journey in the app from ~6 steps to 1.

### 3.2 Players never learn how scoring works
`HowToPlay` covers goal, clues, voting and the four modes — but not points.
Crew get +1 for a correct vote (once per round, across all ballots); surviving
imposters get +2. Nothing in the app says so, and the round-result screen shows
*vote counts*, not score deltas, so players can't connect cause to effect. The
concept's results screen was designed around `+2 / +1 / +0` deltas — the data to
populate it isn't in `getRoundState`.

**Fix:** return per-round score deltas from the round state and show them; add a
scoring section to HowToPlay.

### 3.3 "Tie ⇒ imposters win" is severe and undocumented
`resolveBallot` treats any tie — including nobody voting — as an imposter win.
That's a defensible rule but it's invisible until it happens and feels arbitrary.

### 3.4 The discussion phase has no structure
It's a static list with a host button. No timer, no prompts, no way for players
to flag suspicion. It's the social heart of the game and currently the emptiest
screen.

### 3.5 Eliminated players have nothing to do
In multi-imposter rounds an eliminated player watches ballots they can't join,
with no reveal, no spectator insight, no "you were right" feedback.

### 3.6 No match history or recap
Between rounds there's no way to review earlier clues, which is exactly the
information players argue about.

### 3.7 First-run guidance is thin
The settings coach is the only onboarding, and only for hosts. A joining player
lands in a lobby with no explanation of what's about to happen.

### 3.8 Host-only bottlenecks
Advance-discussion, skip-turn, end-vote, next-round and back-to-lobby are all
host-only. Combined with 0.5 this concentrates every failure mode on one person.

---

## P4 — Game design and modes

### 4.1 Bots are trivially identifiable
- **Klassisk/Undercover:** a random word from the round's category — no relation
  to the secret word, so their clue is noise.
- **Spørgsmål:** literally `["hmm","måske","noget","ja","svært","tja"]`.
- **Måleren:** `1 + floor(random()*5)`.
- **Voting:** uniformly random among eligible targets.

Any human spots a bot in one clue, which breaks both the deduction and the
padding-out-a-small-group use case they exist for.

**Fix (cheap → good):** pick the category word *closest* to the secret word;
in Måleren answer near the group's running mean; vote weighted toward whoever's
clue is most semantically distant. Add a bot-difficulty setting.

### 4.2 Undercover decoys can be absurd
The decoy is *any other word from the same pack*. In a broad pack that can be
wildly unrelated, making the undercover player instantly obvious — or, if it
lands close, trivially safe. It's pure luck.

**Fix:** curate decoy pairs (the way `QUESTION_PAIRS`/`SCALE_PAIRS` already
work) rather than sampling the pack.

### 4.3 Turn order is fully random every pass
There's a real first-mover disadvantage (the first clue is the least informed)
and a last-mover advantage (most information). Rotating the start position each
pass would be fairer than re-shuffling.

### 4.4 Mode coverage
Four modes share one loop. Cheap additions with high replay value: a "double
agent" (two imposters who don't know each other), a "hint budget" where crew can
spend a shared reveal, and word packs by difficulty.

---

## P5 — Polish

- `theme_color` / `background_color` are `#0d091a`; the app's actual base is
  `#06030e`. The PWA status bar doesn't match the app.
- **No `<meta name="description">` and no Open Graph tags.** Links shared into
  Messenger/WhatsApp — the primary distribution channel for a party game —
  render with no title card, image or description.
- localStorage keys are still `forraeder.*` (the app's former name). Harmless,
  but it means a rename already silently orphaned everyone's saved profile once.
- Google Fonts is render-blocking and third-party; self-hosting the two weights
  actually used would be faster and avoids the privacy question.
- 8 hardcoded Danish strings sit in components instead of `strings.ts`
  (`SettingsPanel` taglines, `VotePhase` "Mistænkt?", `PhaseChrome` mute labels,
  `PackPicker` search/placeholder). Several are mine from the concept port.
- `Test Screenshots/` is two design iterations stale; those specs run against the
  deployed URL so they need a deploy to regenerate.
- `orientation: portrait` is locked in the manifest — fine for phones, poor on
  tablets.

---

## Suggested order of work

1. **0.5 timers/auto-advance** and **0.2 room cleanup** — these are the two that
   will bite in production.
2. **3.1 join links + share** — largest UX return for the effort.
3. **0.1, 0.3, 0.4, 0.7, 0.8, 0.9** — small, contained correctness fixes.
4. **2.1–2.4** — accessibility; 2.1/2.2 are one-line fixes.
5. **1.1 presence** — before any real concurrency.
6. **1.4 engine tests** — then refactor 1.2/1.3 safely behind them.
7. **3.2 scoring visibility**, **4.1 bots** — the two biggest "feels unfinished"
   gaps in actual play.
