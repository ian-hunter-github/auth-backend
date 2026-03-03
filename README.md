# Identity Backend Service

Minimal authentication backend built with:

- Node 20+
- TypeScript
- Netlify Functions (no Express)
- Postgres (Neon) provider
- Deterministic fake provider (CI-safe default)
- HS256 JWT access tokens

---

# Architecture

## Providers

- `fake` (default in tests / local CI)
- `postgres` (Neon-backed, password + JWT)

Provider is selected via:

```
AUTH_PROVIDER=fake|postgres
```

## Endpoints

```
POST /.netlify/functions/auth-login
GET  /.netlify/functions/me
GET  /.netlify/functions/health
```

All responses use envelope format:

```
{
  "ok": boolean,
  "requestId": string,
  "data"?: object,
  "error"?: { code, message }
}
```

---

# Local Development

## 1. Install

```
npm ci
```

## 2. Configure environment

Create `.env.local` (do not commit):

```
AUTH_PROVIDER=postgres
AUTH_JWT_SECRET=<generate with: openssl rand -base64 32>
```

Load Postgres (Neon) env:

```
postgres/env/neon/.env
```

Required DB vars:

```
PGHOST
PGDATABASE
PGUSER
PGPASSWORD
PGPORT
PGSSLMODE=require
```

## 3. Apply DB schema

```
PGSYSTEM=neon scripts/identity_schema_dev.sh
```

## 4. Start Netlify Dev

```
set -a
source .env.local
source postgres/env/neon/.env
set +a

netlify dev
```

Server will start on:

```
http://localhost:3999
```

## 5. Run smoke test

```
./scripts/smoke-api.sh --debug
```

---

# Running Tests

Integration tests start Netlify Dev once via Vitest global setup.

```
npm run test:run
```

CI-safe default provider is `fake`.

---

# Deployment to Netlify

## 1. Connect repository

- Connect GitHub repo to Netlify
- Enable automatic deploys

## 2. Configure Environment Variables (Netlify Dashboard)

Required for Postgres provider:

```
AUTH_PROVIDER=postgres
AUTH_JWT_SECRET=<32+ byte random secret>

PGHOST=...
PGDATABASE=...
PGUSER=...
PGPASSWORD=...
PGPORT=...
PGSSLMODE=require
```

JWT secret generation:

```
openssl rand -base64 32
```

## 3. Trigger deploy

```
netlify deploy --prod
```

or push to main branch.

---

# Post-Deploy Verification

Run remote smoke test:

```
BASE_URL=https://<site>.netlify.app ./scripts/smoke-api.sh --debug
```

Check health:

```
./scripts/health.sh https://<site>.netlify.app
```

---

# CI Remote Smoke (Deploy Previews)

This project can run the same smoke test automatically against Netlify **Deploy Previews** on every PR.

## 1. Ensure Netlify Deploy Previews are enabled

- Connect the GitHub repo to Netlify
- Enable Deploy Previews (default for most GitHub-connected sites)

## 2. Add GitHub Actions workflow

Create:

```
.github/workflows/netlify-preview-smoke.yml
```

This workflow listens for Netlify `deployment_status` events. When a Deploy Preview finishes successfully, GitHub provides the preview URL in `deployment_status.environment_url`. The workflow runs:

```
BASE_URL=<preview-url> ./scripts/smoke-api.sh --debug
```

## 3. What you get

- PR shows a failing check if deploy preview auth is broken (env vars, Neon connectivity, JWT secret, etc.)
- No manual steps needed to validate remote runtime changes

---

# Security Model

- Passwords stored as salted SHA256 hashes
- JWT access tokens signed with HS256
- Token tampering rejected
- Token expiry enforced
- No forgeable access tokens

---

# Project Structure

```
src/
  contracts/
  lib/
  services/
  functions/

db/identity/
  ddl.sql
  reset.sql
  seed.sql

scripts/
  smoke-api.sh
  smoke-local.sh
  health.sh
```

---

# Manual Verification Checklist

Local:

- [ ] `npm run test:run` passes
- [ ] `smoke-api.sh` passes locally
- [ ] Tampered JWT rejected

Deployed:

- [ ] Remote smoke passes
- [ ] Health shows Postgres env vars present
- [ ] Wrong password returns 401
- [ ] Tampered token returns 401

---

# Version

Current version: 0.1.0

