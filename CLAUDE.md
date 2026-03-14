# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Netlify Dev server (port 3999)
npm run build        # Build Netlify functions
npm run typecheck    # TypeScript type-check
npm run lint         # ESLint
npm run format       # Prettier
npm run test         # Run tests in watch mode (Vitest)
npm run test:run     # Run tests once (CI mode)
npm run ci           # lint + typecheck + test (full CI pipeline)
```

**Run a single test file:**
```bash
npx vitest run test/auth-login.test.ts
```

**Database schema (dev/Neon):**
```bash
PGSYSTEM=neon scripts/identity_schema_dev.sh
```

**Smoke test against running server:**
```bash
./scripts/smoke-api.sh --debug
```

## Architecture

This is a **serverless auth backend** deployed on Netlify Functions. There is no traditional Express server — each endpoint is a standalone function in `netlify/functions/`.

### Request Flow

Each function handler:
1. Extracts/generates a `requestId` (UUID, passed via header or created)
2. Validates HTTP method
3. Parses JSON body
4. Applies rate limiting + brute-force lockout (login only)
5. Delegates to the service layer
6. Wraps response in standardized envelope: `{ ok, requestId, data?, error? }`

### Auth Provider Pattern

All auth logic routes through `src/services/authService.ts` which selects a provider based on `AUTH_PROVIDER` env var:
- **`fake`** — in-memory JSON files in `/tmp/`; used for all tests and CI; deterministic tokens (`fake-access-token.{userId}`)
- **`postgres`** — Neon PostgreSQL; used in production

The provider interface is defined by `IAuthProvider`. Adding a new provider means implementing that interface and registering it in `authService.ts`.

### Token Strategy

- **Access tokens**: HS256 JWTs. Payload: `{ sub, iat, exp, jti }`. TTL default 900s (`AUTH_JWT_TTL_SECONDS`). Custom sign/verify in `src/lib/jwt.ts` (no `jsonwebtoken` library — manual HMAC with timing-safe comparison).
- **Refresh tokens**: `<provider>-refresh-token.<random-hex>`. Stored SHA256-hashed in `identity.sessions`. 60-minute TTL. Token rotation on refresh (old revoked, new issued). Session family lineage tracked.
- **Passwords**: `sha256(salt || plaintext)`. Salt is 16 random bytes (hex).

### Database

Direct `pg` (no ORM). Schema lives in `db/identity/ddl.sql`:
- `identity.users` — accounts, profile fields, salted password hash
- `identity.sessions` — refresh tokens (hashed), revocation, IP/UA metadata
- `identity.audit_log` — append-only action log (actor, target, request context, JSONB details)
- `identity.rate_limits` — bucketed counters per route/key
- `identity.auth_failures` — window-based brute-force tracking

DDL uses `IF NOT EXISTS` / `ADD COLUMN IF NOT EXISTS` for safe re-runs. Env vars: `PGHOST`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`, `PGPORT`, `PGSSLMODE`.

### Security Modules (`src/security/`)

- `runtimeConfig.ts` — validates all required env vars on startup; missing vars = immediate 500
- `rateLimiter.ts` — per-route, per-key bucketed limits; falls back to in-memory Map if Postgres unavailable
- `loginLockout.ts` — brute-force lockout by identifier+IP; same in-memory fallback
- `adminPolicy.ts` — `ADMIN_USER_EMAILS` env var (comma/space-separated) gates admin role assignment
- `adminAuth.ts` — `requireAdminUser()` checks `roles` array for `"admin"`

### Key Directories

```
src/lib/          # Utilities: errors, JWT, response envelope, env, body parsing
src/contracts/    # DTOs and response types for every endpoint
src/services/     # Business logic; postgres/ subdirectory for DB-layer queries
src/security/     # Rate limiting, lockout, admin auth, runtime config validation
netlify/functions/# One file per HTTP endpoint
db/identity/      # DDL, reset, and seed scripts
test/             # Vitest integration tests (hit the real Netlify Dev server)
scripts/          # Bash utilities: smoke tests, health checks, DB setup
```

### Testing

Tests are **integration tests** that hit a real Netlify Dev server (started once in `test/globalSetup.ts`). `AUTH_PROVIDER=fake` is forced globally. Tests run serially (single-threaded) to avoid port conflicts. Timeouts: 120s setup/teardown, 120s per test.

There are no unit tests — the test suite exercises the full HTTP stack.

## Environment Setup

Copy `.env.example` to `.env.local` and set at minimum:
```
AUTH_PROVIDER=fake        # or 'postgres' for local DB dev
AUTH_JWT_SECRET=<secret>  # required; hex or UTF-8
```

For Postgres: populate from `postgres/env/neon/.env` (Neon connection credentials).
