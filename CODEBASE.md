# Kamæleon — Codebase Guide

This is the living map of the application. Update it in the same change as any
feature, flow, data model, deployment, or test change that makes a statement
below inaccurate.

## Product and navigation

Kamæleon is a Danish, mobile-first social-deduction PWA. It supports a normal
guest-first game experience and optional Clerk sign-in.

| Route | Screen | Purpose |
| --- | --- | --- |
| `/` | `HomeScreen` | Set a local name/avatar; create or join a room; optional sign-in; install prompt. |
| `/room/:roomId` | `GameRoom` | Live lobby, in-round phases, results, removal, and spectator states. |

The app is deliberately phone-first: the app shell is height-bounded,
safe-area-aware, and each screen has one scrolling region with a fixed header
and/or primary action. The visual system is the dark neon/glass design defined
in `src/index.css`; `NeonBackdrop`, `Screen`, and `PhaseHero` are its primary
layout primitives.

## Player flow

```text
Home → create/join → lobby → role/question reveal + ready
     → clues or simultaneous answers → discussion → secret vote
     → round reveal/scoreboard → next round or final results → lobby
```

- A room needs at least three players. The host can add up to twelve total
  players, including bots, configure settings, and start/advance the match.
- Late joiners sit out the current round and become active on the next one.
- The host can skip a stalled clue turn or resolve a vote early. If the host is
  offline for 15 seconds, another member can claim host.
- Bots are marked ready automatically and act through a scheduled Convex
  mutation, with a 1.3-second pacing delay.

## Game rules implemented

`rooms.settings.gameMode` selects one of three modes:

| Mode | Crew sees | Imposter sees | Key rule |
| --- | --- | --- | --- |
| `spy` / Klassisk | Secret word | Their imposter role, but no word | Imposters can optionally know each other. |
| `undercover` | Secret word | A related decoy word | Imposters are not told their role until resolution. |
| `questions` / Spørgsmål | Crew question | Related-but-different question | Everyone answers privately, then answers are revealed for discussion. |

Clue rounds run in randomized sequential order. Question answers are stored in
the `clues` table and are hidden from other players until discussion. Votes are
secret during voting; only voter completion is public. A tie immediately gives
the imposters the round. Multi-imposter games use iterative ballots. Correct
crew voters receive +1; surviving imposters receive +2.

## Frontend

| Area | Main files | Notes |
| --- | --- | --- |
| Bootstrap/providers | `src/main.tsx`, `src/App.tsx` | Clerk + Convex providers; `BrowserRouter`; iOS viewport-height workaround. |
| Identity/connection | `src/lib/guest.ts`, `src/hooks/useStoreUser.ts`, `src/hooks/useGameRoom.ts` | Guest secret and room seat are local-storage-backed; authenticated identities are mirrored to Convex; room heartbeat runs every 4 seconds while visible. |
| Game screens | `src/components/game/` | `GameRoom` selects lobby, reveal, clues, discussion, vote, round reveal, and final results. |
| Realtime calls | `api.games`, `api.round`, `api.packs`, `api.presence`, `api.users` | The frontend subscribes to `games.getRoomState` and `round.getRoundState`; mutations drive all state changes. |
| Resilience/feedback | `OfflineIndicator`, `AddToHomeScreen`, `feedback.ts` | Offline banner, PWA install flow, and mute-aware Web Audio/haptics. |

## Backend and data model

Convex source is in `convex/`; always read `convex/_generated/ai/guidelines.md`
before changing Convex code.

| Module | Responsibility |
| --- | --- |
| `schema.ts` | `users`, `rooms`, `players`, `rounds`, `clues`, `votes`, and `packs` tables. |
| `games.ts` | Room lifecycle, host controls, player/bot management, settings, room read model. |
| `round.ts` | Match/round engine, role deal, privacy-projected round read model, scoring, voting, and bot scheduler. |
| `lib.ts` | Guest-or-Clerk player authorization, presence projection, code generation, active-player queries. |
| `presence.ts` | Heartbeat mutation; online threshold is 12 seconds. |
| `packs.ts` | Built-in pack seeding/reseeding, listing, and custom pack creation. |
| `packData.ts` | Built-in Danish word categories. |
| `questionData.ts` | Built-in question pairs. `QUESTION_PAIRS` is the complete exported draw pool. |
| `users.ts`, `auth.config.ts` | Clerk identity mirroring and JWT configuration. |

Authorization is server-side. A player acts either through their signed-in
Convex user or by proving their room player ID and local guest secret. Public
player projections never return a guest secret. `getRoundState` intentionally
returns each requester only the role, word/question, answers, and vote details
they are allowed to see in the current phase.

## Content data

- Built-in word packs are seeded lazily when a room is created; a host may pin a
  built-in or custom pack, otherwise the game chooses a random in-code pack.
- Guests can make one-off custom packs; signed-in users can reuse their packs.
- `QUESTION_PAIRS` combines `QUESTION_PAIRS_EXTRA` and
  `QUESTION_PAIRS_BASE`. Add every new valid `{ crew, imposter }` pair to one
  of those arrays; do not create a standalone unused question list.

## Operations and verification

| Command | Use |
| --- | --- |
| `pnpm dev` | Run Vite and `convex dev` together. |
| `pnpm lint` | Typecheck the project. |
| `pnpm build` | Typecheck and generate the production PWA build. |
| `pnpm test:e2e` | Run mobile Playwright tours against a production build. |
| `pnpm dev:convex` | Provision/watch Convex; requires the Clerk issuer environment variable in Convex. |

Environment variables in `.env.local`: `VITE_CONVEX_URL` and
`VITE_CLERK_PUBLISHABLE_KEY`. Vercel rewrites all routes to `index.html`.
PWA service-worker settings live in `vite.config.ts`; application icons live in
`public/` and can be regenerated from `public/logo.svg` with
`pnpm generate-pwa-assets`.

## Test coverage and current verification

Playwright covers the home screen, install prompt, avatar picker, lobby,
rules/settings/packs, a full Klassisk round and match result, and the
Spørgsmål flow. Screenshots are retained in `Test Screenshots/` and
`qa-screenshots/`.

Last verified after the question-pool fix: `pnpm lint`, `pnpm build`, and
`pnpm test:e2e`.
