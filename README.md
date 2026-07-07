# KimKimi — _do you know who I am?_

A real-time, two-player quiz game about **how well two people actually know each other**.
Each player first answers questions about themselves to build an answer key; then both are
quizzed on each other in synchronized rounds, and the game reveals **who knows whom better**.

Rooms start fast with a short join code (or QR), and neither side's turn advances until both
players have answered — the server is the single source of truth for every round.

## Architecture

A monorepo under `apps/`, with PostgreSQL as the source of truth for data and game rules.

| App | Stack | Role |
|-----|-------|------|
| `api` | **NestJS** (REST + WebSocket) · Prisma | Game logic, rooms, real-time turns, auth |
| `web` | **Next.js** | Public site — marketing, SEO, store bridge, optional browser play |
| `admin` | **Next.js** | Category / question / content management (admin-only) |
| `mobile` | **Flutter** (iOS + Android) | Primary game client |
| _db_ | **PostgreSQL** (Docker) | Persistent state & business rules |

- Real-time round sync via a **WebSocket gateway** (versioned event names — see
  [`apps/api/docs/WS_EVENTS.md`](apps/api/docs/WS_EVENTS.md)).
- **JWT** auth over httpOnly cookies; admin routes restricted to `ROLE_ADMIN`; per-origin CORS.
- Local Postgres via Docker (named volume + healthcheck).

## Getting started

**Prerequisites:** Node.js 20+, Docker Desktop, Flutter SDK (for the mobile client).

```bash
# 1. Database — Postgres on host port 5433
docker compose up -d

# 2. API (apps/api) — REST at :4000, Swagger at /docs
cd apps/api
cp ../../.env.example .env
npx prisma migrate deploy
npx prisma db seed
npm run start:dev

# 3. Admin panel (apps/admin) — port 3001
cd apps/admin && cp .env.local.example .env.local && npm run dev

# 4. Public web (apps/web) — port 3000
cd apps/web && cp .env.local.example .env.local && npm run dev
```

Seeded admin (local): `admin@kimkimi.local` / `Admin123!`

### Tests

```bash
cd apps/api && npm test && npm run test:e2e   # unit + e2e
cd apps/admin && npm run test:pw              # Playwright (dev server up)
cd apps/mobile && flutter test                # Flutter widget/unit tests
```

## Screenshots

_Coming soon._

## Tech stack

`NestJS` · `Prisma` · `PostgreSQL` · `WebSocket / Socket.io` · `Next.js` · `Flutter` · `Docker` · `TypeScript`
