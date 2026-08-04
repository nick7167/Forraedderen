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

`rooms.settings.gameMode` selects one of four modes:

| Mode | Crew sees | Imposter sees | Key rule |
| --- | --- | --- | --- |
| `spy` / Klassisk | Secret word | Their imposter role, but no word | Imposters can optionally know each other. |
| `undercover` | Secret word | A related decoy word | Imposters are not told their role until resolution. |
| `questions` / Spørgsmål | Crew question | Related-but-different question | Everyone answers privately, then answers are revealed for discussion. |
| `scale` / Måleren | Crew prompt | Related-but-different prompt | Everyone privately chooses 1–5; answers reveal together for discussion. |

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
| `round.ts` | Match/round engine, role deal, privacy-projected round read model, scoring, voting, bot scheduler, and match highlights. |
| `lib.ts` | Guest-or-Clerk player authorization, presence projection, code generation, active-player queries. |
| `presence.ts` | Heartbeat mutation; online threshold is 12 seconds. |
| `packs.ts` | Built-in pack seeding/reseeding, listing, and custom pack creation. |
| `packData.ts` | Barrel over `content/packs.*.ts`; exports `DANISH_PACKS`. |
| `questionData.ts` | Barrel over `content/questions.*.ts`; exports `QUESTION_PAIRS`. |
| `scaleData.ts` | Barrel over `content/scale.*.ts`; exports `SCALE_PAIRS`. |
| `content/` | The authored content itself, split by mode and tier — see Content data. |
| `users.ts`, `auth.config.ts` | Clerk identity mirroring and JWT configuration. |

Authorization is server-side. A player acts either through their signed-in
Convex user or by proving their room player ID and local guest secret. Public
player projections never return a guest secret. `getRoundState` intentionally
returns each requester only the role, word/question, answers, and vote details
they are allowed to see in the current phase.

## Content data

Authored content lives in `convex/content/`, one file per mode per tier.
`questionData.ts`, `scaleData.ts` and `packData.ts` are thin barrels that
concatenate those files and stamp each item's tier; every consumer imports the
barrel, so adding a tier file never touches call sites.

| File | Holds |
| --- | --- |
| `content/types.ts` | `QuestionPair`, `ScalePair`, `SeedPack`, `ContentTier`, `tagTier`. |
| `content/questions.{family,party,dansk}.ts` | Spørgsmål pairs (~1,100 total). |
| `content/scale.{family,party,dansk}.ts` | Måleren pairs (~670 total). |
| `content/packs.{core,extra,party,dansk}.ts` | 39 word packs, ~6,100 words. |

Current pool sizes: **1,101** question pairs, **667** scale pairs, **6,133**
words across **39** packs. These are floors enforced by
`content-quality.test.ts` — the draw is memoryless, so pool size is the only
thing preventing repeats.

- **Tiers are additive.** `family` (untagged) is always in the pool; `party`
  ("Krydret indhold", opt-in) and `dansk` ("Dansk kultur", on by default) layer
  on top. `enabledTiers`/`inEnabledTier` in `round.ts` do the filtering; the
  pack picker hides packs whose tier is off, but an explicitly pinned pack is
  always honoured.
- Add new pairs/packs to the matching `convex/content/` file, never to a barrel.
- Built-in packs are seeded lazily on room creation; a host may pin a built-in
  or custom pack, otherwise a random in-tier in-code pack is used.
- Guests can make one-off custom packs; signed-in users can reuse their packs.
- `SCALE_PAIRS` is used only by Måleren. Every pair must work with the same
  1–5 response scale; word-pack modes must never read either prompt pool.
- **Every prompt must stand alone.** A player only ever sees their own side of a
  pair, so a pronoun pointing at the partner prompt ("…får du af det?") is
  unanswerable. Guarded by a test.
- **No brand names or licensed content** in packs — the `dansk` tier uses
  traditions, dishes and places instead.

## Match highlights

The final-results screen subscribes to `round.getMatchAnalytics`, which derives
four authoritative highlights from stored role assignments and secret ballots:
best detective (highest crew voting accuracy), most correct votes, most
suspected (votes received), and best bluff (surviving imposter wins). Ties are
shown together. The query only returns results to a verified room member after
the room enters `finished`.

## Operations and verification

| Command | Use |
| --- | --- |
| `pnpm dev` | Run Vite and `convex dev` together. |
| `pnpm lint` | Typecheck the project. |
| `npx convex run packs:reseedBuiltInPacks` | **Required after any `convex/content/packs.*.ts` change** — otherwise the deployment keeps serving the previously seeded words. |
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
rules/settings/packs, a full Klassisk round and match result, the Spørgsmål
flow, Måleren through match highlights, the reveal-card fit specs, and the
content-tier switches. Screenshots are retained in `Test Screenshots/` and
`qa-screenshots/`.

Vitest covers the round engine plus three content suites:

| Suite | Guards |
| --- | --- |
| `content-length.test.ts` | Reveal-card envelope: question ≤110, scale ≤70, word ≤24 chars. |
| `content-quality.test.ts` | Pool-size floors, duplicates and near-duplicates, opener distribution (no shape over 25%), answer-type match within a pair, stand-alone prompts, charset, pack consistency. |
| `content-tiers.test.ts` | Additive tier filtering and the defaults for pre-tiering rooms. |

Last verified after the content expansion: `pnpm lint`, `pnpm vitest run`
(55 tests), `pnpm build`, `npx convex run packs:reseedBuiltInPacks`, and the
full Playwright suite (23 tests) against a local dev server.
