# KimKimi — _do you know who I am?_

A two-player quiz game about **how well two people actually know each other**.
Each player first answers questions about themselves to build an answer key; then both are
quizzed on each other in synchronized rounds, and the game reveals **who knows whom better**.

Rooms start fast with a short join code (or QR), and neither side's turn advances until both
players have answered — the server is the single source of truth for every round.

## Architecture

A monorepo under `apps/`, with PostgreSQL as the source of truth for data and game rules.

| App | Stack | Role |
|-----|-------|------|
| `web` | **Next.js** (site + API route handlers) · Prisma | Public site **and** the game backend — rooms, rounds, scoring, auth |
| `admin` | **Next.js** | Category / question / content management (admin-only) |
| `mobile` | **Flutter** (iOS + Android) | Primary game client |
| _db_ | **PostgreSQL** | Persistent state & business rules |

- **One deployable.** The backend lives in `apps/web/app/api/*` (route handlers) with the
  game logic in `apps/web/lib/server/*`. There is no separate API host, so there is no
  cold-start wait on the first request.
- **Round sync by polling.** Clients re-read `GET /api/rooms/:secretId/state` every two
  seconds. The game is two-player and turn-based, so this replaces the old WebSocket
  gateway — which serverless hosting cannot keep open anyway.
- **JWT** auth for the admin panel (`Bearer` token, `role=admin` enforced per route).
- Question pool is seeded from `apps/web/prisma/*-pool.ts` (384 profile/game pairs across
  six categories).

## Getting started

**Prerequisites:** Node.js 20+, Docker Desktop, Flutter SDK (for the mobile client).

```bash
# 1. Database — Postgres on host port 5433
docker compose up -d

# 2. Web + API (apps/web) — site and API at :3000
cd apps/web
cp .env.local.example .env.local
npx prisma migrate deploy
npx prisma db seed
npm run dev

# 3. Admin panel (apps/admin) — port 3001
cd apps/admin && cp .env.local.example .env.local && npm run dev

# 4. Mobile client — point it at the web server
cd apps/mobile
flutter run --dart-define=API_BASE=http://10.0.2.2:3000/api   # Android emulator
```

Seeded admin (local): `admin@kimkimi.local` / `Admin123!`

### Tests

```bash
cd apps/web    && npx tsc --noEmit && npm run build   # typecheck + build
cd apps/admin  && npm run test:pw                     # Playwright (dev server up)
cd apps/mobile && flutter analyze && flutter test     # analyze + widget/unit tests
```

## Deployment

Everything runs on free tiers, on a single vendor — see [`docs/DEPLOY.md`](docs/DEPLOY.md).

| Piece | Where |
|---|---|
| `apps/web` (site + API) | Vercel — root directory `apps/web` |
| `apps/admin` | Vercel — root directory `apps/admin`, `API_URL` points at the web app's `/api` |
| Postgres | Neon (scale-to-zero, resumes in about a second) |
| `apps/mobile` | Play Store / App Store, built with `--dart-define=API_BASE=https://<domain>/api` |

## Tech stack

`Next.js` · `Prisma` · `PostgreSQL` · `Zod` · `Flutter` · `TypeScript` · `Vercel` · `Neon`
