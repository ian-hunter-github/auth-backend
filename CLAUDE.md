# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Netlify Dev on port 3999
npm run build        # Build Netlify functions
npm run lint         # ESLint
npm run typecheck    # TypeScript compiler
npm run format       # Prettier
npm run test:run     # Vitest (single run, all tests)
npm run ci           # lint + typecheck + test
```

**Run a single test file:**
```bash
npm run test:run -- test/integration/authLogin.test.ts
```

## Architecture

This is a serverless authentication backend built on **Netlify Functions** + **TypeScript**. There is no Express — each endpoint is a Netlify Function.

### Request Flow

```
netlify/functions/<name>.ts
  → adapters/netlify/  (Netlify event → AppHttpRequest)
  → app/handlers/      (business logic)
  → domains/           (domain services)
  → services/          (auth provider selection, DB access)
  → adapters/netlify/  (AppHttpResponse → Netlify response)
```

### Key Directories

- **`netlify/functions/`** — one file per endpoint; thin wrappers that adapt and delegate
- **`src/adapters/netlify/`** — translates between Netlify event/response and internal types
- **`src/app/handlers/`** — HTTP handlers (auth, me, health, admin)
- **`src/domains/`** — domain logic organized by capability: `auth/`, `profile/`, `admin/`, `users/`, `system/`
- **`src/services/`** — provider selection and DB access; `authService.ts` picks `fakeAuthProvider` vs `postgresAuthProvider` based on `AUTH_PROVIDER` env var
- **`src/platform/`** — shared infrastructure: JWT, rate limiting, login lockout, error types, config, HTTP utilities
- **`src/contracts/`** — request/response type definitions
- **`db/identity/`** — SQL schema (`ddl.sql`), reset, and seed scripts

### Response Envelope

All responses follow this shape:
```json
{ "ok": boolean, "requestId": string, "data"?: object, "error"?: { "code", "message" } }
```

### Auth Provider Pattern

Auth operations are abstracted behind `authProvider.ts`. The provider is selected at runtime:
- **`fake`** — deterministic, no DB required; demo credentials: `demo` / `letmein`
- **`postgres`** — production Neon/Postgres backend

Set via `AUTH_PROVIDER=fake|postgres` in `.env.local`.

### Testing

Tests are integration tests that hit a real Netlify Dev instance. Vitest's `globalSetup` starts a single Netlify Dev process shared across all test files. Tests run serially (parallelism disabled) with 120s timeouts.

CI uses `AUTH_PROVIDER=fake` — no database needed.

### Security

- **JWT**: HS256 access tokens + refresh tokens stored in DB
- **Rate limiting**: IP-based and IP+identifier sliding window
- **Login lockout**: 8 failures in 15 min → 15 min lockout
- **Security headers**: CSP, HSTS, X-Frame-Options set on all responses

### Environment Variables

```
AUTH_PROVIDER=fake|postgres
AUTH_JWT_SECRET=<32+ bytes>
# If postgres:
PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT, PGSSLMODE
```
