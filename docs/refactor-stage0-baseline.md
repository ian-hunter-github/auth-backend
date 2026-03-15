# Stage 0 Baseline: Current Working Contract for `auth-backend`

This document freezes the working baseline that must remain intact throughout the staged refactor.

## 1. Core rule

Until a later stage explicitly changes something, the following must remain true:

- tests stay green
- CI stays green
- Netlify deployment keeps working
- demo GUI continues working

## 2. Canonical local checks

Use these checks as the local baseline:

### 2.1 CI-parity checks

```bash
./scripts/check-ci-local.sh
```

This covers the current default local CI-parity path:

- install dependencies (`npm ci` by default)
- lint
- typecheck
- test suite via `npm run test:run`

### 2.2 Smoke checks

```bash
./scripts/smoke-local.sh
```

This starts a local `netlify dev`, waits for readiness, runs the API smoke suite, and shuts the server down.

### 2.3 Canonical Stage 0 aggregate check

```bash
./scripts/check-all-local.sh
```

This should be treated as the single local refactor gate for default checks.

### 2.4 Optional Postgres-backed checks

```bash
./scripts/check-pg-local.sh
```

This remains optional and separate from the default fake-provider path.

## 3. Current package-level commands

Current root package commands relevant to the refactor baseline:

```bash
npm run lint
npm run typecheck
npm run test:run
npm run build
npm run dev
```

## 4. Current API surface

Current Netlify function entrypoints:

- `/.netlify/functions/health`
- `/.netlify/functions/health-admin`
- `/.netlify/functions/auth-login`
- `/.netlify/functions/auth-logout`
- `/.netlify/functions/auth-refresh`
- `/.netlify/functions/auth-register`
- `/.netlify/functions/admin-users`
- `/.netlify/functions/me`

These are the baseline public/server entrypoints that must not be broken accidentally during Stage 0 or Stage 1.

## 5. Current source layout relevant to refactor planning

Existing implementation areas:

- `src/lib` — shared utility code
- `src/security` — auth/security/runtime-adjacent concerns
- `src/services` — service/business logic
- `netlify/functions` — Netlify entrypoints
- `test` — current mixed test layout
- `demo-client` — working GUI client

These existing folders remain the source of truth until later stages explicitly move code.

## 6. Current remote gates

### 6.1 GitHub CI

Current CI runs:

- install
- lint
- typecheck
- tests

### 6.2 Netlify preview smoke

Deploy preview smoke runs against Netlify preview URLs and executes `./scripts/smoke-api.sh` with retries.

### 6.3 Production deploy

Main-branch deploy path currently builds and deploys to Netlify.

## 7. Runtime and operational environment notes

The exact environment variable surface should remain unchanged during Stage 0 and Stage 1.

Operationally relevant variables already visible from the repo/scripts include:

### 7.1 Runtime / auth / environment

- `APP_ENV`
- `AUTH_PROVIDER`
- `AUTH_JWT_SECRET`
- `API_BASE_URL`
- `SERVER_LABEL`

### 7.2 Database-related variables/templates already present in repo materials

- `DB_DIALECT`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_SSLMODE`
- `DB_LABEL`
- `PGHOST`
- `PGPORT`
- `PGDATABASE`
- `PGUSER`
- `PGPASSWORD`
- `PGSSLMODE`

### 7.3 Test / local execution variables

- `NETLIFY_DEV_PORT`
- `RUN_PG_TESTS`
- `SMOKE_USERNAME`
- `SMOKE_PASSWORD`
- `NETLIFY_PORT_MIN`
- `NETLIFY_PORT_MAX`
- `STATIC_PORT_MIN`
- `STATIC_PORT_MAX`
- `READY_TIMEOUT_S`
- `READY_STABLE_N`
- `READY_SLEEP_S`

## 8. Demo GUI expectations

The demo GUI is considered working if all of the following remain true:

1. the demo client still starts successfully
2. it can talk to the current API without code changes
3. login still works
4. logout still works
5. the user panel can fetch current session/user data
6. the admin panel can continue to perform admin-user flows already supported today

No GUI code should be changed in Stage 0 or Stage 1 unless required for a broken baseline, which is not expected.

## 9. Explicit non-goals for Stage 0 / Stage 1

Do **not** do any of the following yet:

- move source files
- rename imports
- introduce re-export shims
- add Node/OCI runtime code
- change database schema
- alter Netlify entrypoint behavior
- reorganize tests
- change demo-client host behavior

## 10. Stage gate definition

Before proceeding beyond any stage, verify:

1. local checks pass
2. demo GUI still works manually
3. GitHub CI is green
4. Netlify preview smoke is green

That is the frozen behavioral baseline.
