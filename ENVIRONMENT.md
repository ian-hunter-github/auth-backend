# Repo Pack

Generated: 2026-03-14T14:33:37Z

## Goals

To enhance with User Profile data


---

## Tree

```
├── create-env.sh
├── db
│   └── identity
│       ├── ddl.sql
│       ├── reset.sql
│       └── seed.sql
├── demo-client
│   ├── docs
│   │   └── identity-react-shim-guide.md
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── src
│   │   ├── api
│   │   │   └── apiClient.ts
│   │   ├── App.tsx
│   │   ├── auth
│   │   │   ├── AuthContext.tsx
│   │   │   ├── tokenStore.ts
│   │   │   └── useAuth.ts
│   │   ├── components
│   │   │   ├── DebugLogViewer.tsx
│   │   │   ├── JsonViewer.tsx
│   │   │   ├── LoginModal.tsx
│   │   │   ├── SessionPanelBody.tsx
│   │   │   ├── SessionPanelChrome.tsx
│   │   │   └── SplitLayout.tsx
│   │   ├── config.ts
│   │   ├── debug
│   │   │   └── DebugContext.tsx
│   │   ├── features
│   │   │   └── adminUsers
│   │   │       ├── AdminUserFormModal.tsx
│   │   │       └── AdminUsersTable.tsx
│   │   ├── hooks
│   │   │   ├── useAdminPanelModel.ts
│   │   │   ├── useIdentityClient.ts
│   │   │   ├── useIdentityFacade.ts
│   │   │   ├── useIdentitySession.ts
│   │   │   ├── usePanelIdentity.ts
│   │   │   └── useUserPanelModel.ts
│   │   ├── lib
│   │   │   ├── identity-client
│   │   │   │   ├── client.ts
│   │   │   │   ├── errors.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── tokenStore.ts
│   │   │   │   └── types.ts
│   │   │   └── toApiError.ts
│   │   ├── main.tsx
│   │   ├── pages
│   │   │   └── DemoPage.tsx
│   │   ├── panels
│   │   │   ├── AdminPanel.tsx
│   │   │   └── UserPanel.tsx
│   │   ├── types
│   │   │   ├── adminUsersTypes.ts
│   │   │   ├── apiTypes.ts
│   │   │   ├── authTypes.ts
│   │   │   └── meTypes.ts
│   │   └── vite-env.d.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── deno.lock
├── docs
│   ├── api.html
│   └── api.md
├── ENVIRONMENT.md
├── eslint.config.js
├── .github
│   └── workflows
│       ├── ci.yml
│       ├── netlify-preview-smoke.yml
│       └── push-ping.yml
├── .gitignore
├── identity-backend-service@0.1.0
├── index.html
├── netlify
│   └── functions
│       ├── admin-users.ts
│       ├── auth-login.ts
│       ├── auth-logout.ts
│       ├── auth-refresh.ts
│       ├── auth-register.ts
│       ├── health-admin.ts
│       ├── health.ts
│       └── me.ts
├── netlify.toml
├── openapi.yaml
├── package.json
├── .prettierignore
├── .prettierrc.json
├── project-status.json
├── scripts
│   ├── api-docs.sh
│   ├── architecture-diagram.txt
│   ├── check-ci-local.sh
│   ├── check-gh-ci-status.sh
│   ├── check-pg-local.sh
│   ├── dev-demo-client.sh
│   ├── generate-build-info.sh
│   ├── get-admin-token.sh
│   ├── health-admin.sh
│   ├── health.sh
│   ├── load-env.sh
│   ├── netlify-dev.sh
│   ├── netlify-env-sync.sh
│   ├── normalize-db-env.sh
│   ├── pg_psql.sh
│   ├── rebuild-db-dev.sh
│   ├── release-prod.sh
│   ├── rotate-jwt-secret.sh
│   ├── run-env.sh
│   ├── smoke-api.sh
│   ├── smoke-local.sh
│   └── verify-ci-flow.sh
├── src
│   ├── contracts
│   │   ├── adminUsers.ts
│   │   ├── auth.ts
│   │   ├── healthAdmin.ts
│   │   ├── health.ts
│   │   └── me.ts
│   ├── generated
│   │   └── buildInfo.ts
│   ├── lib
│   │   ├── authHeader.ts
│   │   ├── body.ts
│   │   ├── env.ts
│   │   ├── errors.ts
│   │   ├── jwt.ts
│   │   ├── requestId.ts
│   │   └── response.ts
│   ├── meta.ts
│   ├── security
│   │   ├── adminAuth.ts
│   │   ├── adminPolicy.ts
│   │   ├── config.ts
│   │   ├── loginLockout.ts
│   │   ├── rateLimiter.ts
│   │   ├── requestContext.ts
│   │   └── runtimeConfig.ts
│   └── services
│       ├── adminUsersService.ts
│       ├── auditLogService.ts
│       ├── authProvider.ts
│       ├── authService.ts
│       ├── fakeAuthProvider.ts
│       ├── healthAdminService.ts
│       ├── healthService.ts
│       ├── meService.ts
│       ├── postgres
│       │   ├── pgPool.ts
│       │   ├── postgresAuthProvider.ts
│       │   └── usersRepo.ts
│       └── postgresAuthProvider.ts
├── test
│   ├── adminUsers.test.ts
│   ├── auditLog.test.ts
│   ├── authLogin.test.ts
│   ├── authRefreshLogout.test.ts
│   ├── globalSetup.ts
│   ├── globalTeardown.ts
│   ├── health.test.ts
│   ├── jwt.test.ts
│   ├── loadPgEnv.ts
│   ├── lockout.test.ts
│   ├── me.test.ts
│   ├── netlifyDevHarness.ts
│   ├── postgresRefreshFlow.test.ts
│   └── rateLimit.test.ts
├── .testGitHubActions.txt
├── tsconfig.json
├── vitest.config.ts
└── .vitest-netlify-dev.json

```

---

## File: create-env.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "==> Creating environment directory structure"

mkdir -p environment/dev/db
mkdir -p environment/dev/server
mkdir -p environment/prod/db
mkdir -p environment/prod/server

SOURCE_DB_ENV="postgres/env/neon/.env"
DEV_DB_ENV="environment/dev/db/.env"
DEV_SERVER_ENV="environment/dev/server/.env"
PROD_DB_ENV="environment/prod/db/.env"
PROD_SERVER_ENV="environment/prod/server/.env"

echo "==> Creating DEV database env"

if [ -f "$DEV_DB_ENV" ]; then
  echo "    exists: $DEV_DB_ENV (skipping)"
else
  if [ -f "$SOURCE_DB_ENV" ]; then
    echo "    copying from $SOURCE_DB_ENV"

    cp "$SOURCE_DB_ENV" "$DEV_DB_ENV"

    cat >> "$DEV_DB_ENV" <<'EOF'

# ---- Generic DB variables (technology agnostic) ----
DB_DIALECT=postgres
DB_HOST=${PGHOST}
DB_PORT=${PGPORT}
DB_NAME=${PGDATABASE}
DB_USER=${PGUSER}
DB_PASSWORD=${PGPASSWORD}
DB_SSLMODE=${PGSSLMODE}

DB_LABEL=IansProject-dev
EOF

  else
    echo "ERROR: starter env not found: $SOURCE_DB_ENV"
    exit 1
  fi
fi


echo "==> Creating DEV server env"

if [ -f "$DEV_SERVER_ENV" ]; then
  echo "    exists: $DEV_SERVER_ENV (skipping)"
else
  cat > "$DEV_SERVER_ENV" <<'EOF'
APP_ENV=dev

AUTH_PROVIDER=postgres

# JWT secret for development only
AUTH_JWT_SECRET=dev-secret-change-me

# Demo client / API
API_BASE_URL=http://localhost:8888

SERVER_LABEL=dev-server
EOF
fi


echo "==> Creating PROD database env (template)"

if [ -f "$PROD_DB_ENV" ]; then
  echo "    exists: $PROD_DB_ENV (skipping)"
else
  cat > "$PROD_DB_ENV" <<'EOF'
# Production database configuration
# Fill these when production DB is created

DB_DIALECT=postgres

PGHOST=
PGPORT=5432
PGDATABASE=neondb
PGUSER=
PGPASSWORD=
PGSSLMODE=require

# Generic DB variables
DB_HOST=${PGHOST}
DB_PORT=${PGPORT}
DB_NAME=${PGDATABASE}
DB_USER=${PGUSER}
DB_PASSWORD=${PGPASSWORD}
DB_SSLMODE=${PGSSLMODE}

DB_LABEL=IansProject-prod
EOF
fi


echo "==> Creating PROD server env"

if [ -f "$PROD_SERVER_ENV" ]; then
  echo "    exists: $PROD_SERVER_ENV (skipping)"
else
  cat > "$PROD_SERVER_ENV" <<'EOF'
APP_ENV=prod

AUTH_PROVIDER=postgres

# Replace before real production
AUTH_JWT_SECRET=replace-before-production

SERVER_LABEL=prod-server
EOF
fi


echo
echo "Environment layout created:"
echo
tree environment || true
echo
echo "Next step suggestion:"
echo "Add environment/**/.env to .gitignore to avoid committing secrets."

```

---

## File: db/identity/ddl.sql

```
-- DDL for identity schema (Neon/Postgres).
-- Safe to re-run after reset.sql.

create extension if not exists pgcrypto;

create table if not exists identity.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text not null,
  roles text[] not null default array['user'],
  password_salt text not null,
  password_hash text not null,
  deleted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Backward/forward compatible guards (for DBs created with older ddl.sql)
alter table identity.users
  add column if not exists roles text[] not null default array['user'];

alter table identity.users
  add column if not exists deleted_at timestamptz null;

alter table identity.users
  add column if not exists created_at timestamptz not null default now();

alter table identity.users
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_identity_users_deleted_at on identity.users(deleted_at);

-- Refresh token sessions (hashed-at-rest)
create table if not exists identity.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references identity.users(id) on delete cascade,
  refresh_token_hash text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz null
);

create index if not exists idx_identity_sessions_user_id on identity.sessions(user_id);
create index if not exists idx_identity_sessions_expires_at on identity.sessions(expires_at);
create index if not exists idx_identity_sessions_revoked_at on identity.sessions(revoked_at);

-- Phase 4 P0: session lineage + metadata (all nullable for backwards compatibility)
alter table identity.sessions add column if not exists session_family_id uuid null;
alter table identity.sessions add column if not exists rotated_from_session_id uuid null;
alter table identity.sessions add column if not exists created_ip text null;
alter table identity.sessions add column if not exists last_used_ip text null;
alter table identity.sessions add column if not exists user_agent text null;
alter table identity.sessions add column if not exists last_used_at timestamptz null;

create index if not exists idx_identity_sessions_family_id on identity.sessions(session_family_id);
create index if not exists idx_identity_sessions_rotated_from_session_id on identity.sessions(rotated_from_session_id);
create index if not exists idx_identity_sessions_last_used_at on identity.sessions(last_used_at);

-- Audit log (append-only)
create table if not exists identity.audit_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  action text not null,
  actor_user_id uuid null,
  target_user_id uuid null,
  request_id text null,
  ip text null,
  user_agent text null,
  details jsonb null
);

-- Backward/forward compatible guards (for DBs created with older/newer ddl.sql variants)
alter table identity.audit_log
  add column if not exists user_agent text null;

alter table identity.audit_log
  add column if not exists details jsonb null;

create index if not exists idx_identity_audit_log_created_at on identity.audit_log(created_at);
create index if not exists idx_identity_audit_log_action on identity.audit_log(action);
create index if not exists idx_identity_audit_log_actor_user_id on identity.audit_log(actor_user_id);
create index if not exists idx_identity_audit_log_target_user_id on identity.audit_log(target_user_id);

-- Phase 4 P0: Rate limiting counters (bucketed, Postgres-backed)
create table if not exists identity.rate_limits (
  id bigserial primary key,
  rate_key text not null,
  route text not null,
  bucket_start timestamptz not null,
  bucket_seconds int not null,
  hit_count int not null default 0,
  expires_at timestamptz not null,
  updated_at timestamptz not null default now()
);

create unique index if not exists uq_identity_rate_limits_bucket
  on identity.rate_limits(rate_key, route, bucket_start, bucket_seconds);

create index if not exists idx_identity_rate_limits_expires_at
  on identity.rate_limits(expires_at);

-- Phase 4 P0: Authentication failures / lockout tracking
create table if not exists identity.auth_failures (
  id bigserial primary key,
  identifier text not null,
  ip text not null default '',
  window_start timestamptz not null,
  window_seconds int not null,
  failure_count int not null default 0,
  locked_until timestamptz null,
  last_failure_at timestamptz null,
  last_success_at timestamptz null,
  updated_at timestamptz not null default now()
);

create unique index if not exists uq_identity_auth_failures_window
  on identity.auth_failures(identifier, ip, window_start, window_seconds);

create index if not exists idx_identity_auth_failures_locked_until
  on identity.auth_failures(locked_until);

create index if not exists idx_identity_auth_failures_last_failure_at
  on identity.auth_failures(last_failure_at);

```

---

## File: db/identity/reset.sql

```
-- Reset (dev) for identity schema.
-- Safe to re-run.

drop schema if exists identity cascade;
create schema identity;


```

---

## File: db/identity/seed.sql

```
-- Seed data for identity schema (dev).
-- Idempotent.

with seed_users as (
  select
    '00000000-0000-0000-0000-000000000001'::uuid as id,
    'demo@example.com' as email,
    'Demo User' as display_name,
    array['user','admin']::text[] as roles,
    'demo_salt_v1' as password_salt,
    'letmein' as password_plain

  union all
  select
    '00000000-0000-0000-0000-000000000002'::uuid as id,
    'alice@example.com' as email,
    'Alice Example' as display_name,
    array['user']::text[] as roles,
    'alice_salt_v1' as password_salt,
    'letmein' as password_plain

  union all
  select
    '00000000-0000-0000-0000-000000000003'::uuid as id,
    'bob@example.com' as email,
    'Bob Example' as display_name,
    array['user']::text[] as roles,
    'bob_salt_v1' as password_salt,
    'letmein' as password_plain

  union all
  select
    '00000000-0000-0000-0000-000000000004'::uuid as id,
    'admin' as email,
    'Admin User' as display_name,
    array['admin']::text[] as roles,
    'admin_salt_v1' as password_salt,
    '196900' as password_plain
)

insert into identity.users (
  id,
  email,
  display_name,
  roles,
  password_salt,
  password_hash
)
select
  id,
  email,
  display_name,
  roles,
  password_salt,
  encode(
    digest(
      convert_to(password_salt || password_plain, 'utf8'),
      'sha256'
    ),
    'hex'
  ) as password_hash
from seed_users
on conflict (email) do update
set
  display_name = excluded.display_name,
  roles = excluded.roles,
  password_salt = excluded.password_salt,
  password_hash = excluded.password_hash;
  
```

---

## File: demo-client/docs/identity-react-shim-guide.md

```md
# Using the Identity Service from React via the Shim

This guide explains how a React developer should connect to the Identity
Backend Service using the **demo-client shim** rather than calling raw
HTTP endpoints directly.

## What the shim is

The shim is a thin TypeScript client that wraps the backend HTTP API and
gives React code a cleaner typed interface.

Instead of:

``` ts
await fetch("/.netlify/functions/auth-login", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ username, password })
});
```

Use:

``` ts
await client.login({ username, password });
```

The shim:

-   calls the backend
-   unwraps envelopes
-   normalizes errors
-   stores session tokens
-   retries once after refresh if needed

------------------------------------------------------------------------

## Why use the shim

Benefits:

-   typed calls
-   less repetitive fetch code
-   centralized token handling
-   consistent error objects
-   easier API evolution
-   foundation for OAuth support

------------------------------------------------------------------------

## Creating a client

``` ts
import {
  createBrowserTokenStore,
  createIdentityClient
} from "../lib/identity-client";

const client = createIdentityClient({
  tokenStore: createBrowserTokenStore("auth.user")
});
```

------------------------------------------------------------------------

## Login example

``` ts
const result = await client.login({
  username: "admin",
  password: "196900"
});

console.log(result.user);
console.log(result.session);
```

------------------------------------------------------------------------

## Session example

``` ts
const sessionState = client.getSession();

if (sessionState?.session?.accessToken) {
  console.log("Logged in");
}
```

------------------------------------------------------------------------

## Logout

``` ts
await client.logout();
```

------------------------------------------------------------------------

## Fetch current user

``` ts
const me = await client.getMe();
console.log(me.user);
```

------------------------------------------------------------------------

## Admin example

``` ts
const users = await client.listUsers();
```

Create user:

``` ts
await client.createUser({
  email: "new.user@example.com",
  password: "secret123",
  displayName: "New User",
  roles: ["user"]
});
```

------------------------------------------------------------------------

## Error handling

``` ts
import { IdentityClientError } from "../lib/identity-client";

try {
  await client.login({ username, password });
} catch (err) {
  if (err instanceof IdentityClientError) {
    console.error(err.status);
    console.error(err.code);
    console.error(err.message);
    console.error(err.requestId);
  }
}
```

------------------------------------------------------------------------

## Recommended React structure

    src/
      auth/
        AuthContext.tsx
      hooks/
        useIdentityClient.ts
        useIdentitySession.ts
      lib/
        identity-client/
      components/
      pages/

------------------------------------------------------------------------

## Minimal working example

``` ts
import { createBrowserTokenStore, createIdentityClient } from "./lib/identity-client";

const client = createIdentityClient({
  tokenStore: createBrowserTokenStore("auth.main")
});

await client.login({
  username: "admin",
  password: "196900"
});

const me = await client.getMe();
console.log(me.user);
```

------------------------------------------------------------------------

## Final guidance

For React apps:

-   use the shim
-   avoid raw fetch calls
-   centralize client creation
-   keep UI logic separate from transport logic

The API is the product; the shim is the convenience layer.

```

---

## File: demo-client/.gitignore

```
node_modules/
dist/
.vite/
.DS_Store
.env
.env.*

```

---

## File: demo-client/index.html

```
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Identity Backend – Auth Demo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

```

---

## File: demo-client/package.json

```json
{
  "name": "react-auth-demo-client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "dev": "vite --port 5173",
    "build": "tsc -p tsconfig.app.json --noEmit && vite build",
    "preview": "vite preview --port 5173",
    "typecheck": "tsc -p tsconfig.app.json --noEmit"
  },
  "dependencies": {
    "@emotion/react": "^11.11.4",
    "@emotion/styled": "^11.11.5",
    "@mui/icons-material": "^5.15.21",
    "@mui/material": "^5.15.21",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.9.3",
    "vite": "^5.4.2"
  }
}

```

---

## File: demo-client/package-lock.json

```json
{
  "name": "react-auth-demo-client",
  "version": "0.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "react-auth-demo-client",
      "version": "0.0.0",
      "dependencies": {
        "@emotion/react": "^11.11.4",
        "@emotion/styled": "^11.11.5",
        "@mui/icons-material": "^5.15.21",
        "@mui/material": "^5.15.21",
        "react": "^18.3.1",
        "react-dom": "^18.3.1"
      },
      "devDependencies": {
        "@types/react": "^18.3.3",
        "@types/react-dom": "^18.3.0",
        "@vitejs/plugin-react": "^4.3.1",
        "typescript": "^5.9.3",
        "vite": "^5.4.2"
      },
      "engines": {
        "node": ">=20"
      }
    },
    "node_modules/@babel/code-frame": {
      "version": "7.29.0",
      "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.29.0.tgz",
      "integrity": "sha512-9NhCeYjq9+3uxgdtp20LSiJXJvN0FeCtNGpJxuMFZ1Kv3cWUNb6DOhJwUvcVCzKGR66cw4njwM6hrJLqgOwbcw==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-validator-identifier": "^7.28.5",
        "js-tokens": "^4.0.0",
        "picocolors": "^1.1.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/compat-data": {
      "version": "7.29.0",
      "resolved": "https://registry.npmjs.org/@babel/compat-data/-/compat-data-7.29.0.tgz",
      "integrity": "sha512-T1NCJqT/j9+cn8fvkt7jtwbLBfLC/1y1c7NtCeXFRgzGTsafi68MRv8yzkYSapBnFA6L3U2VSc02ciDzoAJhJg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/core": {
      "version": "7.29.0",
      "resolved": "https://registry.npmjs.org/@babel/core/-/core-7.29.0.tgz",
      "integrity": "sha512-CGOfOJqWjg2qW/Mb6zNsDm+u5vFQ8DxXfbM09z69p5Z6+mE1ikP2jUXw+j42Pf1XTYED2Rni5f95npYeuwMDQA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.29.0",
        "@babel/generator": "^7.29.0",
        "@babel/helper-compilation-targets": "^7.28.6",
        "@babel/helper-module-transforms": "^7.28.6",
        "@babel/helpers": "^7.28.6",
        "@babel/parser": "^7.29.0",
        "@babel/template": "^7.28.6",
        "@babel/traverse": "^7.29.0",
        "@babel/types": "^7.29.0",
        "@jridgewell/remapping": "^2.3.5",
        "convert-source-map": "^2.0.0",
        "debug": "^4.1.0",
        "gensync": "^1.0.0-beta.2",
        "json5": "^2.2.3",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/babel"
      }
    },
    "node_modules/@babel/core/node_modules/convert-source-map": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/convert-source-map/-/convert-source-map-2.0.0.tgz",
      "integrity": "sha512-Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@babel/generator": {
      "version": "7.29.1",
      "resolved": "https://registry.npmjs.org/@babel/generator/-/generator-7.29.1.tgz",
      "integrity": "sha512-qsaF+9Qcm2Qv8SRIMMscAvG4O3lJ0F1GuMo5HR/Bp02LopNgnZBC/EkbevHFeGs4ls/oPz9v+Bsmzbkbe+0dUw==",
      "license": "MIT",
      "dependencies": {
        "@babel/parser": "^7.29.0",
        "@babel/types": "^7.29.0",
        "@jridgewell/gen-mapping": "^0.3.12",
        "@jridgewell/trace-mapping": "^0.3.28",
        "jsesc": "^3.0.2"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-compilation-targets": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/helper-compilation-targets/-/helper-compilation-targets-7.28.6.tgz",
      "integrity": "sha512-JYtls3hqi15fcx5GaSNL7SCTJ2MNmjrkHXg4FSpOA/grxK8KwyZ5bubHsCq8FXCkua6xhuaaBit+3b7+VZRfcA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/compat-data": "^7.28.6",
        "@babel/helper-validator-option": "^7.27.1",
        "browserslist": "^4.24.0",
        "lru-cache": "^5.1.1",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-globals": {
      "version": "7.28.0",
      "resolved": "https://registry.npmjs.org/@babel/helper-globals/-/helper-globals-7.28.0.tgz",
      "integrity": "sha512-+W6cISkXFa1jXsDEdYA8HeevQT/FULhxzR99pxphltZcVaugps53THCeiWA8SguxxpSp3gKPiuYfSWopkLQ4hw==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-imports": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-imports/-/helper-module-imports-7.28.6.tgz",
      "integrity": "sha512-l5XkZK7r7wa9LucGw9LwZyyCUscb4x37JWTPz7swwFE/0FMQAGpiWUZn8u9DzkSBWEcK25jmvubfpw2dnAMdbw==",
      "license": "MIT",
      "dependencies": {
        "@babel/traverse": "^7.28.6",
        "@babel/types": "^7.28.6"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-transforms": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-transforms/-/helper-module-transforms-7.28.6.tgz",
      "integrity": "sha512-67oXFAYr2cDLDVGLXTEABjdBJZ6drElUSI7WKp70NrpyISso3plG9SAGEF6y7zbha/wOzUByWWTJvEDVNIUGcA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-module-imports": "^7.28.6",
        "@babel/helper-validator-identifier": "^7.28.5",
        "@babel/traverse": "^7.28.6"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/@babel/helper-plugin-utils": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/helper-plugin-utils/-/helper-plugin-utils-7.28.6.tgz",
      "integrity": "sha512-S9gzZ/bz83GRysI7gAD4wPT/AI3uCnY+9xn+Mx/KPs2JwHJIz1W8PZkg2cqyt3RNOBM8ejcXhV6y8Og7ly/Dug==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-string-parser": {
      "version": "7.27.1",
      "resolved": "https://registry.npmjs.org/@babel/helper-string-parser/-/helper-string-parser-7.27.1.tgz",
      "integrity": "sha512-qMlSxKbpRlAridDExk92nSobyDdpPijUq2DW6oDnUqd0iOGxmQjyqhMIihI9+zv4LPyZdRje2cavWPbCbWm3eA==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-identifier": {
      "version": "7.28.5",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.28.5.tgz",
      "integrity": "sha512-qSs4ifwzKJSV39ucNjsvc6WVHs6b7S03sOh2OcHF9UHfVPqWWALUsNUVzhSBiItjRZoLHx7nIarVjqKVusUZ1Q==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-option": {
      "version": "7.27.1",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-option/-/helper-validator-option-7.27.1.tgz",
      "integrity": "sha512-YvjJow9FxbhFFKDSuFnVCe2WxXk1zWc22fFePVNEaWJEu8IrZVlda6N0uHwzZrUM1il7NC9Mlp4MaJYbYd9JSg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helpers": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/helpers/-/helpers-7.28.6.tgz",
      "integrity": "sha512-xOBvwq86HHdB7WUDTfKfT/Vuxh7gElQ+Sfti2Cy6yIWNW05P8iUslOVcZ4/sKbE+/jQaukQAdz/gf3724kYdqw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/template": "^7.28.6",
        "@babel/types": "^7.28.6"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/parser": {
      "version": "7.29.0",
      "resolved": "https://registry.npmjs.org/@babel/parser/-/parser-7.29.0.tgz",
      "integrity": "sha512-IyDgFV5GeDUVX4YdF/3CPULtVGSXXMLh1xVIgdCgxApktqnQV0r7/8Nqthg+8YLGaAtdyIlo2qIdZrbCv4+7ww==",
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.29.0"
      },
      "bin": {
        "parser": "bin/babel-parser.js"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@babel/plugin-transform-react-jsx-self": {
      "version": "7.27.1",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-react-jsx-self/-/plugin-transform-react-jsx-self-7.27.1.tgz",
      "integrity": "sha512-6UzkCs+ejGdZ5mFFC/OCUrv028ab2fp1znZmCZjAOBKiBK2jXD1O+BPSfX8X2qjJ75fZBMSnQn3Rq2mrBJK2mw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.27.1"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/plugin-transform-react-jsx-source": {
      "version": "7.27.1",
      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-react-jsx-source/-/plugin-transform-react-jsx-source-7.27.1.tgz",
      "integrity": "sha512-zbwoTsBruTeKB9hSq73ha66iFeJHuaFkUbwvqElnygoNbj/jHRsSeokowZFN3CZ64IvEqcmmkVe89OPXc7ldAw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-plugin-utils": "^7.27.1"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0-0"
      }
    },
    "node_modules/@babel/runtime": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/runtime/-/runtime-7.28.6.tgz",
      "integrity": "sha512-05WQkdpL9COIMz4LjTxGpPNCdlpyimKppYNoJ5Di5EUObifl8t4tuLuUBBZEpoLYOmfvIWrsp9fCl0HoPRVTdA==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/template": {
      "version": "7.28.6",
      "resolved": "https://registry.npmjs.org/@babel/template/-/template-7.28.6.tgz",
      "integrity": "sha512-YA6Ma2KsCdGb+WC6UpBVFJGXL58MDA6oyONbjyF/+5sBgxY/dwkhLogbMT2GXXyU84/IhRw/2D1Os1B/giz+BQ==",
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.28.6",
        "@babel/parser": "^7.28.6",
        "@babel/types": "^7.28.6"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/traverse": {
      "version": "7.29.0",
      "resolved": "https://registry.npmjs.org/@babel/traverse/-/traverse-7.29.0.tgz",
      "integrity": "sha512-4HPiQr0X7+waHfyXPZpWPfWL/J7dcN1mx9gL6WdQVMbPnF3+ZhSMs8tCxN7oHddJE9fhNE7+lxdnlyemKfJRuA==",
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.29.0",
        "@babel/generator": "^7.29.0",
        "@babel/helper-globals": "^7.28.0",
        "@babel/parser": "^7.29.0",
        "@babel/template": "^7.28.6",
        "@babel/types": "^7.29.0",
        "debug": "^4.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/types": {
      "version": "7.29.0",
      "resolved": "https://registry.npmjs.org/@babel/types/-/types-7.29.0.tgz",
      "integrity": "sha512-LwdZHpScM4Qz8Xw2iKSzS+cfglZzJGvofQICy7W7v4caru4EaAmyUuO6BGrbyQ2mYV11W0U8j5mBhd14dd3B0A==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-string-parser": "^7.27.1",
        "@babel/helper-validator-identifier": "^7.28.5"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@emotion/babel-plugin": {
      "version": "11.13.5",
      "resolved": "https://registry.npmjs.org/@emotion/babel-plugin/-/babel-plugin-11.13.5.tgz",
      "integrity": "sha512-pxHCpT2ex+0q+HH91/zsdHkw/lXd468DIN2zvfvLtPKLLMo6gQj7oLObq8PhkrxOZb/gGCq03S3Z7PDhS8pduQ==",
      "license": "MIT",
      "dependencies": {
        "@babel/helper-module-imports": "^7.16.7",
        "@babel/runtime": "^7.18.3",
        "@emotion/hash": "^0.9.2",
        "@emotion/memoize": "^0.9.0",
        "@emotion/serialize": "^1.3.3",
        "babel-plugin-macros": "^3.1.0",
        "convert-source-map": "^1.5.0",
        "escape-string-regexp": "^4.0.0",
        "find-root": "^1.1.0",
        "source-map": "^0.5.7",
        "stylis": "4.2.0"
      }
    },
    "node_modules/@emotion/cache": {
      "version": "11.14.0",
      "resolved": "https://registry.npmjs.org/@emotion/cache/-/cache-11.14.0.tgz",
      "integrity": "sha512-L/B1lc/TViYk4DcpGxtAVbx0ZyiKM5ktoIyafGkH6zg/tj+mA+NE//aPYKG0k8kCHSHVJrpLpcAlOBEXQ3SavA==",
      "license": "MIT",
      "dependencies": {
        "@emotion/memoize": "^0.9.0",
        "@emotion/sheet": "^1.4.0",
        "@emotion/utils": "^1.4.2",
        "@emotion/weak-memoize": "^0.4.0",
        "stylis": "4.2.0"
      }
    },
    "node_modules/@emotion/hash": {
      "version": "0.9.2",
      "resolved": "https://registry.npmjs.org/@emotion/hash/-/hash-0.9.2.tgz",
      "integrity": "sha512-MyqliTZGuOm3+5ZRSaaBGP3USLw6+EGykkwZns2EPC5g8jJ4z9OrdZY9apkl3+UP9+sdz76YYkwCKP5gh8iY3g==",
      "license": "MIT"
    },
    "node_modules/@emotion/is-prop-valid": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/@emotion/is-prop-valid/-/is-prop-valid-1.4.0.tgz",
      "integrity": "sha512-QgD4fyscGcbbKwJmqNvUMSE02OsHUa+lAWKdEUIJKgqe5IwRSKd7+KhibEWdaKwgjLj0DRSHA9biAIqGBk05lw==",
      "license": "MIT",
      "dependencies": {
        "@emotion/memoize": "^0.9.0"
      }
    },
    "node_modules/@emotion/memoize": {
      "version": "0.9.0",
      "resolved": "https://registry.npmjs.org/@emotion/memoize/-/memoize-0.9.0.tgz",
      "integrity": "sha512-30FAj7/EoJ5mwVPOWhAyCX+FPfMDrVecJAM+Iw9NRoSl4BBAQeqj4cApHHUXOVvIPgLVDsCFoz/hGD+5QQD1GQ==",
      "license": "MIT"
    },
    "node_modules/@emotion/react": {
      "version": "11.14.0",
      "resolved": "https://registry.npmjs.org/@emotion/react/-/react-11.14.0.tgz",
      "integrity": "sha512-O000MLDBDdk/EohJPFUqvnp4qnHeYkVP5B0xEG0D/L7cOKP9kefu2DXn8dj74cQfsEzUqh+sr1RzFqiL1o+PpA==",
      "license": "MIT",
      "dependencies": {
        "@babel/runtime": "^7.18.3",
        "@emotion/babel-plugin": "^11.13.5",
        "@emotion/cache": "^11.14.0",
        "@emotion/serialize": "^1.3.3",
        "@emotion/use-insertion-effect-with-fallbacks": "^1.2.0",
        "@emotion/utils": "^1.4.2",
        "@emotion/weak-memoize": "^0.4.0",
        "hoist-non-react-statics": "^3.3.1"
      },
      "peerDependencies": {
        "react": ">=16.8.0"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@emotion/serialize": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@emotion/serialize/-/serialize-1.3.3.tgz",
      "integrity": "sha512-EISGqt7sSNWHGI76hC7x1CksiXPahbxEOrC5RjmFRJTqLyEK9/9hZvBbiYn70dw4wuwMKiEMCUlR6ZXTSWQqxA==",
      "license": "MIT",
      "dependencies": {
        "@emotion/hash": "^0.9.2",
        "@emotion/memoize": "^0.9.0",
        "@emotion/unitless": "^0.10.0",
        "@emotion/utils": "^1.4.2",
        "csstype": "^3.0.2"
      }
    },
    "node_modules/@emotion/sheet": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/@emotion/sheet/-/sheet-1.4.0.tgz",
      "integrity": "sha512-fTBW9/8r2w3dXWYM4HCB1Rdp8NLibOw2+XELH5m5+AkWiL/KqYX6dc0kKYlaYyKjrQ6ds33MCdMPEwgs2z1rqg==",
      "license": "MIT"
    },
    "node_modules/@emotion/styled": {
      "version": "11.14.1",
      "resolved": "https://registry.npmjs.org/@emotion/styled/-/styled-11.14.1.tgz",
      "integrity": "sha512-qEEJt42DuToa3gurlH4Qqc1kVpNq8wO8cJtDzU46TjlzWjDlsVyevtYCRijVq3SrHsROS+gVQ8Fnea108GnKzw==",
      "license": "MIT",
      "dependencies": {
        "@babel/runtime": "^7.18.3",
        "@emotion/babel-plugin": "^11.13.5",
        "@emotion/is-prop-valid": "^1.3.0",
        "@emotion/serialize": "^1.3.3",
        "@emotion/use-insertion-effect-with-fallbacks": "^1.2.0",
        "@emotion/utils": "^1.4.2"
      },
      "peerDependencies": {
        "@emotion/react": "^11.0.0-rc.0",
        "react": ">=16.8.0"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@emotion/unitless": {
      "version": "0.10.0",
      "resolved": "https://registry.npmjs.org/@emotion/unitless/-/unitless-0.10.0.tgz",
      "integrity": "sha512-dFoMUuQA20zvtVTuxZww6OHoJYgrzfKM1t52mVySDJnMSEa08ruEvdYQbhvyu6soU+NeLVd3yKfTfT0NeV6qGg==",
      "license": "MIT"
    },
    "node_modules/@emotion/use-insertion-effect-with-fallbacks": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/@emotion/use-insertion-effect-with-fallbacks/-/use-insertion-effect-with-fallbacks-1.2.0.tgz",
      "integrity": "sha512-yJMtVdH59sxi/aVJBpk9FQq+OR8ll5GT8oWd57UpeaKEVGab41JWaCFA7FRLoMLloOZF/c/wsPoe+bfGmRKgDg==",
      "license": "MIT",
      "peerDependencies": {
        "react": ">=16.8.0"
      }
    },
    "node_modules/@emotion/utils": {
      "version": "1.4.2",
      "resolved": "https://registry.npmjs.org/@emotion/utils/-/utils-1.4.2.tgz",
      "integrity": "sha512-3vLclRofFziIa3J2wDh9jjbkUz9qk5Vi3IZ/FSTKViB0k+ef0fPV7dYrUIugbgupYDx7v9ud/SjrtEP8Y4xLoA==",
      "license": "MIT"
    },
    "node_modules/@emotion/weak-memoize": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/@emotion/weak-memoize/-/weak-memoize-0.4.0.tgz",
      "integrity": "sha512-snKqtPW01tN0ui7yu9rGv69aJXr/a/Ywvl11sUjNtEcRc+ng/mQriFL0wLXMef74iHa/EkftbDzU9F8iFbH+zg==",
      "license": "MIT"
    },
    "node_modules/@esbuild/aix-ppc64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.21.5.tgz",
      "integrity": "sha512-1SDgH6ZSPTlggy1yI6+Dbkiz8xzpHJEVAlF/AM1tHPLsf5STom9rwtjE4hKAF20FfXXNTFqEYXyJNWh1GiZedQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/android-arm": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.21.5.tgz",
      "integrity": "sha512-vCPvzSjpPHEi1siZdlvAlsPxXl7WbOVUBBAowWug4rJHb68Ox8KualB+1ocNvT5fjv6wpkX6o/iEpbDrf68zcg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/android-arm64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.21.5.tgz",
      "integrity": "sha512-c0uX9VAUBQ7dTDCjq+wdyGLowMdtR/GoC2U5IYk/7D1H1JYC0qseD7+11iMP2mRLN9RcCMRcjC4YMclCzGwS/A==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/android-x64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.21.5.tgz",
      "integrity": "sha512-D7aPRUUNHRBwHxzxRvp856rjUHRFW1SdQATKXH2hqA0kAZb1hKmi02OpYRacl0TxIGz/ZmXWlbZgjwWYaCakTA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/darwin-arm64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.21.5.tgz",
      "integrity": "sha512-DwqXqZyuk5AiWWf3UfLiRDJ5EDd49zg6O9wclZ7kUMv2WRFr4HKjXp/5t8JZ11QbQfUS6/cRCKGwYhtNAY88kQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/darwin-x64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.21.5.tgz",
      "integrity": "sha512-se/JjF8NlmKVG4kNIuyWMV/22ZaerB+qaSi5MdrXtd6R08kvs2qCN4C09miupktDitvh8jRFflwGFBQcxZRjbw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/freebsd-arm64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.21.5.tgz",
      "integrity": "sha512-5JcRxxRDUJLX8JXp/wcBCy3pENnCgBR9bN6JsY4OmhfUtIHe3ZW0mawA7+RDAcMLrMIZaf03NlQiX9DGyB8h4g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/freebsd-x64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.21.5.tgz",
      "integrity": "sha512-J95kNBj1zkbMXtHVH29bBriQygMXqoVQOQYA+ISs0/2l3T9/kj42ow2mpqerRBxDJnmkUDCaQT/dfNXWX/ZZCQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/linux-arm": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.21.5.tgz",
      "integrity": "sha512-bPb5AHZtbeNGjCKVZ9UGqGwo8EUu4cLq68E95A53KlxAPRmUyYv2D6F0uUI65XisGOL1hBP5mTronbgo+0bFcA==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/linux-arm64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.21.5.tgz",
      "integrity": "sha512-ibKvmyYzKsBeX8d8I7MH/TMfWDXBF3db4qM6sy+7re0YXya+K1cem3on9XgdT2EQGMu4hQyZhan7TeQ8XkGp4Q==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/linux-ia32": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.21.5.tgz",
      "integrity": "sha512-YvjXDqLRqPDl2dvRODYmmhz4rPeVKYvppfGYKSNGdyZkA01046pLWyRKKI3ax8fbJoK5QbxblURkwK/MWY18Tg==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/linux-loong64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.21.5.tgz",
      "integrity": "sha512-uHf1BmMG8qEvzdrzAqg2SIG/02+4/DHB6a9Kbya0XDvwDEKCoC8ZRWI5JJvNdUjtciBGFQ5PuBlpEOXQj+JQSg==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/linux-mips64el": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.21.5.tgz",
      "integrity": "sha512-IajOmO+KJK23bj52dFSNCMsz1QP1DqM6cwLUv3W1QwyxkyIWecfafnI555fvSGqEKwjMXVLokcV5ygHW5b3Jbg==",
      "cpu": [
        "mips64el"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/linux-ppc64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.21.5.tgz",
      "integrity": "sha512-1hHV/Z4OEfMwpLO8rp7CvlhBDnjsC3CttJXIhBi+5Aj5r+MBvy4egg7wCbe//hSsT+RvDAG7s81tAvpL2XAE4w==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/linux-riscv64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.21.5.tgz",
      "integrity": "sha512-2HdXDMd9GMgTGrPWnJzP2ALSokE/0O5HhTUvWIbD3YdjME8JwvSCnNGBnTThKGEB91OZhzrJ4qIIxk/SBmyDDA==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/linux-s390x": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.21.5.tgz",
      "integrity": "sha512-zus5sxzqBJD3eXxwvjN1yQkRepANgxE9lgOW2qLnmr8ikMTphkjgXu1HR01K4FJg8h1kEEDAqDcZQtbrRnB41A==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/linux-x64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.21.5.tgz",
      "integrity": "sha512-1rYdTpyv03iycF1+BhzrzQJCdOuAOtaqHTWJZCWvijKD2N5Xu0TtVC8/+1faWqcP9iBCWOmjmhoH94dH82BxPQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/netbsd-x64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.21.5.tgz",
      "integrity": "sha512-Woi2MXzXjMULccIwMnLciyZH4nCIMpWQAs049KEeMvOcNADVxo0UBIQPfSmxB3CWKedngg7sWZdLvLczpe0tLg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/openbsd-x64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.21.5.tgz",
      "integrity": "sha512-HLNNw99xsvx12lFBUwoT8EVCsSvRNDVxNpjZ7bPn947b8gJPzeHWyNVhFsaerc0n3TsbOINvRP2byTZ5LKezow==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/sunos-x64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.21.5.tgz",
      "integrity": "sha512-6+gjmFpfy0BHU5Tpptkuh8+uw3mnrvgs+dSPQXQOv3ekbordwnzTVEb4qnIvQcYXq6gzkyTnoZ9dZG+D4garKg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/win32-arm64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.21.5.tgz",
      "integrity": "sha512-Z0gOTd75VvXqyq7nsl93zwahcTROgqvuAcYDUr+vOv8uHhNSKROyU961kgtCD1e95IqPKSQKH7tBTslnS3tA8A==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/win32-ia32": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.21.5.tgz",
      "integrity": "sha512-SWXFF1CL2RVNMaVs+BBClwtfZSvDgtL//G/smwAc5oVK/UPu2Gu9tIaRgFmYFFKrmg3SyAjSrElf0TiJ1v8fYA==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@esbuild/win32-x64": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.21.5.tgz",
      "integrity": "sha512-tQd/1efJuzPC6rCFwEvLtci/xNFcTZknmXs98FYDfGE4wP9ClFV98nyKrzJKVPMhdDnjzLhdUyMX4PsQAPjwIw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@jridgewell/gen-mapping": {
      "version": "0.3.13",
      "resolved": "https://registry.npmjs.org/@jridgewell/gen-mapping/-/gen-mapping-0.3.13.tgz",
      "integrity": "sha512-2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.5.0",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/remapping": {
      "version": "2.3.5",
      "resolved": "https://registry.npmjs.org/@jridgewell/remapping/-/remapping-2.3.5.tgz",
      "integrity": "sha512-LI9u/+laYG4Ds1TDKSJW2YPrIlcVYOwi2fUC6xB43lueCjgxV4lffOCZCtYFiH6TNOX+tQKXx97T4IKHbhyHEQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.5",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/resolve-uri": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz",
      "integrity": "sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==",
      "license": "MIT",
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@jridgewell/sourcemap-codec": {
      "version": "1.5.5",
      "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.5.tgz",
      "integrity": "sha512-cYQ9310grqxueWbl+WuIUIaiUaDcj7WOq5fVhEljNVgRfOUhY9fy2zTvfoqWsnebh8Sl70VScFbICvJnLKB0Og==",
      "license": "MIT"
    },
    "node_modules/@jridgewell/trace-mapping": {
      "version": "0.3.31",
      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.31.tgz",
      "integrity": "sha512-zzNR+SdQSDJzc8joaeP8QQoCQr8NuYx2dIIytl1QeBEZHJ9uW6hebsrYgbz8hJwUQao3TWCMtmfV8Nu1twOLAw==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/resolve-uri": "^3.1.0",
        "@jridgewell/sourcemap-codec": "^1.4.14"
      }
    },
    "node_modules/@mui/core-downloads-tracker": {
      "version": "5.18.0",
      "resolved": "https://registry.npmjs.org/@mui/core-downloads-tracker/-/core-downloads-tracker-5.18.0.tgz",
      "integrity": "sha512-jbhwoQ1AY200PSSOrNXmrFCaSDSJWP7qk6urkTmIirvRXDROkqe+QwcLlUiw/PrREwsIF/vm3/dAXvjlMHF0RA==",
      "license": "MIT",
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/mui-org"
      }
    },
    "node_modules/@mui/icons-material": {
      "version": "5.18.0",
      "resolved": "https://registry.npmjs.org/@mui/icons-material/-/icons-material-5.18.0.tgz",
      "integrity": "sha512-1s0vEZj5XFXDMmz3Arl/R7IncFqJ+WQ95LDp1roHWGDE2oCO3IS4/hmiOv1/8SD9r6B7tv9GLiqVZYHo+6PkTg==",
      "license": "MIT",
      "dependencies": {
        "@babel/runtime": "^7.23.9"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/mui-org"
      },
      "peerDependencies": {
        "@mui/material": "^5.0.0",
        "@types/react": "^17.0.0 || ^18.0.0 || ^19.0.0",
        "react": "^17.0.0 || ^18.0.0 || ^19.0.0"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@mui/material": {
      "version": "5.18.0",
      "resolved": "https://registry.npmjs.org/@mui/material/-/material-5.18.0.tgz",
      "integrity": "sha512-bbH/HaJZpFtXGvWg3TsBWG4eyt3gah3E7nCNU8GLyRjVoWcA91Vm/T+sjHfUcwgJSw9iLtucfHBoq+qW/T30aA==",
      "license": "MIT",
      "dependencies": {
        "@babel/runtime": "^7.23.9",
        "@mui/core-downloads-tracker": "^5.18.0",
        "@mui/system": "^5.18.0",
        "@mui/types": "~7.2.15",
        "@mui/utils": "^5.17.1",
        "@popperjs/core": "^2.11.8",
        "@types/react-transition-group": "^4.4.10",
        "clsx": "^2.1.0",
        "csstype": "^3.1.3",
        "prop-types": "^15.8.1",
        "react-is": "^19.0.0",
        "react-transition-group": "^4.4.5"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/mui-org"
      },
      "peerDependencies": {
        "@emotion/react": "^11.5.0",
        "@emotion/styled": "^11.3.0",
        "@types/react": "^17.0.0 || ^18.0.0 || ^19.0.0",
        "react": "^17.0.0 || ^18.0.0 || ^19.0.0",
        "react-dom": "^17.0.0 || ^18.0.0 || ^19.0.0"
      },
      "peerDependenciesMeta": {
        "@emotion/react": {
          "optional": true
        },
        "@emotion/styled": {
          "optional": true
        },
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@mui/private-theming": {
      "version": "5.17.1",
      "resolved": "https://registry.npmjs.org/@mui/private-theming/-/private-theming-5.17.1.tgz",
      "integrity": "sha512-XMxU0NTYcKqdsG8LRmSoxERPXwMbp16sIXPcLVgLGII/bVNagX0xaheWAwFv8+zDK7tI3ajllkuD3GZZE++ICQ==",
      "license": "MIT",
      "dependencies": {
        "@babel/runtime": "^7.23.9",
        "@mui/utils": "^5.17.1",
        "prop-types": "^15.8.1"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/mui-org"
      },
      "peerDependencies": {
        "@types/react": "^17.0.0 || ^18.0.0 || ^19.0.0",
        "react": "^17.0.0 || ^18.0.0 || ^19.0.0"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@mui/styled-engine": {
      "version": "5.18.0",
      "resolved": "https://registry.npmjs.org/@mui/styled-engine/-/styled-engine-5.18.0.tgz",
      "integrity": "sha512-BN/vKV/O6uaQh2z5rXV+MBlVrEkwoS/TK75rFQ2mjxA7+NBo8qtTAOA4UaM0XeJfn7kh2wZ+xQw2HAx0u+TiBg==",
      "license": "MIT",
      "dependencies": {
        "@babel/runtime": "^7.23.9",
        "@emotion/cache": "^11.13.5",
        "@emotion/serialize": "^1.3.3",
        "csstype": "^3.1.3",
        "prop-types": "^15.8.1"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/mui-org"
      },
      "peerDependencies": {
        "@emotion/react": "^11.4.1",
        "@emotion/styled": "^11.3.0",
        "react": "^17.0.0 || ^18.0.0 || ^19.0.0"
      },
      "peerDependenciesMeta": {
        "@emotion/react": {
          "optional": true
        },
        "@emotion/styled": {
          "optional": true
        }
      }
    },
    "node_modules/@mui/system": {
      "version": "5.18.0",
      "resolved": "https://registry.npmjs.org/@mui/system/-/system-5.18.0.tgz",
      "integrity": "sha512-ojZGVcRWqWhu557cdO3pWHloIGJdzVtxs3rk0F9L+x55LsUjcMUVkEhiF7E4TMxZoF9MmIHGGs0ZX3FDLAf0Xw==",
      "license": "MIT",
      "dependencies": {
        "@babel/runtime": "^7.23.9",
        "@mui/private-theming": "^5.17.1",
        "@mui/styled-engine": "^5.18.0",
        "@mui/types": "~7.2.15",
        "@mui/utils": "^5.17.1",
        "clsx": "^2.1.0",
        "csstype": "^3.1.3",
        "prop-types": "^15.8.1"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/mui-org"
      },
      "peerDependencies": {
        "@emotion/react": "^11.5.0",
        "@emotion/styled": "^11.3.0",
        "@types/react": "^17.0.0 || ^18.0.0 || ^19.0.0",
        "react": "^17.0.0 || ^18.0.0 || ^19.0.0"
      },
      "peerDependenciesMeta": {
        "@emotion/react": {
          "optional": true
        },
        "@emotion/styled": {
          "optional": true
        },
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@mui/types": {
      "version": "7.2.24",
      "resolved": "https://registry.npmjs.org/@mui/types/-/types-7.2.24.tgz",
      "integrity": "sha512-3c8tRt/CbWZ+pEg7QpSwbdxOk36EfmhbKf6AGZsD1EcLDLTSZoxxJ86FVtcjxvjuhdyBiWKSTGZFaXCnidO2kw==",
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "^17.0.0 || ^18.0.0 || ^19.0.0"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@mui/utils": {
      "version": "5.17.1",
      "resolved": "https://registry.npmjs.org/@mui/utils/-/utils-5.17.1.tgz",
      "integrity": "sha512-jEZ8FTqInt2WzxDV8bhImWBqeQRD99c/id/fq83H0ER9tFl+sfZlaAoCdznGvbSQQ9ividMxqSV2c7cC1vBcQg==",
      "license": "MIT",
      "dependencies": {
        "@babel/runtime": "^7.23.9",
        "@mui/types": "~7.2.15",
        "@types/prop-types": "^15.7.12",
        "clsx": "^2.1.1",
        "prop-types": "^15.8.1",
        "react-is": "^19.0.0"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/mui-org"
      },
      "peerDependencies": {
        "@types/react": "^17.0.0 || ^18.0.0 || ^19.0.0",
        "react": "^17.0.0 || ^18.0.0 || ^19.0.0"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/@popperjs/core": {
      "version": "2.11.8",
      "resolved": "https://registry.npmjs.org/@popperjs/core/-/core-2.11.8.tgz",
      "integrity": "sha512-P1st0aksCrn9sGZhp8GMYwBnQsbvAWsZAX44oXNNvLHGqAOcoVxmjZiohstwQ7SqKnbR47akdNi+uleWD8+g6A==",
      "license": "MIT",
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/popperjs"
      }
    },
    "node_modules/@rolldown/pluginutils": {
      "version": "1.0.0-beta.27",
      "resolved": "https://registry.npmjs.org/@rolldown/pluginutils/-/pluginutils-1.0.0-beta.27.tgz",
      "integrity": "sha512-+d0F4MKMCbeVUJwG96uQ4SgAznZNSq93I3V+9NHA4OpvqG8mRCpGdKmK8l/dl02h2CCDHwW2FqilnTyDcAnqjA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@rollup/rollup-android-arm-eabi": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm-eabi/-/rollup-android-arm-eabi-4.59.0.tgz",
      "integrity": "sha512-upnNBkA6ZH2VKGcBj9Fyl9IGNPULcjXRlg0LLeaioQWueH30p6IXtJEbKAgvyv+mJaMxSm1l6xwDXYjpEMiLMg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@rollup/rollup-android-arm64": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm64/-/rollup-android-arm64-4.59.0.tgz",
      "integrity": "sha512-hZ+Zxj3SySm4A/DylsDKZAeVg0mvi++0PYVceVyX7hemkw7OreKdCvW2oQ3T1FMZvCaQXqOTHb8qmBShoqk69Q==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@rollup/rollup-darwin-arm64": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-arm64/-/rollup-darwin-arm64-4.59.0.tgz",
      "integrity": "sha512-W2Psnbh1J8ZJw0xKAd8zdNgF9HRLkdWwwdWqubSVk0pUuQkoHnv7rx4GiF9rT4t5DIZGAsConRE3AxCdJ4m8rg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@rollup/rollup-darwin-x64": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-x64/-/rollup-darwin-x64-4.59.0.tgz",
      "integrity": "sha512-ZW2KkwlS4lwTv7ZVsYDiARfFCnSGhzYPdiOU4IM2fDbL+QGlyAbjgSFuqNRbSthybLbIJ915UtZBtmuLrQAT/w==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@rollup/rollup-freebsd-arm64": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-arm64/-/rollup-freebsd-arm64-4.59.0.tgz",
      "integrity": "sha512-EsKaJ5ytAu9jI3lonzn3BgG8iRBjV4LxZexygcQbpiU0wU0ATxhNVEpXKfUa0pS05gTcSDMKpn3Sx+QB9RlTTA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ]
    },
    "node_modules/@rollup/rollup-freebsd-x64": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-x64/-/rollup-freebsd-x64-4.59.0.tgz",
      "integrity": "sha512-d3DuZi2KzTMjImrxoHIAODUZYoUUMsuUiY4SRRcJy6NJoZ6iIqWnJu9IScV9jXysyGMVuW+KNzZvBLOcpdl3Vg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm-gnueabihf": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-gnueabihf/-/rollup-linux-arm-gnueabihf-4.59.0.tgz",
      "integrity": "sha512-t4ONHboXi/3E0rT6OZl1pKbl2Vgxf9vJfWgmUoCEVQVxhW6Cw/c8I6hbbu7DAvgp82RKiH7TpLwxnJeKv2pbsw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm-musleabihf": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-musleabihf/-/rollup-linux-arm-musleabihf-4.59.0.tgz",
      "integrity": "sha512-CikFT7aYPA2ufMD086cVORBYGHffBo4K8MQ4uPS/ZnY54GKj36i196u8U+aDVT2LX4eSMbyHtyOh7D7Zvk2VvA==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm64-gnu": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-gnu/-/rollup-linux-arm64-gnu-4.59.0.tgz",
      "integrity": "sha512-jYgUGk5aLd1nUb1CtQ8E+t5JhLc9x5WdBKew9ZgAXg7DBk0ZHErLHdXM24rfX+bKrFe+Xp5YuJo54I5HFjGDAA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-arm64-musl": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-musl/-/rollup-linux-arm64-musl-4.59.0.tgz",
      "integrity": "sha512-peZRVEdnFWZ5Bh2KeumKG9ty7aCXzzEsHShOZEFiCQlDEepP1dpUl/SrUNXNg13UmZl+gzVDPsiCwnV1uI0RUA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-loong64-gnu": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-loong64-gnu/-/rollup-linux-loong64-gnu-4.59.0.tgz",
      "integrity": "sha512-gbUSW/97f7+r4gHy3Jlup8zDG190AuodsWnNiXErp9mT90iCy9NKKU0Xwx5k8VlRAIV2uU9CsMnEFg/xXaOfXg==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-loong64-musl": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-loong64-musl/-/rollup-linux-loong64-musl-4.59.0.tgz",
      "integrity": "sha512-yTRONe79E+o0FWFijasoTjtzG9EBedFXJMl888NBEDCDV9I2wGbFFfJQQe63OijbFCUZqxpHz1GzpbtSFikJ4Q==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-ppc64-gnu": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-ppc64-gnu/-/rollup-linux-ppc64-gnu-4.59.0.tgz",
      "integrity": "sha512-sw1o3tfyk12k3OEpRddF68a1unZ5VCN7zoTNtSn2KndUE+ea3m3ROOKRCZxEpmT9nsGnogpFP9x6mnLTCaoLkA==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-ppc64-musl": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-ppc64-musl/-/rollup-linux-ppc64-musl-4.59.0.tgz",
      "integrity": "sha512-+2kLtQ4xT3AiIxkzFVFXfsmlZiG5FXYW7ZyIIvGA7Bdeuh9Z0aN4hVyXS/G1E9bTP/vqszNIN/pUKCk/BTHsKA==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-riscv64-gnu": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-gnu/-/rollup-linux-riscv64-gnu-4.59.0.tgz",
      "integrity": "sha512-NDYMpsXYJJaj+I7UdwIuHHNxXZ/b/N2hR15NyH3m2qAtb/hHPA4g4SuuvrdxetTdndfj9b1WOmy73kcPRoERUg==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-riscv64-musl": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-musl/-/rollup-linux-riscv64-musl-4.59.0.tgz",
      "integrity": "sha512-nLckB8WOqHIf1bhymk+oHxvM9D3tyPndZH8i8+35p/1YiVoVswPid2yLzgX7ZJP0KQvnkhM4H6QZ5m0LzbyIAg==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-s390x-gnu": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-s390x-gnu/-/rollup-linux-s390x-gnu-4.59.0.tgz",
      "integrity": "sha512-oF87Ie3uAIvORFBpwnCvUzdeYUqi2wY6jRFWJAy1qus/udHFYIkplYRW+wo+GRUP4sKzYdmE1Y3+rY5Gc4ZO+w==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-x64-gnu": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-gnu/-/rollup-linux-x64-gnu-4.59.0.tgz",
      "integrity": "sha512-3AHmtQq/ppNuUspKAlvA8HtLybkDflkMuLK4DPo77DfthRb71V84/c4MlWJXixZz4uruIH4uaa07IqoAkG64fg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-linux-x64-musl": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-musl/-/rollup-linux-x64-musl-4.59.0.tgz",
      "integrity": "sha512-2UdiwS/9cTAx7qIUZB/fWtToJwvt0Vbo0zmnYt7ED35KPg13Q0ym1g442THLC7VyI6JfYTP4PiSOWyoMdV2/xg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@rollup/rollup-openbsd-x64": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-openbsd-x64/-/rollup-openbsd-x64-4.59.0.tgz",
      "integrity": "sha512-M3bLRAVk6GOwFlPTIxVBSYKUaqfLrn8l0psKinkCFxl4lQvOSz8ZrKDz2gxcBwHFpci0B6rttydI4IpS4IS/jQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ]
    },
    "node_modules/@rollup/rollup-openharmony-arm64": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-openharmony-arm64/-/rollup-openharmony-arm64-4.59.0.tgz",
      "integrity": "sha512-tt9KBJqaqp5i5HUZzoafHZX8b5Q2Fe7UjYERADll83O4fGqJ49O1FsL6LpdzVFQcpwvnyd0i+K/VSwu/o/nWlA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ]
    },
    "node_modules/@rollup/rollup-win32-arm64-msvc": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-arm64-msvc/-/rollup-win32-arm64-msvc-4.59.0.tgz",
      "integrity": "sha512-V5B6mG7OrGTwnxaNUzZTDTjDS7F75PO1ae6MJYdiMu60sq0CqN5CVeVsbhPxalupvTX8gXVSU9gq+Rx1/hvu6A==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-ia32-msvc": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-ia32-msvc/-/rollup-win32-ia32-msvc-4.59.0.tgz",
      "integrity": "sha512-UKFMHPuM9R0iBegwzKF4y0C4J9u8C6MEJgFuXTBerMk7EJ92GFVFYBfOZaSGLu6COf7FxpQNqhNS4c4icUPqxA==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-x64-gnu": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-x64-gnu/-/rollup-win32-x64-gnu-4.59.0.tgz",
      "integrity": "sha512-laBkYlSS1n2L8fSo1thDNGrCTQMmxjYY5G0WFWjFFYZkKPjsMBsgJfGf4TLxXrF6RyhI60L8TMOjBMvXiTcxeA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@rollup/rollup-win32-x64-msvc": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-x64-msvc/-/rollup-win32-x64-msvc-4.59.0.tgz",
      "integrity": "sha512-2HRCml6OztYXyJXAvdDXPKcawukWY2GpR5/nxKp4iBgiO3wcoEGkAaqctIbZcNB6KlUQBIqt8VYkNSj2397EfA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@types/babel__core": {
      "version": "7.20.5",
      "resolved": "https://registry.npmjs.org/@types/babel__core/-/babel__core-7.20.5.tgz",
      "integrity": "sha512-qoQprZvz5wQFJwMDqeseRXWv3rqMvhgpbXFfVyWhbx9X47POIA6i/+dXefEmZKoAgOaTdaIgNSMqMIU61yRyzA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/parser": "^7.20.7",
        "@babel/types": "^7.20.7",
        "@types/babel__generator": "*",
        "@types/babel__template": "*",
        "@types/babel__traverse": "*"
      }
    },
    "node_modules/@types/babel__generator": {
      "version": "7.27.0",
      "resolved": "https://registry.npmjs.org/@types/babel__generator/-/babel__generator-7.27.0.tgz",
      "integrity": "sha512-ufFd2Xi92OAVPYsy+P4n7/U7e68fex0+Ee8gSG9KX7eo084CWiQ4sdxktvdl0bOPupXtVJPY19zk6EwWqUQ8lg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.0.0"
      }
    },
    "node_modules/@types/babel__template": {
      "version": "7.4.4",
      "resolved": "https://registry.npmjs.org/@types/babel__template/-/babel__template-7.4.4.tgz",
      "integrity": "sha512-h/NUaSyG5EyxBIp8YRxo4RMe2/qQgvyowRwVMzhYhBCONbW8PUsg4lkFMrhgZhUe5z3L3MiLDuvyJ/CaPa2A8A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/parser": "^7.1.0",
        "@babel/types": "^7.0.0"
      }
    },
    "node_modules/@types/babel__traverse": {
      "version": "7.28.0",
      "resolved": "https://registry.npmjs.org/@types/babel__traverse/-/babel__traverse-7.28.0.tgz",
      "integrity": "sha512-8PvcXf70gTDZBgt9ptxJ8elBeBjcLOAcOtoO/mPJjtji1+CdGbHgm77om1GrsPxsiE+uXIpNSK64UYaIwQXd4Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.28.2"
      }
    },
    "node_modules/@types/estree": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/@types/estree/-/estree-1.0.8.tgz",
      "integrity": "sha512-dWHzHa2WqEXI/O1E9OjrocMTKJl2mSrEolh1Iomrv6U+JuNwaHXsXx9bLu5gG7BUWFIN0skIQJQ/L1rIex4X6w==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/parse-json": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/@types/parse-json/-/parse-json-4.0.2.tgz",
      "integrity": "sha512-dISoDXWWQwUquiKsyZ4Ng+HX2KsPL7LyHKHQwgGFEA3IaKac4Obd+h2a/a6waisAoepJlBcx9paWqjA8/HVjCw==",
      "license": "MIT"
    },
    "node_modules/@types/prop-types": {
      "version": "15.7.15",
      "resolved": "https://registry.npmjs.org/@types/prop-types/-/prop-types-15.7.15.tgz",
      "integrity": "sha512-F6bEyamV9jKGAFBEmlQnesRPGOQqS2+Uwi0Em15xenOxHaf2hv6L8YCVn3rPdPJOiJfPiCnLIRyvwVaqMY3MIw==",
      "license": "MIT"
    },
    "node_modules/@types/react": {
      "version": "18.3.28",
      "resolved": "https://registry.npmjs.org/@types/react/-/react-18.3.28.tgz",
      "integrity": "sha512-z9VXpC7MWrhfWipitjNdgCauoMLRdIILQsAEV+ZesIzBq/oUlxk0m3ApZuMFCXdnS4U7KrI+l3WRUEGQ8K1QKw==",
      "license": "MIT",
      "dependencies": {
        "@types/prop-types": "*",
        "csstype": "^3.2.2"
      }
    },
    "node_modules/@types/react-dom": {
      "version": "18.3.7",
      "resolved": "https://registry.npmjs.org/@types/react-dom/-/react-dom-18.3.7.tgz",
      "integrity": "sha512-MEe3UeoENYVFXzoXEWsvcpg6ZvlrFNlOQ7EOsvhI3CfAXwzPfO8Qwuxd40nepsYKqyyVQnTdEfv68q91yLcKrQ==",
      "dev": true,
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "^18.0.0"
      }
    },
    "node_modules/@types/react-transition-group": {
      "version": "4.4.12",
      "resolved": "https://registry.npmjs.org/@types/react-transition-group/-/react-transition-group-4.4.12.tgz",
      "integrity": "sha512-8TV6R3h2j7a91c+1DXdJi3Syo69zzIZbz7Lg5tORM5LEJG7X/E6a1V3drRyBRZq7/utz7A+c4OgYLiLcYGHG6w==",
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "*"
      }
    },
    "node_modules/@vitejs/plugin-react": {
      "version": "4.7.0",
      "resolved": "https://registry.npmjs.org/@vitejs/plugin-react/-/plugin-react-4.7.0.tgz",
      "integrity": "sha512-gUu9hwfWvvEDBBmgtAowQCojwZmJ5mcLn3aufeCsitijs3+f2NsrPtlAWIR6OPiqljl96GVCUbLe0HyqIpVaoA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/core": "^7.28.0",
        "@babel/plugin-transform-react-jsx-self": "^7.27.1",
        "@babel/plugin-transform-react-jsx-source": "^7.27.1",
        "@rolldown/pluginutils": "1.0.0-beta.27",
        "@types/babel__core": "^7.20.5",
        "react-refresh": "^0.17.0"
      },
      "engines": {
        "node": "^14.18.0 || >=16.0.0"
      },
      "peerDependencies": {
        "vite": "^4.2.0 || ^5.0.0 || ^6.0.0 || ^7.0.0"
      }
    },
    "node_modules/babel-plugin-macros": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/babel-plugin-macros/-/babel-plugin-macros-3.1.0.tgz",
      "integrity": "sha512-Cg7TFGpIr01vOQNODXOOaGz2NpCU5gl8x1qJFbb6hbZxR7XrcE2vtbAsTAbJ7/xwJtUuJEw8K8Zr/AE0LHlesg==",
      "license": "MIT",
      "dependencies": {
        "@babel/runtime": "^7.12.5",
        "cosmiconfig": "^7.0.0",
        "resolve": "^1.19.0"
      },
      "engines": {
        "node": ">=10",
        "npm": ">=6"
      }
    },
    "node_modules/baseline-browser-mapping": {
      "version": "2.10.0",
      "resolved": "https://registry.npmjs.org/baseline-browser-mapping/-/baseline-browser-mapping-2.10.0.tgz",
      "integrity": "sha512-lIyg0szRfYbiy67j9KN8IyeD7q7hcmqnJ1ddWmNt19ItGpNN64mnllmxUNFIOdOm6by97jlL6wfpTTJrmnjWAA==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "baseline-browser-mapping": "dist/cli.cjs"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/browserslist": {
      "version": "4.28.1",
      "resolved": "https://registry.npmjs.org/browserslist/-/browserslist-4.28.1.tgz",
      "integrity": "sha512-ZC5Bd0LgJXgwGqUknZY/vkUQ04r8NXnJZ3yYi4vDmSiZmC/pdSN0NbNRPxZpbtO4uAfDUAFffO8IZoM3Gj8IkA==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "baseline-browser-mapping": "^2.9.0",
        "caniuse-lite": "^1.0.30001759",
        "electron-to-chromium": "^1.5.263",
        "node-releases": "^2.0.27",
        "update-browserslist-db": "^1.2.0"
      },
      "bin": {
        "browserslist": "cli.js"
      },
      "engines": {
        "node": "^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7"
      }
    },
    "node_modules/callsites": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/callsites/-/callsites-3.1.0.tgz",
      "integrity": "sha512-P8BjAsXvZS+VIDUI11hHCQEv74YT67YUi5JJFNWIqL235sBmjX4+qx9Muvls5ivyNENctx46xQLQ3aTuE7ssaQ==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/caniuse-lite": {
      "version": "1.0.30001776",
      "resolved": "https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001776.tgz",
      "integrity": "sha512-sg01JDPzZ9jGshqKSckOQthXnYwOEP50jeVFhaSFbZcOy05TiuuaffDOfcwtCisJ9kNQuLBFibYywv2Bgm9osw==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/caniuse-lite"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "CC-BY-4.0"
    },
    "node_modules/clsx": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/clsx/-/clsx-2.1.1.tgz",
      "integrity": "sha512-eYm0QWBtUrBWZWG0d386OGAw16Z995PiOVo2B7bjWSbHedGl5e0ZWaq65kOGgUSNesEIDkB9ISbTg/JK9dhCZA==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/convert-source-map": {
      "version": "1.9.0",
      "resolved": "https://registry.npmjs.org/convert-source-map/-/convert-source-map-1.9.0.tgz",
      "integrity": "sha512-ASFBup0Mz1uyiIjANan1jzLQami9z1PoYSZCiiYW2FczPbenXc45FZdBZLzOT+r6+iciuEModtmCti+hjaAk0A==",
      "license": "MIT"
    },
    "node_modules/cosmiconfig": {
      "version": "7.1.0",
      "resolved": "https://registry.npmjs.org/cosmiconfig/-/cosmiconfig-7.1.0.tgz",
      "integrity": "sha512-AdmX6xUzdNASswsFtmwSt7Vj8po9IuqXm0UXz7QKPuEUmPB4XyjGfaAr2PSuELMwkRMVH1EpIkX5bTZGRB3eCA==",
      "license": "MIT",
      "dependencies": {
        "@types/parse-json": "^4.0.0",
        "import-fresh": "^3.2.1",
        "parse-json": "^5.0.0",
        "path-type": "^4.0.0",
        "yaml": "^1.10.0"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/csstype": {
      "version": "3.2.3",
      "resolved": "https://registry.npmjs.org/csstype/-/csstype-3.2.3.tgz",
      "integrity": "sha512-z1HGKcYy2xA8AGQfwrn0PAy+PB7X/GSj3UVJW9qKyn43xWa+gl5nXmU4qqLMRzWVLFC8KusUX8T/0kCiOYpAIQ==",
      "license": "MIT"
    },
    "node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/dom-helpers": {
      "version": "5.2.1",
      "resolved": "https://registry.npmjs.org/dom-helpers/-/dom-helpers-5.2.1.tgz",
      "integrity": "sha512-nRCa7CK3VTrM2NmGkIy4cbK7IZlgBE/PYMn55rrXefr5xXDP0LdtfPnblFDoVdcAfslJ7or6iqAUnx0CCGIWQA==",
      "license": "MIT",
      "dependencies": {
        "@babel/runtime": "^7.8.7",
        "csstype": "^3.0.2"
      }
    },
    "node_modules/electron-to-chromium": {
      "version": "1.5.307",
      "resolved": "https://registry.npmjs.org/electron-to-chromium/-/electron-to-chromium-1.5.307.tgz",
      "integrity": "sha512-5z3uFKBWjiNR44nFcYdkcXjKMbg5KXNdciu7mhTPo9tB7NbqSNP2sSnGR+fqknZSCwKkBN+oxiiajWs4dT6ORg==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/error-ex": {
      "version": "1.3.4",
      "resolved": "https://registry.npmjs.org/error-ex/-/error-ex-1.3.4.tgz",
      "integrity": "sha512-sqQamAnR14VgCr1A618A3sGrygcpK+HEbenA/HiEAkkUwcZIIB/tgWqHFxWgOyDh4nB4JCRimh79dR5Ywc9MDQ==",
      "license": "MIT",
      "dependencies": {
        "is-arrayish": "^0.2.1"
      }
    },
    "node_modules/esbuild": {
      "version": "0.21.5",
      "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.21.5.tgz",
      "integrity": "sha512-mg3OPMV4hXywwpoDxu3Qda5xCKQi+vCTZq8S9J/EpkhB2HzKXq4SNFZE3+NK93JYxc8VMSep+lOUSC/RVKaBqw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "bin": {
        "esbuild": "bin/esbuild"
      },
      "engines": {
        "node": ">=12"
      },
      "optionalDependencies": {
        "@esbuild/aix-ppc64": "0.21.5",
        "@esbuild/android-arm": "0.21.5",
        "@esbuild/android-arm64": "0.21.5",
        "@esbuild/android-x64": "0.21.5",
        "@esbuild/darwin-arm64": "0.21.5",
        "@esbuild/darwin-x64": "0.21.5",
        "@esbuild/freebsd-arm64": "0.21.5",
        "@esbuild/freebsd-x64": "0.21.5",
        "@esbuild/linux-arm": "0.21.5",
        "@esbuild/linux-arm64": "0.21.5",
        "@esbuild/linux-ia32": "0.21.5",
        "@esbuild/linux-loong64": "0.21.5",
        "@esbuild/linux-mips64el": "0.21.5",
        "@esbuild/linux-ppc64": "0.21.5",
        "@esbuild/linux-riscv64": "0.21.5",
        "@esbuild/linux-s390x": "0.21.5",
        "@esbuild/linux-x64": "0.21.5",
        "@esbuild/netbsd-x64": "0.21.5",
        "@esbuild/openbsd-x64": "0.21.5",
        "@esbuild/sunos-x64": "0.21.5",
        "@esbuild/win32-arm64": "0.21.5",
        "@esbuild/win32-ia32": "0.21.5",
        "@esbuild/win32-x64": "0.21.5"
      }
    },
    "node_modules/escalade": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/escalade/-/escalade-3.2.0.tgz",
      "integrity": "sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/escape-string-regexp": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-4.0.0.tgz",
      "integrity": "sha512-TtpcNJ3XAzx3Gq8sWRzJaVajRs0uVxA2YAkdb1jm2YkPz4G6egUFAyA3n5vtEIZefPk5Wa4UXbKuS5fKkJWdgA==",
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/find-root": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/find-root/-/find-root-1.1.0.tgz",
      "integrity": "sha512-NKfW6bec6GfKc0SGx1e07QZY9PE99u0Bft/0rzSD5k3sO/vwkVUpDUKVm5Gpp5Ue3YfShPFTX2070tDs5kB9Ng==",
      "license": "MIT"
    },
    "node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/gensync": {
      "version": "1.0.0-beta.2",
      "resolved": "https://registry.npmjs.org/gensync/-/gensync-1.0.0-beta.2.tgz",
      "integrity": "sha512-3hN7NaskYvMDLQY55gnW3NQ+mesEAepTqlg+VEbj7zzqEMBVNhzcGYYeqFo/TlYz6eQiFcp1HcsCZO+nGgS8zg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/hasown": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.2.tgz",
      "integrity": "sha512-0hJU9SCPvmMzIBdZFqNPXWa6dqh7WdH0cII9y+CyS8rG3nL48Bclra9HmKhVVUHyPWNH5Y7xDwAB7bfgSjkUMQ==",
      "license": "MIT",
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/hoist-non-react-statics": {
      "version": "3.3.2",
      "resolved": "https://registry.npmjs.org/hoist-non-react-statics/-/hoist-non-react-statics-3.3.2.tgz",
      "integrity": "sha512-/gGivxi8JPKWNm/W0jSmzcMPpfpPLc3dY/6GxhX2hQ9iGj3aDfklV4ET7NjKpSinLpJ5vafa9iiGIEZg10SfBw==",
      "license": "BSD-3-Clause",
      "dependencies": {
        "react-is": "^16.7.0"
      }
    },
    "node_modules/hoist-non-react-statics/node_modules/react-is": {
      "version": "16.13.1",
      "resolved": "https://registry.npmjs.org/react-is/-/react-is-16.13.1.tgz",
      "integrity": "sha512-24e6ynE2H+OKt4kqsOvNd8kBpV65zoxbA4BVsEOB3ARVWQki/DHzaUoC5KuON/BiccDaCCTZBuOcfZs70kR8bQ==",
      "license": "MIT"
    },
    "node_modules/import-fresh": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/import-fresh/-/import-fresh-3.3.1.tgz",
      "integrity": "sha512-TR3KfrTZTYLPB6jUjfx6MF9WcWrHL9su5TObK4ZkYgBdWKPOFoSoQIdEuTuR82pmtxH2spWG9h6etwfr1pLBqQ==",
      "license": "MIT",
      "dependencies": {
        "parent-module": "^1.0.0",
        "resolve-from": "^4.0.0"
      },
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/is-arrayish": {
      "version": "0.2.1",
      "resolved": "https://registry.npmjs.org/is-arrayish/-/is-arrayish-0.2.1.tgz",
      "integrity": "sha512-zz06S8t0ozoDXMG+ube26zeCTNXcKIPJZJi8hBrF4idCLms4CG9QtK7qBl1boi5ODzFpjswb5JPmHCbMpjaYzg==",
      "license": "MIT"
    },
    "node_modules/is-core-module": {
      "version": "2.16.1",
      "resolved": "https://registry.npmjs.org/is-core-module/-/is-core-module-2.16.1.tgz",
      "integrity": "sha512-UfoeMA6fIJ8wTYFEUjelnaGI67v6+N7qXJEvQuIGa99l4xsCruSYOVSQ0uPANn4dAzm8lkYPaKLrrijLq7x23w==",
      "license": "MIT",
      "dependencies": {
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/js-tokens": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/js-tokens/-/js-tokens-4.0.0.tgz",
      "integrity": "sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==",
      "license": "MIT"
    },
    "node_modules/jsesc": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/jsesc/-/jsesc-3.1.0.tgz",
      "integrity": "sha512-/sM3dO2FOzXjKQhJuo0Q173wf2KOo8t4I8vHy6lF9poUp7bKT0/NHE8fPX23PwfhnykfqnC2xRxOnVw5XuGIaA==",
      "license": "MIT",
      "bin": {
        "jsesc": "bin/jsesc"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/json-parse-even-better-errors": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/json-parse-even-better-errors/-/json-parse-even-better-errors-2.3.1.tgz",
      "integrity": "sha512-xyFwyhro/JEof6Ghe2iz2NcXoj2sloNsWr/XsERDK/oiPCfaNhl5ONfp+jQdAZRQQ0IJWNzH9zIZF7li91kh2w==",
      "license": "MIT"
    },
    "node_modules/json5": {
      "version": "2.2.3",
      "resolved": "https://registry.npmjs.org/json5/-/json5-2.2.3.tgz",
      "integrity": "sha512-XmOWe7eyHYH14cLdVPoyg+GOH3rYX++KpzrylJwSW98t3Nk+U8XOl8FWKOgwtzdb8lXGf6zYwDUzeHMWfxasyg==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "json5": "lib/cli.js"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/lines-and-columns": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/lines-and-columns/-/lines-and-columns-1.2.4.tgz",
      "integrity": "sha512-7ylylesZQ/PV29jhEDl3Ufjo6ZX7gCqJr5F7PKrqc93v7fzSymt1BpwEU8nAUXs8qzzvqhbjhK5QZg6Mt/HkBg==",
      "license": "MIT"
    },
    "node_modules/loose-envify": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/loose-envify/-/loose-envify-1.4.0.tgz",
      "integrity": "sha512-lyuxPGr/Wfhrlem2CL/UcnUc1zcqKAImBDzukY7Y5F/yQiNdko6+fRLevlw1HgMySw7f611UIY408EtxRSoK3Q==",
      "license": "MIT",
      "dependencies": {
        "js-tokens": "^3.0.0 || ^4.0.0"
      },
      "bin": {
        "loose-envify": "cli.js"
      }
    },
    "node_modules/lru-cache": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-5.1.1.tgz",
      "integrity": "sha512-KpNARQA3Iwv+jTA0utUVVbrh+Jlrr1Fv0e56GGzAFOXN7dk/FviaDW8LHmK52DlcH4WP2n6gI8vN1aesBFgo9w==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "yallist": "^3.0.2"
      }
    },
    "node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT"
    },
    "node_modules/nanoid": {
      "version": "3.3.11",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.11.tgz",
      "integrity": "sha512-N8SpfPUnUp1bK+PMYW8qSWdl9U+wwNWI4QKxOYDy9JAro3WMX7p2OeVRF9v+347pnakNevPmiHhNmZ2HbFA76w==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/node-releases": {
      "version": "2.0.36",
      "resolved": "https://registry.npmjs.org/node-releases/-/node-releases-2.0.36.tgz",
      "integrity": "sha512-TdC8FSgHz8Mwtw9g5L4gR/Sh9XhSP/0DEkQxfEFXOpiul5IiHgHan2VhYYb6agDSfp4KuvltmGApc8HMgUrIkA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/object-assign": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
      "integrity": "sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/parent-module": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/parent-module/-/parent-module-1.0.1.tgz",
      "integrity": "sha512-GQ2EWRpQV8/o+Aw8YqtfZZPfNRWZYkbidE9k5rpl/hC3vtHHBfGm2Ifi6qWV+coDGkrUKZAxE3Lot5kcsRlh+g==",
      "license": "MIT",
      "dependencies": {
        "callsites": "^3.0.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/parse-json": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/parse-json/-/parse-json-5.2.0.tgz",
      "integrity": "sha512-ayCKvm/phCGxOkYRSCM82iDwct8/EonSEgCSxWxD7ve6jHggsFl4fZVQBPRNgQoKiuV/odhFrGzQXZwbifC8Rg==",
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.0.0",
        "error-ex": "^1.3.1",
        "json-parse-even-better-errors": "^2.3.0",
        "lines-and-columns": "^1.1.6"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/path-parse": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/path-parse/-/path-parse-1.0.7.tgz",
      "integrity": "sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==",
      "license": "MIT"
    },
    "node_modules/path-type": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/path-type/-/path-type-4.0.0.tgz",
      "integrity": "sha512-gDKb8aZMDeD/tZWs9P6+q0J9Mwkdl6xMV8TjnGP3qJVJ06bdMgkbBlLU8IdfOsIsFz2BW1rNVT3XuNEl8zPAvw==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "license": "ISC"
    },
    "node_modules/postcss": {
      "version": "8.5.8",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.8.tgz",
      "integrity": "sha512-OW/rX8O/jXnm82Ey1k44pObPtdblfiuWnrd8X7GJ7emImCOstunGbXUpp7HdBrFQX6rJzn3sPT397Wp5aCwCHg==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.11",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/prop-types": {
      "version": "15.8.1",
      "resolved": "https://registry.npmjs.org/prop-types/-/prop-types-15.8.1.tgz",
      "integrity": "sha512-oj87CgZICdulUohogVAR7AjlC0327U4el4L6eAvOqCeudMDVU0NThNaV+b9Df4dXgSP1gXMTnPdhfe/2qDH5cg==",
      "license": "MIT",
      "dependencies": {
        "loose-envify": "^1.4.0",
        "object-assign": "^4.1.1",
        "react-is": "^16.13.1"
      }
    },
    "node_modules/prop-types/node_modules/react-is": {
      "version": "16.13.1",
      "resolved": "https://registry.npmjs.org/react-is/-/react-is-16.13.1.tgz",
      "integrity": "sha512-24e6ynE2H+OKt4kqsOvNd8kBpV65zoxbA4BVsEOB3ARVWQki/DHzaUoC5KuON/BiccDaCCTZBuOcfZs70kR8bQ==",
      "license": "MIT"
    },
    "node_modules/react": {
      "version": "18.3.1",
      "resolved": "https://registry.npmjs.org/react/-/react-18.3.1.tgz",
      "integrity": "sha512-wS+hAgJShR0KhEvPJArfuPVN1+Hz1t0Y6n5jLrGQbkb4urgPE/0Rve+1kMB1v/oWgHgm4WIcV+i7F2pTVj+2iQ==",
      "license": "MIT",
      "dependencies": {
        "loose-envify": "^1.1.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/react-dom": {
      "version": "18.3.1",
      "resolved": "https://registry.npmjs.org/react-dom/-/react-dom-18.3.1.tgz",
      "integrity": "sha512-5m4nQKp+rZRb09LNH59GM4BxTh9251/ylbKIbpe7TpGxfJ+9kv6BLkLBXIjjspbgbnIBNqlI23tRnTWT0snUIw==",
      "license": "MIT",
      "dependencies": {
        "loose-envify": "^1.1.0",
        "scheduler": "^0.23.2"
      },
      "peerDependencies": {
        "react": "^18.3.1"
      }
    },
    "node_modules/react-is": {
      "version": "19.2.4",
      "resolved": "https://registry.npmjs.org/react-is/-/react-is-19.2.4.tgz",
      "integrity": "sha512-W+EWGn2v0ApPKgKKCy/7s7WHXkboGcsrXE+2joLyVxkbyVQfO3MUEaUQDHoSmb8TFFrSKYa9mw64WZHNHSDzYA==",
      "license": "MIT"
    },
    "node_modules/react-refresh": {
      "version": "0.17.0",
      "resolved": "https://registry.npmjs.org/react-refresh/-/react-refresh-0.17.0.tgz",
      "integrity": "sha512-z6F7K9bV85EfseRCp2bzrpyQ0Gkw1uLoCel9XBVWPg/TjRj94SkJzUTGfOa4bs7iJvBWtQG0Wq7wnI0syw3EBQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/react-transition-group": {
      "version": "4.4.5",
      "resolved": "https://registry.npmjs.org/react-transition-group/-/react-transition-group-4.4.5.tgz",
      "integrity": "sha512-pZcd1MCJoiKiBR2NRxeCRg13uCXbydPnmB4EOeRrY7480qNWO8IIgQG6zlDkm6uRMsURXPuKq0GWtiM59a5Q6g==",
      "license": "BSD-3-Clause",
      "dependencies": {
        "@babel/runtime": "^7.5.5",
        "dom-helpers": "^5.0.1",
        "loose-envify": "^1.4.0",
        "prop-types": "^15.6.2"
      },
      "peerDependencies": {
        "react": ">=16.6.0",
        "react-dom": ">=16.6.0"
      }
    },
    "node_modules/resolve": {
      "version": "1.22.11",
      "resolved": "https://registry.npmjs.org/resolve/-/resolve-1.22.11.tgz",
      "integrity": "sha512-RfqAvLnMl313r7c9oclB1HhUEAezcpLjz95wFH4LVuhk9JF/r22qmVP9AMmOU4vMX7Q8pN8jwNg/CSpdFnMjTQ==",
      "license": "MIT",
      "dependencies": {
        "is-core-module": "^2.16.1",
        "path-parse": "^1.0.7",
        "supports-preserve-symlinks-flag": "^1.0.0"
      },
      "bin": {
        "resolve": "bin/resolve"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/resolve-from": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/resolve-from/-/resolve-from-4.0.0.tgz",
      "integrity": "sha512-pb/MYmXstAkysRFx8piNI1tGFNQIFA3vkE3Gq4EuA1dF6gHp/+vgZqsCGJapvy8N3Q+4o7FwvquPJcnZ7RYy4g==",
      "license": "MIT",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/rollup": {
      "version": "4.59.0",
      "resolved": "https://registry.npmjs.org/rollup/-/rollup-4.59.0.tgz",
      "integrity": "sha512-2oMpl67a3zCH9H79LeMcbDhXW/UmWG/y2zuqnF2jQq5uq9TbM9TVyXvA4+t+ne2IIkBdrLpAaRQAvo7YI/Yyeg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/estree": "1.0.8"
      },
      "bin": {
        "rollup": "dist/bin/rollup"
      },
      "engines": {
        "node": ">=18.0.0",
        "npm": ">=8.0.0"
      },
      "optionalDependencies": {
        "@rollup/rollup-android-arm-eabi": "4.59.0",
        "@rollup/rollup-android-arm64": "4.59.0",
        "@rollup/rollup-darwin-arm64": "4.59.0",
        "@rollup/rollup-darwin-x64": "4.59.0",
        "@rollup/rollup-freebsd-arm64": "4.59.0",
        "@rollup/rollup-freebsd-x64": "4.59.0",
        "@rollup/rollup-linux-arm-gnueabihf": "4.59.0",
        "@rollup/rollup-linux-arm-musleabihf": "4.59.0",
        "@rollup/rollup-linux-arm64-gnu": "4.59.0",
        "@rollup/rollup-linux-arm64-musl": "4.59.0",
        "@rollup/rollup-linux-loong64-gnu": "4.59.0",
        "@rollup/rollup-linux-loong64-musl": "4.59.0",
        "@rollup/rollup-linux-ppc64-gnu": "4.59.0",
        "@rollup/rollup-linux-ppc64-musl": "4.59.0",
        "@rollup/rollup-linux-riscv64-gnu": "4.59.0",
        "@rollup/rollup-linux-riscv64-musl": "4.59.0",
        "@rollup/rollup-linux-s390x-gnu": "4.59.0",
        "@rollup/rollup-linux-x64-gnu": "4.59.0",
        "@rollup/rollup-linux-x64-musl": "4.59.0",
        "@rollup/rollup-openbsd-x64": "4.59.0",
        "@rollup/rollup-openharmony-arm64": "4.59.0",
        "@rollup/rollup-win32-arm64-msvc": "4.59.0",
        "@rollup/rollup-win32-ia32-msvc": "4.59.0",
        "@rollup/rollup-win32-x64-gnu": "4.59.0",
        "@rollup/rollup-win32-x64-msvc": "4.59.0",
        "fsevents": "~2.3.2"
      }
    },
    "node_modules/scheduler": {
      "version": "0.23.2",
      "resolved": "https://registry.npmjs.org/scheduler/-/scheduler-0.23.2.tgz",
      "integrity": "sha512-UOShsPwz7NrMUqhR6t0hWjFduvOzbtv7toDH1/hIrfRNIDBnnBWd0CwJTGvTpngVlmwGCdP9/Zl/tVrDqcuYzQ==",
      "license": "MIT",
      "dependencies": {
        "loose-envify": "^1.1.0"
      }
    },
    "node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/source-map": {
      "version": "0.5.7",
      "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.5.7.tgz",
      "integrity": "sha512-LbrmJOMUSdEVxIKvdcJzQC+nQhe8FUZQTXQy6+I75skNgn3OoQ0DZA8YnFa7gp8tqtL3KPf1kmo0R5DoApeSGQ==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/source-map-js": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz",
      "integrity": "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==",
      "dev": true,
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/stylis": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/stylis/-/stylis-4.2.0.tgz",
      "integrity": "sha512-Orov6g6BB1sDfYgzWfTHDOxamtX1bE/zo104Dh9e6fqJ3PooipYyfJ0pUmrZO2wAvO8YbEyeFrkV91XTsGMSrw==",
      "license": "MIT"
    },
    "node_modules/supports-preserve-symlinks-flag": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/supports-preserve-symlinks-flag/-/supports-preserve-symlinks-flag-1.0.0.tgz",
      "integrity": "sha512-ot0WnXS9fgdkgIcePe6RHNk1WA8+muPa6cSjeR3V8K27q9BB1rTE3R1p7Hv0z1ZyAc8s6Vvv8DIyWf681MAt0w==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/typescript": {
      "version": "5.9.3",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-5.9.3.tgz",
      "integrity": "sha512-jl1vZzPDinLr9eUt3J/t7V6FgNEw9QjvBPdysz9KfQDD41fQrC2Y4vKQdiaUpFT4bXlb1RHhLpp8wtm6M5TgSw==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "tsc": "bin/tsc",
        "tsserver": "bin/tsserver"
      },
      "engines": {
        "node": ">=14.17"
      }
    },
    "node_modules/update-browserslist-db": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/update-browserslist-db/-/update-browserslist-db-1.2.3.tgz",
      "integrity": "sha512-Js0m9cx+qOgDxo0eMiFGEueWztz+d4+M3rGlmKPT+T4IS/jP4ylw3Nwpu6cpTTP8R1MAC1kF4VbdLt3ARf209w==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "escalade": "^3.2.0",
        "picocolors": "^1.1.1"
      },
      "bin": {
        "update-browserslist-db": "cli.js"
      },
      "peerDependencies": {
        "browserslist": ">= 4.21.0"
      }
    },
    "node_modules/vite": {
      "version": "5.4.21",
      "resolved": "https://registry.npmjs.org/vite/-/vite-5.4.21.tgz",
      "integrity": "sha512-o5a9xKjbtuhY6Bi5S3+HvbRERmouabWbyUcpXXUA1u+GNUKoROi9byOJ8M0nHbHYHkYICiMlqxkg1KkYmm25Sw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "esbuild": "^0.21.3",
        "postcss": "^8.4.43",
        "rollup": "^4.20.0"
      },
      "bin": {
        "vite": "bin/vite.js"
      },
      "engines": {
        "node": "^18.0.0 || >=20.0.0"
      },
      "funding": {
        "url": "https://github.com/vitejs/vite?sponsor=1"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.3"
      },
      "peerDependencies": {
        "@types/node": "^18.0.0 || >=20.0.0",
        "less": "*",
        "lightningcss": "^1.21.0",
        "sass": "*",
        "sass-embedded": "*",
        "stylus": "*",
        "sugarss": "*",
        "terser": "^5.4.0"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        },
        "less": {
          "optional": true
        },
        "lightningcss": {
          "optional": true
        },
        "sass": {
          "optional": true
        },
        "sass-embedded": {
          "optional": true
        },
        "stylus": {
          "optional": true
        },
        "sugarss": {
          "optional": true
        },
        "terser": {
          "optional": true
        }
      }
    },
    "node_modules/yallist": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-3.1.1.tgz",
      "integrity": "sha512-a4UGQaWPH59mOXUYnAG2ewncQS4i4F43Tv3JoAM+s2VDAmS9NsK8GpDMLrCHPksFT7h3K6TOoUNn2pb7RoXx4g==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/yaml": {
      "version": "1.10.2",
      "resolved": "https://registry.npmjs.org/yaml/-/yaml-1.10.2.tgz",
      "integrity": "sha512-r3vXyErRCYJ7wg28yvBY5VSoAF8ZvlcW9/BwUzEtUsjvX/DKs24dIkuwjtuprwJJHsbyUbLApepYTR1BN4uHrg==",
      "license": "ISC",
      "engines": {
        "node": ">= 6"
      }
    }
  }
}

```

---

## File: demo-client/README.md

```md
React Auth Demo Client (Material UI)

Local dev:

1) Start backend (repo root):
   ./scripts/netlify-dev.sh

2) Start demo client:
   cd demo-client
   npm install
   npm run dev

By default (no VITE_API_BASE_URL set), the demo client uses same-origin and Vite proxies:
  /.netlify/functions/*  ->  http://localhost:3999/.netlify/functions/*

Config (optional):

- VITE_API_BASE_URL: if set, the UI will call:
    ${VITE_API_BASE_URL}/.netlify/functions/*
  and Vite proxy target will also use this value.

Example:

  cat > demo-client/.env.local <<'EOF'
  VITE_API_BASE_URL=http://localhost:3999
  EOF

```

---

## File: demo-client/src/api/apiClient.ts

```ts
import { getFunctionsBaseUrl } from "../config";
import { isErrorEnvelope, isSuccessEnvelope } from "../types/apiTypes";

export type ApiError = {
  status: number;
  code: string;
  message: string;
  details?: unknown;
  requestId?: string;
};

export type ApiLogEntry = {
  method: string;
  path: string;
  url: string;
  status: number;
  ms: number;
  ok: boolean;
  requestBody?: unknown;
  responseBody?: unknown;
  errorMessage?: string;
};

export type ApiLogger = (e: ApiLogEntry) => void;

type FetchInit = Parameters<typeof fetch>[1];

export type ApiClient = {
  get<T>(path: string, opts?: { headers?: Record<string, string> }): Promise<T>;
  post<T>(path: string, body?: unknown, opts?: { headers?: Record<string, string> }): Promise<T>;
  patch<T>(path: string, body?: unknown, opts?: { headers?: Record<string, string> }): Promise<T>;
  del<T>(path: string, opts?: { headers?: Record<string, string> }): Promise<T>;
  raw: {
    request(method: string, path: string, init?: FetchInit): Promise<Response>;
  };
};

function joinUrl(base: string, path: string): string {
  const b = base.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

async function readJsonSafe(res: Response): Promise<unknown> {
  const txt = await res.text();
  if (!txt) return null;
  try {
    return JSON.parse(txt);
  } catch {
    return txt;
  }
}

function toApiError(status: number, body: unknown): ApiError {
  if (isErrorEnvelope(body)) {
    return {
      status,
      code: body.error.code,
      message: body.error.message,
      ...(body.error.details !== undefined ? { details: body.error.details } : {}),
      ...(body.requestId !== undefined ? { requestId: body.requestId } : {})
    };
  }

  return {
    status,
    code: "HTTP_ERROR",
    message: typeof body === "string" ? body : "Request failed",
    ...(typeof body === "string" ? {} : { details: body })
  };
}

function unwrapEnvelope<T>(status: number, body: unknown): T {
  if (isSuccessEnvelope<T>(body)) return body.data;
  if (isErrorEnvelope(body)) throw toApiError(status, body);
  return body as T;
}

export function createApiClient(getAccessToken: () => string | undefined, logger?: ApiLogger): ApiClient {
  const baseUrl = getFunctionsBaseUrl();

  async function request(method: string, path: string, init?: FetchInit): Promise<Response> {
    const url = joinUrl(baseUrl, path);
    const headers: Record<string, string> = {
      ...(init?.headers ? (init.headers as Record<string, string>) : {})
    };

    const token = getAccessToken();
    if (token) headers.authorization = `Bearer ${token}`;

    return fetch(url, {
      ...init,
      method,
      headers
    });
  }

  async function jsonRequest<T>(
    method: string,
    path: string,
    body?: unknown,
    extraHeaders?: Record<string, string>
  ): Promise<T> {
    const headers: Record<string, string> = {
      ...(extraHeaders || {})
    };

    let payload: string | undefined;
    if (body !== undefined) {
      headers["content-type"] = headers["content-type"] || "application/json";
      payload = JSON.stringify(body);
    }

    const started = performance.now();
    const url = joinUrl(baseUrl, path);

    try {
      const res = await request(method, path, {
        headers,
        ...(payload !== undefined ? { body: payload } : {})
      });

      const parsed = await readJsonSafe(res);
      const ms = Math.max(0, Math.round(performance.now() - started));

      if (!res.ok) {
        logger?.({
          method,
          path,
          url,
          status: res.status,
          ms,
          ok: false,
          ...(body !== undefined ? { requestBody: body } : {}),
          ...(parsed !== undefined ? { responseBody: parsed } : {})
        });

        throw toApiError(res.status, parsed);
      }

      logger?.({
        method,
        path,
        url,
        status: res.status,
        ms,
        ok: true,
        ...(body !== undefined ? { requestBody: body } : {}),
        ...(parsed !== undefined ? { responseBody: parsed } : {})
      });

      return unwrapEnvelope<T>(res.status, parsed) as T;
    } catch (err) {
      const ms = Math.max(0, Math.round(performance.now() - started));

      if ((err as { status?: unknown })?.status === undefined) {
        logger?.({
          method,
          path,
          url,
          status: 0,
          ms,
          ok: false,
          ...(body !== undefined ? { requestBody: body } : {}),
          responseBody: null,
          ...(err instanceof Error ? { errorMessage: err.message } : { errorMessage: String(err) })
        });
      }

      throw err;
    }
  }

  return {
    get: (path, opts) => jsonRequest("GET", path, undefined, opts?.headers),
    post: (path, body, opts) => jsonRequest("POST", path, body, opts?.headers),
    patch: (path, body, opts) => jsonRequest("PATCH", path, body, opts?.headers),
    del: (path, opts) => jsonRequest("DELETE", path, undefined, opts?.headers),
    raw: { request }
  };
}

```

---

## File: demo-client/src/App.tsx

```tsx
import React from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { DemoPage } from "./pages/DemoPage";

const theme = createTheme({
  palette: {
    mode: "light"
  }
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DemoPage />
    </ThemeProvider>
  );
}

```

---

## File: demo-client/src/auth/AuthContext.tsx

```tsx
import React, { createContext, useCallback, useMemo, useState } from "react";
import type { ApiError } from "../api/apiClient";
import { useIdentitySession } from "../hooks/useIdentitySession";
import type { AuthSession, AuthUserProfile } from "../types/authTypes";
import { toApiError } from "../lib/toApiError";

export type AuthState = {
  sessionKey: string;
  session?: AuthSession;
  user?: AuthUserProfile;
  isLoggedIn: boolean;

  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;

  clearLocal: () => void;

  lastError?: ApiError;
  busy: boolean;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider(props: { sessionKey: string; children: React.ReactNode }) {
  const { sessionKey } = props;
  const { client, session, user, reload } = useIdentitySession(sessionKey);

  const [busy, setBusy] = useState(false);
  const [lastError, setLastError] = useState<ApiError | undefined>(undefined);

  const clearLocal = useCallback(() => {
    client.clearSession();
    setLastError(undefined);
    reload();
  }, [client, reload]);

  const login = useCallback(
    async (username: string, password: string) => {
      setBusy(true);
      setLastError(undefined);
      try {
        await client.login({ username, password });
        reload();
      } catch (err) {
        const apiError = toApiError(err);
        setLastError(apiError);
        throw apiError;
      } finally {
        setBusy(false);
      }
    },
    [client, reload]
  );

  const logout = useCallback(async () => {
    setBusy(true);
    setLastError(undefined);
    try {
      await client.logout();
    } catch (err) {
      setLastError(toApiError(err));
    } finally {
      reload();
      setBusy(false);
    }
  }, [client, reload]);

  const refresh = useCallback(async () => {
    setBusy(true);
    setLastError(undefined);
    try {
      await client.refresh();
      reload();
    } catch (err) {
      const apiError = toApiError(err);
      setLastError(apiError);
      throw apiError;
    } finally {
      setBusy(false);
    }
  }, [client, reload]);

  const value: AuthState = useMemo(
    () => ({
      sessionKey,
      ...(session ? { session } : {}),
      ...(user ? { user } : {}),
      isLoggedIn: !!session?.accessToken,
      login,
      logout,
      refresh,
      clearLocal,
      ...(lastError ? { lastError } : {}),
      busy
    }),
    [sessionKey, session, user, login, logout, refresh, clearLocal, lastError, busy]
  );

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthState {
  const v = React.useContext(AuthContext);
  if (!v) throw new Error("useAuthContext must be used within AuthProvider");
  return v;
}

```

---

## File: demo-client/src/auth/tokenStore.ts

```ts
import type { AuthSession, AuthUserProfile } from "../types/authTypes";

export type StoredAuth = {
  session?: AuthSession;
  user?: AuthUserProfile;
};

function k(sessionKey: string): string {
  return `auth.${sessionKey}`;
}

function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

function safeRemoveItem(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function loadAuth(sessionKey: string): StoredAuth {
  const raw = safeGetItem(k(sessionKey));
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as StoredAuth;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveAuth(sessionKey: string, v: StoredAuth) {
  safeSetItem(k(sessionKey), JSON.stringify(v));
}

export function clearAuth(sessionKey: string) {
  safeRemoveItem(k(sessionKey));
}

```

---

## File: demo-client/src/auth/useAuth.ts

```ts
export { useAuthContext as useAuth } from "./AuthContext";

```

---

## File: demo-client/src/components/DebugLogViewer.tsx

```tsx
import React, { useMemo, useState } from "react";
import { Box, Button, Collapse, Divider, Paper, Stack, Typography } from "@mui/material";
import { useDebug } from "../debug/DebugContext";
import { JsonViewer } from "./JsonViewer";

export function DebugLogViewer() {
  const dbg = useDebug();
  const [open, setOpen] = useState(false);

  const latest = useMemo(() => dbg.logs[0], [dbg.logs]);

  if (!dbg.enabled) return null;

  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="subtitle2" sx={{ flex: 1 }}>
          Debug log ({dbg.logs.length})
        </Typography>

        <Button size="small" onClick={() => setOpen((v) => !v)}>
          {open ? "Hide" : "Show"}
        </Button>
        <Button size="small" color="error" onClick={dbg.clear} disabled={!dbg.logs.length}>
          Clear
        </Button>
      </Stack>

      {latest ? (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Latest: {latest.method} {latest.path} → {latest.status} in {latest.ms}ms
          </Typography>
        </Box>
      ) : null}

      <Collapse in={open}>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: "grid", gap: 1 }}>
          {dbg.logs.length ? (
            dbg.logs.map((e) => (
              <Box key={e.id} sx={{ display: "grid", gap: 0.5 }}>
                <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                  {e.atIso} | {e.method} {e.path} | {e.status} | {e.ms}ms | {e.ok ? "OK" : "ERR"}
                </Typography>

                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Request
                    </Typography>
                    <JsonViewer value={e.requestBody ?? null} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Response
                    </Typography>
                    <JsonViewer value={e.responseBody ?? (e.errorMessage ? { errorMessage: e.errorMessage } : null)} />
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No calls recorded yet.
            </Typography>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
}

```

---

## File: demo-client/src/components/JsonViewer.tsx

```tsx
import { Box } from "@mui/material";
import React, { useMemo } from "react";

export function JsonViewer(props: { value: unknown }) {
  const txt = useMemo(() => JSON.stringify(props.value, null, 2), [props.value]);
  return (
    <Box
      component="pre"
      sx={{
        m: 0,
        p: 1.5,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        overflow: "auto",
        fontSize: 12
      }}
    >
      {txt}
    </Box>
  );
}

```

---

## File: demo-client/src/components/LoginModal.tsx

```tsx
import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import type { ApiError } from "../api/apiClient";

export function LoginModal(props: {
  open: boolean;
  title: string;
  defaultUsername?: string;
  defaultPassword?: string;
  onClose: () => void;
  onSubmit: (username: string, password: string) => Promise<void>;
  busy?: boolean;
  error?: ApiError;
}) {
  const [username, setUsername] = useState(props.defaultUsername || "");
  const [password, setPassword] = useState(props.defaultPassword || "196900");

  useEffect(() => {
    if (props.open) {
      setUsername(props.defaultUsername || "");
      setPassword("");
    }
  }, [props.open, props.defaultUsername]);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault?.();
    await props.onSubmit(username, password);
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.busy ? undefined : props.onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2, pt: 1 }}>
          {props.error ? (
            <Alert severity="error">{`${props.error.code}: ${props.error.message}`}</Alert>
          ) : null}

          <TextField
            label="Email / Username"
            value={username}
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
            disabled={!!props.busy}
            fullWidth
          />
          <TextField
            label="Password"
            value={password}
            type="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            disabled={!!props.busy}
            fullWidth
          />
          <button type="submit" style={{ display: "none" }} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} disabled={!!props.busy}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => void handleSubmit()}
          disabled={!!props.busy || !username || !password}
        >
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
}

```

---

## File: demo-client/src/components/SessionPanelBody.tsx

```tsx
import React from "react";
import { Alert, Box, Divider } from "@mui/material";
import type { ApiError } from "../api/apiClient";
import { DebugLogViewer } from "./DebugLogViewer";

export function SessionPanelBody(props: {
  authError?: ApiError;
  panelError?: ApiError;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ minHeight: 0, display: "grid", gridTemplateRows: "auto auto auto 1fr", gap: 1 }}>
      {props.authError ? (
        <Alert severity="error">{`${props.authError.code}: ${props.authError.message}`}</Alert>
      ) : null}
      {props.panelError ? (
        <Alert severity="error">{`${props.panelError.code}: ${props.panelError.message}`}</Alert>
      ) : null}

      <DebugLogViewer />

      <Divider />

      {props.children}
    </Box>
  );
}

```

---

## File: demo-client/src/components/SessionPanelChrome.tsx

```tsx
import React from "react";
import {
  Box,
  Button,
  Chip,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  Typography
} from "@mui/material";

export function SessionPanelChrome(props: {
  title: string;
  sessionKeyLabel: string;
  functionsBaseUrl: string;
  isLoggedIn: boolean;
  username?: string;
  roles?: string[];
  debugEnabled: boolean;
  onDebugEnabledChange: (enabled: boolean) => void;
  onLogin: () => void;
  onRefresh: () => void;
  onLogout: () => void;
  busy?: boolean;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Paper sx={{ p: 2, height: "100%", display: "grid", gridTemplateRows: "auto auto 1fr", gap: 1.5 }}>
      <Box>
        <Typography variant="h6">{props.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          Independent session: <code>{props.sessionKeyLabel}</code>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Functions base: <code>{props.functionsBaseUrl}</code>
        </Typography>
      </Box>

      <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
        {props.isLoggedIn ? (
          <Chip label="Logged in" color="success" size="small" />
        ) : (
          <Chip label="Logged out" color="default" size="small" />
        )}
        {props.username ? <Chip label={props.username} size="small" /> : null}
        {props.roles?.length ? <Chip label={props.roles.join(", ")} size="small" /> : null}

        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={props.debugEnabled}
              onChange={(e) => props.onDebugEnabledChange(e.target.checked)}
            />
          }
          label="Debug"
          sx={{ ml: 0.5 }}
        />

        <Box sx={{ flex: 1 }} />

        {!props.isLoggedIn ? (
          <Button variant="contained" onClick={props.onLogin}>
            Login
          </Button>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={props.onRefresh} disabled={!!props.busy}>
              Refresh
            </Button>
            {props.actions}
            <Button variant="contained" color="error" onClick={props.onLogout} disabled={!!props.busy}>
              Logout
            </Button>
          </Stack>
        )}
      </Stack>

      {props.children}
    </Paper>
  );
}

```

---

## File: demo-client/src/components/SplitLayout.tsx

```tsx
import { Box } from "@mui/material";
import React from "react";

export function SplitLayout(props: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 2,
        height: "100vh",
        p: 2,
        boxSizing: "border-box"
      }}
    >
      {props.left}
      {props.right}
    </Box>
  );
}

```

---

## File: demo-client/src/config.ts

```ts
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL;
  const v = (raw || "").trim();

  // If not explicitly set, default to same-origin. In local dev, Vite proxies
  // "/.netlify/functions/*" to the backend (see vite.config.ts) to avoid CORS.
  if (!v) return window.location.origin;

  return v;
}

export function getFunctionsBaseUrl(): string {
  const base = getApiBaseUrl().replace(/\/+$/, "");
  return `${base}/.netlify/functions`;
}

```

---

## File: demo-client/src/debug/DebugContext.tsx

```tsx
import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";

export type DebugLogEntry = {
  id: string;
  atIso: string;
  method: string;
  path: string;
  url: string;
  status: number;
  ms: number;
  ok: boolean;
  requestBody?: unknown;
  responseBody?: unknown;
  errorMessage?: string;
};

export type DebugState = {
  sessionKey: string;
  enabled: boolean;
  setEnabled: (v: boolean) => void;

  logs: DebugLogEntry[];
  clear: () => void;

  log: (e: Omit<DebugLogEntry, "id" | "atIso">) => void;
};

const DebugContext = createContext<DebugState | null>(null);

function key(sessionKey: string): string {
  return `debug.${sessionKey}.enabled`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function randomId(): string {
  // deterministic enough for UI keys; avoids adding deps
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function DebugProvider(props: { sessionKey: string; children: React.ReactNode }) {
  const { sessionKey } = props;

  const [enabled, setEnabledState] = useState(false);
  const [logs, setLogs] = useState<DebugLogEntry[]>([]);

  const maxLogsRef = useRef(200);

  useEffect(() => {
    const raw = localStorage.getItem(key(sessionKey));
    setEnabledState(raw === "1");
  }, [sessionKey]);

  const setEnabled = useCallback(
    (v: boolean) => {
      setEnabledState(v);
      localStorage.setItem(key(sessionKey), v ? "1" : "0");
    },
    [sessionKey]
  );

  const clear = useCallback(() => {
    setLogs([]);
  }, []);

  const log = useCallback((e: Omit<DebugLogEntry, "id" | "atIso">) => {
    setLogs((prev) => {
      const next: DebugLogEntry[] = [
        {
          id: randomId(),
          atIso: nowIso(),
          ...e
        },
        ...prev
      ];
      return next.slice(0, maxLogsRef.current);
    });
  }, []);

  const value: DebugState = useMemo(
    () => ({
      sessionKey,
      enabled,
      setEnabled,
      logs,
      clear,
      log
    }),
    [sessionKey, enabled, setEnabled, logs, clear, log]
  );

  return <DebugContext.Provider value={value}>{props.children}</DebugContext.Provider>;
}

export function useDebug(): DebugState {
  const v = React.useContext(DebugContext);
  if (!v) throw new Error("useDebug must be used within DebugProvider");
  return v;
}

```

---

## File: demo-client/src/features/adminUsers/AdminUserFormModal.tsx

```tsx
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import type { ApiError } from "../../api/apiClient";
import type { AdminCreateUserRequest, AdminUpdateUserRequest, AuthUserProfile } from "../../lib/identity-client";

function splitRoles(v: string): string[] | undefined {
  const parts = v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : undefined;
}

function joinRoles(v: string[] | undefined): string {
  return (v || []).join(", ");
}

export function AdminUserFormModal(props: {
  open: boolean;
  mode: "create" | "edit";
  initialUser?: AuthUserProfile;
  onClose: () => void;
  onCreate: (req: AdminCreateUserRequest) => Promise<void>;
  onUpdate: (req: AdminUpdateUserRequest) => Promise<void>;
  busy?: boolean;
  error?: ApiError;
}) {
  const title = useMemo(() => (props.mode === "create" ? "Create User" : "Edit User"), [props.mode]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [roles, setRoles] = useState("user");

  useEffect(() => {
    if (!props.open) return;

    if (props.mode === "create") {
      setEmail("");
      setPassword("");
      setDisplayName("");
      setRoles("user");
      return;
    }

    const u = props.initialUser;
    setEmail(u?.username || "");
    setPassword("");
    setDisplayName(u?.displayName || "");
    setRoles(joinRoles(u?.roles));
  }, [props.open, props.mode, props.initialUser]);

  async function submit() {
    if (props.mode === "create") {
      const nextRoles = splitRoles(roles);
      await props.onCreate({
        email: email.trim(),
        password,
        ...(displayName.trim() ? { displayName: displayName.trim() } : {}),
        ...(nextRoles ? { roles: nextRoles } : {})
      });
      return;
    }

    const nextRoles = splitRoles(roles);
    await props.onUpdate({
      ...(displayName.trim() ? { displayName: displayName.trim() } : {}),
      ...(nextRoles ? { roles: nextRoles } : {})
    });
  }

  const canSubmit =
    props.mode === "create" ? !!email.trim() && !!password : !!displayName.trim() || !!splitRoles(roles);

  return (
    <Dialog open={props.open} onClose={props.busy ? undefined : props.onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "grid", gap: 2, pt: 1 }}>
          {props.error ? <Alert severity="error">{`${props.error.code}: ${props.error.message}`}</Alert> : null}

          {props.mode === "create" ? (
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!props.busy}
              fullWidth
            />
          ) : (
            <TextField label="Email" value={email} disabled fullWidth />
          )}

          {props.mode === "create" ? (
            <TextField
              label="Password"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              disabled={!!props.busy}
              fullWidth
            />
          ) : null}

          <TextField
            label="Display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={!!props.busy}
            fullWidth
          />

          <TextField
            label="Roles (comma separated)"
            value={roles}
            onChange={(e) => setRoles(e.target.value)}
            disabled={!!props.busy}
            fullWidth
            helperText="Examples: user   or   admin, user"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} disabled={!!props.busy}>
          Cancel
        </Button>
        <Button variant="contained" onClick={() => void submit()} disabled={!!props.busy || !canSubmit}>
          {props.mode === "create" ? "Create" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

```

---

## File: demo-client/src/features/adminUsers/AdminUsersTable.tsx

```tsx
import React from "react";
import type { AuthUserProfile } from "../../types/authTypes";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export function AdminUsersTable(props: {
  users: AuthUserProfile[];
  onEdit: (u: AuthUserProfile) => void;
  onDelete: (u: AuthUserProfile) => void;
}) {
  return (
    <Box sx={{ overflow: "auto", border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ whiteSpace: "nowrap" }}>ID</TableCell>
            <TableCell sx={{ whiteSpace: "nowrap" }}>Email</TableCell>
            <TableCell sx={{ whiteSpace: "nowrap" }}>Display name</TableCell>
            <TableCell sx={{ whiteSpace: "nowrap" }}>Roles</TableCell>
            <TableCell sx={{ width: 96, textAlign: "right" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.users.length ? (
            props.users.map((u) => (
              <TableRow key={u.id} hover>
                <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>{u.id}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{u.username}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{u.displayName}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{(u.roles || []).join(", ")}</TableCell>
                <TableCell sx={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => props.onEdit(u)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => props.onDelete(u)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>
                <Typography variant="body2" color="text.secondary">
                  No users loaded.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {!props.users.length ? (
        <Box sx={{ p: 1 }}>
          <Button size="small" disabled>
            No rows
          </Button>
        </Box>
      ) : null}
    </Box>
  );
}

```

---

## File: demo-client/src/hooks/useAdminPanelModel.ts

```ts
import { useEffect, useMemo, useState } from "react";
import type { ApiError } from "../api/apiClient";
import {
  type AdminCreateUserRequest,
  type AdminUpdateUserRequest,
  type AuthUserProfile
} from "../lib/identity-client";
import { useIdentityFacade } from "./useIdentityFacade";

export function useAdminPanelModel() {
  const { auth, client, toPanelError } = useIdentityFacade();

  const [loginOpen, setLoginOpen] = useState(false);
  const [users, setUsers] = useState<AuthUserProfile[]>([]);
  const [panelError, setPanelError] = useState<ApiError | undefined>(undefined);

  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<AuthUserProfile | undefined>(undefined);
  const [formError, setFormError] = useState<ApiError | undefined>(undefined);

  const isAdmin = useMemo(() => (auth.user?.roles || []).includes("admin"), [auth.user?.roles]);

  async function loadUsers() {
    setPanelError(undefined);
    try {
      const nextUsers = await client.listUsers();
      setUsers(nextUsers);
    } catch (err) {
      setPanelError(toPanelError(err));
      setUsers([]);
    }
  }

  useEffect(() => {
    if (auth.isLoggedIn) void loadUsers();
    if (!auth.isLoggedIn) setUsers([]);
  }, [auth.isLoggedIn]);

  async function doLogin(username: string, password: string) {
    await auth.login(username, password);
    setLoginOpen(false);
  }

  async function doCreate(req: AdminCreateUserRequest) {
    setFormError(undefined);
    try {
      await client.createUser(req);
      setCreateOpen(false);
      await loadUsers();
    } catch (err) {
      const apiError = toPanelError(err);
      setFormError(apiError);
      throw apiError;
    }
  }

  async function doUpdate(req: AdminUpdateUserRequest) {
    if (!editUser) return;
    setFormError(undefined);
    try {
      await client.updateUser(editUser.id, req);
      setEditUser(undefined);
      await loadUsers();
    } catch (err) {
      const apiError = toPanelError(err);
      setFormError(apiError);
      throw apiError;
    }
  }

  async function doDelete(u: AuthUserProfile) {
    const ok = window.confirm(`Delete user?\n\n${u.username}\n${u.id}`);
    if (!ok) return;

    setPanelError(undefined);
    try {
      await client.deleteUser(u.id);
      await loadUsers();
    } catch (err) {
      setPanelError(toPanelError(err));
    }
  }

  return {
    auth,
    loginOpen,
    setLoginOpen,
    users,
    panelError,
    createOpen,
    setCreateOpen,
    editUser,
    setEditUser,
    formError,
    setFormError,
    isAdmin,
    loadUsers,
    doLogin,
    doCreate,
    doUpdate,
    doDelete
  };
}

```

---

## File: demo-client/src/hooks/useIdentityClient.ts

```ts
import { useMemo } from "react";
import { useDebug } from "../debug/DebugContext";
import {
  createBrowserTokenStore,
  createIdentityClient
} from "../lib/identity-client";

export function useIdentityClient(sessionKey: string) {
  const dbg = useDebug();

  return useMemo(
    () =>
      createIdentityClient({
        tokenStore: createBrowserTokenStore(`auth.${sessionKey}`),
        ...(dbg.enabled
          ? {
              logger: (e) =>
                dbg.log({
                  method: e.method,
                  path: e.path,
                  url: e.url,
                  status: e.status,
                  ms: e.ms,
                  ok: e.ok,
                  ...(e.requestBody !== undefined ? { requestBody: e.requestBody } : {}),
                  ...(e.responseBody !== undefined ? { responseBody: e.responseBody } : {}),
                  ...(e.errorMessage !== undefined ? { errorMessage: e.errorMessage } : {})
                })
            }
          : {})
      }),
    [sessionKey, dbg.enabled, dbg]
  );
}

```

---

## File: demo-client/src/hooks/useIdentityFacade.ts

```ts
import { useCallback } from "react";
import type { ApiError } from "../api/apiClient";
import { useAuth } from "../auth/useAuth";
import { useIdentityClient } from "./useIdentityClient";
import { toApiError } from "../lib/toApiError";

export function useIdentityFacade(): {
  auth: ReturnType<typeof useAuth>;
  client: ReturnType<typeof useIdentityClient>;
  toPanelError: (err: unknown) => ApiError;
} {
  const auth = useAuth();
  const client = useIdentityClient(auth.sessionKey);

  const toPanelError = useCallback((err: unknown): ApiError => toApiError(err), []);

  return { auth, client, toPanelError };
}

```

---

## File: demo-client/src/hooks/useIdentitySession.ts

```ts
import { useCallback, useMemo, useState } from "react";
import type { AuthSession, AuthUserProfile } from "../types/authTypes";
import { useIdentityClient } from "./useIdentityClient";

export function useIdentitySession(sessionKey: string): {
  client: ReturnType<typeof useIdentityClient>;
  session?: AuthSession;
  user?: AuthUserProfile;
  reload: () => void;
} {
  const client = useIdentityClient(sessionKey);
  const [revision, setRevision] = useState(0);

  const reload = useCallback(() => {
    setRevision((v) => v + 1);
  }, []);

  const snapshot = useMemo(() => {
    void revision;
    return client.getSession();
  }, [client, revision]);

  return {
    client,
    ...(snapshot?.session ? { session: snapshot.session } : {}),
    ...(snapshot?.user ? { user: snapshot.user } : {}),
    reload
  };
}

```

---

## File: demo-client/src/hooks/usePanelIdentity.ts

```ts
import { useCallback } from "react";
import type { ApiError } from "../api/apiClient";
import { useAuth } from "../auth/useAuth";
import { useIdentityClient } from "./useIdentityClient";
import { toApiError } from "../lib/toApiError";

export function usePanelIdentity(): {
  client: ReturnType<typeof useIdentityClient>;
  toPanelError: (err: unknown) => ApiError;
} {
  const auth = useAuth();
  const client = useIdentityClient(auth.sessionKey);

  const toPanelError = useCallback((err: unknown): ApiError => toApiError(err), []);

  return { client, toPanelError };
}

```

---

## File: demo-client/src/hooks/useUserPanelModel.ts

```ts
import { useEffect, useState } from "react";
import type { ApiError } from "../api/apiClient";
import type { MeResponse } from "../lib/identity-client";
import { useIdentityFacade } from "./useIdentityFacade";

export function useUserPanelModel() {
  const { auth, client, toPanelError } = useIdentityFacade();

  const [loginOpen, setLoginOpen] = useState(false);
  const [me, setMe] = useState<MeResponse | undefined>(undefined);
  const [panelError, setPanelError] = useState<ApiError | undefined>(undefined);

  useEffect(() => {
    if (!auth.isLoggedIn) {
      setMe(undefined);
      setPanelError(undefined);
    }
  }, [auth.isLoggedIn]);

  async function doLogin(username: string, password: string) {
    await auth.login(username, password);
    setLoginOpen(false);
  }

  async function fetchMe() {
    setPanelError(undefined);
    try {
      const res = await client.getMe();
      setMe(res);
    } catch (err) {
      setPanelError(toPanelError(err));
      setMe(undefined);
    }
  }

  return {
    auth,
    loginOpen,
    setLoginOpen,
    me,
    panelError,
    doLogin,
    fetchMe
  };
}

```

---

## File: demo-client/src/lib/identity-client/client.ts

```ts
import { getFunctionsBaseUrl } from "../../config";
import { IdentityClientError } from "./errors";
import type {
  AdminCreateUserRequest,
  AdminUpdateUserRequest,
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutRequest,
  AuthRefreshResponse,
  AuthRegisterResponse,
  AuthUserProfile,
  IdentityClient,
  IdentityClientLogger,
  IdentityClientOptions,
  IdentitySessionState,
  MeResponse,
  TokenStore
} from "./types";

type FetchInit = Parameters<typeof fetch>[1];

type SuccessEnvelope<T> = {
  ok: true;
  requestId?: string;
  data: T;
};

type ErrorEnvelope = {
  ok: false;
  requestId?: string;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

type RequestOptions = {
  headers?: Record<string, string>;
  skipAuth?: boolean;
  retryOnAuthFailure?: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSuccessEnvelope<T>(value: unknown): value is SuccessEnvelope<T> {
  return isRecord(value) && value.ok === true && "data" in value;
}

function isErrorEnvelope(value: unknown): value is ErrorEnvelope {
  if (!isRecord(value)) return false;
  if (value.ok !== false) return false;
  if (!("error" in value) || !isRecord(value.error)) return false;
  return typeof value.error.code === "string" && typeof value.error.message === "string";
}

function joinUrl(base: string, path: string): string {
  const cleanBase = base.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

async function readJsonSafe(res: Response): Promise<unknown> {
  const txt = await res.text();
  if (!txt) return null;

  try {
    return JSON.parse(txt);
  } catch {
    return txt;
  }
}

function toError(status: number, payload: unknown): IdentityClientError {
  if (isErrorEnvelope(payload)) {
    return new IdentityClientError({
      status,
      code: payload.error.code,
      message: payload.error.message,
      ...(payload.error.details !== undefined ? { details: payload.error.details } : {}),
      ...(payload.requestId !== undefined ? { requestId: payload.requestId } : {})
    });
  }

  if (typeof payload === "string" && payload.trim().length > 0) {
    return new IdentityClientError({
      status,
      message: payload
    });
  }

  return new IdentityClientError({
    status,
    message: `HTTP ${status}`
  });
}

function unwrapEnvelope<T>(status: number, payload: unknown): T {
  if (isSuccessEnvelope<T>(payload)) {
    return payload.data;
  }

  if (isErrorEnvelope(payload)) {
    throw toError(status, payload);
  }

  return payload as T;
}

function createNoopTokenStore(): TokenStore {
  return {
    get(): IdentitySessionState | null {
      return null;
    },
    set(): void {
      // noop
    }
  };
}

export function createIdentityClient(options: IdentityClientOptions = {}): IdentityClient {
  const fetchImpl = options.fetchImpl ?? fetch;
  const tokenStore = options.tokenStore ?? createNoopTokenStore();
  const logger: IdentityClientLogger | undefined = options.logger;
  const baseUrl = options.baseUrl ?? getFunctionsBaseUrl();

  function getSession(): IdentitySessionState | null {
    return tokenStore.get();
  }

  function setSession(value: IdentitySessionState | null): void {
    tokenStore.set(value);
  }

  function clearSession(): void {
    tokenStore.set(null);
  }

  async function maybeRefreshSession(): Promise<boolean> {
    const current = getSession();
    const refreshToken = current?.session?.refreshToken;
    if (!refreshToken) return false;

    try {
      const refreshed = await refresh();
      setSession({
        session: refreshed.session,
        user: refreshed.user,
        provider: refreshed.provider
      });
      return true;
    } catch {
      clearSession();
      if (options.onAuthFailure) {
        await options.onAuthFailure();
      }
      return false;
    }
  }

  async function request<T>(
    method: string,
    path: string,
    body?: unknown,
    requestOptions?: RequestOptions
  ): Promise<T> {
    const url = joinUrl(baseUrl, path);
    const started = performance.now();

    const headers: Record<string, string> = {
      accept: "application/json",
      ...(requestOptions?.headers ?? {})
    };

    if (body !== undefined) {
      headers["content-type"] = "application/json";
    }

    const current = getSession();
    const accessToken = current?.session?.accessToken;
    if (!requestOptions?.skipAuth && accessToken) {
      headers.authorization = `Bearer ${accessToken}`;
    }

    const init: FetchInit = {
      method,
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {})
    };

    try {
      const res = await fetchImpl(url, init);
      const parsed = await readJsonSafe(res);
      const ms = Math.max(0, Math.round(performance.now() - started));

      if (!res.ok) {
        if (
          res.status === 401 &&
          requestOptions?.retryOnAuthFailure !== false &&
          !requestOptions?.skipAuth &&
          (await maybeRefreshSession())
        ) {
          return request<T>(method, path, body, {
            ...requestOptions,
            retryOnAuthFailure: false
          });
        }

        logger?.({
          method,
          path,
          url,
          status: res.status,
          ms,
          ok: false,
          ...(body !== undefined ? { requestBody: body } : {}),
          ...(parsed !== undefined ? { responseBody: parsed } : {})
        });

        throw toError(res.status, parsed);
      }

      logger?.({
        method,
        path,
        url,
        status: res.status,
        ms,
        ok: true,
        ...(body !== undefined ? { requestBody: body } : {}),
        ...(parsed !== undefined ? { responseBody: parsed } : {})
      });

      return unwrapEnvelope<T>(res.status, parsed);
    } catch (err) {
      const ms = Math.max(0, Math.round(performance.now() - started));

      if ((err as { status?: unknown })?.status === undefined) {
        logger?.({
          method,
          path,
          url,
          status: 0,
          ms,
          ok: false,
          ...(body !== undefined ? { requestBody: body } : {}),
          responseBody: null,
          ...(err instanceof Error ? { errorMessage: err.message } : { errorMessage: String(err) })
        });
      }

      throw err;
    }
  }

  async function login(req: AuthLoginRequest): Promise<AuthLoginResponse> {
    const result = await request<AuthLoginResponse>("POST", "/auth-login", req, {
      headers: { "x-request-id": "identity-client-login" },
      skipAuth: true,
      retryOnAuthFailure: false
    });

    setSession({
      session: result.session,
      user: result.user,
      provider: result.provider
    });

    return result;
  }

  async function register(req: {
    email: string;
    password: string;
    displayName?: string;
  }): Promise<AuthRegisterResponse> {
    const result = await request<AuthRegisterResponse>("POST", "/auth-register", req, {
      headers: { "x-request-id": "identity-client-register" },
      skipAuth: true,
      retryOnAuthFailure: false
    });

    setSession({
      session: result.session,
      user: result.user,
      provider: result.provider
    });

    return result;
  }

  async function refresh(): Promise<AuthRefreshResponse> {
    const current = getSession();
    const refreshToken = current?.session?.refreshToken;
    if (!refreshToken) {
      throw new IdentityClientError({
        status: 401,
        code: "UNAUTHORIZED",
        message: "No refresh token available"
      });
    }

    const result = await request<AuthRefreshResponse>(
      "POST",
      "/auth-refresh",
      { refreshToken },
      {
        headers: { "x-request-id": "identity-client-refresh" },
        skipAuth: true,
        retryOnAuthFailure: false
      }
    );

    setSession({
      session: result.session,
      user: result.user,
      provider: result.provider
    });

    return result;
  }

  async function logout(req?: AuthLogoutRequest): Promise<void> {
    const current = getSession();
    const refreshToken = req?.refreshToken ?? current?.session?.refreshToken;

    try {
      await request<unknown>(
        "POST",
        "/auth-logout",
        refreshToken ? { refreshToken } : {},
        {
          headers: { "x-request-id": "identity-client-logout" },
          retryOnAuthFailure: false
        }
      );
    } finally {
      clearSession();
    }
  }

  async function getMe(): Promise<MeResponse> {
    const result = await request<MeResponse>("GET", "/me", undefined, {
      headers: { "x-request-id": "identity-client-me" }
    });

    const current = getSession();
    setSession({
      ...(current?.session ? { session: current.session } : {}),
      user: result.user,
      ...(current?.provider ? { provider: current.provider } : {})
    });

    return result;
  }

  async function listUsers(): Promise<AuthUserProfile[]> {
    const result = await request<{ users: AuthUserProfile[] }>("GET", "/admin-users", undefined, {
      headers: { "x-request-id": "identity-client-admin-users-list" }
    });

    return result.users;
  }

  async function getUser(id: string): Promise<AuthUserProfile> {
    const result = await request<{ user: AuthUserProfile }>(
      "GET",
      `/admin-users/${encodeURIComponent(id)}`,
      undefined,
      {
        headers: { "x-request-id": "identity-client-admin-users-get" }
      }
    );

    return result.user;
  }

  async function createUser(req: AdminCreateUserRequest): Promise<AuthUserProfile> {
    const result = await request<{ user: AuthUserProfile }>("POST", "/admin-users", req, {
      headers: { "x-request-id": "identity-client-admin-users-create" }
    });

    return result.user;
  }

  async function updateUser(id: string, req: AdminUpdateUserRequest): Promise<AuthUserProfile> {
    const result = await request<{ user: AuthUserProfile }>(
      "PATCH",
      `/admin-users/${encodeURIComponent(id)}`,
      req,
      {
        headers: { "x-request-id": "identity-client-admin-users-patch" }
      }
    );

    return result.user;
  }

  async function deleteUser(id: string): Promise<void> {
    await request<unknown>("DELETE", `/admin-users/${encodeURIComponent(id)}`, undefined, {
      headers: { "x-request-id": "identity-client-admin-users-delete" }
    });
  }

  return {
    login,
    register,
    refresh,
    logout,
    getMe,
    listUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getSession,
    setSession,
    clearSession
  };
}

```

---

## File: demo-client/src/lib/identity-client/errors.ts

```ts
export class IdentityClientError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;
  readonly requestId?: string;

  constructor(args: {
    message: string;
    status: number;
    code?: string;
    details?: unknown;
    requestId?: string;
  }) {
    super(args.message);
    this.name = "IdentityClientError";
    this.status = args.status;
    this.details = args.details;

    if (args.code !== undefined) {
      this.code = args.code;
    }

    if (args.requestId !== undefined) {
      this.requestId = args.requestId;
    }
  }
}

```

---

## File: demo-client/src/lib/identity-client/index.ts

```ts
export { createIdentityClient } from "./client";
export { IdentityClientError } from "./errors";
export { createBrowserTokenStore, createMemoryTokenStore } from "./tokenStore";

export type {
  IdentityClient,
  IdentityClientLogger,
  IdentityClientLoggerEntry,
  IdentityClientOptions,
  IdentitySessionState,
  TokenStore,
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutRequest,
  AuthRefreshRequest,
  AuthRefreshResponse,
  AuthRegisterResponse,
  AuthSession,
  AuthUserProfile,
  AuthProviderId,
  MeResponse,
  AdminCreateUserRequest,
  AdminUpdateUserRequest
} from "./types";

```

---

## File: demo-client/src/lib/identity-client/tokenStore.ts

```ts
import type { IdentitySessionState, TokenStore } from "./types";

export function createMemoryTokenStore(initialValue?: IdentitySessionState | null): TokenStore {
  let current = initialValue ?? null;

  return {
    get(): IdentitySessionState | null {
      return current;
    },

    set(value: IdentitySessionState | null): void {
      current = value;
    }
  };
}

export function createBrowserTokenStore(key: string): TokenStore {
  function safeGetItem(): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeSetItem(value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // ignore storage failures
    }
  }

  function safeRemoveItem(): void {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore storage failures
    }
  }

  return {
    get(): IdentitySessionState | null {
      const raw = safeGetItem();
      if (!raw) return null;

      try {
        const parsed = JSON.parse(raw) as IdentitySessionState;
        if (!parsed || typeof parsed !== "object") return null;
        return parsed;
      } catch {
        return null;
      }
    },

    set(value: IdentitySessionState | null): void {
      if (!value) {
        safeRemoveItem();
        return;
      }

      safeSetItem(JSON.stringify(value));
    }
  };
}

```

---

## File: demo-client/src/lib/identity-client/types.ts

```ts
import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutRequest,
  AuthRefreshRequest,
  AuthRefreshResponse,
  AuthRegisterResponse,
  AuthSession,
  AuthUserProfile,
  AuthProviderId
} from "../../types/authTypes";
import type { MeResponse } from "../../types/meTypes";
import type {
  AdminCreateUserRequest,
  AdminUpdateUserRequest
} from "../../types/adminUsersTypes";

export type IdentitySessionState = {
  session?: AuthSession;
  user?: AuthUserProfile;
  provider?: AuthProviderId;
};

export type TokenStore = {
  get(): IdentitySessionState | null;
  set(value: IdentitySessionState | null): void;
};

export type IdentityClientLoggerEntry = {
  method: string;
  path: string;
  url: string;
  status: number;
  ms: number;
  ok: boolean;
  requestBody?: unknown;
  responseBody?: unknown;
  errorMessage?: string;
};

export type IdentityClientLogger = (entry: IdentityClientLoggerEntry) => void;

export type IdentityClientOptions = {
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  tokenStore?: TokenStore;
  onAuthFailure?: () => void | Promise<void>;
  logger?: IdentityClientLogger;
};

export type IdentityClient = {
  login(req: AuthLoginRequest): Promise<AuthLoginResponse>;
  register(req: {
    email: string;
    password: string;
    displayName?: string;
  }): Promise<AuthRegisterResponse>;
  refresh(): Promise<AuthRefreshResponse>;
  logout(req?: AuthLogoutRequest): Promise<void>;
  getMe(): Promise<MeResponse>;

  listUsers(): Promise<AuthUserProfile[]>;
  getUser(id: string): Promise<AuthUserProfile>;
  createUser(req: AdminCreateUserRequest): Promise<AuthUserProfile>;
  updateUser(id: string, req: AdminUpdateUserRequest): Promise<AuthUserProfile>;
  deleteUser(id: string): Promise<void>;

  getSession(): IdentitySessionState | null;
  setSession(value: IdentitySessionState | null): void;
  clearSession(): void;
};

export type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutRequest,
  AuthRefreshRequest,
  AuthRefreshResponse,
  AuthRegisterResponse,
  AuthSession,
  AuthUserProfile,
  AuthProviderId,
  MeResponse,
  AdminCreateUserRequest,
  AdminUpdateUserRequest
};

```

---

## File: demo-client/src/lib/toApiError.ts

```ts
import type { ApiError } from "../api/apiClient";
import { IdentityClientError } from "../lib/identity-client";

export function toApiError(err: unknown): ApiError {
  if (err instanceof IdentityClientError) {
    return {
      status: err.status,
      code: err.code || "IDENTITY_CLIENT_ERROR",
      message: err.message,
      ...(err.details !== undefined ? { details: err.details } : {}),
      ...(err.requestId !== undefined ? { requestId: err.requestId } : {})
    };
  }

  if (err && typeof err === "object") {
    const maybe = err as Partial<ApiError>;
    if (typeof maybe.message === "string") {
      return {
        status: typeof maybe.status === "number" ? maybe.status : 0,
        code: typeof maybe.code === "string" ? maybe.code : "UNKNOWN_ERROR",
        message: maybe.message,
        ...(maybe.details !== undefined ? { details: maybe.details } : {}),
        ...(maybe.requestId !== undefined ? { requestId: maybe.requestId } : {})
      };
    }
  }

  return {
    status: 0,
    code: "UNKNOWN_ERROR",
    message: err instanceof Error ? err.message : String(err)
  };
}

```

---

## File: demo-client/src/main.tsx

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

```

---

## File: demo-client/src/pages/DemoPage.tsx

```tsx
import React from "react";
import { AuthProvider } from "../auth/AuthContext";
import { SplitLayout } from "../components/SplitLayout";
import { AdminPanel } from "../panels/AdminPanel";
import { UserPanel } from "../panels/UserPanel";
import { DebugProvider } from "../debug/DebugContext";

export function DemoPage() {
  return (
    <SplitLayout
      left={
        <DebugProvider sessionKey="admin">
          <AuthProvider sessionKey="admin">
            <AdminPanel />
          </AuthProvider>
        </DebugProvider>
      }
      right={
        <DebugProvider sessionKey="user">
          <AuthProvider sessionKey="user">
            <UserPanel />
          </AuthProvider>
        </DebugProvider>
      }
    />
  );
}

```

---

## File: demo-client/src/panels/AdminPanel.tsx

```tsx
import React from "react";
import {
  Alert,
  Box,
  Button,
  Stack,
  Typography
} from "@mui/material";
import { LoginModal } from "../components/LoginModal";
import { AdminUsersTable } from "../features/adminUsers/AdminUsersTable";
import { AdminUserFormModal } from "../features/adminUsers/AdminUserFormModal";
import { useDebug } from "../debug/DebugContext";
import { getFunctionsBaseUrl } from "../config";
import { useAdminPanelModel } from "../hooks/useAdminPanelModel";
import { SessionPanelChrome } from "../components/SessionPanelChrome";
import { SessionPanelBody } from "../components/SessionPanelBody";

export function AdminPanel() {
  const dbg = useDebug();
  const vm = useAdminPanelModel();

  return (
    <SessionPanelChrome
      title="Admin Panel"
      sessionKeyLabel="auth.admin.*"
      functionsBaseUrl={getFunctionsBaseUrl()}
      isLoggedIn={vm.auth.isLoggedIn}
      {...(vm.auth.user?.username ? { username: vm.auth.user.username } : {})}
      {...(vm.auth.user?.roles?.length ? { roles: vm.auth.user.roles } : {})}
      debugEnabled={dbg.enabled}
      onDebugEnabledChange={dbg.setEnabled}
      onLogin={() => vm.setLoginOpen(true)}
      onRefresh={() => void vm.auth.refresh()}
      onLogout={() => void vm.auth.logout()}
      busy={vm.auth.busy}
      actions={
        <Button variant="outlined" onClick={() => void vm.loadUsers()} disabled={vm.auth.busy}>
          Reload users
        </Button>
      }
    >
      <SessionPanelBody
        {...(vm.auth.lastError ? { authError: vm.auth.lastError } : {})}
        {...(vm.panelError ? { panelError: vm.panelError } : {})}
      >
        {vm.auth.isLoggedIn ? (
          <Box sx={{ minHeight: 0, display: "grid", gridTemplateRows: "auto 1fr", gap: 1 }}>
            {!vm.isAdmin ? (
              <Alert severity="warning">
                This account does not have <code>admin</code> role. Admin endpoints will be
                forbidden.
              </Alert>
            ) : null}

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle1" sx={{ flex: 1 }}>
                Users
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  vm.setFormError(undefined);
                  vm.setCreateOpen(true);
                }}
                disabled={!vm.isAdmin}
              >
                Create user
              </Button>
            </Stack>

            <AdminUsersTable
              users={vm.users}
              onEdit={(u) => {
                vm.setFormError(undefined);
                vm.setEditUser(u);
              }}
              onDelete={(u) => void vm.doDelete(u)}
            />
          </Box>
        ) : (
          <Alert severity="info">Login to manage users.</Alert>
        )}
      </SessionPanelBody>

      <LoginModal
        open={vm.loginOpen}
        title="Admin Login"
        defaultUsername="admin"
        onClose={() => vm.setLoginOpen(false)}
        onSubmit={vm.doLogin}
        busy={vm.auth.busy}
        {...(vm.auth.lastError ? { error: vm.auth.lastError } : {})}
      />

      <AdminUserFormModal
        open={vm.createOpen}
        mode="create"
        onClose={() => vm.setCreateOpen(false)}
        onCreate={vm.doCreate}
        onUpdate={async () => {}}
        busy={vm.auth.busy}
        {...(vm.formError ? { error: vm.formError } : {})}
      />

      <AdminUserFormModal
        open={!!vm.editUser}
        mode="edit"
        {...(vm.editUser ? { initialUser: vm.editUser } : {})}
        onClose={() => vm.setEditUser(undefined)}
        onCreate={async () => {}}
        onUpdate={vm.doUpdate}
        busy={vm.auth.busy}
        {...(vm.formError ? { error: vm.formError } : {})}
      />
    </SessionPanelChrome>
  );
}

```

---

## File: demo-client/src/panels/UserPanel.tsx

```tsx
import React from "react";
import {
  Alert,
  Box,
  Button
} from "@mui/material";
import { LoginModal } from "../components/LoginModal";
import { JsonViewer } from "../components/JsonViewer";
import { useDebug } from "../debug/DebugContext";
import { getFunctionsBaseUrl } from "../config";
import { useUserPanelModel } from "../hooks/useUserPanelModel";
import { SessionPanelChrome } from "../components/SessionPanelChrome";
import { SessionPanelBody } from "../components/SessionPanelBody";

export function UserPanel() {
  const dbg = useDebug();
  const vm = useUserPanelModel();

  return (
    <SessionPanelChrome
      title="User Panel"
      sessionKeyLabel="auth.user.*"
      functionsBaseUrl={getFunctionsBaseUrl()}
      isLoggedIn={vm.auth.isLoggedIn}
      {...(vm.auth.user?.username ? { username: vm.auth.user.username } : {})}
      {...(vm.auth.user?.roles?.length ? { roles: vm.auth.user.roles } : {})}
      debugEnabled={dbg.enabled}
      onDebugEnabledChange={dbg.setEnabled}
      onLogin={() => vm.setLoginOpen(true)}
      onRefresh={() => void vm.auth.refresh()}
      onLogout={() => void vm.auth.logout()}
      busy={vm.auth.busy}
      actions={
        <Button variant="contained" onClick={() => void vm.fetchMe()} disabled={vm.auth.busy}>
          Fetch /me
        </Button>
      }
    >
      <SessionPanelBody
        {...(vm.auth.lastError ? { authError: vm.auth.lastError } : {})}
        {...(vm.panelError ? { panelError: vm.panelError } : {})}
      >
        <Box sx={{ minHeight: 0 }}>
          {vm.me ? (
            <JsonViewer value={vm.me} />
          ) : (
            <Alert severity="info">Login and click “Fetch /me” to view the authenticated profile JSON.</Alert>
          )}
        </Box>
      </SessionPanelBody>

      <LoginModal
        open={vm.loginOpen}
        title="User Login"
        defaultUsername="user@example.com"
        onClose={() => vm.setLoginOpen(false)}
        onSubmit={vm.doLogin}
        busy={vm.auth.busy}
        {...(vm.auth.lastError ? { error: vm.auth.lastError } : {})}
      />
    </SessionPanelChrome>
  );
}

```

---

## File: demo-client/src/types/adminUsersTypes.ts

```ts
import type { AuthUserProfile } from "./authTypes";

export type AdminUsersResponse = {
  users: AuthUserProfile[];
};

export type AdminUserResponse = {
  user: AuthUserProfile;
};

export type AdminCreateUserRequest = {
  email: string;
  password: string;
  displayName?: string;
  roles?: string[];
};

export type AdminUpdateUserRequest = {
  displayName?: string;
  roles?: string[];
};

```

---

## File: demo-client/src/types/apiTypes.ts

```ts
export type SuccessEnvelope<T> = {
  ok: true;
  requestId?: string;
  data: T;
};

export type ErrorEnvelope = {
  ok: false;
  requestId?: string;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type Envelope<T> = SuccessEnvelope<T> | ErrorEnvelope;

type UnknownRecord = Record<string, unknown>;

function isRecord(v: unknown): v is UnknownRecord {
  return typeof v === "object" && v !== null;
}

export function isSuccessEnvelope<T>(v: unknown): v is SuccessEnvelope<T> {
  if (!isRecord(v)) return false;
  return v.ok === true && "data" in v;
}

export function isErrorEnvelope(v: unknown): v is ErrorEnvelope {
  if (!isRecord(v)) return false;

  const ok = v.ok;
  const err = v.error;

  if (ok !== false) return false;
  if (!isRecord(err)) return false;

  const code = err.code;
  const message = err.message;

  return typeof code === "string" && typeof message === "string";
}

```

---

## File: demo-client/src/types/authTypes.ts

```ts
export type AuthSession = {
  accessToken: string;
  tokenType: "bearer";
  expiresAt?: string;
  refreshToken?: string;
};

export type AuthUserProfile = {
  id: string;
  username: string;
  displayName: string;
  roles: string[];
};

export type AuthProviderId = "fake" | "postgres" | "google" | "github";

export type AuthLoginResponse = {
  provider: AuthProviderId;
  session: AuthSession;
  user: AuthUserProfile;
};

export type AuthRegisterResponse = AuthLoginResponse;

export type AuthRefreshResponse = AuthLoginResponse;

export type AuthLoginRequest = {
  username: string;
  password: string;
};

export type AuthRefreshRequest = {
  refreshToken: string;
};

export type AuthLogoutRequest = {
  refreshToken?: string;
};

```

---

## File: demo-client/src/types/meTypes.ts

```ts
import type { AuthUserProfile } from "./authTypes";

export type MeResponse = {
  user: AuthUserProfile;
};

```

---

## File: demo-client/src/vite-env.d.ts

```ts
/// <reference types="vite/client" />

```

---

## File: demo-client/tsconfig.app.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    "types": ["vite/client"]
  },
  "include": ["src"]
}

```

---

## File: demo-client/tsconfig.json

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" }
  ]
}

```

---

## File: demo-client/vite.config.ts

```ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = (env.VITE_API_BASE_URL || "http://localhost:3999").replace(/\/+$/, "");

  return {
    plugins: [react()],
    server: {
      strictPort: true,
      proxy: {
        "/.netlify/functions": {
          target,
          changeOrigin: true
        }
      }
    }
  };
});

```

---

## File: deno.lock

```
{
  "version": "5",
  "remote": {
    "https://edge.netlify.com/": "fd941d61d88673d5f28aab283fb86fcc50f08a3bc80ee5470498fcfa88c65cfb",
    "https://edge.netlify.com/bootstrap/config.ts": "6a2ce0e544e15e8f8883a5c18da5948e37fd0f2619f68cb31f3af53c51817025",
    "https://edge.netlify.com/bootstrap/context.ts": "e97240232121e2f369f6546ce961490f34d961ea1ea54be3ff09633e3f08373f",
    "https://edge.netlify.com/bootstrap/cookie.ts": "8b0baae708989ca183c6f3b4ab3d029e6abcbc2e43f93edeb0ff447b3bbc3a05",
    "https://edge.netlify.com/bootstrap/edge_function.ts": "b8253e86aa83c67341f5cfedeba5049d77fbf84dcab7eceff7566b7728ae9b39",
    "https://edge.netlify.com/bootstrap/globals/types.ts": "eaa6148ded3121d8dee62dd91c86e7fe76601df0f3ca8d7962243a30f4c8935f"
  },
  "workspace": {
    "packageJson": {
      "dependencies": [
        "npm:@eslint/js@^9.9.0",
        "npm:@netlify/functions@^2.8.0",
        "npm:@redocly/cli@^2.20.1",
        "npm:@types/node@^22.10.2",
        "npm:@types/pg@^8.11.10",
        "npm:@typescript-eslint/eslint-plugin@^8.10.0",
        "npm:@typescript-eslint/parser@^8.10.0",
        "npm:eslint-config-prettier@^9.1.0",
        "npm:eslint@^9.9.0",
        "npm:globals@^15.9.0",
        "npm:netlify-cli@18",
        "npm:pg@^8.13.1",
        "npm:prettier@^3.3.3",
        "npm:typescript@^5.9.3",
        "npm:vitest@^2.1.8",
        "npm:widdershins@^4.0.1"
      ]
    }
  }
}

```

---

## File: docs/api.html

```
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf8" />
  <title>Identity Backend Service API</title>
  <!-- needed for adaptive design -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      padding: 0;
      margin: 0;
    }
  </style>
  <script src="https://cdn.redocly.com/redoc/v2.5.1/bundles/redoc.standalone.js"></script><style data-styled="true" data-styled-version="6.3.9">.hoYmkG{width:calc(100% - 40%);padding:0 40px;}/*!sc*/
@media print,screen and (max-width: 75rem){.hoYmkG{width:100%;padding:40px 40px;}}/*!sc*/
.eiTXyS{width:calc(100% - 40%);padding:0 40px;}/*!sc*/
@media print,screen and (max-width: 75rem){.eiTXyS{width:100%;padding:0px 40px;}}/*!sc*/
data-styled.g4[id="sc-hLseeT"]{content:"hoYmkG,eiTXyS,"}/*!sc*/
.eTiIZG{padding:40px 0;}/*!sc*/
.eTiIZG:last-child{min-height:calc(100vh + 1px);}/*!sc*/
.eTiIZG>.eTiIZG:last-child{min-height:initial;}/*!sc*/
@media print,screen and (max-width: 75rem){.eTiIZG{padding:0;}}/*!sc*/
.iUTsUN{padding:40px 0;position:relative;}/*!sc*/
.iUTsUN:last-child{min-height:calc(100vh + 1px);}/*!sc*/
.iUTsUN>.iUTsUN:last-child{min-height:initial;}/*!sc*/
@media print,screen and (max-width: 75rem){.iUTsUN{padding:0;}}/*!sc*/
.iUTsUN:not(:last-of-type):after{position:absolute;bottom:0;width:100%;display:block;content:'';border-bottom:1px solid rgba(0, 0, 0, 0.2);}/*!sc*/
data-styled.g5[id="sc-eDDNvO"]{content:"eTiIZG,iUTsUN,"}/*!sc*/
.dVngAA{width:40%;color:#ffffff;background-color:#263238;padding:0 40px;}/*!sc*/
@media print,screen and (max-width: 75rem){.dVngAA{width:100%;padding:40px 40px;}}/*!sc*/
data-styled.g6[id="sc-jTrPJt"]{content:"dVngAA,"}/*!sc*/
.fYLqku{background-color:#263238;}/*!sc*/
data-styled.g7[id="sc-gLDzao"]{content:"fYLqku,"}/*!sc*/
.cmAaWK{display:flex;width:100%;padding:0;}/*!sc*/
@media print,screen and (max-width: 75rem){.cmAaWK{flex-direction:column;}}/*!sc*/
data-styled.g8[id="sc-iAEyYj"]{content:"cmAaWK,"}/*!sc*/
.ePkAIL{font-family:Montserrat,sans-serif;font-weight:400;font-size:1.85714em;line-height:1.6em;color:#333333;}/*!sc*/
data-styled.g9[id="sc-fsQipe"]{content:"ePkAIL,"}/*!sc*/
.bcNKdh{font-family:Montserrat,sans-serif;font-weight:400;font-size:1.57143em;line-height:1.6em;color:#333333;margin:0 0 20px;}/*!sc*/
data-styled.g10[id="sc-qRumy"]{content:"bcNKdh,"}/*!sc*/
.dEbuTz{color:#ffffff;}/*!sc*/
data-styled.g12[id="sc-kFuwaQ"]{content:"dEbuTz,"}/*!sc*/
.fA-dGxt{border-bottom:1px solid rgba(38, 50, 56, 0.3);margin:1em 0 1em 0;color:rgba(38, 50, 56, 0.5);font-weight:normal;text-transform:uppercase;font-size:0.929em;line-height:20px;}/*!sc*/
data-styled.g13[id="sc-irTswZ"]{content:"fA-dGxt,"}/*!sc*/
.jSIqAu{cursor:pointer;margin-left:-20px;padding:0;line-height:1;width:20px;display:inline-block;outline:0;}/*!sc*/
.jSIqAu:before{content:'';width:15px;height:15px;background-size:contain;background-image:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeD0iMCIgeT0iMCIgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBmaWxsPSIjMDEwMTAxIiBkPSJNNDU5LjcgMjMzLjRsLTkwLjUgOTAuNWMtNTAgNTAtMTMxIDUwLTE4MSAwIC03LjktNy44LTE0LTE2LjctMTkuNC0yNS44bDQyLjEtNDIuMWMyLTIgNC41LTMuMiA2LjgtNC41IDIuOSA5LjkgOCAxOS4zIDE1LjggMjcuMiAyNSAyNSA2NS42IDI0LjkgOTAuNSAwbDkwLjUtOTAuNWMyNS0yNSAyNS02NS42IDAtOTAuNSAtMjQuOS0yNS02NS41LTI1LTkwLjUgMGwtMzIuMiAzMi4yYy0yNi4xLTEwLjItNTQuMi0xMi45LTgxLjYtOC45bDY4LjYtNjguNmM1MC01MCAxMzEtNTAgMTgxIDBDNTA5LjYgMTAyLjMgNTA5LjYgMTgzLjQgNDU5LjcgMjMzLjR6TTIyMC4zIDM4Mi4ybC0zMi4yIDMyLjJjLTI1IDI0LjktNjUuNiAyNC45LTkwLjUgMCAtMjUtMjUtMjUtNjUuNiAwLTkwLjVsOTAuNS05MC41YzI1LTI1IDY1LjUtMjUgOTAuNSAwIDcuOCA3LjggMTIuOSAxNy4yIDE1LjggMjcuMSAyLjQtMS40IDQuOC0yLjUgNi44LTQuNWw0Mi4xLTQyYy01LjQtOS4yLTExLjYtMTgtMTkuNC0yNS44IC01MC01MC0xMzEtNTAtMTgxIDBsLTkwLjUgOTAuNWMtNTAgNTAtNTAgMTMxIDAgMTgxIDUwIDUwIDEzMSA1MCAxODEgMGw2OC42LTY4LjZDMjc0LjYgMzk1LjEgMjQ2LjQgMzkyLjMgMjIwLjMgMzgyLjJ6Ii8+PC9zdmc+Cg==');opacity:0.5;visibility:hidden;display:inline-block;vertical-align:middle;}/*!sc*/
h1:hover>.jSIqAu::before,h2:hover>.jSIqAu::before,.jSIqAu:hover::before{visibility:visible;}/*!sc*/
data-styled.g14[id="sc-csCMJq"]{content:"jSIqAu,"}/*!sc*/
.cNCXIL{height:18px;width:18px;min-width:18px;vertical-align:middle;float:right;transition:transform 0.2s ease-out;transform:rotateZ(-90deg);}/*!sc*/
.iZiZiV{height:1.5em;width:1.5em;min-width:1.5em;vertical-align:middle;float:left;transition:transform 0.2s ease-out;transform:rotateZ(-90deg);}/*!sc*/
.iZiZiV polygon{fill:#1d8127;}/*!sc*/
.kiMFkB{height:1.5em;width:1.5em;min-width:1.5em;vertical-align:middle;float:left;transition:transform 0.2s ease-out;transform:rotateZ(-90deg);}/*!sc*/
.kiMFkB polygon{fill:#d41f1c;}/*!sc*/
.ivEQut{height:20px;width:20px;min-width:20px;vertical-align:middle;float:right;transition:transform 0.2s ease-out;transform:rotateZ(0);}/*!sc*/
.ivEQut polygon{fill:white;}/*!sc*/
.eiOVYa{height:1.3em;width:1.3em;min-width:1.3em;vertical-align:middle;transition:transform 0.2s ease-out;transform:rotateZ(-90deg);}/*!sc*/
data-styled.g15[id="sc-fbJfz"]{content:"cNCXIL,iZiZiV,kiMFkB,ivEQut,eiOVYa,"}/*!sc*/
.kddqHa{border-left:1px solid #7c7cbb;box-sizing:border-box;position:relative;padding:10px 10px 10px 0;}/*!sc*/
@media screen and (max-width: 50rem){.kddqHa{display:block;overflow:hidden;}}/*!sc*/
tr:first-of-type>.kddqHa,tr.last>.kddqHa{border-left-width:0;background-position:top left;background-repeat:no-repeat;background-size:1px 100%;}/*!sc*/
tr:first-of-type>.kddqHa{background-image:linear-gradient(
      to bottom,
      transparent 0%,
      transparent 22px,
      #7c7cbb 22px,
      #7c7cbb 100%
    );}/*!sc*/
tr.last>.kddqHa{background-image:linear-gradient(
      to bottom,
      #7c7cbb 0%,
      #7c7cbb 22px,
      transparent 22px,
      transparent 100%
    );}/*!sc*/
tr.last+tr>.kddqHa{border-left-color:transparent;}/*!sc*/
tr.last:first-child>.kddqHa{background:none;border-left-color:transparent;}/*!sc*/
data-styled.g18[id="sc-hAtEya"]{content:"kddqHa,"}/*!sc*/
.eIujjv{vertical-align:top;line-height:20px;white-space:nowrap;font-size:13px;font-family:Courier,monospace;}/*!sc*/
.eIujjv.deprecated{text-decoration:line-through;color:#707070;}/*!sc*/
data-styled.g20[id="sc-fGFwA-d"]{content:"eIujjv,"}/*!sc*/
.bmauLr{border-bottom:1px solid #9fb4be;padding:10px 0;width:75%;box-sizing:border-box;}/*!sc*/
tr.expanded .bmauLr{border-bottom:none;}/*!sc*/
@media screen and (max-width: 50rem){.bmauLr{padding:0 20px;border-bottom:none;border-left:1px solid #7c7cbb;}tr.last>.bmauLr{border-left:none;}}/*!sc*/
data-styled.g21[id="sc-blLsxE"]{content:"bmauLr,"}/*!sc*/
.bEKmDE{color:#7c7cbb;font-family:Courier,monospace;margin-right:10px;}/*!sc*/
.bEKmDE::before{content:'';display:inline-block;vertical-align:middle;width:10px;height:1px;background:#7c7cbb;}/*!sc*/
.bEKmDE::after{content:'';display:inline-block;vertical-align:middle;width:1px;background:#7c7cbb;height:7px;}/*!sc*/
data-styled.g22[id="sc-ieZDjf"]{content:"bEKmDE,"}/*!sc*/
.dybric{border-collapse:separate;border-radius:3px;font-size:14px;border-spacing:0;width:100%;}/*!sc*/
.dybric >tr{vertical-align:middle;}/*!sc*/
@media screen and (max-width: 50rem){.dybric{display:block;}.dybric >tr,.dybric >tbody>tr{display:block;}}/*!sc*/
@media screen and (max-width: 50rem) and (-ms-high-contrast:none){.dybric td{float:left;width:100%;}}/*!sc*/
.dybric .sc-dKfzgG,.dybric .sc-dKfzgG .sc-dKfzgG .sc-dKfzgG,.dybric .sc-dKfzgG .sc-dKfzgG .sc-dKfzgG .sc-dKfzgG .sc-dKfzgG{margin:1em;margin-right:0;background:#fafafa;}/*!sc*/
.dybric .sc-dKfzgG .sc-dKfzgG,.dybric .sc-dKfzgG .sc-dKfzgG .sc-dKfzgG .sc-dKfzgG,.dybric .sc-dKfzgG .sc-dKfzgG .sc-dKfzgG .sc-dKfzgG .sc-dKfzgG .sc-dKfzgG{background:#ffffff;}/*!sc*/
data-styled.g24[id="sc-hIqOWV"]{content:"dybric,"}/*!sc*/
.lbIFgo >ul{list-style:none;padding:0;margin:0;margin:0 -5px;}/*!sc*/
.lbIFgo >ul >li{padding:5px 10px;display:inline-block;background-color:#11171a;border-bottom:1px solid rgba(0, 0, 0, 0.5);cursor:pointer;text-align:center;outline:none;color:#ccc;margin:0 5px 5px 5px;border:1px solid #07090b;border-radius:5px;min-width:60px;font-size:0.9em;font-weight:bold;}/*!sc*/
.lbIFgo >ul >li.react-tabs__tab--selected{color:#333333;background:#ffffff;}/*!sc*/
.lbIFgo >ul >li.react-tabs__tab--selected:focus{outline:auto;}/*!sc*/
.lbIFgo >ul >li:only-child{flex:none;min-width:100px;}/*!sc*/
.lbIFgo >ul >li.tab-success{color:#1d8127;}/*!sc*/
.lbIFgo >ul >li.tab-redirect{color:#ffa500;}/*!sc*/
.lbIFgo >ul >li.tab-info{color:#87ceeb;}/*!sc*/
.lbIFgo >ul >li.tab-error{color:#d41f1c;}/*!sc*/
.lbIFgo >.react-tabs__tab-panel{background:#11171a;}/*!sc*/
.lbIFgo >.react-tabs__tab-panel>div,.lbIFgo >.react-tabs__tab-panel>pre{padding:20px;margin:0;}/*!sc*/
.lbIFgo >.react-tabs__tab-panel>div>pre{padding:0;}/*!sc*/
data-styled.g30[id="sc-cyRfQY"]{content:"lbIFgo,"}/*!sc*/
.dXXcln code[class*='language-'],.dXXcln pre[class*='language-']{text-shadow:0 -0.1em 0.2em black;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none;}/*!sc*/
@media print{.dXXcln code[class*='language-'],.dXXcln pre[class*='language-']{text-shadow:none;}}/*!sc*/
.dXXcln pre[class*='language-']{padding:1em;margin:0.5em 0;overflow:auto;}/*!sc*/
.dXXcln .token.comment,.dXXcln .token.prolog,.dXXcln .token.doctype,.dXXcln .token.cdata{color:hsl(30, 20%, 50%);}/*!sc*/
.dXXcln .token.punctuation{opacity:0.7;}/*!sc*/
.dXXcln .namespace{opacity:0.7;}/*!sc*/
.dXXcln .token.property,.dXXcln .token.tag,.dXXcln .token.number,.dXXcln .token.constant,.dXXcln .token.symbol{color:#4a8bb3;}/*!sc*/
.dXXcln .token.boolean{color:#e64441;}/*!sc*/
.dXXcln .token.selector,.dXXcln .token.attr-name,.dXXcln .token.string,.dXXcln .token.char,.dXXcln .token.builtin,.dXXcln .token.inserted{color:#a0fbaa;}/*!sc*/
.dXXcln .token.selector+a,.dXXcln .token.attr-name+a,.dXXcln .token.string+a,.dXXcln .token.char+a,.dXXcln .token.builtin+a,.dXXcln .token.inserted+a,.dXXcln .token.selector+a:visited,.dXXcln .token.attr-name+a:visited,.dXXcln .token.string+a:visited,.dXXcln .token.char+a:visited,.dXXcln .token.builtin+a:visited,.dXXcln .token.inserted+a:visited{color:#4ed2ba;text-decoration:underline;}/*!sc*/
.dXXcln .token.property.string{color:white;}/*!sc*/
.dXXcln .token.operator,.dXXcln .token.entity,.dXXcln .token.url,.dXXcln .token.variable{color:hsl(40, 90%, 60%);}/*!sc*/
.dXXcln .token.atrule,.dXXcln .token.attr-value,.dXXcln .token.keyword{color:hsl(350, 40%, 70%);}/*!sc*/
.dXXcln .token.regex,.dXXcln .token.important{color:#e90;}/*!sc*/
.dXXcln .token.important,.dXXcln .token.bold{font-weight:bold;}/*!sc*/
.dXXcln .token.italic{font-style:italic;}/*!sc*/
.dXXcln .token.entity{cursor:help;}/*!sc*/
.dXXcln .token.deleted{color:red;}/*!sc*/
data-styled.g32[id="sc-iKGpAq"]{content:"dXXcln,"}/*!sc*/
.btblAa{opacity:0.7;transition:opacity 0.3s ease;text-align:right;}/*!sc*/
.btblAa:focus-within{opacity:1;}/*!sc*/
.btblAa >button{background-color:transparent;border:0;color:inherit;padding:2px 10px;font-family:Roboto,sans-serif;font-size:14px;line-height:1.5em;cursor:pointer;outline:0;}/*!sc*/
.btblAa >button :hover,.btblAa >button :focus{background:rgba(255, 255, 255, 0.1);}/*!sc*/
data-styled.g33[id="sc-gjTGSz"]{content:"btblAa,"}/*!sc*/
.bNwKoT{position:relative;}/*!sc*/
data-styled.g37[id="sc-kMrHXi"]{content:"bNwKoT,"}/*!sc*/
.bzXJk{margin-left:10px;text-transform:none;font-size:0.929em;color:black;}/*!sc*/
data-styled.g41[id="sc-gXSCqT"]{content:"bzXJk,"}/*!sc*/
.dHaogz{font-family:Roboto,sans-serif;font-weight:400;line-height:1.5em;}/*!sc*/
.dHaogz p:last-child{margin-bottom:0;}/*!sc*/
.dHaogz h1{font-family:Montserrat,sans-serif;font-weight:400;font-size:1.85714em;line-height:1.6em;color:#32329f;margin-top:0;}/*!sc*/
.dHaogz h2{font-family:Montserrat,sans-serif;font-weight:400;font-size:1.57143em;line-height:1.6em;color:#333333;}/*!sc*/
.dHaogz code{color:#e53935;background-color:rgba(38, 50, 56, 0.05);font-family:Courier,monospace;border-radius:2px;border:1px solid rgba(38, 50, 56, 0.1);padding:0 5px;font-size:13px;font-weight:400;word-break:break-word;}/*!sc*/
.dHaogz pre{font-family:Courier,monospace;white-space:pre;background-color:#11171a;color:white;padding:20px;overflow-x:auto;line-height:normal;border-radius:0;border:1px solid rgba(38, 50, 56, 0.1);}/*!sc*/
.dHaogz pre code{background-color:transparent;color:white;padding:0;}/*!sc*/
.dHaogz pre code:before,.dHaogz pre code:after{content:none;}/*!sc*/
.dHaogz blockquote{margin:0;margin-bottom:1em;padding:0 15px;color:#777;border-left:4px solid #ddd;}/*!sc*/
.dHaogz img{max-width:100%;box-sizing:content-box;}/*!sc*/
.dHaogz ul,.dHaogz ol{padding-left:2em;margin:0;margin-bottom:1em;}/*!sc*/
.dHaogz ul ul,.dHaogz ol ul,.dHaogz ul ol,.dHaogz ol ol{margin-bottom:0;margin-top:0;}/*!sc*/
.dHaogz table{display:block;width:100%;overflow:auto;word-break:normal;word-break:keep-all;border-collapse:collapse;border-spacing:0;margin-top:1.5em;margin-bottom:1.5em;}/*!sc*/
.dHaogz table tr{background-color:#fff;border-top:1px solid #ccc;}/*!sc*/
.dHaogz table tr:nth-child(2n){background-color:#fafafa;}/*!sc*/
.dHaogz table th,.dHaogz table td{padding:6px 13px;border:1px solid #ddd;}/*!sc*/
.dHaogz table th{text-align:left;font-weight:bold;}/*!sc*/
.dHaogz .share-link{cursor:pointer;margin-left:-20px;padding:0;line-height:1;width:20px;display:inline-block;outline:0;}/*!sc*/
.dHaogz .share-link:before{content:'';width:15px;height:15px;background-size:contain;background-image:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeD0iMCIgeT0iMCIgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBmaWxsPSIjMDEwMTAxIiBkPSJNNDU5LjcgMjMzLjRsLTkwLjUgOTAuNWMtNTAgNTAtMTMxIDUwLTE4MSAwIC03LjktNy44LTE0LTE2LjctMTkuNC0yNS44bDQyLjEtNDIuMWMyLTIgNC41LTMuMiA2LjgtNC41IDIuOSA5LjkgOCAxOS4zIDE1LjggMjcuMiAyNSAyNSA2NS42IDI0LjkgOTAuNSAwbDkwLjUtOTAuNWMyNS0yNSAyNS02NS42IDAtOTAuNSAtMjQuOS0yNS02NS41LTI1LTkwLjUgMGwtMzIuMiAzMi4yYy0yNi4xLTEwLjItNTQuMi0xMi45LTgxLjYtOC45bDY4LjYtNjguNmM1MC01MCAxMzEtNTAgMTgxIDBDNTA5LjYgMTAyLjMgNTA5LjYgMTgzLjQgNDU5LjcgMjMzLjR6TTIyMC4zIDM4Mi4ybC0zMi4yIDMyLjJjLTI1IDI0LjktNjUuNiAyNC45LTkwLjUgMCAtMjUtMjUtMjUtNjUuNiAwLTkwLjVsOTAuNS05MC41YzI1LTI1IDY1LjUtMjUgOTAuNSAwIDcuOCA3LjggMTIuOSAxNy4yIDE1LjggMjcuMSAyLjQtMS40IDQuOC0yLjUgNi44LTQuNWw0Mi4xLTQyYy01LjQtOS4yLTExLjYtMTgtMTkuNC0yNS44IC01MC01MC0xMzEtNTAtMTgxIDBsLTkwLjUgOTAuNWMtNTAgNTAtNTAgMTMxIDAgMTgxIDUwIDUwIDEzMSA1MCAxODEgMGw2OC42LTY4LjZDMjc0LjYgMzk1LjEgMjQ2LjQgMzkyLjMgMjIwLjMgMzgyLjJ6Ii8+PC9zdmc+Cg==');opacity:0.5;visibility:hidden;display:inline-block;vertical-align:middle;}/*!sc*/
.dHaogz h1:hover>.share-link::before,.dHaogz h2:hover>.share-link::before,.dHaogz .share-link:hover::before{visibility:visible;}/*!sc*/
.dHaogz a{text-decoration:auto;color:#32329f;}/*!sc*/
.dHaogz a:visited{color:#32329f;}/*!sc*/
.dHaogz a:hover{color:#6868cf;text-decoration:auto;}/*!sc*/
.cFvDiF{font-family:Roboto,sans-serif;font-weight:400;line-height:1.5em;}/*!sc*/
.cFvDiF p:last-child{margin-bottom:0;}/*!sc*/
.cFvDiF p:first-child{margin-top:0;}/*!sc*/
.cFvDiF p:last-child{margin-bottom:0;}/*!sc*/
.cFvDiF h1{font-family:Montserrat,sans-serif;font-weight:400;font-size:1.85714em;line-height:1.6em;color:#32329f;margin-top:0;}/*!sc*/
.cFvDiF h2{font-family:Montserrat,sans-serif;font-weight:400;font-size:1.57143em;line-height:1.6em;color:#333333;}/*!sc*/
.cFvDiF code{color:#e53935;background-color:rgba(38, 50, 56, 0.05);font-family:Courier,monospace;border-radius:2px;border:1px solid rgba(38, 50, 56, 0.1);padding:0 5px;font-size:13px;font-weight:400;word-break:break-word;}/*!sc*/
.cFvDiF pre{font-family:Courier,monospace;white-space:pre;background-color:#11171a;color:white;padding:20px;overflow-x:auto;line-height:normal;border-radius:0;border:1px solid rgba(38, 50, 56, 0.1);}/*!sc*/
.cFvDiF pre code{background-color:transparent;color:white;padding:0;}/*!sc*/
.cFvDiF pre code:before,.cFvDiF pre code:after{content:none;}/*!sc*/
.cFvDiF blockquote{margin:0;margin-bottom:1em;padding:0 15px;color:#777;border-left:4px solid #ddd;}/*!sc*/
.cFvDiF img{max-width:100%;box-sizing:content-box;}/*!sc*/
.cFvDiF ul,.cFvDiF ol{padding-left:2em;margin:0;margin-bottom:1em;}/*!sc*/
.cFvDiF ul ul,.cFvDiF ol ul,.cFvDiF ul ol,.cFvDiF ol ol{margin-bottom:0;margin-top:0;}/*!sc*/
.cFvDiF table{display:block;width:100%;overflow:auto;word-break:normal;word-break:keep-all;border-collapse:collapse;border-spacing:0;margin-top:1.5em;margin-bottom:1.5em;}/*!sc*/
.cFvDiF table tr{background-color:#fff;border-top:1px solid #ccc;}/*!sc*/
.cFvDiF table tr:nth-child(2n){background-color:#fafafa;}/*!sc*/
.cFvDiF table th,.cFvDiF table td{padding:6px 13px;border:1px solid #ddd;}/*!sc*/
.cFvDiF table th{text-align:left;font-weight:bold;}/*!sc*/
.cFvDiF .share-link{cursor:pointer;margin-left:-20px;padding:0;line-height:1;width:20px;display:inline-block;outline:0;}/*!sc*/
.cFvDiF .share-link:before{content:'';width:15px;height:15px;background-size:contain;background-image:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeD0iMCIgeT0iMCIgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBmaWxsPSIjMDEwMTAxIiBkPSJNNDU5LjcgMjMzLjRsLTkwLjUgOTAuNWMtNTAgNTAtMTMxIDUwLTE4MSAwIC03LjktNy44LTE0LTE2LjctMTkuNC0yNS44bDQyLjEtNDIuMWMyLTIgNC41LTMuMiA2LjgtNC41IDIuOSA5LjkgOCAxOS4zIDE1LjggMjcuMiAyNSAyNSA2NS42IDI0LjkgOTAuNSAwbDkwLjUtOTAuNWMyNS0yNSAyNS02NS42IDAtOTAuNSAtMjQuOS0yNS02NS41LTI1LTkwLjUgMGwtMzIuMiAzMi4yYy0yNi4xLTEwLjItNTQuMi0xMi45LTgxLjYtOC45bDY4LjYtNjguNmM1MC01MCAxMzEtNTAgMTgxIDBDNTA5LjYgMTAyLjMgNTA5LjYgMTgzLjQgNDU5LjcgMjMzLjR6TTIyMC4zIDM4Mi4ybC0zMi4yIDMyLjJjLTI1IDI0LjktNjUuNiAyNC45LTkwLjUgMCAtMjUtMjUtMjUtNjUuNiAwLTkwLjVsOTAuNS05MC41YzI1LTI1IDY1LjUtMjUgOTAuNSAwIDcuOCA3LjggMTIuOSAxNy4yIDE1LjggMjcuMSAyLjQtMS40IDQuOC0yLjUgNi44LTQuNWw0Mi4xLTQyYy01LjQtOS4yLTExLjYtMTgtMTkuNC0yNS44IC01MC01MC0xMzEtNTAtMTgxIDBsLTkwLjUgOTAuNWMtNTAgNTAtNTAgMTMxIDAgMTgxIDUwIDUwIDEzMSA1MCAxODEgMGw2OC42LTY4LjZDMjc0LjYgMzk1LjEgMjQ2LjQgMzkyLjMgMjIwLjMgMzgyLjJ6Ii8+PC9zdmc+Cg==');opacity:0.5;visibility:hidden;display:inline-block;vertical-align:middle;}/*!sc*/
.cFvDiF h1:hover>.share-link::before,.cFvDiF h2:hover>.share-link::before,.cFvDiF .share-link:hover::before{visibility:visible;}/*!sc*/
.cFvDiF a{text-decoration:auto;color:#32329f;}/*!sc*/
.cFvDiF a:visited{color:#32329f;}/*!sc*/
.cFvDiF a:hover{color:#6868cf;text-decoration:auto;}/*!sc*/
.fTBBlJ{font-family:Roboto,sans-serif;font-weight:400;line-height:1.5em;}/*!sc*/
.fTBBlJ p:last-child{margin-bottom:0;}/*!sc*/
.fTBBlJ p:first-child{margin-top:0;}/*!sc*/
.fTBBlJ p:last-child{margin-bottom:0;}/*!sc*/
.fTBBlJ p{display:inline-block;}/*!sc*/
.fTBBlJ h1{font-family:Montserrat,sans-serif;font-weight:400;font-size:1.85714em;line-height:1.6em;color:#32329f;margin-top:0;}/*!sc*/
.fTBBlJ h2{font-family:Montserrat,sans-serif;font-weight:400;font-size:1.57143em;line-height:1.6em;color:#333333;}/*!sc*/
.fTBBlJ code{color:#e53935;background-color:rgba(38, 50, 56, 0.05);font-family:Courier,monospace;border-radius:2px;border:1px solid rgba(38, 50, 56, 0.1);padding:0 5px;font-size:13px;font-weight:400;word-break:break-word;}/*!sc*/
.fTBBlJ pre{font-family:Courier,monospace;white-space:pre;background-color:#11171a;color:white;padding:20px;overflow-x:auto;line-height:normal;border-radius:0;border:1px solid rgba(38, 50, 56, 0.1);}/*!sc*/
.fTBBlJ pre code{background-color:transparent;color:white;padding:0;}/*!sc*/
.fTBBlJ pre code:before,.fTBBlJ pre code:after{content:none;}/*!sc*/
.fTBBlJ blockquote{margin:0;margin-bottom:1em;padding:0 15px;color:#777;border-left:4px solid #ddd;}/*!sc*/
.fTBBlJ img{max-width:100%;box-sizing:content-box;}/*!sc*/
.fTBBlJ ul,.fTBBlJ ol{padding-left:2em;margin:0;margin-bottom:1em;}/*!sc*/
.fTBBlJ ul ul,.fTBBlJ ol ul,.fTBBlJ ul ol,.fTBBlJ ol ol{margin-bottom:0;margin-top:0;}/*!sc*/
.fTBBlJ table{display:block;width:100%;overflow:auto;word-break:normal;word-break:keep-all;border-collapse:collapse;border-spacing:0;margin-top:1.5em;margin-bottom:1.5em;}/*!sc*/
.fTBBlJ table tr{background-color:#fff;border-top:1px solid #ccc;}/*!sc*/
.fTBBlJ table tr:nth-child(2n){background-color:#fafafa;}/*!sc*/
.fTBBlJ table th,.fTBBlJ table td{padding:6px 13px;border:1px solid #ddd;}/*!sc*/
.fTBBlJ table th{text-align:left;font-weight:bold;}/*!sc*/
.fTBBlJ .share-link{cursor:pointer;margin-left:-20px;padding:0;line-height:1;width:20px;display:inline-block;outline:0;}/*!sc*/
.fTBBlJ .share-link:before{content:'';width:15px;height:15px;background-size:contain;background-image:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeD0iMCIgeT0iMCIgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBmaWxsPSIjMDEwMTAxIiBkPSJNNDU5LjcgMjMzLjRsLTkwLjUgOTAuNWMtNTAgNTAtMTMxIDUwLTE4MSAwIC03LjktNy44LTE0LTE2LjctMTkuNC0yNS44bDQyLjEtNDIuMWMyLTIgNC41LTMuMiA2LjgtNC41IDIuOSA5LjkgOCAxOS4zIDE1LjggMjcuMiAyNSAyNSA2NS42IDI0LjkgOTAuNSAwbDkwLjUtOTAuNWMyNS0yNSAyNS02NS42IDAtOTAuNSAtMjQuOS0yNS02NS41LTI1LTkwLjUgMGwtMzIuMiAzMi4yYy0yNi4xLTEwLjItNTQuMi0xMi45LTgxLjYtOC45bDY4LjYtNjguNmM1MC01MCAxMzEtNTAgMTgxIDBDNTA5LjYgMTAyLjMgNTA5LjYgMTgzLjQgNDU5LjcgMjMzLjR6TTIyMC4zIDM4Mi4ybC0zMi4yIDMyLjJjLTI1IDI0LjktNjUuNiAyNC45LTkwLjUgMCAtMjUtMjUtMjUtNjUuNiAwLTkwLjVsOTAuNS05MC41YzI1LTI1IDY1LjUtMjUgOTAuNSAwIDcuOCA3LjggMTIuOSAxNy4yIDE1LjggMjcuMSAyLjQtMS40IDQuOC0yLjUgNi44LTQuNWw0Mi4xLTQyYy01LjQtOS4yLTExLjYtMTgtMTkuNC0yNS44IC01MC01MC0xMzEtNTAtMTgxIDBsLTkwLjUgOTAuNWMtNTAgNTAtNTAgMTMxIDAgMTgxIDUwIDUwIDEzMSA1MCAxODEgMGw2OC42LTY4LjZDMjc0LjYgMzk1LjEgMjQ2LjQgMzkyLjMgMjIwLjMgMzgyLjJ6Ii8+PC9zdmc+Cg==');opacity:0.5;visibility:hidden;display:inline-block;vertical-align:middle;}/*!sc*/
.fTBBlJ h1:hover>.share-link::before,.fTBBlJ h2:hover>.share-link::before,.fTBBlJ .share-link:hover::before{visibility:visible;}/*!sc*/
.fTBBlJ a{text-decoration:auto;color:#32329f;}/*!sc*/
.fTBBlJ a:visited{color:#32329f;}/*!sc*/
.fTBBlJ a:hover{color:#6868cf;text-decoration:auto;}/*!sc*/
data-styled.g42[id="sc-cCYyou"]{content:"dHaogz,cFvDiF,fTBBlJ,"}/*!sc*/
.dkmSdy{display:inline;}/*!sc*/
data-styled.g43[id="sc-cjERFZ"]{content:"dkmSdy,"}/*!sc*/
.fJsoyS{position:relative;}/*!sc*/
data-styled.g44[id="sc-jegxcw"]{content:"fJsoyS,"}/*!sc*/
.iLjyyA:hover>.sc-gjTGSz{opacity:1;}/*!sc*/
data-styled.g49[id="sc-cRZddz"]{content:"iLjyyA,"}/*!sc*/
.jKIGwd{font-family:Courier,monospace;font-size:13px;white-space:pre;contain:content;overflow-x:auto;}/*!sc*/
.jKIGwd .redoc-json code>.collapser{display:none;pointer-events:none;}/*!sc*/
.jKIGwd .callback-function{color:gray;}/*!sc*/
.jKIGwd .collapser:after{content:'-';cursor:pointer;}/*!sc*/
.jKIGwd .collapsed>.collapser:after{content:'+';cursor:pointer;}/*!sc*/
.jKIGwd .ellipsis:after{content:' … ';}/*!sc*/
.jKIGwd .collapsible{margin-left:2em;}/*!sc*/
.jKIGwd .hoverable{padding-top:1px;padding-bottom:1px;padding-left:2px;padding-right:2px;border-radius:2px;}/*!sc*/
.jKIGwd .hovered{background-color:rgba(235, 238, 249, 1);}/*!sc*/
.jKIGwd .collapser{background-color:transparent;border:0;color:#fff;font-family:Courier,monospace;font-size:13px;padding-right:6px;padding-left:6px;padding-top:0;padding-bottom:0;display:flex;align-items:center;justify-content:center;width:15px;height:15px;position:absolute;top:4px;left:-1.5em;cursor:default;user-select:none;-webkit-user-select:none;padding:2px;}/*!sc*/
.jKIGwd .collapser:focus{outline-color:#fff;outline-style:dotted;outline-width:1px;}/*!sc*/
.jKIGwd ul{list-style-type:none;padding:0px;margin:0px 0px 0px 26px;}/*!sc*/
.jKIGwd li{position:relative;display:block;}/*!sc*/
.jKIGwd .hoverable{display:inline-block;}/*!sc*/
.jKIGwd .selected{outline-style:solid;outline-width:1px;outline-style:dotted;}/*!sc*/
.jKIGwd .collapsed>.collapsible{display:none;}/*!sc*/
.jKIGwd .ellipsis{display:none;}/*!sc*/
.jKIGwd .collapsed>.ellipsis{display:inherit;}/*!sc*/
data-styled.g50[id="sc-jMAIzW"]{content:"jKIGwd,"}/*!sc*/
.eMpCUl{padding:0.9em;background-color:rgba(38,50,56,0.4);margin:0 0 10px 0;display:block;font-family:Montserrat,sans-serif;font-size:0.929em;line-height:1.5em;}/*!sc*/
data-styled.g51[id="sc-dQelHO"]{content:"eMpCUl,"}/*!sc*/
.ccmcKc{font-family:Montserrat,sans-serif;font-size:12px;position:absolute;z-index:1;top:-11px;left:12px;font-weight:600;color:rgba(255,255,255,0.7);}/*!sc*/
data-styled.g52[id="sc-bCDidX"]{content:"ccmcKc,"}/*!sc*/
.gpxHhK{position:relative;}/*!sc*/
data-styled.g53[id="sc-cPlDXk"]{content:"gpxHhK,"}/*!sc*/
.ksuOBo{margin-top:15px;}/*!sc*/
data-styled.g56[id="sc-hVkBjf"]{content:"ksuOBo,"}/*!sc*/
.bPAaet{vertical-align:middle;font-size:13px;line-height:20px;}/*!sc*/
data-styled.g58[id="sc-gUrTyB"]{content:"bPAaet,"}/*!sc*/
.UMvzF{color:rgba(102,102,102,0.9);}/*!sc*/
data-styled.g59[id="sc-kZGvTq"]{content:"UMvzF,"}/*!sc*/
.fEQrHJ{color:#666;}/*!sc*/
data-styled.g60[id="sc-iMfspz"]{content:"fEQrHJ,"}/*!sc*/
.boAHLn{color:#d41f1c;font-size:0.9em;font-weight:normal;margin-left:20px;line-height:1;}/*!sc*/
data-styled.g62[id="sc-eKYjSU"]{content:"boAHLn,"}/*!sc*/
.cLOXvd:after{content:' and ';font-weight:normal;}/*!sc*/
.cLOXvd:last-child:after{content:none;}/*!sc*/
.cLOXvd a{text-decoration:auto;color:#32329f;}/*!sc*/
.cLOXvd a:visited{color:#32329f;}/*!sc*/
.cLOXvd a:hover{color:#6868cf;text-decoration:auto;}/*!sc*/
data-styled.g81[id="sc-hNeXkj"]{content:"cLOXvd,"}/*!sc*/
.ddMcul{white-space:nowrap;}/*!sc*/
.ddMcul:after{content:' or ';white-space:pre;}/*!sc*/
.ddMcul:last-child:after,.ddMcul:only-child:after{content:none;}/*!sc*/
.ddMcul a{text-decoration:auto;color:#32329f;}/*!sc*/
.ddMcul a:visited{color:#32329f;}/*!sc*/
.ddMcul a:hover{color:#6868cf;text-decoration:auto;}/*!sc*/
data-styled.g82[id="sc-dskThK"]{content:"ddMcul,"}/*!sc*/
.kuPPCO{flex:1 1 auto;cursor:pointer;}/*!sc*/
data-styled.g83[id="sc-cYRmzp"]{content:"kuPPCO,"}/*!sc*/
.gZngKQ{width:75%;text-overflow:ellipsis;border-radius:4px;overflow:hidden;}/*!sc*/
@media screen and (max-width: 50rem){.gZngKQ{margin-top:10px;}}/*!sc*/
data-styled.g84[id="sc-jTsRVM"]{content:"gZngKQ,"}/*!sc*/
.qtYpT{display:inline-block;margin:0;}/*!sc*/
data-styled.g85[id="sc-jOQpHb"]{content:"qtYpT,"}/*!sc*/
.pzAgN{width:100%;display:flex;margin:1em 0;flex-direction:row;}/*!sc*/
@media screen and (max-width: 50rem){.pzAgN{flex-direction:column;}}/*!sc*/
data-styled.g86[id="sc-ftWlEC"]{content:"pzAgN,"}/*!sc*/
.bSStQp{margin-top:0;margin-bottom:0.5em;}/*!sc*/
data-styled.g92[id="sc-crPCXn"]{content:"bSStQp,"}/*!sc*/
.FLoTo{width:9ex;display:inline-block;height:13px;line-height:13px;background-color:#333;border-radius:3px;background-repeat:no-repeat;background-position:6px 4px;font-size:7px;font-family:Verdana,sans-serif;color:white;text-transform:uppercase;text-align:center;font-weight:bold;vertical-align:middle;margin-right:6px;margin-top:2px;}/*!sc*/
.FLoTo.get{background-color:#2F8132;}/*!sc*/
.FLoTo.post{background-color:#186FAF;}/*!sc*/
.FLoTo.put{background-color:#95507c;}/*!sc*/
.FLoTo.options{background-color:#947014;}/*!sc*/
.FLoTo.patch{background-color:#bf581d;}/*!sc*/
.FLoTo.delete{background-color:#cc3333;}/*!sc*/
.FLoTo.basic{background-color:#707070;}/*!sc*/
.FLoTo.link{background-color:#07818F;}/*!sc*/
.FLoTo.head{background-color:#A23DAD;}/*!sc*/
.FLoTo.hook{background-color:#32329f;}/*!sc*/
.FLoTo.schema{background-color:#707070;}/*!sc*/
data-styled.g100[id="sc-YtoFD"]{content:"FLoTo,"}/*!sc*/
.fpIsZT{margin:0;padding:0;}/*!sc*/
.fpIsZT:first-child{padding-bottom:32px;}/*!sc*/
.sc-imaUOy .sc-imaUOy{font-size:0.929em;}/*!sc*/
.cjNZVC{margin:0;padding:0;display:none;}/*!sc*/
.cjNZVC:first-child{padding-bottom:32px;}/*!sc*/
.sc-imaUOy .sc-imaUOy{font-size:0.929em;}/*!sc*/
data-styled.g101[id="sc-imaUOy"]{content:"fpIsZT,cjNZVC,"}/*!sc*/
.cVgssJ{list-style:none inside none;overflow:hidden;text-overflow:ellipsis;padding:0;}/*!sc*/
data-styled.g102[id="sc-vjKnv"]{content:"cVgssJ,"}/*!sc*/
.YJdNS{cursor:pointer;color:#333333;margin:0;padding:12.5px 20px;display:flex;justify-content:space-between;font-family:Montserrat,sans-serif;font-size:0.929em;text-transform:none;background-color:#fafafa;}/*!sc*/
.YJdNS:hover{color:#32329f;background-color:#e1e1e1;}/*!sc*/
.YJdNS .sc-fbJfz{height:1.5em;width:1.5em;}/*!sc*/
.YJdNS .sc-fbJfz polygon{fill:#333333;}/*!sc*/
.fUjfPA{cursor:pointer;color:#333333;margin:0;padding:12.5px 20px;display:flex;justify-content:space-between;font-family:Montserrat,sans-serif;background-color:#fafafa;}/*!sc*/
.fUjfPA:hover{color:#32329f;background-color:#ededed;}/*!sc*/
.fUjfPA .sc-fbJfz{height:1.5em;width:1.5em;}/*!sc*/
.fUjfPA .sc-fbJfz polygon{fill:#333333;}/*!sc*/
data-styled.g103[id="sc-bjMMwc"]{content:"YJdNS,fUjfPA,"}/*!sc*/
.jZTjzp{display:inline-block;vertical-align:middle;width:calc(100% - 38px);overflow:hidden;text-overflow:ellipsis;}/*!sc*/
data-styled.g104[id="sc-eIrltV"]{content:"jZTjzp,"}/*!sc*/
.jKUIUi{font-size:0.8em;margin-top:10px;text-align:center;position:fixed;width:260px;bottom:0;background:#fafafa;}/*!sc*/
.jKUIUi a,.jKUIUi a:visited,.jKUIUi a:hover{color:#333333!important;padding:5px 0;border-top:1px solid #e1e1e1;text-decoration:none;display:flex;align-items:center;justify-content:center;}/*!sc*/
.jKUIUi img{width:15px;margin-right:5px;}/*!sc*/
@media screen and (max-width: 50rem){.jKUIUi{width:100%;}}/*!sc*/
data-styled.g105[id="sc-hAYhfO"]{content:"jKUIUi,"}/*!sc*/
.dHdMVa{cursor:pointer;position:relative;margin-bottom:5px;}/*!sc*/
data-styled.g111[id="sc-fYzRkH"]{content:"dHdMVa,"}/*!sc*/
.dkiPkt{font-family:Courier,monospace;margin-left:10px;flex:1;overflow-x:hidden;text-overflow:ellipsis;}/*!sc*/
data-styled.g112[id="sc-GJyyy"]{content:"dkiPkt,"}/*!sc*/
.iWrBta{outline:0;color:inherit;width:100%;text-align:left;cursor:pointer;padding:10px 30px 10px 20px;border-radius:4px 4px 0 0;background-color:#11171a;display:flex;white-space:nowrap;align-items:center;border:1px solid transparent;border-bottom:0;transition:border-color 0.25s ease;}/*!sc*/
.iWrBta ..sc-GJyyy{color:#ffffff;}/*!sc*/
.iWrBta:focus{box-shadow:inset 0 2px 2px rgba(0, 0, 0, 0.45),0 2px 0 rgba(128, 128, 128, 0.25);}/*!sc*/
data-styled.g113[id="sc-jYvNnh"]{content:"iWrBta,"}/*!sc*/
.ejslkd{font-size:0.929em;line-height:20px;background-color:#186FAF;color:#ffffff;padding:3px 10px;text-transform:uppercase;font-family:Montserrat,sans-serif;margin:0;}/*!sc*/
.kCsPwr{font-size:0.929em;line-height:20px;background-color:#2F8132;color:#ffffff;padding:3px 10px;text-transform:uppercase;font-family:Montserrat,sans-serif;margin:0;}/*!sc*/
data-styled.g114[id="sc-eGFuAY"]{content:"ejslkd,kCsPwr,"}/*!sc*/
.dplsyJ{position:absolute;width:100%;z-index:100;background:#fafafa;color:#263238;box-sizing:border-box;box-shadow:0 0 6px rgba(0, 0, 0, 0.33);overflow:hidden;border-bottom-left-radius:4px;border-bottom-right-radius:4px;transition:all 0.25s ease;visibility:hidden;transform:translateY(-50%) scaleY(0);}/*!sc*/
data-styled.g115[id="sc-fnxdBX"]{content:"dplsyJ,"}/*!sc*/
.cNCbuV{padding:10px;}/*!sc*/
data-styled.g116[id="sc-llcuoK"]{content:"cNCbuV,"}/*!sc*/
.eobUac{padding:5px;border:1px solid #ccc;background:#fff;word-break:break-all;color:#32329f;}/*!sc*/
.eobUac >span{color:#333333;}/*!sc*/
data-styled.g117[id="sc-jnsZEx"]{content:"eobUac,"}/*!sc*/
.iuCmqI{text-transform:lowercase;margin-left:0;line-height:1.5em;}/*!sc*/
data-styled.g118[id="sc-dVCGSo"]{content:"iuCmqI,"}/*!sc*/
.bmNzFc{text-transform:lowercase;margin-left:0;line-height:1.5em;color:#666;font-size:0.9em;}/*!sc*/
data-styled.g119[id="sc-hsiEir"]{content:"bmNzFc,"}/*!sc*/
.brztng{display:block;border:0;width:100%;text-align:left;padding:10px;border-radius:2px;margin-bottom:4px;line-height:1.5em;cursor:pointer;color:#1d8127;background-color:rgba(29,129,39,0.07);}/*!sc*/
.brztng:focus{outline:auto #1d8127;}/*!sc*/
.fvWYOy{display:block;border:0;width:100%;text-align:left;padding:10px;border-radius:2px;margin-bottom:4px;line-height:1.5em;cursor:pointer;color:#d41f1c;background-color:rgba(212,31,28,0.07);}/*!sc*/
.fvWYOy:focus{outline:auto #d41f1c;}/*!sc*/
.gQivdi{display:block;border:0;width:100%;text-align:left;padding:10px;border-radius:2px;margin-bottom:4px;line-height:1.5em;cursor:pointer;color:#1d8127;background-color:rgba(29,129,39,0.07);cursor:default;}/*!sc*/
.gQivdi:focus{outline:auto #1d8127;}/*!sc*/
.gQivdi::before{content:"—";font-weight:bold;width:1.5em;text-align:center;display:inline-block;vertical-align:top;}/*!sc*/
.gQivdi:focus{outline:0;}/*!sc*/
data-styled.g120[id="sc-caslwi"]{content:"brztng,fvWYOy,gQivdi,"}/*!sc*/
.jJkGwY{vertical-align:top;}/*!sc*/
data-styled.g123[id="sc-fYaxgW"]{content:"jJkGwY,"}/*!sc*/
.hsJdXF{font-size:1.3em;padding:0.2em 0;margin:3em 0 1.1em;color:#333333;font-weight:normal;}/*!sc*/
data-styled.g124[id="sc-fJjTez"]{content:"hsJdXF,"}/*!sc*/
.dUdgLx{margin-bottom:30px;}/*!sc*/
data-styled.g129[id="sc-iERabE"]{content:"dUdgLx,"}/*!sc*/
.dKxKge{user-select:none;width:20px;height:20px;align-self:center;display:flex;flex-direction:column;color:#32329f;}/*!sc*/
data-styled.g130[id="sc-iqavZh"]{content:"dKxKge,"}/*!sc*/
.kBSkUl{width:260px;background-color:#fafafa;overflow:hidden;display:flex;flex-direction:column;backface-visibility:hidden;height:100vh;position:sticky;position:-webkit-sticky;top:0;}/*!sc*/
@media screen and (max-width: 50rem){.kBSkUl{position:fixed;z-index:20;width:100%;background:#fafafa;display:none;}}/*!sc*/
@media print{.kBSkUl{display:none;}}/*!sc*/
data-styled.g131[id="sc-eXHjA-d"]{content:"kBSkUl,"}/*!sc*/
.laYfRb{outline:none;user-select:none;background-color:#f2f2f2;color:#32329f;display:none;cursor:pointer;position:fixed;right:20px;z-index:100;border-radius:50%;box-shadow:0 0 20px rgba(0, 0, 0, 0.3);bottom:44px;width:60px;height:60px;padding:0 20px;}/*!sc*/
@media screen and (max-width: 50rem){.laYfRb{display:flex;}}/*!sc*/
.laYfRb svg{color:#0065FB;}/*!sc*/
@media print{.laYfRb{display:none;}}/*!sc*/
data-styled.g132[id="sc-kVmAmQ"]{content:"laYfRb,"}/*!sc*/
.gRgPoG{font-family:Roboto,sans-serif;font-size:14px;font-weight:400;line-height:1.5em;color:#333333;display:flex;position:relative;text-align:left;-webkit-font-smoothing:antialiased;font-smoothing:antialiased;text-rendering:optimizeSpeed!important;tap-highlight-color:rgba(0, 0, 0, 0);text-size-adjust:100%;}/*!sc*/
.gRgPoG *{box-sizing:border-box;-webkit-tap-highlight-color:rgba(255, 255, 255, 0);}/*!sc*/
data-styled.g133[id="sc-dxnOzf"]{content:"gRgPoG,"}/*!sc*/
.gfWNtA{z-index:1;position:relative;overflow:hidden;width:calc(100% - 260px);contain:layout;}/*!sc*/
@media print,screen and (max-width: 50rem){.gfWNtA{width:100%;}}/*!sc*/
data-styled.g134[id="sc-juTflS"]{content:"gfWNtA,"}/*!sc*/
.jYOHCb{background:#263238;position:absolute;top:0;bottom:0;right:0;width:calc((100% - 260px) * 0.4);}/*!sc*/
@media print,screen and (max-width: 75rem){.jYOHCb{display:none;}}/*!sc*/
data-styled.g135[id="sc-emEvRt"]{content:"jYOHCb,"}/*!sc*/
.ijJYzO{padding:5px 0;}/*!sc*/
data-styled.g136[id="sc-kkjMEg"]{content:"ijJYzO,"}/*!sc*/
.kOlXdP{width:calc(100% - 40px);box-sizing:border-box;margin:0 20px;padding:5px 10px 5px 20px;border:0;border-bottom:1px solid #e1e1e1;font-family:Roboto,sans-serif;font-weight:bold;font-size:13px;color:#333333;background-color:transparent;outline:none;}/*!sc*/
data-styled.g137[id="sc-cMlaQv"]{content:"kOlXdP,"}/*!sc*/
.gtHWGb{position:absolute;left:20px;height:1.8em;width:0.9em;}/*!sc*/
.gtHWGb path{fill:#333333;}/*!sc*/
data-styled.g138[id="sc-iJQrDi"]{content:"gtHWGb,"}/*!sc*/
</style>
  <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
</head>

<body>
  
      <div id="redoc"><div class="sc-dxnOzf gRgPoG redoc-wrap"><div class="sc-eXHjA-d kBSkUl menu-content" style="top:0px;height:calc(100vh - 0px)"><div role="search" class="sc-kkjMEg ijJYzO"><svg class="sc-iJQrDi gtHWGb search-icon" version="1.1" viewBox="0 0 1000 1000" x="0px" xmlns="http://www.w3.org/2000/svg" y="0px"><path d="M968.2,849.4L667.3,549c83.9-136.5,66.7-317.4-51.7-435.6C477.1-25,252.5-25,113.9,113.4c-138.5,138.3-138.5,362.6,0,501C219.2,730.1,413.2,743,547.6,666.5l301.9,301.4c43.6,43.6,76.9,14.9,104.2-12.4C981,928.3,1011.8,893,968.2,849.4z M524.5,522c-88.9,88.7-233,88.7-321.8,0c-88.9-88.7-88.9-232.6,0-321.3c88.9-88.7,233-88.7,321.8,0C613.4,289.4,613.4,433.3,524.5,522z"></path></svg><input placeholder="Search..." aria-label="Search" type="text" class="sc-cMlaQv kOlXdP search-input" value=""/></div><div class="sc-kMrHXi bNwKoT scrollbar-container undefined"><ul role="menu" class="sc-imaUOy fpIsZT"><li tabindex="0" depth="1" data-item-id="tag/auth" role="menuitem" aria-label="auth" aria-expanded="false" class="sc-vjKnv cVgssJ"><label class="sc-bjMMwc YJdNS -depth1"><span width="calc(100% - 38px)" title="auth" class="sc-eIrltV jZTjzp">auth</span><svg class="sc-fbJfz cNCXIL" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg></label><ul class="sc-imaUOy cjNZVC"><li tabindex="0" depth="2" data-item-id="tag/auth/operation/authLogin" role="menuitem" aria-label="Login and create a session" aria-expanded="false" class="sc-vjKnv cVgssJ"><label class="sc-bjMMwc fUjfPA -depth2"><span type="post" class="sc-YtoFD FLoTo operation-type post">post</span><span tabindex="0" width="calc(100% - 38px)" class="sc-eIrltV jZTjzp">Login and create a session</span></label></li><li tabindex="0" depth="2" data-item-id="tag/auth/operation/authRegister" role="menuitem" aria-label="Register a new user and create a session" aria-expanded="false" class="sc-vjKnv cVgssJ"><label class="sc-bjMMwc fUjfPA -depth2"><span type="post" class="sc-YtoFD FLoTo operation-type post">post</span><span tabindex="0" width="calc(100% - 38px)" class="sc-eIrltV jZTjzp">Register a new user and create a session</span></label></li><li tabindex="0" depth="2" data-item-id="tag/auth/operation/authRefresh" role="menuitem" aria-label="Refresh an access token" aria-expanded="false" class="sc-vjKnv cVgssJ"><label class="sc-bjMMwc fUjfPA -depth2"><span type="post" class="sc-YtoFD FLoTo operation-type post">post</span><span tabindex="0" width="calc(100% - 38px)" class="sc-eIrltV jZTjzp">Refresh an access token</span></label></li><li tabindex="0" depth="2" data-item-id="tag/auth/operation/authLogout" role="menuitem" aria-label="Logout / revoke session tokens" aria-expanded="false" class="sc-vjKnv cVgssJ"><label class="sc-bjMMwc fUjfPA -depth2"><span type="post" class="sc-YtoFD FLoTo operation-type post">post</span><span tabindex="0" width="calc(100% - 38px)" class="sc-eIrltV jZTjzp">Logout / revoke session tokens</span></label></li></ul></li><li tabindex="0" depth="1" data-item-id="tag/users" role="menuitem" aria-label="users" aria-expanded="false" class="sc-vjKnv cVgssJ"><label class="sc-bjMMwc YJdNS -depth1"><span width="calc(100% - 38px)" title="users" class="sc-eIrltV jZTjzp">users</span><svg class="sc-fbJfz cNCXIL" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg></label><ul class="sc-imaUOy cjNZVC"><li tabindex="0" depth="2" data-item-id="tag/users/operation/getMe" role="menuitem" aria-label="Get current user profile" aria-expanded="false" class="sc-vjKnv cVgssJ"><label class="sc-bjMMwc fUjfPA -depth2"><span type="get" class="sc-YtoFD FLoTo operation-type get">get</span><span tabindex="0" width="calc(100% - 38px)" class="sc-eIrltV jZTjzp">Get current user profile</span></label></li></ul></li></ul><div class="sc-hAYhfO jKUIUi"><a target="_blank" rel="noopener noreferrer" href="https://redocly.com/redoc/">API docs by Redocly</a></div></div></div><div class="sc-kVmAmQ laYfRb"><div class="sc-iqavZh dKxKge"><svg class="" style="transform:translate(2px, -4px) rotate(180deg);transition:transform 0.2s ease" viewBox="0 0 926.23699 573.74994" version="1.1" x="0px" y="0px" width="15" height="15"><g transform="translate(904.92214,-879.1482)"><path d="
          m -673.67664,1221.6502 -231.2455,-231.24803 55.6165,
          -55.627 c 30.5891,-30.59485 56.1806,-55.627 56.8701,-55.627 0.6894,
          0 79.8637,78.60862 175.9427,174.68583 l 174.6892,174.6858 174.6892,
          -174.6858 c 96.079,-96.07721 175.253196,-174.68583 175.942696,
          -174.68583 0.6895,0 26.281,25.03215 56.8701,
          55.627 l 55.6165,55.627 -231.245496,231.24803 c -127.185,127.1864
          -231.5279,231.248 -231.873,231.248 -0.3451,0 -104.688,
          -104.0616 -231.873,-231.248 z
        " fill="currentColor"></path></g></svg><svg class="" style="transform:translate(2px, 4px);transition:transform 0.2s ease" viewBox="0 0 926.23699 573.74994" version="1.1" x="0px" y="0px" width="15" height="15"><g transform="translate(904.92214,-879.1482)"><path d="
          m -673.67664,1221.6502 -231.2455,-231.24803 55.6165,
          -55.627 c 30.5891,-30.59485 56.1806,-55.627 56.8701,-55.627 0.6894,
          0 79.8637,78.60862 175.9427,174.68583 l 174.6892,174.6858 174.6892,
          -174.6858 c 96.079,-96.07721 175.253196,-174.68583 175.942696,
          -174.68583 0.6895,0 26.281,25.03215 56.8701,
          55.627 l 55.6165,55.627 -231.245496,231.24803 c -127.185,127.1864
          -231.5279,231.248 -231.873,231.248 -0.3451,0 -104.688,
          -104.0616 -231.873,-231.248 z
        " fill="currentColor"></path></g></svg></div></div><div class="sc-juTflS gfWNtA api-content"><div class="sc-eDDNvO eTiIZG"><div class="sc-iAEyYj cmAaWK"><div class="sc-hLseeT hoYmkG api-info"><h1 class="sc-fsQipe sc-crPCXn ePkAIL bSStQp">Identity Backend Service API<!-- --> <span>(<!-- -->0.1.0<!-- -->)</span></h1><p>Download OpenAPI specification<!-- -->:</p><div class="sc-iKGpAq sc-cCYyou dXXcln dHaogz"></div><div data-role="redoc-summary" html="" class="sc-iKGpAq sc-cCYyou dXXcln dHaogz"></div><div data-role="redoc-description" html="&lt;p&gt;Backend-first identity API implemented with Netlify Functions.&lt;/p&gt;
&lt;p&gt;Notes:&lt;/p&gt;
&lt;ul&gt;
&lt;li&gt;This spec is the source of truth for the REST contract.&lt;/li&gt;
&lt;li&gt;Some endpoints are planned and may not be implemented yet.&lt;/li&gt;
&lt;/ul&gt;
" class="sc-iKGpAq sc-cCYyou dXXcln dHaogz"><p>Backend-first identity API implemented with Netlify Functions.</p>
<p>Notes:</p>
<ul>
<li>This spec is the source of truth for the REST contract.</li>
<li>Some endpoints are planned and may not be implemented yet.</li>
</ul>
</div></div></div></div><div id="tag/auth" data-section-id="tag/auth" class="sc-eDDNvO eTiIZG"><div class="sc-iAEyYj cmAaWK"><div class="sc-hLseeT hoYmkG"><h2 class="sc-qRumy bcNKdh"><a class="sc-csCMJq jSIqAu" href="#tag/auth" aria-label="tag/auth"></a>auth</h2></div></div><div class="sc-hLseeT eiTXyS"><div class="sc-iKGpAq sc-cCYyou dXXcln dHaogz redoc-markdown " html="&lt;p&gt;Authentication and session management&lt;/p&gt;
"><p>Authentication and session management</p>
</div></div></div><div id="tag/auth/operation/authLogin" data-section-id="tag/auth/operation/authLogin" class="sc-eDDNvO iUTsUN"><div data-section-id="operation/authLogin" id="operation/authLogin" class="sc-iAEyYj cmAaWK"><div class="sc-hLseeT hoYmkG"><h2 class="sc-qRumy bcNKdh"><a class="sc-csCMJq jSIqAu" href="#tag/auth/operation/authLogin" aria-label="tag/auth/operation/authLogin"></a>Login and create a session<!-- --> </h2><h5 class="sc-irTswZ fA-dGxt">Request Body schema: <span class="sc-gXSCqT bzXJk">application/json</span><div class="sc-gUrTyB sc-eKYjSU sc-dVCGSo bPAaet boAHLn iuCmqI">required</div></h5><div html="" class="sc-iKGpAq sc-cCYyou dXXcln dHaogz"></div><table class="sc-hIqOWV dybric"><tbody><tr class=""><td kind="field" title="username" class="sc-hAtEya sc-fGFwA-d kddqHa eIujjv"><span class="sc-ieZDjf bEKmDE"></span><span class="property-name">username</span><div class="sc-gUrTyB sc-eKYjSU bPAaet boAHLn">required</div></td><td class="sc-blLsxE bmauLr"><div><div><span class="sc-gUrTyB sc-kZGvTq bPAaet UMvzF"></span><span class="sc-gUrTyB sc-iMfspz bPAaet fEQrHJ">string</span></div> <div><div html="&lt;p&gt;Username/email used to authenticate.&lt;/p&gt;
" class="sc-iKGpAq sc-cCYyou dXXcln cFvDiF"><p>Username/email used to authenticate.</p>
</div></div></div></td></tr><tr class="last "><td kind="field" title="password" class="sc-hAtEya sc-fGFwA-d kddqHa eIujjv"><span class="sc-ieZDjf bEKmDE"></span><span class="property-name">password</span><div class="sc-gUrTyB sc-eKYjSU bPAaet boAHLn">required</div></td><td class="sc-blLsxE bmauLr"><div><div><span class="sc-gUrTyB sc-kZGvTq bPAaet UMvzF"></span><span class="sc-gUrTyB sc-iMfspz bPAaet fEQrHJ">string</span></div> <div><div html="&lt;p&gt;Password used to authenticate.&lt;/p&gt;
" class="sc-iKGpAq sc-cCYyou dXXcln cFvDiF"><p>Password used to authenticate.</p>
</div></div></div></td></tr></tbody></table><div><h3 class="sc-fJjTez hsJdXF">Responses</h3><div><button class="sc-caslwi brztng"><svg class="sc-fbJfz iZiZiV" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg><strong class="sc-fYaxgW jJkGwY">200<!-- --> </strong><div html="&lt;p&gt;Authenticated session and user profile.&lt;/p&gt;
" class="sc-iKGpAq sc-cCYyou sc-cjERFZ dXXcln fTBBlJ dkmSdy"><p>Authenticated session and user profile.</p>
</div></button></div><div><button class="sc-caslwi fvWYOy"><svg class="sc-fbJfz kiMFkB" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg><strong class="sc-fYaxgW jJkGwY">400<!-- --> </strong><div html="&lt;p&gt;Validation error.&lt;/p&gt;
" class="sc-iKGpAq sc-cCYyou sc-cjERFZ dXXcln fTBBlJ dkmSdy"><p>Validation error.</p>
</div></button></div><div><button class="sc-caslwi fvWYOy"><svg class="sc-fbJfz kiMFkB" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg><strong class="sc-fYaxgW jJkGwY">401<!-- --> </strong><div html="&lt;p&gt;Invalid credentials.&lt;/p&gt;
" class="sc-iKGpAq sc-cCYyou sc-cjERFZ dXXcln fTBBlJ dkmSdy"><p>Invalid credentials.</p>
</div></button></div><div><button class="sc-caslwi fvWYOy"><svg class="sc-fbJfz kiMFkB" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg><strong class="sc-fYaxgW jJkGwY">500<!-- --> </strong><div html="&lt;p&gt;Internal error.&lt;/p&gt;
" class="sc-iKGpAq sc-cCYyou sc-cjERFZ dXXcln fTBBlJ dkmSdy"><p>Internal error.</p>
</div></button></div></div></div><div class="sc-jTrPJt sc-gLDzao dVngAA fYLqku"><div class="sc-fYzRkH dHdMVa"><button class="sc-jYvNnh iWrBta"><span type="post" class="sc-eGFuAY ejslkd http-verb post">post</span><span class="sc-GJyyy dkiPkt">/auth-login</span><svg class="sc-fbJfz ivEQut" style="margin-right:-25px" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg></button><div aria-hidden="true" class="sc-fnxdBX dplsyJ"><div class="sc-llcuoK cNCbuV"><div html="" class="sc-iKGpAq sc-cCYyou dXXcln cFvDiF"></div><div tabindex="0" role="button"><div class="sc-jnsZEx eobUac"><span></span>/auth-login</div></div></div></div></div><div><h3 class="sc-kFuwaQ dEbuTz"> <!-- -->Request samples<!-- --> </h3><div class="sc-cyRfQY lbIFgo" data-rttabs="true"><ul class="react-tabs__tab-list" role="tablist"><li class="react-tabs__tab react-tabs__tab--selected" role="tab" id="tab_R_iicq_0" aria-selected="true" aria-disabled="false" aria-controls="panel_R_iicq_0" tabindex="0" data-rttab="true">Payload</li></ul><div class="react-tabs__tab-panel react-tabs__tab-panel--selected" role="tabpanel" id="panel_R_iicq_0" aria-labelledby="tab_R_iicq_0"><div><div class="sc-cPlDXk gpxHhK"><span class="sc-bCDidX ccmcKc">Content type</span><div class="sc-dQelHO eMpCUl">application/json</div></div><div class="sc-hVkBjf ksuOBo"><div class="sc-cRZddz iLjyyA"><div class="sc-gjTGSz btblAa"><button><div class="sc-jegxcw fJsoyS">Copy</div></button></div><div tabindex="0" class="sc-iKGpAq dXXcln sc-jMAIzW jKIGwd"><div class="redoc-json"><code><button class="collapser" aria-label="collapse"></button><span class="token punctuation">{</span><span class="ellipsis"></span><ul class="obj collapsible"><li><div class="hoverable "><span class="property token string">"username"</span>: <span class="token string">&quot;demo&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable "><span class="property token string">"password"</span>: <span class="token string">&quot;letmein&quot;</span></div></li></ul><span class="token punctuation">}</span></code></div></div></div></div></div></div></div></div><div><h3 class="sc-kFuwaQ dEbuTz"> <!-- -->Response samples<!-- --> </h3><div class="sc-cyRfQY lbIFgo" data-rttabs="true"><ul class="react-tabs__tab-list" role="tablist"><li class="tab-success react-tabs__tab--selected" role="tab" id="tab_R_jicq_0" aria-selected="true" aria-disabled="false" aria-controls="panel_R_jicq_0" tabindex="0" data-rttab="true">200</li><li class="tab-error" role="tab" id="tab_R_jicq_1" aria-selected="false" aria-disabled="false" aria-controls="panel_R_jicq_1" data-rttab="true">400</li><li class="tab-error" role="tab" id="tab_R_jicq_2" aria-selected="false" aria-disabled="false" aria-controls="panel_R_jicq_2" data-rttab="true">401</li><li class="tab-error" role="tab" id="tab_R_jicq_3" aria-selected="false" aria-disabled="false" aria-controls="panel_R_jicq_3" data-rttab="true">500</li></ul><div class="react-tabs__tab-panel react-tabs__tab-panel--selected" role="tabpanel" id="panel_R_jicq_0" aria-labelledby="tab_R_jicq_0"><div><div class="sc-cPlDXk gpxHhK"><span class="sc-bCDidX ccmcKc">Content type</span><div class="sc-dQelHO eMpCUl">application/json</div></div><div class="sc-hVkBjf ksuOBo"><div class="sc-cRZddz iLjyyA"><div class="sc-gjTGSz btblAa"><button><div class="sc-jegxcw fJsoyS">Copy</div></button><button> Expand all </button><button> Collapse all </button></div><div tabindex="0" class="sc-iKGpAq dXXcln sc-jMAIzW jKIGwd"><div class="redoc-json"><code><button class="collapser" aria-label="collapse"></button><span class="token punctuation">{</span><span class="ellipsis"></span><ul class="obj collapsible"><li><div class="hoverable "><span class="property token string">"provider"</span>: <span class="token string">&quot;fake&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable "><span class="property token string">"session"</span>: <button class="collapser" aria-label="collapse"></button><span class="token punctuation">{</span><span class="ellipsis"></span><ul class="obj collapsible"><li><div class="hoverable collapsed"><span class="property token string">"accessToken"</span>: <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable collapsed"><span class="property token string">"tokenType"</span>: <span class="token string">&quot;Bearer&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable collapsed"><span class="property token string">"expiresAt"</span>: <span class="token string">&quot;2026-03-02T12:34:56.000Z&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable collapsed"><span class="property token string">"refreshToken"</span>: <span class="token string">&quot;string&quot;</span></div></li></ul><span class="token punctuation">}</span><span class="token punctuation">,</span></div></li><li><div class="hoverable "><span class="property token string">"user"</span>: <button class="collapser" aria-label="collapse"></button><span class="token punctuation">{</span><span class="ellipsis"></span><ul class="obj collapsible"><li><div class="hoverable collapsed"><span class="property token string">"id"</span>: <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable collapsed"><span class="property token string">"email"</span>: <span class="token string">&quot;user@example.com&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable collapsed"><span class="property token string">"displayName"</span>: <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable collapsed"><span class="property token string">"roles"</span>: <button class="collapser" aria-label="expand"></button><span class="token punctuation">[</span><span class="ellipsis"></span><ul class="array collapsible"><li><div class="hoverable collapsed"><span class="token string">&quot;string&quot;</span></div></li></ul><span class="token punctuation">]</span></div></li></ul><span class="token punctuation">}</span></div></li></ul><span class="token punctuation">}</span></code></div></div></div></div></div></div><div class="react-tabs__tab-panel" role="tabpanel" id="panel_R_jicq_1" aria-labelledby="tab_R_jicq_1"></div><div class="react-tabs__tab-panel" role="tabpanel" id="panel_R_jicq_2" aria-labelledby="tab_R_jicq_2"></div><div class="react-tabs__tab-panel" role="tabpanel" id="panel_R_jicq_3" aria-labelledby="tab_R_jicq_3"></div></div></div></div></div></div><div id="tag/auth/operation/authRegister" data-section-id="tag/auth/operation/authRegister" class="sc-eDDNvO iUTsUN"><div data-section-id="operation/authRegister" id="operation/authRegister" class="sc-iAEyYj cmAaWK"><div class="sc-hLseeT hoYmkG"><h2 class="sc-qRumy bcNKdh"><a class="sc-csCMJq jSIqAu" href="#tag/auth/operation/authRegister" aria-label="tag/auth/operation/authRegister"></a>Register a new user and create a session<!-- --> </h2><div class="sc-iERabE dUdgLx"><div html="&lt;p&gt;Planned endpoint. When implemented, should create a new user and return an authenticated session.&lt;/p&gt;
" class="sc-iKGpAq sc-cCYyou dXXcln dHaogz"><p>Planned endpoint. When implemented, should create a new user and return an authenticated session.</p>
</div></div><h5 class="sc-irTswZ fA-dGxt">Request Body schema: <span class="sc-gXSCqT bzXJk">application/json</span><div class="sc-gUrTyB sc-eKYjSU sc-dVCGSo bPAaet boAHLn iuCmqI">required</div></h5><div html="" class="sc-iKGpAq sc-cCYyou dXXcln dHaogz"></div><table class="sc-hIqOWV dybric"><tbody><tr class=""><td kind="field" title="email" class="sc-hAtEya sc-fGFwA-d kddqHa eIujjv"><span class="sc-ieZDjf bEKmDE"></span><span class="property-name">email</span><div class="sc-gUrTyB sc-eKYjSU bPAaet boAHLn">required</div></td><td class="sc-blLsxE bmauLr"><div><div><span class="sc-gUrTyB sc-kZGvTq bPAaet UMvzF"></span><span class="sc-gUrTyB sc-iMfspz bPAaet fEQrHJ">string</span><span class="sc-gUrTyB sc-iMfspz bPAaet fEQrHJ"> <!-- -->&lt;<!-- -->email<!-- -->&gt;<!-- --> </span></div> <div><div html="" class="sc-iKGpAq sc-cCYyou dXXcln cFvDiF"></div></div></div></td></tr><tr class=""><td kind="field" title="password" class="sc-hAtEya sc-fGFwA-d kddqHa eIujjv"><span class="sc-ieZDjf bEKmDE"></span><span class="property-name">password</span><div class="sc-gUrTyB sc-eKYjSU bPAaet boAHLn">required</div></td><td class="sc-blLsxE bmauLr"><div><div><span class="sc-gUrTyB sc-kZGvTq bPAaet UMvzF"></span><span class="sc-gUrTyB sc-iMfspz bPAaet fEQrHJ">string</span></div> <div><div html="" class="sc-iKGpAq sc-cCYyou dXXcln cFvDiF"></div></div></div></td></tr><tr class="last "><td kind="field" title="displayName" class="sc-hAtEya sc-fGFwA-d kddqHa eIujjv"><span class="sc-ieZDjf bEKmDE"></span><span class="property-name">displayName</span></td><td class="sc-blLsxE bmauLr"><div><div><span class="sc-gUrTyB sc-kZGvTq bPAaet UMvzF"></span><span class="sc-gUrTyB sc-iMfspz bPAaet fEQrHJ">string</span></div> <div><div html="" class="sc-iKGpAq sc-cCYyou dXXcln cFvDiF"></div></div></div></td></tr></tbody></table><div><h3 class="sc-fJjTez hsJdXF">Responses</h3><div><button class="sc-caslwi brztng"><svg class="sc-fbJfz iZiZiV" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg><strong class="sc-fYaxgW jJkGwY">201<!-- --> </strong><div html="&lt;p&gt;User created and session issued.&lt;/p&gt;
" class="sc-iKGpAq sc-cCYyou sc-cjERFZ dXXcln fTBBlJ dkmSdy"><p>User created and session issued.</p>
</div></button></div><div><button class="sc-caslwi fvWYOy"><svg class="sc-fbJfz kiMFkB" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg><strong class="sc-fYaxgW jJkGwY">400<!-- --> </strong><div html="&lt;p&gt;Validation error.&lt;/p&gt;
" class="sc-iKGpAq sc-cCYyou sc-cjERFZ dXXcln fTBBlJ dkmSdy"><p>Validation error.</p>
</div></button></div><div><button class="sc-caslwi fvWYOy"><svg class="sc-fbJfz kiMFkB" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg><strong class="sc-fYaxgW jJkGwY">409<!-- --> </strong><div html="&lt;p&gt;Email already exists.&lt;/p&gt;
" class="sc-iKGpAq sc-cCYyou sc-cjERFZ dXXcln fTBBlJ dkmSdy"><p>Email already exists.</p>
</div></button></div><div><button class="sc-caslwi fvWYOy"><svg class="sc-fbJfz kiMFkB" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg><strong class="sc-fYaxgW jJkGwY">500<!-- --> </strong><div html="&lt;p&gt;Internal error.&lt;/p&gt;
" class="sc-iKGpAq sc-cCYyou sc-cjERFZ dXXcln fTBBlJ dkmSdy"><p>Internal error.</p>
</div></button></div></div></div><div class="sc-jTrPJt sc-gLDzao dVngAA fYLqku"><div class="sc-fYzRkH dHdMVa"><button class="sc-jYvNnh iWrBta"><span type="post" class="sc-eGFuAY ejslkd http-verb post">post</span><span class="sc-GJyyy dkiPkt">/auth-register</span><svg class="sc-fbJfz ivEQut" style="margin-right:-25px" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg></button><div aria-hidden="true" class="sc-fnxdBX dplsyJ"><div class="sc-llcuoK cNCbuV"><div html="" class="sc-iKGpAq sc-cCYyou dXXcln cFvDiF"></div><div tabindex="0" role="button"><div class="sc-jnsZEx eobUac"><span></span>/auth-register</div></div></div></div></div><div><h3 class="sc-kFuwaQ dEbuTz"> <!-- -->Request samples<!-- --> </h3><div class="sc-cyRfQY lbIFgo" data-rttabs="true"><ul class="react-tabs__tab-list" role="tablist"><li class="react-tabs__tab react-tabs__tab--selected" role="tab" id="tab_R_iikq_0" aria-selected="true" aria-disabled="false" aria-controls="panel_R_iikq_0" tabindex="0" data-rttab="true">Payload</li></ul><div class="react-tabs__tab-panel react-tabs__tab-panel--selected" role="tabpanel" id="panel_R_iikq_0" aria-labelledby="tab_R_iikq_0"><div><div class="sc-cPlDXk gpxHhK"><span class="sc-bCDidX ccmcKc">Content type</span><div class="sc-dQelHO eMpCUl">application/json</div></div><div class="sc-hVkBjf ksuOBo"><div class="sc-cRZddz iLjyyA"><div class="sc-gjTGSz btblAa"><button><div class="sc-jegxcw fJsoyS">Copy</div></button></div><div tabindex="0" class="sc-iKGpAq dXXcln sc-jMAIzW jKIGwd"><div class="redoc-json"><code><button class="collapser" aria-label="collapse"></button><span class="token punctuation">{</span><span class="ellipsis"></span><ul class="obj collapsible"><li><div class="hoverable "><span class="property token string">"email"</span>: <span class="token string">&quot;user@example.com&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable "><span class="property token string">"password"</span>: <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable "><span class="property token string">"displayName"</span>: <span class="token string">&quot;string&quot;</span></div></li></ul><span class="token punctuation">}</span></code></div></div></div></div></div></div></div></div><div><h3 class="sc-kFuwaQ dEbuTz"> <!-- -->Response samples<!-- --> </h3><div class="sc-cyRfQY lbIFgo" data-rttabs="true"><ul class="react-tabs__tab-list" role="tablist"><li class="tab-success react-tabs__tab--selected" role="tab" id="tab_R_jikq_0" aria-selected="true" aria-disabled="false" aria-controls="panel_R_jikq_0" tabindex="0" data-rttab="true">201</li><li class="tab-error" role="tab" id="tab_R_jikq_1" aria-selected="false" aria-disabled="false" aria-controls="panel_R_jikq_1" data-rttab="true">400</li><li class="tab-error" role="tab" id="tab_R_jikq_2" aria-selected="false" aria-disabled="false" aria-controls="panel_R_jikq_2" data-rttab="true">409</li><li class="tab-error" role="tab" id="tab_R_jikq_3" aria-selected="false" aria-disabled="false" aria-controls="panel_R_jikq_3" data-rttab="true">500</li></ul><div class="react-tabs__tab-panel react-tabs__tab-panel--selected" role="tabpanel" id="panel_R_jikq_0" aria-labelledby="tab_R_jikq_0"><div><div class="sc-cPlDXk gpxHhK"><span class="sc-bCDidX ccmcKc">Content type</span><div class="sc-dQelHO eMpCUl">application/json</div></div><div class="sc-hVkBjf ksuOBo"><div class="sc-cRZddz iLjyyA"><div class="sc-gjTGSz btblAa"><button><div class="sc-jegxcw fJsoyS">Copy</div></button><button> Expand all </button><button> Collapse all </button></div><div tabindex="0" class="sc-iKGpAq dXXcln sc-jMAIzW jKIGwd"><div class="redoc-json"><code><button class="collapser" aria-label="collapse"></button><span class="token punctuation">{</span><span class="ellipsis"></span><ul class="obj collapsible"><li><div class="hoverable "><span class="property token string">"provider"</span>: <span class="token string">&quot;fake&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable "><span class="property token string">"session"</span>: <button class="collapser" aria-label="collapse"></button><span class="token punctuation">{</span><span class="ellipsis"></span><ul class="obj collapsible"><li><div class="hoverable collapsed"><span class="property token string">"accessToken"</span>: <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable collapsed"><span class="property token string">"tokenType"</span>: <span class="token string">&quot;Bearer&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable collapsed"><span class="property token string">"expiresAt"</span>: <span class="token string">&quot;2026-03-02T12:34:56.000Z&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable collapsed"><span class="property token string">"refreshToken"</span>: <span class="token string">&quot;string&quot;</span></div></li></ul><span class="token punctuation">}</span><span class="token punctuation">,</span></div></li><li><div class="hoverable "><span class="property token string">"user"</span>: <button class="collapser" aria-label="collapse"></button><span class="token punctuation">{</span><span class="ellipsis"></span><ul class="obj collapsible"><li><div class="hoverable collapsed"><span class="property token string">"id"</span>: <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable collapsed"><span class="property token string">"email"</span>: <span class="token string">&quot;user@example.com&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable collapsed"><span class="property token string">"displayName"</span>: <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable collapsed"><span class="property token string">"roles"</span>: <button class="collapser" aria-label="expand"></button><span class="token punctuation">[</span><span class="ellipsis"></span><ul class="array collapsible"><li><div class="hoverable collapsed"><span class="token string">&quot;string&quot;</span></div></li></ul><span class="token punctuation">]</span></div></li></ul><span class="token punctuation">}</span></div></li></ul><span class="token punctuation">}</span></code></div></div></div></div></div></div><div class="react-tabs__tab-panel" role="tabpanel" id="panel_R_jikq_1" aria-labelledby="tab_R_jikq_1"></div><div class="react-tabs__tab-panel" role="tabpanel" id="panel_R_jikq_2" aria-labelledby="tab_R_jikq_2"></div><div class="react-tabs__tab-panel" role="tabpanel" id="panel_R_jikq_3" aria-labelledby="tab_R_jikq_3"></div></div></div></div></div></div><div id="tag/auth/operation/authRefresh" data-section-id="tag/auth/operation/authRefresh" class="sc-eDDNvO iUTsUN"><div data-section-id="operation/authRefresh" id="operation/authRefresh" class="sc-iAEyYj cmAaWK"><div class="sc-hLseeT hoYmkG"><h2 class="sc-qRumy bcNKdh"><a class="sc-csCMJq jSIqAu" href="#tag/auth/operation/authRefresh" aria-label="tag/auth/operation/authRefresh"></a>Refresh an access token<!-- --> </h2><div class="sc-iERabE dUdgLx"><div html="&lt;p&gt;Planned endpoint. When implemented, should validate the refresh token and return a new session payload.&lt;/p&gt;
" class="sc-iKGpAq sc-cCYyou dXXcln dHaogz"><p>Planned endpoint. When implemented, should validate the refresh token and return a new session payload.</p>
</div></div><h5 class="sc-irTswZ fA-dGxt">Request Body schema: <span class="sc-gXSCqT bzXJk">application/json</span><div class="sc-gUrTyB sc-eKYjSU sc-dVCGSo bPAaet boAHLn iuCmqI">required</div></h5><div html="" class="sc-iKGpAq sc-cCYyou dXXcln dHaogz"></div><table class="sc-hIqOWV dybric"><tbody><tr class="last "><td kind="field" title="refreshToken" class="sc-hAtEya sc-fGFwA-d kddqHa eIujjv"><span class="sc-ieZDjf bEKmDE"></span><span class="property-name">refreshToken</span><div class="sc-gUrTyB sc-eKYjSU bPAaet boAHLn">required</div></td><td class="sc-blLsxE bmauLr"><div><div><span class="sc-gUrTyB sc-kZGvTq bPAaet UMvzF"></span><span class="sc-gUrTyB sc-iMfspz bPAaet fEQrHJ">string</span></div> <div><div html="" class="sc-iKGpAq sc-cCYyou dXXcln cFvDiF"></div></div></div></td></tr></tbody></table><div><h3 class="sc-fJjTez hsJdXF">Responses</h3><div><button class="sc-caslwi brztng"><svg class="sc-fbJfz iZiZiV" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg><strong class="sc-fYaxgW jJkGwY">200<!-- --> </strong><div html="&lt;p&gt;New session issued.&lt;/p&gt;
" class="sc-iKGpAq sc-cCYyou sc-cjERFZ dXXcln fTBBlJ dkmSdy"><p>New session issued.</p>
</div></button></div><div><button class="sc-caslwi fvWYOy"><svg class="sc-fbJfz kiMFkB" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg><strong class="sc-fYaxgW jJkGwY">400<!-- --> </strong><div html="&lt;p&gt;Validation error.&lt;/p&gt;
" class="sc-iKGpAq sc-cCYyou sc-cjERFZ dXXcln fTBBlJ dkmSdy"><p>Validation error.</p>
</div></button></div><div><button class="sc-caslwi fvWYOy"><svg class="sc-fbJfz kiMFkB" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg><strong class="sc-fYaxgW jJkGwY">401<!-- --> </strong><div html="&lt;p&gt;Invalid or expired refresh token.&lt;/p&gt;
" class="sc-iKGpAq sc-cCYyou sc-cjERFZ dXXcln fTBBlJ dkmSdy"><p>Invalid or expired refresh token.</p>
</div></button></div><div><button class="sc-caslwi fvWYOy"><svg class="sc-fbJfz kiMFkB" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg><strong class="sc-fYaxgW jJkGwY">500<!-- --> </strong><div html="&lt;p&gt;Internal error.&lt;/p&gt;
" class="sc-iKGpAq sc-cCYyou sc-cjERFZ dXXcln fTBBlJ dkmSdy"><p>Internal error.</p>
</div></button></div></div></div><div class="sc-jTrPJt sc-gLDzao dVngAA fYLqku"><div class="sc-fYzRkH dHdMVa"><button class="sc-jYvNnh iWrBta"><span type="post" class="sc-eGFuAY ejslkd http-verb post">post</span><span class="sc-GJyyy dkiPkt">/auth-refresh</span><svg class="sc-fbJfz ivEQut" style="margin-right:-25px" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg></button><div aria-hidden="true" class="sc-fnxdBX dplsyJ"><div class="sc-llcuoK cNCbuV"><div html="" class="sc-iKGpAq sc-cCYyou dXXcln cFvDiF"></div><div tabindex="0" role="button"><div class="sc-jnsZEx eobUac"><span></span>/auth-refresh</div></div></div></div></div><div><h3 class="sc-kFuwaQ dEbuTz"> <!-- -->Request samples<!-- --> </h3><div class="sc-cyRfQY lbIFgo" data-rttabs="true"><ul class="react-tabs__tab-list" role="tablist"><li class="react-tabs__tab react-tabs__tab--selected" role="tab" id="tab_R_iisq_0" aria-selected="true" aria-disabled="false" aria-controls="panel_R_iisq_0" tabindex="0" data-rttab="true">Payload</li></ul><div class="react-tabs__tab-panel react-tabs__tab-panel--selected" role="tabpanel" id="panel_R_iisq_0" aria-labelledby="tab_R_iisq_0"><div><div class="sc-cPlDXk gpxHhK"><span class="sc-bCDidX ccmcKc">Content type</span><div class="sc-dQelHO eMpCUl">application/json</div></div><div class="sc-hVkBjf ksuOBo"><div class="sc-cRZddz iLjyyA"><div class="sc-gjTGSz btblAa"><button><div class="sc-jegxcw fJsoyS">Copy</div></button></div><div tabindex="0" class="sc-iKGpAq dXXcln sc-jMAIzW jKIGwd"><div class="redoc-json"><code><button class="collapser" aria-label="collapse"></button><span class="token punctuation">{</span><span class="ellipsis"></span><ul class="obj collapsible"><li><div class="hoverable "><span class="property token string">"refreshToken"</span>: <span class="token string">&quot;string&quot;</span></div></li></ul><span class="token punctuation">}</span></code></div></div></div></div></div></div></div></div><div><h3 class="sc-kFuwaQ dEbuTz"> <!-- -->Response samples<!-- --> </h3><div class="sc-cyRfQY lbIFgo" data-rttabs="true"><ul class="react-tabs__tab-list" role="tablist"><li class="tab-success react-tabs__tab--selected" role="tab" id="tab_R_jisq_0" aria-selected="true" aria-disabled="false" aria-controls="panel_R_jisq_0" tabindex="0" data-rttab="true">200</li><li class="tab-error" role="tab" id="tab_R_jisq_1" aria-selected="false" aria-disabled="false" aria-controls="panel_R_jisq_1" data-rttab="true">400</li><li class="tab-error" role="tab" id="tab_R_jisq_2" aria-selected="false" aria-disabled="false" aria-controls="panel_R_jisq_2" data-rttab="true">401</li><li class="tab-error" role="tab" id="tab_R_jisq_3" aria-selected="false" aria-disabled="false" aria-controls="panel_R_jisq_3" data-rttab="true">500</li></ul><div class="react-tabs__tab-panel react-tabs__tab-panel--selected" role="tabpanel" id="panel_R_jisq_0" aria-labelledby="tab_R_jisq_0"><div><div class="sc-cPlDXk gpxHhK"><span class="sc-bCDidX ccmcKc">Content type</span><div class="sc-dQelHO eMpCUl">application/json</div></div><div class="sc-hVkBjf ksuOBo"><div class="sc-cRZddz iLjyyA"><div class="sc-gjTGSz btblAa"><button><div class="sc-jegxcw fJsoyS">Copy</div></button><button> Expand all </button><button> Collapse all </button></div><div tabindex="0" class="sc-iKGpAq dXXcln sc-jMAIzW jKIGwd"><div class="redoc-json"><code><button class="collapser" aria-label="collapse"></button><span class="token punctuation">{</span><span class="ellipsis"></span><ul class="obj collapsible"><li><div class="hoverable "><span class="property token string">"provider"</span>: <span class="token string">&quot;fake&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable "><span class="property token string">"session"</span>: <button class="collapser" aria-label="collapse"></button><span class="token punctuation">{</span><span class="ellipsis"></span><ul class="obj collapsible"><li><div class="hoverable collapsed"><span class="property token string">"accessToken"</span>: <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable collapsed"><span class="property token string">"tokenType"</span>: <span class="token string">&quot;Bearer&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable collapsed"><span class="property token string">"expiresAt"</span>: <span class="token string">&quot;2026-03-02T12:34:56.000Z&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable collapsed"><span class="property token string">"refreshToken"</span>: <span class="token string">&quot;string&quot;</span></div></li></ul><span class="token punctuation">}</span><span class="token punctuation">,</span></div></li><li><div class="hoverable "><span class="property token string">"user"</span>: <button class="collapser" aria-label="collapse"></button><span class="token punctuation">{</span><span class="ellipsis"></span><ul class="obj collapsible"><li><div class="hoverable collapsed"><span class="property token string">"id"</span>: <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable collapsed"><span class="property token string">"email"</span>: <span class="token string">&quot;user@example.com&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable collapsed"><span class="property token string">"displayName"</span>: <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable collapsed"><span class="property token string">"roles"</span>: <button class="collapser" aria-label="expand"></button><span class="token punctuation">[</span><span class="ellipsis"></span><ul class="array collapsible"><li><div class="hoverable collapsed"><span class="token string">&quot;string&quot;</span></div></li></ul><span class="token punctuation">]</span></div></li></ul><span class="token punctuation">}</span></div></li></ul><span class="token punctuation">}</span></code></div></div></div></div></div></div><div class="react-tabs__tab-panel" role="tabpanel" id="panel_R_jisq_1" aria-labelledby="tab_R_jisq_1"></div><div class="react-tabs__tab-panel" role="tabpanel" id="panel_R_jisq_2" aria-labelledby="tab_R_jisq_2"></div><div class="react-tabs__tab-panel" role="tabpanel" id="panel_R_jisq_3" aria-labelledby="tab_R_jisq_3"></div></div></div></div></div></div><div id="tag/auth/operation/authLogout" data-section-id="tag/auth/operation/authLogout" class="sc-eDDNvO iUTsUN"><div data-section-id="operation/authLogout" id="operation/authLogout" class="sc-iAEyYj cmAaWK"><div class="sc-hLseeT hoYmkG"><h2 class="sc-qRumy bcNKdh"><a class="sc-csCMJq jSIqAu" href="#tag/auth/operation/authLogout" aria-label="tag/auth/operation/authLogout"></a>Logout / revoke session tokens<!-- --> </h2><div class="sc-iERabE dUdgLx"><div html="&lt;p&gt;Planned endpoint. When implemented, should revoke refresh token(s) if supported by the provider.&lt;/p&gt;
" class="sc-iKGpAq sc-cCYyou dXXcln dHaogz"><p>Planned endpoint. When implemented, should revoke refresh token(s) if supported by the provider.</p>
</div></div><div class="sc-ftWlEC pzAgN"><div class="sc-cYRmzp kuPPCO"><h5 class="sc-irTswZ sc-jOQpHb fA-dGxt qtYpT">Authorizations:</h5><svg class="sc-fbJfz eiOVYa" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg></div><div class="sc-jTsRVM gZngKQ"><span class="sc-dskThK ddMcul"><span class="sc-hNeXkj cLOXvd"><i>bearerAuth</i></span></span></div></div><h5 class="sc-irTswZ fA-dGxt">Request Body schema: <span class="sc-gXSCqT bzXJk">application/json</span><div class="sc-hsiEir bmNzFc">optional</div></h5><div html="" class="sc-iKGpAq sc-cCYyou dXXcln dHaogz"></div><table class="sc-hIqOWV dybric"><tbody><tr class="last "><td kind="field" title="refreshToken" class="sc-hAtEya sc-fGFwA-d kddqHa eIujjv"><span class="sc-ieZDjf bEKmDE"></span><span class="property-name">refreshToken</span></td><td class="sc-blLsxE bmauLr"><div><div><span class="sc-gUrTyB sc-kZGvTq bPAaet UMvzF"></span><span class="sc-gUrTyB sc-iMfspz bPAaet fEQrHJ">string</span></div> <div><div html="&lt;p&gt;Optional refresh token to revoke, if applicable.&lt;/p&gt;
" class="sc-iKGpAq sc-cCYyou dXXcln cFvDiF"><p>Optional refresh token to revoke, if applicable.</p>
</div></div></div></td></tr></tbody></table><div><h3 class="sc-fJjTez hsJdXF">Responses</h3><div><button class="sc-caslwi gQivdi" disabled=""><strong class="sc-fYaxgW jJkGwY">204<!-- --> </strong><div html="&lt;p&gt;Logged out.&lt;/p&gt;
" class="sc-iKGpAq sc-cCYyou sc-cjERFZ dXXcln fTBBlJ dkmSdy"><p>Logged out.</p>
</div></button></div><div><button class="sc-caslwi fvWYOy"><svg class="sc-fbJfz kiMFkB" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg><strong class="sc-fYaxgW jJkGwY">400<!-- --> </strong><div html="&lt;p&gt;Validation error.&lt;/p&gt;
" class="sc-iKGpAq sc-cCYyou sc-cjERFZ dXXcln fTBBlJ dkmSdy"><p>Validation error.</p>
</div></button></div><div><button class="sc-caslwi fvWYOy"><svg class="sc-fbJfz kiMFkB" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg><strong class="sc-fYaxgW jJkGwY">401<!-- --> </strong><div html="&lt;p&gt;Missing or invalid access token.&lt;/p&gt;
" class="sc-iKGpAq sc-cCYyou sc-cjERFZ dXXcln fTBBlJ dkmSdy"><p>Missing or invalid access token.</p>
</div></button></div><div><button class="sc-caslwi fvWYOy"><svg class="sc-fbJfz kiMFkB" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg><strong class="sc-fYaxgW jJkGwY">500<!-- --> </strong><div html="&lt;p&gt;Internal error.&lt;/p&gt;
" class="sc-iKGpAq sc-cCYyou sc-cjERFZ dXXcln fTBBlJ dkmSdy"><p>Internal error.</p>
</div></button></div></div></div><div class="sc-jTrPJt sc-gLDzao dVngAA fYLqku"><div class="sc-fYzRkH dHdMVa"><button class="sc-jYvNnh iWrBta"><span type="post" class="sc-eGFuAY ejslkd http-verb post">post</span><span class="sc-GJyyy dkiPkt">/auth-logout</span><svg class="sc-fbJfz ivEQut" style="margin-right:-25px" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg></button><div aria-hidden="true" class="sc-fnxdBX dplsyJ"><div class="sc-llcuoK cNCbuV"><div html="" class="sc-iKGpAq sc-cCYyou dXXcln cFvDiF"></div><div tabindex="0" role="button"><div class="sc-jnsZEx eobUac"><span></span>/auth-logout</div></div></div></div></div><div><h3 class="sc-kFuwaQ dEbuTz"> <!-- -->Request samples<!-- --> </h3><div class="sc-cyRfQY lbIFgo" data-rttabs="true"><ul class="react-tabs__tab-list" role="tablist"><li class="react-tabs__tab react-tabs__tab--selected" role="tab" id="tab_R_ij4q_0" aria-selected="true" aria-disabled="false" aria-controls="panel_R_ij4q_0" tabindex="0" data-rttab="true">Payload</li></ul><div class="react-tabs__tab-panel react-tabs__tab-panel--selected" role="tabpanel" id="panel_R_ij4q_0" aria-labelledby="tab_R_ij4q_0"><div><div class="sc-cPlDXk gpxHhK"><span class="sc-bCDidX ccmcKc">Content type</span><div class="sc-dQelHO eMpCUl">application/json</div></div><div class="sc-hVkBjf ksuOBo"><div class="sc-cRZddz iLjyyA"><div class="sc-gjTGSz btblAa"><button><div class="sc-jegxcw fJsoyS">Copy</div></button></div><div tabindex="0" class="sc-iKGpAq dXXcln sc-jMAIzW jKIGwd"><div class="redoc-json"><code><button class="collapser" aria-label="collapse"></button><span class="token punctuation">{</span><span class="ellipsis"></span><ul class="obj collapsible"><li><div class="hoverable "><span class="property token string">"refreshToken"</span>: <span class="token string">&quot;string&quot;</span></div></li></ul><span class="token punctuation">}</span></code></div></div></div></div></div></div></div></div><div><h3 class="sc-kFuwaQ dEbuTz"> <!-- -->Response samples<!-- --> </h3><div class="sc-cyRfQY lbIFgo" data-rttabs="true"><ul class="react-tabs__tab-list" role="tablist"><li class="tab-error react-tabs__tab--selected" role="tab" id="tab_R_jj4q_0" aria-selected="true" aria-disabled="false" aria-controls="panel_R_jj4q_0" tabindex="0" data-rttab="true">400</li><li class="tab-error" role="tab" id="tab_R_jj4q_1" aria-selected="false" aria-disabled="false" aria-controls="panel_R_jj4q_1" data-rttab="true">401</li><li class="tab-error" role="tab" id="tab_R_jj4q_2" aria-selected="false" aria-disabled="false" aria-controls="panel_R_jj4q_2" data-rttab="true">500</li></ul><div class="react-tabs__tab-panel react-tabs__tab-panel--selected" role="tabpanel" id="panel_R_jj4q_0" aria-labelledby="tab_R_jj4q_0"><div><div class="sc-cPlDXk gpxHhK"><span class="sc-bCDidX ccmcKc">Content type</span><div class="sc-dQelHO eMpCUl">application/json</div></div><div class="sc-hVkBjf ksuOBo"><div class="sc-cRZddz iLjyyA"><div class="sc-gjTGSz btblAa"><button><div class="sc-jegxcw fJsoyS">Copy</div></button><button> Expand all </button><button> Collapse all </button></div><div tabindex="0" class="sc-iKGpAq dXXcln sc-jMAIzW jKIGwd"><div class="redoc-json"><code><button class="collapser" aria-label="collapse"></button><span class="token punctuation">{</span><span class="ellipsis"></span><ul class="obj collapsible"><li><div class="hoverable "><span class="property token string">"error"</span>: <button class="collapser" aria-label="collapse"></button><span class="token punctuation">{</span><span class="ellipsis"></span><ul class="obj collapsible"><li><div class="hoverable collapsed"><span class="property token string">"code"</span>: <span class="token string">&quot;UNAUTHORIZED&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable collapsed"><span class="property token string">"message"</span>: <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable collapsed"><span class="property token string">"details"</span>: <span class="token keyword">null</span></div></li></ul><span class="token punctuation">}</span></div></li></ul><span class="token punctuation">}</span></code></div></div></div></div></div></div><div class="react-tabs__tab-panel" role="tabpanel" id="panel_R_jj4q_1" aria-labelledby="tab_R_jj4q_1"></div><div class="react-tabs__tab-panel" role="tabpanel" id="panel_R_jj4q_2" aria-labelledby="tab_R_jj4q_2"></div></div></div></div></div></div><div id="tag/users" data-section-id="tag/users" class="sc-eDDNvO eTiIZG"><div class="sc-iAEyYj cmAaWK"><div class="sc-hLseeT hoYmkG"><h2 class="sc-qRumy bcNKdh"><a class="sc-csCMJq jSIqAu" href="#tag/users" aria-label="tag/users"></a>users</h2></div></div><div class="sc-hLseeT eiTXyS"><div class="sc-iKGpAq sc-cCYyou dXXcln dHaogz redoc-markdown " html="&lt;p&gt;User registration and profile&lt;/p&gt;
"><p>User registration and profile</p>
</div></div></div><div id="tag/users/operation/getMe" data-section-id="tag/users/operation/getMe" class="sc-eDDNvO iUTsUN"><div data-section-id="operation/getMe" id="operation/getMe" class="sc-iAEyYj cmAaWK"><div class="sc-hLseeT hoYmkG"><h2 class="sc-qRumy bcNKdh"><a class="sc-csCMJq jSIqAu" href="#tag/users/operation/getMe" aria-label="tag/users/operation/getMe"></a>Get current user profile<!-- --> </h2><div class="sc-ftWlEC pzAgN"><div class="sc-cYRmzp kuPPCO"><h5 class="sc-irTswZ sc-jOQpHb fA-dGxt qtYpT">Authorizations:</h5><svg class="sc-fbJfz eiOVYa" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg></div><div class="sc-jTsRVM gZngKQ"><span class="sc-dskThK ddMcul"><span class="sc-hNeXkj cLOXvd"><i>bearerAuth</i></span></span></div></div><div><h3 class="sc-fJjTez hsJdXF">Responses</h3><div><button class="sc-caslwi brztng"><svg class="sc-fbJfz iZiZiV" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg><strong class="sc-fYaxgW jJkGwY">200<!-- --> </strong><div html="&lt;p&gt;Current user profile.&lt;/p&gt;
" class="sc-iKGpAq sc-cCYyou sc-cjERFZ dXXcln fTBBlJ dkmSdy"><p>Current user profile.</p>
</div></button></div><div><button class="sc-caslwi fvWYOy"><svg class="sc-fbJfz kiMFkB" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg><strong class="sc-fYaxgW jJkGwY">401<!-- --> </strong><div html="&lt;p&gt;Missing or invalid access token.&lt;/p&gt;
" class="sc-iKGpAq sc-cCYyou sc-cjERFZ dXXcln fTBBlJ dkmSdy"><p>Missing or invalid access token.</p>
</div></button></div><div><button class="sc-caslwi fvWYOy"><svg class="sc-fbJfz kiMFkB" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg><strong class="sc-fYaxgW jJkGwY">500<!-- --> </strong><div html="&lt;p&gt;Internal error.&lt;/p&gt;
" class="sc-iKGpAq sc-cCYyou sc-cjERFZ dXXcln fTBBlJ dkmSdy"><p>Internal error.</p>
</div></button></div></div></div><div class="sc-jTrPJt sc-gLDzao dVngAA fYLqku"><div class="sc-fYzRkH dHdMVa"><button class="sc-jYvNnh iWrBta"><span type="get" class="sc-eGFuAY kCsPwr http-verb get">get</span><span class="sc-GJyyy dkiPkt">/me</span><svg class="sc-fbJfz ivEQut" style="margin-right:-25px" version="1.1" viewBox="0 0 24 24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" aria-hidden="true"><polygon points="17.3 8.3 12 13.6 6.7 8.3 5.3 9.7 12 16.4 18.7 9.7 "></polygon></svg></button><div aria-hidden="true" class="sc-fnxdBX dplsyJ"><div class="sc-llcuoK cNCbuV"><div html="" class="sc-iKGpAq sc-cCYyou dXXcln cFvDiF"></div><div tabindex="0" role="button"><div class="sc-jnsZEx eobUac"><span></span>/me</div></div></div></div></div><div><h3 class="sc-kFuwaQ dEbuTz"> <!-- -->Response samples<!-- --> </h3><div class="sc-cyRfQY lbIFgo" data-rttabs="true"><ul class="react-tabs__tab-list" role="tablist"><li class="tab-success react-tabs__tab--selected" role="tab" id="tab_R_4sta_0" aria-selected="true" aria-disabled="false" aria-controls="panel_R_4sta_0" tabindex="0" data-rttab="true">200</li><li class="tab-error" role="tab" id="tab_R_4sta_1" aria-selected="false" aria-disabled="false" aria-controls="panel_R_4sta_1" data-rttab="true">401</li><li class="tab-error" role="tab" id="tab_R_4sta_2" aria-selected="false" aria-disabled="false" aria-controls="panel_R_4sta_2" data-rttab="true">500</li></ul><div class="react-tabs__tab-panel react-tabs__tab-panel--selected" role="tabpanel" id="panel_R_4sta_0" aria-labelledby="tab_R_4sta_0"><div><div class="sc-cPlDXk gpxHhK"><span class="sc-bCDidX ccmcKc">Content type</span><div class="sc-dQelHO eMpCUl">application/json</div></div><div class="sc-hVkBjf ksuOBo"><div class="sc-cRZddz iLjyyA"><div class="sc-gjTGSz btblAa"><button><div class="sc-jegxcw fJsoyS">Copy</div></button><button> Expand all </button><button> Collapse all </button></div><div tabindex="0" class="sc-iKGpAq dXXcln sc-jMAIzW jKIGwd"><div class="redoc-json"><code><button class="collapser" aria-label="collapse"></button><span class="token punctuation">{</span><span class="ellipsis"></span><ul class="obj collapsible"><li><div class="hoverable "><span class="property token string">"provider"</span>: <span class="token string">&quot;fake&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable "><span class="property token string">"user"</span>: <button class="collapser" aria-label="collapse"></button><span class="token punctuation">{</span><span class="ellipsis"></span><ul class="obj collapsible"><li><div class="hoverable collapsed"><span class="property token string">"id"</span>: <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable collapsed"><span class="property token string">"email"</span>: <span class="token string">&quot;user@example.com&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable collapsed"><span class="property token string">"displayName"</span>: <span class="token string">&quot;string&quot;</span><span class="token punctuation">,</span></div></li><li><div class="hoverable collapsed"><span class="property token string">"roles"</span>: <button class="collapser" aria-label="expand"></button><span class="token punctuation">[</span><span class="ellipsis"></span><ul class="array collapsible"><li><div class="hoverable collapsed"><span class="token string">&quot;string&quot;</span></div></li></ul><span class="token punctuation">]</span></div></li></ul><span class="token punctuation">}</span></div></li></ul><span class="token punctuation">}</span></code></div></div></div></div></div></div><div class="react-tabs__tab-panel" role="tabpanel" id="panel_R_4sta_1" aria-labelledby="tab_R_4sta_1"></div><div class="react-tabs__tab-panel" role="tabpanel" id="panel_R_4sta_2" aria-labelledby="tab_R_4sta_2"></div></div></div></div></div></div></div><div class="sc-emEvRt jYOHCb"></div></div></div>
      <script>
      const __redoc_state = {"menu":{"activeItemIdx":-1},"spec":{"data":{"openapi":"3.1.0","info":{"title":"Identity Backend Service API","version":"0.1.0","description":"Backend-first identity API implemented with Netlify Functions.\n\nNotes:\n- This spec is the source of truth for the REST contract.\n- Some endpoints are planned and may not be implemented yet.\n"},"servers":[{"url":"/"}],"tags":[{"name":"auth","description":"Authentication and session management"},{"name":"users","description":"User registration and profile"}],"components":{"securitySchemes":{"bearerAuth":{"type":"http","scheme":"bearer","bearerFormat":"JWT"}},"schemas":{"ErrorResponse":{"type":"object","additionalProperties":false,"required":["error"],"properties":{"error":{"type":"object","additionalProperties":false,"required":["code","message"],"properties":{"code":{"type":"string","description":"Stable, machine-readable error code.","examples":["UNAUTHORIZED","INVALID_CREDENTIALS","VALIDATION_ERROR","INTERNAL_ERROR"]},"message":{"type":"string","description":"Human-readable error message."},"details":{"description":"Optional error details."}}}}},"AuthProvider":{"type":"string","description":"Authentication provider identifier.","examples":["fake","postgres"]},"Session":{"type":"object","additionalProperties":false,"required":["accessToken","tokenType"],"properties":{"accessToken":{"type":"string"},"tokenType":{"type":"string","description":"Token type, usually \"Bearer\".","examples":["Bearer"]},"expiresAt":{"type":"string","description":"Optional expiry time in ISO 8601 format.","examples":["2026-03-02T12:34:56.000Z"]},"refreshToken":{"type":"string","description":"Optional refresh token (if issued)."}}},"User":{"type":"object","additionalProperties":true,"required":["id"],"properties":{"id":{"type":"string","description":"Provider-unique user id."},"email":{"type":"string","format":"email"},"displayName":{"type":"string"},"roles":{"type":"array","items":{"type":"string"}}}},"AuthResult":{"type":"object","additionalProperties":false,"required":["provider","session","user"],"properties":{"provider":{"$ref":"#/components/schemas/AuthProvider"},"session":{"$ref":"#/components/schemas/Session"},"user":{"$ref":"#/components/schemas/User"}}},"AuthLoginRequest":{"type":"object","additionalProperties":false,"required":["username","password"],"properties":{"username":{"type":"string","description":"Username/email used to authenticate."},"password":{"type":"string","description":"Password used to authenticate."}}},"AuthRegisterRequest":{"type":"object","additionalProperties":false,"required":["email","password"],"properties":{"email":{"type":"string","format":"email"},"password":{"type":"string"},"displayName":{"type":"string"}}},"AuthRefreshRequest":{"type":"object","additionalProperties":false,"required":["refreshToken"],"properties":{"refreshToken":{"type":"string"}}},"AuthLogoutRequest":{"type":"object","additionalProperties":false,"properties":{"refreshToken":{"type":"string","description":"Optional refresh token to revoke, if applicable."}}},"MeResponse":{"type":"object","additionalProperties":false,"required":["provider","user"],"properties":{"provider":{"$ref":"#/components/schemas/AuthProvider"},"user":{"$ref":"#/components/schemas/User"}}}}},"paths":{"/auth-login":{"post":{"tags":["auth"],"summary":"Login and create a session","operationId":"authLogin","requestBody":{"required":true,"content":{"application/json":{"schema":{"$ref":"#/components/schemas/AuthLoginRequest"},"examples":{"demo":{"value":{"username":"demo","password":"letmein"}}}}}},"responses":{"200":{"description":"Authenticated session and user profile.","content":{"application/json":{"schema":{"$ref":"#/components/schemas/AuthResult"}}}},"400":{"description":"Validation error.","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ErrorResponse"}}}},"401":{"description":"Invalid credentials.","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ErrorResponse"}}}},"500":{"description":"Internal error.","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ErrorResponse"}}}}}}},"/me":{"get":{"tags":["users"],"summary":"Get current user profile","operationId":"getMe","security":[{"bearerAuth":[]}],"responses":{"200":{"description":"Current user profile.","content":{"application/json":{"schema":{"$ref":"#/components/schemas/MeResponse"}}}},"401":{"description":"Missing or invalid access token.","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ErrorResponse"}}}},"500":{"description":"Internal error.","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ErrorResponse"}}}}}}},"/auth-register":{"post":{"tags":["auth"],"summary":"Register a new user and create a session","operationId":"authRegister","description":"Planned endpoint. When implemented, should create a new user and return an authenticated session.\n","requestBody":{"required":true,"content":{"application/json":{"schema":{"$ref":"#/components/schemas/AuthRegisterRequest"}}}},"responses":{"201":{"description":"User created and session issued.","content":{"application/json":{"schema":{"$ref":"#/components/schemas/AuthResult"}}}},"400":{"description":"Validation error.","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ErrorResponse"}}}},"409":{"description":"Email already exists.","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ErrorResponse"}}}},"500":{"description":"Internal error.","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ErrorResponse"}}}}}}},"/auth-refresh":{"post":{"tags":["auth"],"summary":"Refresh an access token","operationId":"authRefresh","description":"Planned endpoint. When implemented, should validate the refresh token and return a new session payload.\n","requestBody":{"required":true,"content":{"application/json":{"schema":{"$ref":"#/components/schemas/AuthRefreshRequest"}}}},"responses":{"200":{"description":"New session issued.","content":{"application/json":{"schema":{"$ref":"#/components/schemas/AuthResult"}}}},"400":{"description":"Validation error.","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ErrorResponse"}}}},"401":{"description":"Invalid or expired refresh token.","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ErrorResponse"}}}},"500":{"description":"Internal error.","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ErrorResponse"}}}}}}},"/auth-logout":{"post":{"tags":["auth"],"summary":"Logout / revoke session tokens","operationId":"authLogout","description":"Planned endpoint. When implemented, should revoke refresh token(s) if supported by the provider.\n","security":[{"bearerAuth":[]}],"requestBody":{"required":false,"content":{"application/json":{"schema":{"$ref":"#/components/schemas/AuthLogoutRequest"}}}},"responses":{"204":{"description":"Logged out."},"400":{"description":"Validation error.","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ErrorResponse"}}}},"401":{"description":"Missing or invalid access token.","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ErrorResponse"}}}},"500":{"description":"Internal error.","content":{"application/json":{"schema":{"$ref":"#/components/schemas/ErrorResponse"}}}}}}}}}},"searchIndex":{"store":["tag/auth","tag/auth/operation/authLogin","tag/auth/operation/authRegister","tag/auth/operation/authRefresh","tag/auth/operation/authLogout","tag/users","tag/users/operation/getMe"],"index":{"version":"2.3.9","fields":["title","description"],"fieldVectors":[["title/0",[0,2.302]],["description/0",[1,1.413,2,0.252,3,2.034]],["title/1",[2,0.208,4,1.674,5,0.827]],["description/1",[6,2.505]],["title/2",[2,0.163,5,0.65,7,1.315,8,0.65,9,0.294]],["description/2",[1,0.852,2,0.152,5,0.606,8,0.606,9,0.275,10,0.606,11,0.606,12,0.606,13,0.852,14,1.226]],["title/3",[15,0.827,16,1.674,17,0.827]],["description/3",[2,0.144,8,0.573,10,0.573,11,0.573,12,0.573,13,0.806,15,0.573,17,0.573,18,1.161,19,1.161,20,1.161]],["title/4",[2,0.163,17,0.65,21,1.315,22,1.315,23,0.914]],["description/4",[10,0.642,11,0.642,12,0.642,15,0.642,23,0.903,24,1.3,25,1.3,26,1.3,27,1.3]],["title/5",[9,0.515]],["description/5",[9,0.455,28,2.034,29,1.413]],["title/6",[9,0.375,29,1.163,30,1.674]],["description/6",[]]],"invertedIndex":[["",{"_index":22,"title":{"4":{}},"description":{}}],["access",{"_index":16,"title":{"3":{}},"description":{}}],["auth",{"_index":0,"title":{"0":{}},"description":{}}],["auth-login",{"_index":6,"title":{},"description":{"1":{}}}],["auth-logout",{"_index":27,"title":{},"description":{"4":{}}}],["auth-refresh",{"_index":20,"title":{},"description":{"3":{}}}],["auth-regist",{"_index":14,"title":{},"description":{"2":{}}}],["authent",{"_index":1,"title":{},"description":{"0":{},"2":{}}}],["creat",{"_index":5,"title":{"1":{},"2":{}},"description":{"2":{}}}],["current",{"_index":30,"title":{"6":{}},"description":{}}],["endpoint",{"_index":11,"title":{},"description":{"2":{},"3":{},"4":{}}}],["implement",{"_index":12,"title":{},"description":{"2":{},"3":{},"4":{}}}],["login",{"_index":4,"title":{"1":{}},"description":{}}],["logout",{"_index":21,"title":{"4":{}},"description":{}}],["manag",{"_index":3,"title":{},"description":{"0":{}}}],["new",{"_index":8,"title":{"2":{}},"description":{"2":{},"3":{}}}],["payload",{"_index":19,"title":{},"description":{"3":{}}}],["plan",{"_index":10,"title":{},"description":{"2":{},"3":{},"4":{}}}],["profil",{"_index":29,"title":{"6":{}},"description":{"5":{}}}],["provid",{"_index":26,"title":{},"description":{"4":{}}}],["refresh",{"_index":15,"title":{"3":{}},"description":{"3":{},"4":{}}}],["regist",{"_index":7,"title":{"2":{}},"description":{}}],["registr",{"_index":28,"title":{},"description":{"5":{}}}],["return",{"_index":13,"title":{},"description":{"2":{},"3":{}}}],["revok",{"_index":23,"title":{"4":{}},"description":{"4":{}}}],["session",{"_index":2,"title":{"1":{},"2":{},"4":{}},"description":{"0":{},"2":{},"3":{}}}],["support",{"_index":25,"title":{},"description":{"4":{}}}],["token",{"_index":17,"title":{"3":{},"4":{}},"description":{"3":{}}}],["token(",{"_index":24,"title":{},"description":{"4":{}}}],["user",{"_index":9,"title":{"2":{},"5":{},"6":{}},"description":{"2":{},"5":{}}}],["valid",{"_index":18,"title":{},"description":{"3":{}}}]],"pipeline":[]}},"options":{}};

      var container = document.getElementById('redoc');
      Redoc.hydrate(__redoc_state, container);

      </script>
</body>

</html>

```

---

## File: docs/api.md

```md
---
title: Identity Backend Service API v0.1.0
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="identity-backend-service-api">Identity Backend Service API v0.1.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

Backend-first identity API implemented with Netlify Functions.

Notes:
- This spec is the source of truth for the REST contract.
- Some endpoints are planned and may not be implemented yet.

Base URLs:

* <a href="/">/</a>

# Authentication

- HTTP Authentication, scheme: bearer 

<h1 id="identity-backend-service-api-auth">auth</h1>

Authentication and session management

## authLogin

<a id="opIdauthLogin"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /auth-login \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST /auth-login HTTP/1.1

Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "username": "demo",
  "password": "letmein"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/auth-login',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post '/auth-login',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('/auth-login', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/auth-login', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/auth-login");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/auth-login", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth-login`

*Login and create a session*

> Body parameter

```json
{
  "username": "demo",
  "password": "letmein"
}
```

<h3 id="authlogin-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[AuthLoginRequest](#schemaauthloginrequest)|true|none|

> Example responses

> 200 Response

```json
{
  "provider": "fake",
  "session": {
    "accessToken": "string",
    "tokenType": "Bearer",
    "expiresAt": "2026-03-02T12:34:56.000Z",
    "refreshToken": "string"
  },
  "user": {
    "id": "string",
    "email": "user@example.com",
    "displayName": "string",
    "roles": [
      "string"
    ]
  }
}
```

<h3 id="authlogin-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Authenticated session and user profile.|[AuthResult](#schemaauthresult)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error.|[ErrorResponse](#schemaerrorresponse)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid credentials.|[ErrorResponse](#schemaerrorresponse)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal error.|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## authRegister

<a id="opIdauthRegister"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /auth-register \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST /auth-register HTTP/1.1

Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "email": "user@example.com",
  "password": "string",
  "displayName": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/auth-register',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post '/auth-register',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('/auth-register', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/auth-register', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/auth-register");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/auth-register", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth-register`

*Register a new user and create a session*

Planned endpoint. When implemented, should create a new user and return an authenticated session.

> Body parameter

```json
{
  "email": "user@example.com",
  "password": "string",
  "displayName": "string"
}
```

<h3 id="authregister-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[AuthRegisterRequest](#schemaauthregisterrequest)|true|none|

> Example responses

> 201 Response

```json
{
  "provider": "fake",
  "session": {
    "accessToken": "string",
    "tokenType": "Bearer",
    "expiresAt": "2026-03-02T12:34:56.000Z",
    "refreshToken": "string"
  },
  "user": {
    "id": "string",
    "email": "user@example.com",
    "displayName": "string",
    "roles": [
      "string"
    ]
  }
}
```

<h3 id="authregister-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|User created and session issued.|[AuthResult](#schemaauthresult)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error.|[ErrorResponse](#schemaerrorresponse)|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|Email already exists.|[ErrorResponse](#schemaerrorresponse)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal error.|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## authRefresh

<a id="opIdauthRefresh"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /auth-refresh \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST /auth-refresh HTTP/1.1

Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "refreshToken": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/auth-refresh',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post '/auth-refresh',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('/auth-refresh', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/auth-refresh', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/auth-refresh");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/auth-refresh", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth-refresh`

*Refresh an access token*

Planned endpoint. When implemented, should validate the refresh token and return a new session payload.

> Body parameter

```json
{
  "refreshToken": "string"
}
```

<h3 id="authrefresh-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[AuthRefreshRequest](#schemaauthrefreshrequest)|true|none|

> Example responses

> 200 Response

```json
{
  "provider": "fake",
  "session": {
    "accessToken": "string",
    "tokenType": "Bearer",
    "expiresAt": "2026-03-02T12:34:56.000Z",
    "refreshToken": "string"
  },
  "user": {
    "id": "string",
    "email": "user@example.com",
    "displayName": "string",
    "roles": [
      "string"
    ]
  }
}
```

<h3 id="authrefresh-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|New session issued.|[AuthResult](#schemaauthresult)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error.|[ErrorResponse](#schemaerrorresponse)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Invalid or expired refresh token.|[ErrorResponse](#schemaerrorresponse)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal error.|[ErrorResponse](#schemaerrorresponse)|

<aside class="success">
This operation does not require authentication
</aside>

## authLogout

<a id="opIdauthLogout"></a>

> Code samples

```shell
# You can also use wget
curl -X POST /auth-logout \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
POST /auth-logout HTTP/1.1

Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "refreshToken": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/auth-logout',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.post '/auth-logout',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.post('/auth-logout', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/auth-logout', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/auth-logout");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/auth-logout", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /auth-logout`

*Logout / revoke session tokens*

Planned endpoint. When implemented, should revoke refresh token(s) if supported by the provider.

> Body parameter

```json
{
  "refreshToken": "string"
}
```

<h3 id="authlogout-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[AuthLogoutRequest](#schemaauthlogoutrequest)|false|none|

> Example responses

> 400 Response

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "string",
    "details": null
  }
}
```

<h3 id="authlogout-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|Logged out.|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation error.|[ErrorResponse](#schemaerrorresponse)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Missing or invalid access token.|[ErrorResponse](#schemaerrorresponse)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal error.|[ErrorResponse](#schemaerrorresponse)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

<h1 id="identity-backend-service-api-users">users</h1>

User registration and profile

## getMe

<a id="opIdgetMe"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /me \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer {access-token}'

```

```http
GET /me HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('/me',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json',
  'Authorization' => 'Bearer {access-token}'
}

result = RestClient.get '/me',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer {access-token}'
}

r = requests.get('/me', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
    'Authorization' => 'Bearer {access-token}',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/me', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/me");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
        "Authorization": []string{"Bearer {access-token}"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/me", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /me`

*Get current user profile*

> Example responses

> 200 Response

```json
{
  "provider": "fake",
  "user": {
    "id": "string",
    "email": "user@example.com",
    "displayName": "string",
    "roles": [
      "string"
    ]
  }
}
```

<h3 id="getme-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Current user profile.|[MeResponse](#schemameresponse)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Missing or invalid access token.|[ErrorResponse](#schemaerrorresponse)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Internal error.|[ErrorResponse](#schemaerrorresponse)|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
bearerAuth
</aside>

# Schemas

<h2 id="tocS_ErrorResponse">ErrorResponse</h2>
<!-- backwards compatibility -->
<a id="schemaerrorresponse"></a>
<a id="schema_ErrorResponse"></a>
<a id="tocSerrorresponse"></a>
<a id="tocserrorresponse"></a>

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "string",
    "details": null
  }
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|error|object|true|none|none|
|» code|string|true|none|Stable, machine-readable error code.|
|» message|string|true|none|Human-readable error message.|
|» details|any|false|none|Optional error details.|

<h2 id="tocS_AuthProvider">AuthProvider</h2>
<!-- backwards compatibility -->
<a id="schemaauthprovider"></a>
<a id="schema_AuthProvider"></a>
<a id="tocSauthprovider"></a>
<a id="tocsauthprovider"></a>

```json
"fake"

```

Authentication provider identifier.

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|string|false|none|Authentication provider identifier.|

<h2 id="tocS_Session">Session</h2>
<!-- backwards compatibility -->
<a id="schemasession"></a>
<a id="schema_Session"></a>
<a id="tocSsession"></a>
<a id="tocssession"></a>

```json
{
  "accessToken": "string",
  "tokenType": "Bearer",
  "expiresAt": "2026-03-02T12:34:56.000Z",
  "refreshToken": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|accessToken|string|true|none|none|
|tokenType|string|true|none|Token type, usually "Bearer".|
|expiresAt|string|false|none|Optional expiry time in ISO 8601 format.|
|refreshToken|string|false|none|Optional refresh token (if issued).|

<h2 id="tocS_User">User</h2>
<!-- backwards compatibility -->
<a id="schemauser"></a>
<a id="schema_User"></a>
<a id="tocSuser"></a>
<a id="tocsuser"></a>

```json
{
  "id": "string",
  "email": "user@example.com",
  "displayName": "string",
  "roles": [
    "string"
  ]
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|Provider-unique user id.|
|email|string(email)|false|none|none|
|displayName|string|false|none|none|
|roles|[string]|false|none|none|

<h2 id="tocS_AuthResult">AuthResult</h2>
<!-- backwards compatibility -->
<a id="schemaauthresult"></a>
<a id="schema_AuthResult"></a>
<a id="tocSauthresult"></a>
<a id="tocsauthresult"></a>

```json
{
  "provider": "fake",
  "session": {
    "accessToken": "string",
    "tokenType": "Bearer",
    "expiresAt": "2026-03-02T12:34:56.000Z",
    "refreshToken": "string"
  },
  "user": {
    "id": "string",
    "email": "user@example.com",
    "displayName": "string",
    "roles": [
      "string"
    ]
  }
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|provider|[AuthProvider](#schemaauthprovider)|true|none|Authentication provider identifier.|
|session|[Session](#schemasession)|true|none|none|
|user|[User](#schemauser)|true|none|none|

<h2 id="tocS_AuthLoginRequest">AuthLoginRequest</h2>
<!-- backwards compatibility -->
<a id="schemaauthloginrequest"></a>
<a id="schema_AuthLoginRequest"></a>
<a id="tocSauthloginrequest"></a>
<a id="tocsauthloginrequest"></a>

```json
{
  "username": "string",
  "password": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|username|string|true|none|Username/email used to authenticate.|
|password|string|true|none|Password used to authenticate.|

<h2 id="tocS_AuthRegisterRequest">AuthRegisterRequest</h2>
<!-- backwards compatibility -->
<a id="schemaauthregisterrequest"></a>
<a id="schema_AuthRegisterRequest"></a>
<a id="tocSauthregisterrequest"></a>
<a id="tocsauthregisterrequest"></a>

```json
{
  "email": "user@example.com",
  "password": "string",
  "displayName": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|email|string(email)|true|none|none|
|password|string|true|none|none|
|displayName|string|false|none|none|

<h2 id="tocS_AuthRefreshRequest">AuthRefreshRequest</h2>
<!-- backwards compatibility -->
<a id="schemaauthrefreshrequest"></a>
<a id="schema_AuthRefreshRequest"></a>
<a id="tocSauthrefreshrequest"></a>
<a id="tocsauthrefreshrequest"></a>

```json
{
  "refreshToken": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|refreshToken|string|true|none|none|

<h2 id="tocS_AuthLogoutRequest">AuthLogoutRequest</h2>
<!-- backwards compatibility -->
<a id="schemaauthlogoutrequest"></a>
<a id="schema_AuthLogoutRequest"></a>
<a id="tocSauthlogoutrequest"></a>
<a id="tocsauthlogoutrequest"></a>

```json
{
  "refreshToken": "string"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|refreshToken|string|false|none|Optional refresh token to revoke, if applicable.|

<h2 id="tocS_MeResponse">MeResponse</h2>
<!-- backwards compatibility -->
<a id="schemameresponse"></a>
<a id="schema_MeResponse"></a>
<a id="tocSmeresponse"></a>
<a id="tocsmeresponse"></a>

```json
{
  "provider": "fake",
  "user": {
    "id": "string",
    "email": "user@example.com",
    "displayName": "string",
    "roles": [
      "string"
    ]
  }
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|provider|[AuthProvider](#schemaauthprovider)|true|none|Authentication provider identifier.|
|user|[User](#schemauser)|true|none|none|


```

---

## File: ENVIRONMENT.md

_Skipped (too large: 300373 bytes > 300000)._ 

---

## File: eslint.config.js

```js
import js from "@eslint/js";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.node
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    rules: {
      ...tsPlugin.configs["recommended"].rules,

      // `no-undef` is a JS rule and misfires on TS-only type names and DOM globals
      // when the repo config is Node-oriented. TS compiler is the source of truth here.
      "no-undef": "off",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_"
        }
      ],
      "no-console": "off"
    }
  },
  {
    files: ["demo-client/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    rules: {
      ...tsPlugin.configs["recommended"].rules,
      "no-undef": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_"
        }
      ],
      "no-console": "off"
    }
  },
  {
    ignores: ["dist/**", "node_modules/**", ".netlify/**", "coverage/**"]
  }
];


```

---

## File: .github/workflows/ci.yml

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      debug:
        description: "Enable extra diagnostics output"
        required: false
        default: "false"
      run_deploy:
        description: "Run deploy job (only applies on main, requires Netlify secrets)"
        required: false
        default: "false"

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read

env:
  CI: "true"

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: |
            package-lock.json
            demo-client/package-lock.json

      - name: Debug (workflow_dispatch only)
        if: ${{ github.event_name == 'workflow_dispatch' && inputs.debug == 'true' }}
        run: |
          set -euo pipefail
          echo "event=${GITHUB_EVENT_NAME}"
          echo "ref=${GITHUB_REF}"
          echo "sha=${GITHUB_SHA}"
          echo "actor=${GITHUB_ACTOR}"
          echo "runner.os=${RUNNER_OS}"
          echo "runner.arch=${RUNNER_ARCH}"
          node --version
          npm --version
          echo "pwd=$(pwd)"
          ls -la
          echo "--- workflows ---"
          ls -la .github/workflows || true
          echo "--- env (filtered) ---"
          env | sort | grep -Ev 'TOKEN|SECRET|PASSWORD|KEY' || true

      - name: Install
        run: npm ci --no-audit --prefer-offline

      - name: Lint
        run: npm run lint

      - name: Typecheck
        run: npm run typecheck

      - name: Tests
        run: npm run test:run
        env:
          NETLIFY_DEV_PORT: "3999"

  deploy:
    needs: [test]
    runs-on: ubuntu-latest
    timeout-minutes: 10
    permissions:
      contents: read
    if: ${{ github.ref == 'refs/heads/main' && (github.event_name != 'workflow_dispatch' || inputs.run_deploy == 'true') }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: |
            package-lock.json
            demo-client/package-lock.json

      - name: Check Netlify secrets
        run: |
          set -euo pipefail
          test -n "${NETLIFY_AUTH_TOKEN:-}"
          test -n "${NETLIFY_SITE_ID:-}"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

      - name: Install
        run: npm ci --no-audit --prefer-offline

      - name: Build
        run: npm run build

      - name: Netlify deploy (prod)
        run: npx netlify deploy --prod --dir=. --site "$NETLIFY_SITE_ID" --auth "$NETLIFY_AUTH_TOKEN"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

```

---

## File: .github/workflows/netlify-preview-smoke.yml

```yaml
name: Netlify Deploy Preview Smoke

on:
  deployment_status:

permissions:
  contents: read

jobs:
  smoke:
    name: Smoke test deployed preview
    runs-on: ubuntu-latest
    if: >
      github.event.deployment_status.state == 'success' &&
      github.event.deployment_status.environment_url != '' &&
      contains(github.event.deployment_status.environment_url, 'netlify.app')

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Run smoke against deploy preview
        env:
          BASE_URL: ${{ github.event.deployment_status.environment_url }}
        run: |
          set -euo pipefail
          echo "Deploy preview URL: ${BASE_URL}"

          # Quick retry to avoid flake if the deploy URL is live but functions are still warming up.
          for i in 1 2 3 4 5; do
            echo "Smoke attempt ${i}..."
            if ./scripts/smoke-api.sh --debug; then
              echo "Smoke passed."
              exit 0
            fi
            echo "Smoke failed; retrying in 5s..."
            sleep 5
          done

          echo "Smoke failed after retries."
          exit 1

```

---

## File: .github/workflows/push-ping.yml

```yaml
name: Push Ping

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

jobs:
  ping:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - name: Show event + commit
        run: |
          set -euo pipefail
          echo "event: ${{ github.event_name }}"
          echo "ref:   ${{ github.ref }}"
          echo "sha:   ${{ github.sha }}"
          echo "actor: ${{ github.actor }}"


```

---

## File: .gitignore

```
node_modules/
dist/
.netlify/
.env
.env.*
coverage/
.DS_Store
aichat_admin/
.neon.env
.env.local
environment/**/.env

```

---

## File: identity-backend-service@0.1.0

```

```

---

## File: index.html

```
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Identity Backend Service - Dashboard</title>
    <style>
      :root {
        color-scheme: light dark;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial,
          "Apple Color Emoji", "Segoe UI Emoji";
        line-height: 1.4;
      }
      body {
        margin: 0;
        padding: 24px;
      }
      .wrap {
        max-width: 860px;
        margin: 0 auto;
      }
      .row {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        align-items: center;
      }
      .card {
        border: 1px solid rgba(127, 127, 127, 0.35);
        border-radius: 12px;
        padding: 16px;
        margin: 12px 0;
      }
      label {
        display: inline-flex;
        flex-direction: column;
        gap: 6px;
        min-width: 220px;
      }
      input {
        padding: 10px 12px;
        border-radius: 10px;
        border: 1px solid rgba(127, 127, 127, 0.4);
        background: transparent;
        color: inherit;
      }
      button {
        padding: 10px 12px;
        border-radius: 10px;
        border: 1px solid rgba(127, 127, 127, 0.4);
        background: transparent;
        color: inherit;
        cursor: pointer;
      }
      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      pre {
        overflow: auto;
        padding: 12px;
        border-radius: 10px;
        background: rgba(127, 127, 127, 0.12);
        border: 1px solid rgba(127, 127, 127, 0.25);
      }
      .muted {
        opacity: 0.8;
      }
      .pill {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 999px;
        border: 1px solid rgba(127, 127, 127, 0.35);
        font-size: 12px;
      }
      .ok {
        border-color: rgba(0, 180, 120, 0.55);
      }
      .bad {
        border-color: rgba(220, 60, 60, 0.55);
      }
    </style>
  </head>
  <body>
    <div id="root"></div>

    <script type="module">
      import React, { useEffect, useMemo, useState } from "https://esm.sh/react@18.3.1";
      import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";

      const SESSION_KEY = "ibs.session.v1";

      function safeJsonParse(raw) {
        try {
          return JSON.parse(raw);
        } catch {
          return null;
        }
      }

      function loadSession() {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        const v = safeJsonParse(raw);
        if (!v || typeof v !== "object") return null;

        const accessToken = v.accessToken;
        const tokenType = v.tokenType;
        if (typeof accessToken !== "string" || accessToken.trim().length === 0) return null;
        if (tokenType !== "bearer") return null;

        return {
          accessToken,
          tokenType: "bearer",
          expiresAt: typeof v.expiresAt === "string" ? v.expiresAt : undefined,
          refreshToken: typeof v.refreshToken === "string" ? v.refreshToken : undefined,
        };
      }

      function saveSession(session) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      }

      function clearSession() {
        localStorage.removeItem(SESSION_KEY);
      }

      async function apiFetch(path, opts = {}) {
        const res = await fetch(path, opts);
        const text = await res.text();
        const body = text ? safeJsonParse(text) : null;
        return { res, body, rawText: text };
      }

      function JsonBlock({ value }) {
        const txt = useMemo(() => JSON.stringify(value, null, 2), [value]);
        return React.createElement("pre", null, txt);
      }

      function App() {
        const [username, setUsername] = useState("demo");
        const [password, setPassword] = useState("letmein");

        const [session, setSession] = useState(null);
        const [me, setMe] = useState(null);
        const [lastCall, setLastCall] = useState(null);
        const [busy, setBusy] = useState(false);

        useEffect(() => {
          const s = loadSession();
          if (s) setSession(s);
        }, []);

        async function doLogin(e) {
          e?.preventDefault?.();
          setBusy(true);
          setMe(null);

          try {
            const { res, body, rawText } = await apiFetch("/.netlify/functions/auth-login", {
              method: "POST",
              headers: {
                "content-type": "application/json",
                "x-request-id": "web-auth-login",
              },
              body: JSON.stringify({ username, password }),
            });

            setLastCall({
              at: new Date().toISOString(),
              endpoint: "POST /.netlify/functions/auth-login",
              status: res.status,
              ok: res.ok,
              body: body ?? rawText,
            });

            if (!body || body.ok !== true || !body.data || !body.data.session) return;

            const s = body.data.session;
            saveSession(s);
            setSession(s);
          } finally {
            setBusy(false);
          }
        }

        async function doMe() {
          if (!session) return;
          setBusy(true);

          try {
            const { res, body, rawText } = await apiFetch("/.netlify/functions/me", {
              method: "GET",
              headers: {
                authorization: `Bearer ${session.accessToken}`,
                "x-request-id": "web-me",
              },
            });

            setLastCall({
              at: new Date().toISOString(),
              endpoint: "GET /.netlify/functions/me",
              status: res.status,
              ok: res.ok,
              body: body ?? rawText,
            });

            if (body && body.ok === true && body.data) {
              setMe(body.data);
            } else {
              setMe(null);
            }
          } finally {
            setBusy(false);
          }
        }

        function doLogout() {
          clearSession();
          setSession(null);
          setMe(null);
          setLastCall(null);
        }

        const statusPill = session
          ? React.createElement("span", { className: "pill ok" }, "SESSION: present")
          : React.createElement("span", { className: "pill bad" }, "SESSION: none");

        return React.createElement(
          "div",
          { className: "wrap" },
          React.createElement("h1", null, "Minimal Dashboard"),
          React.createElement(
            "p",
            { className: "muted" },
            "Calls Netlify Functions on the same origin. In Netlify Dev, auth defaults to the fake provider."
          ),
          React.createElement("div", { className: "row" }, statusPill),
          React.createElement(
            "div",
            { className: "card" },
            React.createElement("h2", null, "Login"),
            React.createElement(
              "form",
              { onSubmit: doLogin },
              React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                  "label",
                  null,
                  React.createElement("span", null, "Username"),
                  React.createElement("input", {
                    value: username,
                    onChange: (e) => setUsername(e.target.value),
                    autoComplete: "username",
                    spellCheck: false,
                  })
                ),
                React.createElement(
                  "label",
                  null,
                  React.createElement("span", null, "Password"),
                  React.createElement("input", {
                    value: password,
                    onChange: (e) => setPassword(e.target.value),
                    type: "password",
                    autoComplete: "current-password",
                  })
                ),
                React.createElement(
                  "div",
                  { style: { display: "flex", gap: "8px", alignItems: "end" } },
                  React.createElement(
                    "button",
                    { type: "submit", disabled: busy },
                    busy ? "Working..." : "Login (POST /auth-login)"
                  ),
                  React.createElement(
                    "button",
                    { type: "button", onClick: doLogout, disabled: busy || !session },
                    "Logout"
                  )
                )
              )
            )
          ),
          React.createElement(
            "div",
            { className: "card" },
            React.createElement("h2", null, "/me"),
            React.createElement(
              "div",
              { className: "row" },
              React.createElement(
                "button",
                { type: "button", onClick: doMe, disabled: busy || !session },
                busy ? "Working..." : "Fetch profile (GET /me)"
              )
            ),
            me
              ? React.createElement(
                  React.Fragment,
                  null,
                  React.createElement("h3", null, "Profile"),
                  React.createElement(JsonBlock, { value: me })
                )
              : React.createElement("p", { className: "muted" }, "No profile loaded yet.")
          ),
          React.createElement(
            "div",
            { className: "card" },
            React.createElement("h2", null, "Last call"),
            lastCall
              ? React.createElement(JsonBlock, { value: lastCall })
              : React.createElement("p", { className: "muted" }, "No calls yet.")
          ),
          React.createElement(
            "p",
            { className: "muted" },
            "Tip: run ",
            React.createElement("code", null, "npm run dev"),
            " then open the Netlify Dev URL; use demo / letmein."
          )
        );
      }

      createRoot(document.getElementById("root")).render(React.createElement(App));
    </script>
  </body>
</html>

```

---

## File: netlify/functions/admin-users.ts

```ts
import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/lib/requestId.js";
import { parseJsonBody } from "../../src/lib/body.js";
import { getBearerToken } from "../../src/lib/authHeader.js";
import {
  jsonBadRequest,
  jsonCorsPreflight,
  jsonMethodNotAllowed,
  jsonNoContent,
  jsonOk,
  requireMethod,
  toErrorResponse
} from "../../src/lib/response.js";
import type { AdminCreateUserRequest, AdminUpdateUserRequest } from "../../src/contracts/adminUsers.js";
import {
  createAdminUser,
  deleteAdminUser,
  getAdminUserById,
  getAdminUsers,
  updateAdminUser
} from "../../src/services/adminUsersService.js";

function getIdFromPath(pathname: string | undefined): string | undefined {
  const p = (pathname || "").trim();
  if (!p) return undefined;

  const marker = "/.netlify/functions/admin-users";
  const i = p.indexOf(marker);
  if (i < 0) return undefined;

  const rest = p.slice(i + marker.length);
  const seg = rest.startsWith("/") ? rest.slice(1) : rest;
  const id = seg.split("/")[0];
  return id && id.trim().length > 0 ? id.trim() : undefined;
}

export const handler: Handler = async (event) => {
  const requestId = getOrCreateRequestId(event.headers || {});
  try {
    if ((event.httpMethod || "").toUpperCase() === "OPTIONS") {
      return jsonCorsPreflight(requestId);
    }

    requireMethod(event.httpMethod, ["GET", "POST", "PATCH", "DELETE"]);

    const token = getBearerToken(event.headers || {});
    const id = getIdFromPath(event.path);

    if (event.httpMethod === "GET") {
      if (id) {
        const data = await getAdminUserById(token, id);
        return jsonOk(200, requestId, data);
      }
      const data = await getAdminUsers(token);
      return jsonOk(200, requestId, data);
    }

    if (event.httpMethod === "POST") {
      if (id) {
        // POST to /admin-users/:id is not supported
        return jsonMethodNotAllowed(requestId);
      }
      const req = parseJsonBody<AdminCreateUserRequest>(event.body);
      const data = await createAdminUser(token, req);
      return jsonOk(201, requestId, data);
    }

    if (event.httpMethod === "PATCH") {
      if (!id) {
        return jsonBadRequest(requestId, "Missing user id");
      }
      const req = parseJsonBody<AdminUpdateUserRequest>(event.body);
      const data = await updateAdminUser(token, id, req);
      return jsonOk(200, requestId, data);
    }

    // DELETE
    if (!id) {
      return jsonBadRequest(requestId, "Missing user id");
    }
    await deleteAdminUser(token, id);
    return jsonNoContent(204, requestId);
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};

```

---

## File: netlify/functions/auth-login.ts

```ts
import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/lib/requestId.js";
import { parseJsonBody } from "../../src/lib/body.js";
import { isAppError } from "../../src/lib/errors.js";
import { jsonCorsPreflight, jsonOk, jsonTooManyRequests, requireMethod, toErrorResponse } from "../../src/lib/response.js";
import type { AuthLoginRequest } from "../../src/contracts/auth.js";
import { login } from "../../src/services/authService.js";
import { buildRequestContext } from "../../src/security/requestContext.js";
import { checkRateLimit, makeRateKey, rateKeyFromContext } from "../../src/security/rateLimiter.js";
import { checkLockout, recordLoginFailure, recordLoginSuccess } from "../../src/security/loginLockout.js";

const LOGIN_IP_POLICY = {
  bucketSeconds: 60,
  maxHits: 60,
  route: "auth-login:ip"
};

const LOGIN_IP_IDENTIFIER_POLICY = {
  bucketSeconds: 60,
  maxHits: 10,
  route: "auth-login:ip+identifier"
};

const LOCKOUT_POLICY = {
  windowSeconds: 15 * 60,
  // Must be < LOGIN_IP_IDENTIFIER_POLICY.maxHits so lockout is observable independently of rate limiting.
  maxFailures: 8,
  lockSeconds: 15 * 60,
  scope: "ip+identifier" as const
};

function normalizeIdentifier(v: string | undefined): string | undefined {
  const s = (v || "").trim().toLowerCase();
  return s.length > 0 ? s : undefined;
}

export const handler: Handler = async (event) => {
  const requestId = getOrCreateRequestId(event.headers || {});
  const ctx = buildRequestContext(event, requestId);

  try {
    if ((event.httpMethod || "").toUpperCase() === "OPTIONS") {
      return jsonCorsPreflight(requestId);
    }

    requireMethod(event.httpMethod, ["POST"]);

    // Parse early so we can rate-limit and lock out by identifier.
    const req = parseJsonBody<AuthLoginRequest>(event.body);
    const identifier = normalizeIdentifier(req.username);

    const ipKey = rateKeyFromContext(ctx);
    const ipLimit = await checkRateLimit(LOGIN_IP_POLICY, ipKey);
    if (!ipLimit.allowed) {
      return jsonTooManyRequests(requestId, ipLimit.retryAfterSeconds);
    }

    const ipIdKey = makeRateKey([ctx.ip, identifier]);
    const ipIdLimit = await checkRateLimit(LOGIN_IP_IDENTIFIER_POLICY, ipIdKey);
    if (!ipIdLimit.allowed) {
      return jsonTooManyRequests(requestId, ipIdLimit.retryAfterSeconds);
    }

    if (identifier) {
      const lock = await checkLockout(LOCKOUT_POLICY, {
        identifier,
        ip: ctx.ip,
        requestId,
        userAgent: ctx.userAgent
      });

      if (lock.locked) {
        return jsonTooManyRequests(requestId, lock.retryAfterSeconds);
      }
    }

    try {
      const data = await login(req);

      if (identifier) {
        await recordLoginSuccess(LOCKOUT_POLICY, { identifier, ip: ctx.ip });
      }

      return jsonOk(200, requestId, data);
    } catch (err) {
      // Only count invalid credential failures towards lockout.
      if (identifier && isAppError(err) && err.code === "UNAUTHORIZED" && err.status === 401) {
        await recordLoginFailure(LOCKOUT_POLICY, {
          identifier,
          ip: ctx.ip,
          requestId,
          userAgent: ctx.userAgent
        });
      }
      throw err;
    }
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};

```

---

## File: netlify/functions/auth-logout.ts

```ts
import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/lib/requestId.js";
import { parseJsonBody } from "../../src/lib/body.js";
import { getBearerToken } from "../../src/lib/authHeader.js";
import { jsonCorsPreflight, jsonNoContent, requireMethod, toErrorResponse } from "../../src/lib/response.js";
import type { AuthLogoutRequest } from "../../src/contracts/auth.js";
import { logout } from "../../src/services/authService.js";
import { buildRequestContext } from "../../src/security/requestContext.js";
import { verifyAccessToken } from "../../src/lib/jwt.js"; // ✅ FIXED PATH
import { writeAuditLog } from "../../src/services/auditLogService.js";

export const handler: Handler = async (event) => {
  const requestId = getOrCreateRequestId(event.headers || {});
  const ctx = buildRequestContext(event, requestId);

  try {
    if ((event.httpMethod || "").toUpperCase() === "OPTIONS") {
      return jsonCorsPreflight(requestId);
    }

    requireMethod(event.httpMethod, ["POST"]);

    const accessToken = getBearerToken(event.headers || {});
    const req = event.body ? parseJsonBody<AuthLogoutRequest>(event.body) : undefined;

    await logout(accessToken, req);

    if (process.env.AUTH_PROVIDER === "postgres") {
      let actorUserId: string | undefined;

      try {
        const verified = verifyAccessToken(accessToken);
        actorUserId = verified.userId;
      } catch {
        actorUserId = undefined;
      }

      await writeAuditLog({
        action: "auth.logout",
        ...(actorUserId ? { actorUserId, targetUserId: actorUserId } : {}),
        requestId,
        ip: ctx.ip,
        userAgent: ctx.userAgent,
      });
    }

    return jsonNoContent(204, requestId);
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};

```

---

## File: netlify/functions/auth-refresh.ts

```ts
import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/lib/requestId.js";
import { parseJsonBody } from "../../src/lib/body.js";
import { jsonCorsPreflight, jsonOk, jsonTooManyRequests, requireMethod, toErrorResponse } from "../../src/lib/response.js";
import type { AuthRefreshRequest } from "../../src/contracts/auth.js";
import { refresh } from "../../src/services/authService.js";
import { buildRequestContext } from "../../src/security/requestContext.js";
import { checkRateLimit, rateKeyFromContext } from "../../src/security/rateLimiter.js";
import { writeAuditLog } from "../../src/services/auditLogService.js";

const REFRESH_IP_POLICY = {
  bucketSeconds: 60,
  maxHits: 120,
  route: "auth-refresh:ip"
};

export const handler: Handler = async (event) => {
  const requestId = getOrCreateRequestId(event.headers || {});
  const ctx = buildRequestContext(event, requestId);

  try {
    if ((event.httpMethod || "").toUpperCase() === "OPTIONS") {
      return jsonCorsPreflight(requestId);
    }

    requireMethod(event.httpMethod, ["POST"]);

    const ipKey = rateKeyFromContext(ctx);
    const ipLimit = await checkRateLimit(REFRESH_IP_POLICY, ipKey);
    if (!ipLimit.allowed) {
      return jsonTooManyRequests(requestId, ipLimit.retryAfterSeconds);
    }

    const req = parseJsonBody<AuthRefreshRequest>(event.body);
    const data = await refresh(req);

    if (process.env.AUTH_PROVIDER === "postgres") {
      await writeAuditLog({
        action: "auth.refresh.rotated",
        actorUserId: data.user?.id,
        targetUserId: data.user?.id,
        requestId,
        ip: ctx.ip,
        userAgent: ctx.userAgent,
        details: { provider: data.provider }
      });
    }

    return jsonOk(200, requestId, data);
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};

```

---

## File: netlify/functions/auth-register.ts

```ts
import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/lib/requestId.js";
import { parseJsonBody } from "../../src/lib/body.js";
import { jsonCorsPreflight, jsonOk, jsonTooManyRequests, requireMethod, toErrorResponse } from "../../src/lib/response.js";
import type { AuthRegisterRequest } from "../../src/contracts/auth.js";
import { register } from "../../src/services/authService.js";
import { buildRequestContext } from "../../src/security/requestContext.js";
import { checkRateLimit, makeRateKey, rateKeyFromContext } from "../../src/security/rateLimiter.js";

const REGISTER_IP_POLICY = {
  bucketSeconds: 60,
  maxHits: 20,
  route: "auth-register:ip"
};

const REGISTER_IP_IDENTIFIER_POLICY = {
  bucketSeconds: 60,
  maxHits: 5,
  route: "auth-register:ip+email"
};

function normalizeEmail(v: string | undefined): string | undefined {
  const s = (v || "").trim().toLowerCase();
  return s.length > 0 ? s : undefined;
}

export const handler: Handler = async (event) => {
  const requestId = getOrCreateRequestId(event.headers || {});
  const ctx = buildRequestContext(event, requestId);

  try {
    if ((event.httpMethod || "").toUpperCase() === "OPTIONS") {
      return jsonCorsPreflight(requestId);
    }

    requireMethod(event.httpMethod, ["POST"]);

    const req = parseJsonBody<AuthRegisterRequest>(event.body);
    const email = normalizeEmail(req.email);

    const ipKey = rateKeyFromContext(ctx);
    const ipLimit = await checkRateLimit(REGISTER_IP_POLICY, ipKey);
    if (!ipLimit.allowed) {
      return jsonTooManyRequests(requestId, ipLimit.retryAfterSeconds);
    }

    const ipEmailKey = makeRateKey([ctx.ip, email]);
    const ipEmailLimit = await checkRateLimit(REGISTER_IP_IDENTIFIER_POLICY, ipEmailKey);
    if (!ipEmailLimit.allowed) {
      return jsonTooManyRequests(requestId, ipEmailLimit.retryAfterSeconds);
    }

    const data = await register(req);
    return jsonOk(201, requestId, data);
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};

```

---

## File: netlify/functions/health-admin.ts

```ts
import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/lib/requestId.js";
import { getBearerToken } from "../../src/lib/authHeader.js";
import { jsonCorsPreflight, jsonOk, requireMethod, toErrorResponse } from "../../src/lib/response.js";
import { getHealthAdmin } from "../../src/services/healthAdminService.js";

export const handler: Handler = async (event) => {
  const requestId = getOrCreateRequestId(event.headers || {});
  try {
    if ((event.httpMethod || "").toUpperCase() === "OPTIONS") {
      return jsonCorsPreflight(requestId);
    }

    requireMethod(event.httpMethod, ["GET"]);

    const token = getBearerToken(event.headers || {});
    const data = await getHealthAdmin(token);

    return jsonOk(200, requestId, data);
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};

```

---

## File: netlify/functions/health.ts

```ts
import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/lib/requestId.js";
import { jsonCorsPreflight, jsonOk, requireMethod, toErrorResponse } from "../../src/lib/response.js";
import { getHealth } from "../../src/services/healthService.js";

export const handler: Handler = async (event) => {
  const requestId = getOrCreateRequestId(event.headers || {});
  try {
    if ((event.httpMethod || "").toUpperCase() === "OPTIONS") {
      return jsonCorsPreflight(requestId);
    }

    requireMethod(event.httpMethod, ["GET"]);
    const data = await getHealth();
    return jsonOk(200, requestId, data);
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};

```

---

## File: netlify/functions/me.ts

```ts
import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/lib/requestId.js";
import { jsonCorsPreflight, jsonOk, requireMethod, toErrorResponse } from "../../src/lib/response.js";
import { getBearerToken } from "../../src/lib/authHeader.js";
import { getMe } from "../../src/services/meService.js";

export const handler: Handler = async (event) => {
  const requestId = getOrCreateRequestId(event.headers || {});
  try {
    if ((event.httpMethod || "").toUpperCase() === "OPTIONS") {
      return jsonCorsPreflight(requestId);
    }

    requireMethod(event.httpMethod, ["GET"]);
    const token = getBearerToken(event.headers || {});
    const data = await getMe(token);
    return jsonOk(200, requestId, data);
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};

```

---

## File: netlify.toml

```
[build]
  functions = "netlify/functions"

[dev]
  framework = "#static"
  functions = "netlify/functions"
  port = 3999
  staticServerPort = 49000
  autoLaunch = false

```

---

## File: openapi.yaml

```yaml
openapi: 3.1.0
info:
  title: Identity Backend Service API
  version: 0.1.0
  description: |
    Backend-first identity API implemented with Netlify Functions.

    Notes:
    - This spec is the source of truth for the REST contract.
    - Some endpoints are planned and may not be implemented yet.
servers:
  - url: /
tags:
  - name: auth
    description: Authentication and session management
  - name: users
    description: User registration and profile

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    ErrorResponse:
      type: object
      additionalProperties: false
      required:
        - error
      properties:
        error:
          type: object
          additionalProperties: false
          required:
            - code
            - message
          properties:
            code:
              type: string
              description: Stable, machine-readable error code.
              examples:
                - UNAUTHORIZED
                - INVALID_CREDENTIALS
                - VALIDATION_ERROR
                - INTERNAL_ERROR
            message:
              type: string
              description: Human-readable error message.
            details:
              description: Optional error details.
    AuthProvider:
      type: string
      description: Authentication provider identifier.
      examples:
        - fake
        - postgres
    Session:
      type: object
      additionalProperties: false
      required:
        - accessToken
        - tokenType
      properties:
        accessToken:
          type: string
        tokenType:
          type: string
          description: Token type, usually "Bearer".
          examples:
            - Bearer
        expiresAt:
          type: string
          description: Optional expiry time in ISO 8601 format.
          examples:
            - "2026-03-02T12:34:56.000Z"
        refreshToken:
          type: string
          description: Optional refresh token (if issued).
    User:
      type: object
      additionalProperties: true
      required:
        - id
      properties:
        id:
          type: string
          description: Provider-unique user id.
        email:
          type: string
          format: email
        displayName:
          type: string
        roles:
          type: array
          items:
            type: string
    AuthResult:
      type: object
      additionalProperties: false
      required:
        - provider
        - session
        - user
      properties:
        provider:
          $ref: "#/components/schemas/AuthProvider"
        session:
          $ref: "#/components/schemas/Session"
        user:
          $ref: "#/components/schemas/User"
    AuthLoginRequest:
      type: object
      additionalProperties: false
      required:
        - username
        - password
      properties:
        username:
          type: string
          description: Username/email used to authenticate.
        password:
          type: string
          description: Password used to authenticate.
    AuthRegisterRequest:
      type: object
      additionalProperties: false
      required:
        - email
        - password
      properties:
        email:
          type: string
          format: email
        password:
          type: string
        displayName:
          type: string
    AuthRefreshRequest:
      type: object
      additionalProperties: false
      required:
        - refreshToken
      properties:
        refreshToken:
          type: string
    AuthLogoutRequest:
      type: object
      additionalProperties: false
      properties:
        refreshToken:
          type: string
          description: Optional refresh token to revoke, if applicable.
    MeResponse:
      type: object
      additionalProperties: false
      required:
        - provider
        - user
      properties:
        provider:
          $ref: "#/components/schemas/AuthProvider"
        user:
          $ref: "#/components/schemas/User"

paths:
  /auth-login:
    post:
      tags: [auth]
      summary: Login and create a session
      operationId: authLogin
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/AuthLoginRequest"
            examples:
              demo:
                value:
                  username: demo
                  password: letmein
      responses:
        "200":
          description: Authenticated session and user profile.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/AuthResult"
        "400":
          description: Validation error.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
        "401":
          description: Invalid credentials.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
        "500":
          description: Internal error.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"

  /me:
    get:
      tags: [users]
      summary: Get current user profile
      operationId: getMe
      security:
        - bearerAuth: []
      responses:
        "200":
          description: Current user profile.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MeResponse"
        "401":
          description: Missing or invalid access token.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
        "500":
          description: Internal error.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"

  /auth-register:
    post:
      tags: [auth]
      summary: Register a new user and create a session
      operationId: authRegister
      description: |
        Planned endpoint. When implemented, should create a new user and return an authenticated session.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/AuthRegisterRequest"
      responses:
        "201":
          description: User created and session issued.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/AuthResult"
        "400":
          description: Validation error.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
        "409":
          description: Email already exists.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
        "500":
          description: Internal error.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"

  /auth-refresh:
    post:
      tags: [auth]
      summary: Refresh an access token
      operationId: authRefresh
      description: |
        Planned endpoint. When implemented, should validate the refresh token and return a new session payload.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/AuthRefreshRequest"
      responses:
        "200":
          description: New session issued.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/AuthResult"
        "400":
          description: Validation error.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
        "401":
          description: Invalid or expired refresh token.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
        "500":
          description: Internal error.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"

  /auth-logout:
    post:
      tags: [auth]
      summary: Logout / revoke session tokens
      operationId: authLogout
      description: |
        Planned endpoint. When implemented, should revoke refresh token(s) if supported by the provider.
      security:
        - bearerAuth: []
      requestBody:
        required: false
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/AuthLogoutRequest"
      responses:
        "204":
          description: Logged out.
        "400":
          description: Validation error.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
        "401":
          description: Missing or invalid access token.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
        "500":
          description: Internal error.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"

```

---

## File: package.json

```json
{
  "name": "identity-backend-service",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "dev": "netlify dev --port 3999 --staticServerPort 49000",
    "build": "netlify functions:build --src netlify/functions --functions dist/functions",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "vitest",
    "test:run": "vitest run",
    "ci": "npm run lint && npm run typecheck && npm run test:run",
    "check:ci": "./scripts/check-ci-local.sh",
    "api:docs": "./scripts/api-docs.sh",
    "check:gh-ci-status": "./scripts/check-gh-ci-status.sh",
    "check:pg-local": "./scripts/check-pg-local.sh",
    "build:info": "./scripts/generate-build-info.sh"
  },
  "dependencies": {
    "pg": "^8.13.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.0",
    "@netlify/functions": "^2.8.0",
    "@redocly/cli": "^2.20.1",
    "@types/node": "^22.10.2",
    "@types/pg": "^8.11.10",
    "@typescript-eslint/eslint-plugin": "^8.10.0",
    "@typescript-eslint/parser": "^8.10.0",
    "eslint": "^9.9.0",
    "eslint-config-prettier": "^9.1.0",
    "globals": "^15.9.0",
    "netlify-cli": "^18.0.0",
    "prettier": "^3.3.3",
    "typescript": "^5.9.3",
    "vitest": "^2.1.8",
    "widdershins": "^4.0.1"
  }
}

```

---

## File: .prettierignore

```
dist/
node_modules/
.netlify/
coverage/

```

---

## File: .prettierrc.json

```json
{
  "singleQuote": false,
  "semi": true,
  "trailingComma": "all",
  "printWidth": 100
}

```

---

## File: project-status.json

```json
{
  "workPackage": "identity-backend",
  "phase": 5,
  "step": "5.5.3",
  "description": "Environment handling, CI stabilization, and build metadata"
}

```

---

## File: scripts/api-docs.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# Generate API documentation from openapi.yaml:
# - Markdown: docs/api.md
# - HTML:     docs/api.html
#
# Installs required dev dependencies if missing:
#   - widdershins
#   - @redocly/cli

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f "openapi.yaml" ]]; then
  echo "ERROR: openapi.yaml not found in project root" >&2
  exit 2
fi

mkdir -p docs/generated

need_install=0
if [[ ! -x "node_modules/.bin/widdershins" ]]; then
  need_install=1
fi
if [[ ! -x "node_modules/.bin/redocly" ]]; then
  need_install=1
fi

if [[ "$need_install" -eq 1 ]]; then
  npm install --save-dev widdershins @redocly/cli
fi

npx widdershins openapi.yaml -o docs/api.md
npx redocly build-docs openapi.yaml --output docs/api.html

echo "OK: generated docs/api.md"
echo "OK: generated docs/api.html"

```

---

## File: scripts/architecture-diagram.txt

```
Identity Backend Service (Netlify Functions + Postgres)

+-------------------+                         +-----------------------------+
| Client / Curl /   |  HTTPS                  | Netlify Site / Functions    |
| App (trusted UI)  +------------------------>+  /.netlify/functions/*      |
+---------+---------+                         +--------------+--------------+
          |                                                   |
          | Authorization: Bearer <access token>              |
          |                                                   |
          v                                                   v
+-------------------+                         +-----------------------------+
| auth-login         |  validate creds        | src/services/*              |
| auth-refresh       +----------------------->| - authService               |
| auth-logout        |                         | - postgresAuthProvider      |
| me                 |                         | - fakeAuthProvider          |
| admin-users        |                         | - adminUsersService         |
| health             |                         | - healthService             |
| health-admin       |  ADMIN-only details     | - healthAdminService        |
+-------------------+                         +--------------+--------------+
                                                             |
                                                             | pg.Pool
                                                             v
                                                +-----------------------------+
                                                | Neon Postgres               |
                                                | schema: identity            |
                                                | - users                     |
                                                | - sessions                  |
                                                | - audit_log                 |
                                                | - login_failures / lockouts |
                                                +-----------------------------+

Notes:
- /health is safe for public use (booleans + basic diagnostics).
- /health-admin is protected (admin bearer token) and may reveal more config detail.
- Passwords and secrets must never be returned; prefer fingerprints + masked values.


```

---

## File: scripts/check-ci-local.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# Local CI parity check.
#
# Runs the same default steps CI should run, using a clean install to surface issues early.
#
# Usage:
#   ./scripts/check-ci-local.sh
#   ./scripts/check-ci-local.sh --no-install
#   ./scripts/check-ci-local.sh --no-tests
#   ./scripts/check-ci-local.sh --no-typecheck
#   ./scripts/check-ci-local.sh --no-lint
#
# Notes:
# - Default uses `npm ci` for parity with CI.
# - Default test run is the deterministic fake-provider suite.
# - Postgres-backed tests are intentionally separate via ./scripts/check-pg-local.sh.
# - If you want faster iteration after you've already installed deps, use --no-install.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export APP_ENV="${APP_ENV:-dev}"
# shellcheck disable=SC1091
source "$SCRIPT_DIR/load-env.sh"

ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "$ROOT_DIR"

NO_INSTALL=0
NO_LINT=0
NO_TYPECHECK=0
NO_TESTS=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-install)
      NO_INSTALL=1
      shift
      ;;
    --no-lint)
      NO_LINT=1
      shift
      ;;
    --no-typecheck)
      NO_TYPECHECK=1
      shift
      ;;
    --no-tests)
      NO_TESTS=1
      shift
      ;;
    -*)
      echo "ERROR: unknown option: $1" >&2
      exit 2
      ;;
    *)
      echo "ERROR: unexpected argument: $1" >&2
      exit 2
      ;;
  esac
done

step() {
  local msg="$1"
  echo ""
  echo "==> $msg"
}

if [[ "$NO_INSTALL" -ne 1 ]]; then
  step "npm ci"
  npm ci
else
  step "skip install (--no-install)"
fi

if [[ "$NO_LINT" -ne 1 ]]; then
  step "npm run lint"
  npm run lint
else
  step "skip lint (--no-lint)"
fi

if [[ "$NO_TYPECHECK" -ne 1 ]]; then
  step "npm run typecheck"
  npm run typecheck
else
  step "skip typecheck (--no-typecheck)"
fi

if [[ "$NO_TESTS" -ne 1 ]]; then
  step "npm run test:run"

  # Default local CI parity should be deterministic and not depend on a live Postgres DB.
  export AUTH_PROVIDER=fake
  unset RUN_PG_TESTS || true

  npm run test:run
else
  step "skip tests (--no-tests)"
fi

echo ""
echo "OK: local CI checks passed."

```

---

## File: scripts/check-gh-ci-status.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# check-gh-ci-status.sh
#
# Purpose:
#   Exit 0 if the most recent GitHub Actions run for the CI workflow on the given branch succeeded.
#   Exit non-zero otherwise.
#
# Usage:
#   ./scripts/check-gh-ci-status.sh
#   ./scripts/check-gh-ci-status.sh main
#
# Requirements:
#   - gh CLI authenticated (gh auth status)
#
# Notes:
#   Resolves the workflow by file path/name first, because display-name matching can be unreliable.

branch="${1:-}"

if ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: gh CLI not found. Install GitHub CLI and authenticate: gh auth login" >&2
  exit 2
fi

if command -v git >/dev/null 2>&1; then
  if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "ERROR: Not inside a git repository." >&2
    exit 2
  fi
fi

if [[ -z "$branch" ]]; then
  if command -v git >/dev/null 2>&1; then
    branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
  fi
fi
if [[ -z "$branch" ]]; then
  branch="main"
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "ERROR: gh is not authenticated. Run: gh auth login" >&2
  exit 2
fi

resolve_workflow_ref() {
  local candidate

  for candidate in ".github/workflows/ci.yml" "ci.yml" "CI"; do
    if gh run list --workflow "$candidate" --branch "$branch" --limit 1 >/dev/null 2>&1; then
      printf '%s\n' "$candidate"
      return 0
    fi
  done

  return 1
}

workflow_ref="$(resolve_workflow_ref || true)"

if [[ -z "$workflow_ref" ]]; then
  echo "ERROR: Could not resolve the CI workflow by .github/workflows/ci.yml, ci.yml, or CI." >&2
  exit 3
fi

status="$(gh run list --workflow "$workflow_ref" --branch "$branch" --limit 1 --json status --jq '.[0].status // empty' || true)"
conclusion="$(gh run list --workflow "$workflow_ref" --branch "$branch" --limit 1 --json conclusion --jq '.[0].conclusion // empty' || true)"
url="$(gh run list --workflow "$workflow_ref" --branch "$branch" --limit 1 --json url --jq '.[0].url // empty' || true)"
title="$(gh run list --workflow "$workflow_ref" --branch "$branch" --limit 1 --json displayTitle --jq '.[0].displayTitle // empty' || true)"

if [[ -z "$status" && -z "$conclusion" ]]; then
  echo "ERROR: No CI runs found for branch '$branch' (workflow: $workflow_ref)." >&2
  exit 4
fi

if [[ "$status" != "completed" ]]; then
  echo "CI is not completed yet on branch '$branch'."
  echo "  workflow:   $workflow_ref"
  echo "  status:     $status"
  echo "  conclusion: ${conclusion:-<none>}"
  echo "  title:      ${title:-<none>}"
  echo "  url:        ${url:-<none>}"
  exit 5
fi

if [[ "$conclusion" != "success" ]]; then
  echo "CI is completed but NOT successful on branch '$branch'."
  echo "  workflow:   $workflow_ref"
  echo "  status:     $status"
  echo "  conclusion: $conclusion"
  echo "  title:      ${title:-<none>}"
  echo "  url:        ${url:-<none>}"
  exit 6
fi

echo "CI is SUCCESS on branch '$branch'."
echo "  workflow: $workflow_ref"
echo "  title:    ${title:-<none>}"
echo "  url:      ${url:-<none>}"
exit 0

```

---

## File: scripts/check-pg-local.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# Optional Postgres-backed local test entry point.
# This keeps DB-backed tests explicit and separate from the default fake-provider local CI run.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export APP_ENV="${APP_ENV:-dev}"
# shellcheck disable=SC1091
source "$SCRIPT_DIR/load-env.sh"

ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "$ROOT_DIR"

echo "==> npm run test:run (Postgres mode)"
export AUTH_PROVIDER=postgres
export RUN_PG_TESTS=1
npm run test:run

```

---

## File: scripts/dev-demo-client.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# Runs the demo client dev server (Vite) from the repo root.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR/demo-client"

if [[ ! -f "package.json" ]]; then
  echo "ERROR: demo-client/package.json not found" >&2
  exit 2
fi

if [[ ! -d "node_modules" ]]; then
  echo "Installing demo-client dependencies..."
  npm install
fi

npm run dev

```

---

## File: scripts/generate-build-info.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PACKAGE_JSON="$ROOT_DIR/package.json"
PROJECT_STATUS_JSON="$ROOT_DIR/project-status.json"
OUT_FILE="$ROOT_DIR/src/generated/buildInfo.ts"

if [[ ! -f "$PACKAGE_JSON" ]]; then
  echo "ERROR: package.json not found" >&2
  exit 2
fi

if [[ ! -f "$PROJECT_STATUS_JSON" ]]; then
  echo "ERROR: project-status.json not found" >&2
  exit 2
fi

version="$(python3 - <<'PY'
import json
from pathlib import Path
pkg = json.loads(Path("package.json").read_text())
print(pkg.get("version", "0.0.0"))
PY
)"

project_name="$(python3 - <<'PY'
import json
from pathlib import Path
pkg = json.loads(Path("package.json").read_text())
print(pkg.get("name", "identity-backend-service"))
PY
)"

readarray -t status_fields < <(python3 - <<'PY'
import json
from pathlib import Path
data = json.loads(Path("project-status.json").read_text())
print(data.get("workPackage", ""))
print(data.get("phase", ""))
print(data.get("step", ""))
print(data.get("description", ""))
PY
)

work_package="${status_fields[0]:-}"
phase="${status_fields[1]:-}"
step="${status_fields[2]:-}"
description="${status_fields[3]:-}"

sha="${GITHUB_SHA:-${NETLIFY_COMMIT_REF:-${COMMIT_REF:-}}}"
if [[ -z "$sha" ]] && command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  sha="$(git rev-parse HEAD 2>/dev/null || true)"
fi

short_sha=""
if [[ -n "$sha" ]]; then
  short_sha="${sha:0:7}"
fi

build_time="${BUILD_TIME:-}"
if [[ -z "$build_time" ]]; then
  build_time="$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")"
fi

build_id="${GITHUB_RUN_ID:-${BUILD_ID:-${DEPLOY_ID:-}}}"

branch="${GITHUB_REF_NAME:-${BRANCH:-${HEAD:-}}}"
if [[ -z "$branch" ]] && command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
fi

app_env="${APP_ENV:-${CONTEXT:-}}"

export BUILDINFO_PROJECT_NAME="$project_name"
export BUILDINFO_VERSION="$version"
export BUILDINFO_BUILD_TIME="$build_time"
export BUILDINFO_SHA="$sha"
export BUILDINFO_SHORT_SHA="$short_sha"
export BUILDINFO_BUILD_ID="$build_id"
export BUILDINFO_BRANCH="$branch"
export BUILDINFO_APP_ENV="$app_env"
export BUILDINFO_WORK_PACKAGE="$work_package"
export BUILDINFO_PHASE="$phase"
export BUILDINFO_STEP="$step"
export BUILDINFO_DESCRIPTION="$description"

python3 - <<'PY'
import json
import os
from pathlib import Path

def ts_optional_str(name: str, value: str) -> str:
    if value:
        return f"  {name}: {json.dumps(value)},\n"
    return ""

def ts_optional_num(name: str, value: str) -> str:
    if value:
        try:
            num = int(value)
        except ValueError:
            return f"  {name}: {json.dumps(value)},\n"
        return f"  {name}: {num},\n"
    return ""

project_name = os.environ["BUILDINFO_PROJECT_NAME"]
version = os.environ["BUILDINFO_VERSION"]
build_time = os.environ["BUILDINFO_BUILD_TIME"]
sha = os.environ.get("BUILDINFO_SHA", "")
short_sha = os.environ.get("BUILDINFO_SHORT_SHA", "")
build_id = os.environ.get("BUILDINFO_BUILD_ID", "")
branch = os.environ.get("BUILDINFO_BRANCH", "")
app_env = os.environ.get("BUILDINFO_APP_ENV", "")
work_package = os.environ.get("BUILDINFO_WORK_PACKAGE", "")
phase = os.environ.get("BUILDINFO_PHASE", "")
step = os.environ.get("BUILDINFO_STEP", "")
description = os.environ.get("BUILDINFO_DESCRIPTION", "")

content = (
    "export type GeneratedBuildInfo = {\n"
    "  projectName: string;\n"
    "  version: string;\n"
    "  buildTime: string;\n"
    "  sha?: string;\n"
    "  shortSha?: string;\n"
    "  buildId?: string;\n"
    "  branch?: string;\n"
    "  appEnv?: string;\n"
    "  workPackage?: string;\n"
    "  phase?: number | string;\n"
    "  step?: string;\n"
    "  description?: string;\n"
    "};\n\n"
    "export const GENERATED_BUILD_INFO: GeneratedBuildInfo = {\n"
    f"  projectName: {json.dumps(project_name)},\n"
    f"  version: {json.dumps(version)},\n"
    f"  buildTime: {json.dumps(build_time)},\n"
    f"{ts_optional_str('sha', sha)}"
    f"{ts_optional_str('shortSha', short_sha)}"
    f"{ts_optional_str('buildId', build_id)}"
    f"{ts_optional_str('branch', branch)}"
    f"{ts_optional_str('appEnv', app_env)}"
    f"{ts_optional_str('workPackage', work_package)}"
    f"{ts_optional_num('phase', phase)}"
    f"{ts_optional_str('step', step)}"
    f"{ts_optional_str('description', description)}"
    "};\n"
)

Path("src/generated/buildInfo.ts").write_text(content)
PY

echo "OK: wrote $OUT_FILE"

```

---

## File: scripts/get-admin-token.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# Logs in using the seeded admin user and prints ONLY the access token.
#
# Usage:
#   ./scripts/get-admin-token.sh [BASE_URL]
#
# Examples:
#   ./scripts/get-admin-token.sh https://auth-backend-netlify.netlify.app
#   BASE_URL=http://localhost:3999 ./scripts/get-admin-token.sh

BASE_URL="${1:-${BASE_URL:-}}"
BASE_URL="${BASE_URL%/}"

if [[ -z "${BASE_URL}" ]]; then
  echo "Usage: $0 [BASE_URL]" >&2
  exit 2
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "ERROR: curl required" >&2
  exit 2
fi

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: node required" >&2
  exit 2
fi

USERNAME="${ADMIN_USERNAME:-admin}"
PASSWORD="${ADMIN_PASSWORD:-196900}"

LOGIN_URL="${BASE_URL}/.netlify/functions/auth-login"

tmp_headers="$(mktemp)"
tmp_body="$(mktemp)"
cleanup() {
  rm -f "$tmp_headers" "$tmp_body"
}
trap cleanup EXIT

curl -sS \
  -D "$tmp_headers" \
  -o "$tmp_body" \
  -H "content-type: application/json" \
  -X POST \
  "$LOGIN_URL" \
  -d "{\"username\":\"${USERNAME}\",\"password\":\"${PASSWORD}\"}"

status="$(awk 'NR==1{print $2}' "$tmp_headers" || true)"
content_type="$(awk -F': ' 'tolower($1)=="content-type"{print $2; exit}' "$tmp_headers" | tr -d '\r' || true)"

if [[ ! -s "$tmp_body" ]]; then
  echo "ERROR: auth-login returned empty body (status=${status:-unknown}, content-type=${content_type:-unknown})" >&2
  echo "URL: $LOGIN_URL" >&2
  exit 1
fi

token="$(
  node -e '
    const fs = require("fs");
    const raw = fs.readFileSync(0, "utf8");
    let j;
    try { j = JSON.parse(raw); }
    catch (e) {
      console.error("ERROR: auth-login response was not valid JSON");
      process.exit(2);
    }
    if (!j || typeof j !== "object" || j.ok !== true) {
      console.error("ERROR: auth-login returned ok:false");
      process.exit(3);
    }
    const t = j?.data?.session?.accessToken;
    if (!t || typeof t !== "string" || t.length < 10) {
      console.error("ERROR: missing accessToken in auth-login response");
      process.exit(4);
    }
    process.stdout.write(t);
  ' < "$tmp_body" 2>/dev/null || true
)"

if [[ -z "$token" ]]; then
  # Try again but show useful diagnostics
  echo "ERROR: failed to extract access token from auth-login response." >&2
  echo "status=${status:-unknown} content-type=${content_type:-unknown}" >&2
  echo "URL: $LOGIN_URL" >&2
  echo "--- response (first 400 chars) ---" >&2
  head -c 400 "$tmp_body" >&2 || true
  echo "" >&2
  exit 1
fi

printf '%s\n' "$token"

```

---

## File: scripts/health-admin.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# ------------------------------------------------------------------
# health-admin.sh
#
# Calls the authenticated health-admin endpoint (admin-only).
#
# Default: human readable output
# --json : raw JSON output only
# --watch: repeatedly poll and print (human-readable only)
#   --interval <seconds>  (default: 2)
#
# Usage:
#   ./scripts/health-admin.sh [BASE_URL]
#   ./scripts/health-admin.sh --json [BASE_URL]
#   ./scripts/health-admin.sh --watch [--interval N] [BASE_URL]
# ------------------------------------------------------------------

JSON=false
WATCH=false
INTERVAL_SECONDS=2

while [[ $# -gt 0 ]]; do
  case "$1" in
    --json)
      JSON=true
      shift
      ;;
    --watch)
      WATCH=true
      shift
      ;;
    --interval)
      shift
      if [[ $# -lt 1 ]]; then
        echo "ERROR: --interval requires a number of seconds" >&2
        exit 2
      fi
      INTERVAL_SECONDS="$1"
      shift
      ;;
    -*)
      echo "ERROR: unknown option: $1" >&2
      exit 2
      ;;
    *)
      break
      ;;
  esac
done

BASE_URL="${1:-${BASE_URL:-http://localhost:3999}}"
BASE_URL="${BASE_URL%/}"

if ! command -v curl >/dev/null 2>&1; then
  echo "ERROR: curl required" >&2
  exit 2
fi

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: node required" >&2
  exit 2
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ ! -x "${SCRIPT_DIR}/get-admin-token.sh" ]]; then
  echo "ERROR: scripts/get-admin-token.sh not found or not executable" >&2
  exit 2
fi

URL="${BASE_URL}/.netlify/functions/health-admin"

FETCH_STATUS=""
FETCH_CONTENT_TYPE=""

get_token() {
  "${SCRIPT_DIR}/get-admin-token.sh" "$BASE_URL"
}

fetch_health_admin() {
  local token="$1"
  local tmp_headers
  local tmp_body
  local status
  local content_type

  tmp_headers="$(mktemp)"
  tmp_body="$(mktemp)"
  cleanup_fetch() {
    rm -f "$tmp_headers" "$tmp_body"
  }
  trap cleanup_fetch RETURN

  curl -sS \
    -D "$tmp_headers" \
    -o "$tmp_body" \
    -H "accept: application/json" \
    -H "authorization: Bearer ${token}" \
    "$URL" || true

  status="$(awk 'NR==1{print $2}' "$tmp_headers" || true)"
  content_type="$(awk -F': ' 'tolower($1)=="content-type"{print $2; exit}' "$tmp_headers" | tr -d '\r' || true)"

  FETCH_STATUS="${status:-unknown}"
  FETCH_CONTENT_TYPE="${content_type:-unknown}"

  if [[ ! -s "$tmp_body" ]]; then
    echo ""
    return 0
  fi

  cat "$tmp_body"
}

fetch_json_with_reauth() {
  local token="$1"
  local raw

  raw="$(fetch_health_admin "$token")"

  # If token is expired/invalid, re-login once and retry.
  if [[ "${FETCH_STATUS}" == "401" || "${FETCH_STATUS}" == "403" ]]; then
    token="$(get_token || true)"
    if [[ -z "${token}" ]]; then
      echo ""
      return 1
    fi
    raw="$(fetch_health_admin "$token")"
    printf '%s' "${raw}"
    # Echo token back to caller via global.
    TOKEN_CURRENT="${token}"
    return 0
  fi

  printf '%s' "${raw}"
  TOKEN_CURRENT="${token}"
  return 0
}

print_human() {
  node -e '
const fs = require("fs");

const raw = fs.readFileSync(0, "utf8");
let j;

try {
  j = JSON.parse(raw);
} catch {
  console.error("ERROR: health-admin response was not JSON");
  console.error("");
  console.error("--- raw response ---");
  console.error(raw.trim().slice(0, 2000));
  process.exit(1);
}

const pg =
  j?.data?.postgres ||
  j?.postgres ||
  (j?.data?.envValues?.postgres ? j.data.envValues.postgres : undefined);

if (!pg) {
  console.log(JSON.stringify(j, null, 2));
  process.exit(0);
}

console.log("Postgres Observability");
console.log("----------------------");

if (pg.connectMs !== undefined) console.log("connect latency      :", pg.connectMs, "ms");
if (pg.queryMs !== undefined) console.log("query latency        :", pg.queryMs, "ms");
if (pg.activeSessions !== undefined) console.log("active sessions      :", pg.activeSessions);
if (pg.revokedSessions !== undefined) console.log("revoked sessions     :", pg.revokedSessions);
if (pg.failedLoginCountLastHour !== undefined) console.log("failed logins (1h)   :", pg.failedLoginCountLastHour);

console.log("");

if (pg.host) console.log("host                 :", pg.host);
if (pg.database) console.log("database             :", pg.database);
if (pg.user) console.log("user                 :", pg.user);
if (pg.port) console.log("port                 :", pg.port);
if (pg.sslMode) console.log("ssl mode             :", pg.sslMode);
if (pg.passwordSet !== undefined) console.log("password set         :", pg.passwordSet);
if (pg.configFingerprint) console.log("config fingerprint   :", pg.configFingerprint);
'
}

watch_extract_banner() {
  node -e '
const fs = require("fs");
const raw = fs.readFileSync(0, "utf8");
let j;
try { j = JSON.parse(raw); } catch { process.exit(2); }

const pg =
  j?.data?.postgres ||
  j?.postgres ||
  (j?.data?.envValues?.postgres ? j.data.envValues.postgres : undefined);

if (!pg) process.exit(3);

function s(v) { return (typeof v === "string" && v.length) ? v : "-"; }

const host = s(pg.host);
const finger = s(pg.configFingerprint);

process.stdout.write(host + "\n" + finger + "\n");
'
}

watch_print_header() {
  printf '%-16s %-6s %-6s %-5s %-5s %-7s\n' "ts" "conn" "qry" "act" "rev" "fail1h"
}

watch_print_line() {
  node -e '
const fs = require("fs");
const raw = fs.readFileSync(0, "utf8");
let j;
try { j = JSON.parse(raw); } catch { process.exit(2); }

const pg =
  j?.data?.postgres ||
  j?.postgres ||
  (j?.data?.envValues?.postgres ? j.data.envValues.postgres : undefined);

if (!pg) process.exit(3);

function n(v) { return (typeof v === "number" && Number.isFinite(v)) ? String(v) : "-"; }

function ts() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const HH = String(d.getHours()).padStart(2, "0");
  const MM = String(d.getMinutes()).padStart(2, "0");
  const SS = String(d.getSeconds()).padStart(2, "0");
  const ms = String(d.getMilliseconds()).padStart(3, "0");
  return `${dd}-${mm} ${HH}:${MM}:${SS}.${ms}`;
}

const conn = n(pg.connectMs);
const qry = n(pg.queryMs);
const act = n(pg.activeSessions);
const rev = n(pg.revokedSessions);
const fail1h = n(pg.failedLoginCountLastHour);

const line =
  ts().padEnd(16) + " " +
  (conn + "ms").padEnd(6) + " " +
  (qry + "ms").padEnd(6) + " " +
  act.padEnd(5) + " " +
  rev.padEnd(5) + " " +
  fail1h.padEnd(7);

process.stdout.write(line + "\n");
'
}

if [[ "${WATCH}" == true && "${JSON}" == true ]]; then
  echo "ERROR: --watch cannot be combined with --json" >&2
  exit 2
fi

# Acquire token once for the run (avoid auth-login rate limits). Reauth only on 401/403 from health-admin.
TOKEN_CURRENT="$(get_token || true)"
if [[ -z "${TOKEN_CURRENT}" ]]; then
  echo "ERROR: Failed to obtain admin token." >&2
  exit 1
fi

if [[ "${WATCH}" == true ]]; then
  if ! [[ "${INTERVAL_SECONDS}" =~ ^[0-9]+$ ]]; then
    echo "ERROR: --interval must be an integer number of seconds" >&2
    exit 2
  fi

  echo "health-admin --watch  baseUrl=${BASE_URL}  interval=${INTERVAL_SECONDS}s" >&2
  echo "endpoint: ${URL}" >&2

  FETCH_STATUS=""
  FETCH_CONTENT_TYPE=""
  first="$(fetch_json_with_reauth "${TOKEN_CURRENT}" || true)"
  TOKEN_CURRENT="${TOKEN_CURRENT:-${TOKEN_CURRENT}}"

  if [[ -z "${first}" ]]; then
    echo "ERROR: initial fetch failed (status=${FETCH_STATUS:-unknown} content-type=${FETCH_CONTENT_TYPE:-unknown})" >&2
    exit 1
  fi

  banner="$(printf '%s' "${first}" | watch_extract_banner || true)"
  if [[ -z "${banner}" ]]; then
    echo "ERROR: health-admin response did not contain postgres banner data (status=${FETCH_STATUS:-unknown} content-type=${FETCH_CONTENT_TYPE:-unknown})" >&2
    exit 1
  fi

  host="$(printf '%s\n' "${banner}" | sed -n '1p')"
  finger="$(printf '%s\n' "${banner}" | sed -n '2p')"

  echo "" >&2
  echo "pg.host   : ${host}" >&2
  echo "pg.finger : ${finger}" >&2
  echo "" >&2

  watch_print_header
  printf '%s' "${first}" | watch_print_line || true

  while true; do
    FETCH_STATUS=""
    FETCH_CONTENT_TYPE=""
    raw="$(fetch_json_with_reauth "${TOKEN_CURRENT}" || true)"
    TOKEN_CURRENT="${TOKEN_CURRENT:-${TOKEN_CURRENT}}"

    if [[ -z "${raw}" ]]; then
      ts="$(date +'%d-%m %H:%M:%S.000')"
      printf '%-16s %-6s %-6s %-5s %-5s %-7s\n' "${ts}" "-ms" "-ms" "-" "-" "-"
    else
      if ! printf '%s' "${raw}" | watch_print_line; then
        ts="$(date +'%d-%m %H:%M:%S.000')"
        printf '%-16s %-6s %-6s %-5s %-5s %-7s\n' "${ts}" "-ms" "-ms" "-" "-" "-"
      fi
    fi

    sleep "${INTERVAL_SECONDS}"
  done
fi

# Single-shot mode (token already acquired above)
FETCH_STATUS=""
FETCH_CONTENT_TYPE=""
raw="$(fetch_json_with_reauth "${TOKEN_CURRENT}" || true)"
TOKEN_CURRENT="${TOKEN_CURRENT:-${TOKEN_CURRENT}}"

if [[ -z "${raw}" ]]; then
  echo "ERROR: health-admin returned empty body (status=${FETCH_STATUS:-unknown}, content-type=${FETCH_CONTENT_TYPE:-unknown})" >&2
  exit 1
fi

if [[ "${JSON}" == true ]]; then
  printf '%s\n' "${raw}"
  exit 0
fi

if ! printf '%s' "${raw}" | print_human; then
  echo "" >&2
  echo "Diagnostics: status=${FETCH_STATUS:-unknown} content-type=${FETCH_CONTENT_TYPE:-unknown}" >&2
  exit 1
fi

echo ""

```

---

## File: scripts/health.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# Pretty-print the /health endpoint and optionally show a focused env summary.
#
# Usage:
#   scripts/health.sh [--debug] [--env-only] [BASE_URL]
#
# Examples:
#   scripts/health.sh
#   scripts/health.sh https://auth-backend-netlify.netlify.app
#   scripts/health.sh --env-only https://auth-backend-netlify.netlify.app
#   BASE_URL=http://localhost:3999 scripts/health.sh
#
# Notes:
# - Uses node (no jq dependency).
# - Expects the standard envelope: { ok, requestId, data: ... }

DEBUG=0
ENV_ONLY=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --debug)
      DEBUG=1
      shift
      ;;
    --env-only)
      ENV_ONLY=1
      shift
      ;;
    -*)
      echo "ERROR: unknown option: $1" >&2
      exit 2
      ;;
    *)
      break
      ;;
  esac
done

BASE_URL="${1:-${BASE_URL:-http://localhost:3999}}"
BASE_URL="${BASE_URL%/}"

if ! command -v curl >/dev/null 2>&1; then
  echo "ERROR: curl is required" >&2
  exit 2
fi

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: node is required" >&2
  exit 2
fi

URL="${BASE_URL}/.netlify/functions/health"

if [[ "$DEBUG" -eq 1 ]]; then
  echo "[DEBUG] GET $URL" >&2
fi

raw="$(curl -sS "$URL")"

# Pretty-print full envelope (or env-only) using node.
if [[ "$ENV_ONLY" -eq 1 ]]; then
  echo "$raw" | node -e '
    const fs = require("fs");
    const raw = fs.readFileSync(0, "utf8").trim();
    let j;
    try { j = JSON.parse(raw); } catch (e) { console.error("ERROR: invalid JSON"); process.exit(1); }
    const data = j && typeof j === "object" ? (j.data ?? j) : null;
    const env = data && typeof data === "object" ? (data.env ?? (data.data ? data.data.env : undefined)) : undefined;

    if (!env) {
      console.log(JSON.stringify({ error: "missing env in response", haveKeys: data ? Object.keys(data) : [] }, null, 2));
      process.exit(0);
    }

    console.log(JSON.stringify(env, null, 2));
  '
  exit 0
fi

echo "$raw" | node -e '
  const fs = require("fs");
  const raw = fs.readFileSync(0, "utf8").trim();
  let j;
  try { j = JSON.parse(raw); } catch (e) { console.error("ERROR: invalid JSON"); process.exit(1); }
  console.log(JSON.stringify(j, null, 2));
'

# Add a concise human summary after JSON, without extra dependencies.
echo ""
echo "Summary:"
echo "$raw" | node -e '
  const fs = require("fs");
  const raw = fs.readFileSync(0, "utf8").trim();
  let j;
  try { j = JSON.parse(raw); } catch { process.exit(0); }

  const ok = j && typeof j === "object" ? j.ok : undefined;
  const rid = j && typeof j === "object" ? j.requestId : undefined;
  const data = j && typeof j === "object" ? j.data : undefined;

  function b(v) { return v ? "yes" : "no"; }

  const d = (data && typeof data === "object") ? data : {};
  const env = (d.env && typeof d.env === "object") ? d.env : {};
  const pg = (env.postgres && typeof env.postgres === "object") ? env.postgres : {};

  const authProvider = env.authProvider ?? "<unset>";
  const nodeVer = d.build && d.build.node ? d.build.node : "<unknown>";

  console.log(`  ok        : ${ok === true ? "true" : ok === false ? "false" : "<unknown>"}`);
  if (rid) console.log(`  requestId : ${rid}`);
  console.log(`  node      : ${nodeVer}`);
  console.log(`  provider  : ${authProvider}`);
  console.log(`  postgres  : host=${b(pg.hasHost)} db=${b(pg.hasDatabase)} user=${b(pg.hasUser)} pass=${b(pg.hasPassword)} port=${b(pg.hasPort)} sslmode=${b(pg.hasSslMode)}`);
'


```

---

## File: scripts/load-env.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# ------------------------------------------------------------
# load-env.sh
#
# Loads environment variables for the selected environment.
#
# Layout:
#   environment/
#     dev/
#       db/.env
#       server/.env
#     prod/
#       db/.env
#       server/.env
#
# Behaviour:
#   • APP_ENV selects environment (default: dev)
#   • Existing env vars are NOT overwritten
#   • DB_* variables are the single source of truth
#   • Compatibility vars are derived based on DB_DIALECT
# ------------------------------------------------------------

APP_ENV="${APP_ENV:-dev}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

DB_ENV_FILE="$ROOT_DIR/environment/$APP_ENV/db/.env"
SERVER_ENV_FILE="$ROOT_DIR/environment/$APP_ENV/server/.env"

load_env_preserve_existing() {
  local file="$1"
  local line key value

  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ -z "$line" ]] && continue
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    [[ "$line" != *=* ]] && continue

    key="${line%%=*}"
    value="${line#*=}"

    key="$(printf '%s' "$key" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"

    [[ -z "$key" ]] && continue

    if [[ -n "${!key:-}" ]]; then
      continue
    fi

    export "$key=$value"
  done < "$file"
}

if [[ ! -f "$DB_ENV_FILE" ]]; then
  echo "ERROR: Missing DB env file: $DB_ENV_FILE" >&2
  exit 2
fi

if [[ ! -f "$SERVER_ENV_FILE" ]]; then
  echo "ERROR: Missing server env file: $SERVER_ENV_FILE" >&2
  exit 2
fi

load_env_preserve_existing "$DB_ENV_FILE"
load_env_preserve_existing "$SERVER_ENV_FILE"

case "${DB_DIALECT:-postgres}" in
  postgres)
    if [[ -n "${DB_HOST:-}" && -z "${PGHOST:-}" ]]; then
      export PGHOST="$DB_HOST"
    fi
    if [[ -n "${DB_PORT:-}" && -z "${PGPORT:-}" ]]; then
      export PGPORT="$DB_PORT"
    fi
    if [[ -n "${DB_NAME:-}" && -z "${PGDATABASE:-}" ]]; then
      export PGDATABASE="$DB_NAME"
    fi
    if [[ -n "${DB_USER:-}" && -z "${PGUSER:-}" ]]; then
      export PGUSER="$DB_USER"
    fi
    if [[ -n "${DB_PASSWORD:-}" && -z "${PGPASSWORD:-}" ]]; then
      export PGPASSWORD="$DB_PASSWORD"
    fi
    if [[ -n "${DB_SSLMODE:-}" && -z "${PGSSLMODE:-}" ]]; then
      export PGSSLMODE="$DB_SSLMODE"
    fi
    ;;
  mysql)
    if [[ -n "${DB_HOST:-}" && -z "${MYSQL_HOST:-}" ]]; then
      export MYSQL_HOST="$DB_HOST"
    fi
    if [[ -n "${DB_PORT:-}" && -z "${MYSQL_PORT:-}" ]]; then
      export MYSQL_PORT="$DB_PORT"
    fi
    if [[ -n "${DB_NAME:-}" && -z "${MYSQL_DATABASE:-}" ]]; then
      export MYSQL_DATABASE="$DB_NAME"
    fi
    if [[ -n "${DB_USER:-}" && -z "${MYSQL_USER:-}" ]]; then
      export MYSQL_USER="$DB_USER"
    fi
    if [[ -n "${DB_PASSWORD:-}" && -z "${MYSQL_PASSWORD:-}" ]]; then
      export MYSQL_PASSWORD="$DB_PASSWORD"
    fi
    ;;
  oracle)
    if [[ -n "${DB_HOST:-}" && -z "${ORACLE_HOST:-}" ]]; then
      export ORACLE_HOST="$DB_HOST"
    fi
    if [[ -n "${DB_PORT:-}" && -z "${ORACLE_PORT:-}" ]]; then
      export ORACLE_PORT="$DB_PORT"
    fi
    if [[ -n "${DB_NAME:-}" && -z "${ORACLE_SERVICE_NAME:-}" ]]; then
      export ORACLE_SERVICE_NAME="$DB_NAME"
    fi
    if [[ -n "${DB_USER:-}" && -z "${ORACLE_USER:-}" ]]; then
      export ORACLE_USER="$DB_USER"
    fi
    if [[ -n "${DB_PASSWORD:-}" && -z "${ORACLE_PASSWORD:-}" ]]; then
      export ORACLE_PASSWORD="$DB_PASSWORD"
    fi
    ;;
esac

echo "==> Loading environment: $APP_ENV"
echo "DB_LABEL=${DB_LABEL:-unknown}"
echo "DB_DIALECT=${DB_DIALECT:-unknown}"
echo "DB_HOST=${DB_HOST:-unknown}"
echo "SERVER_LABEL=${SERVER_LABEL:-unknown}"
echo "AUTH_PROVIDER=${AUTH_PROVIDER:-<unset>}"
echo ""

```

---

## File: scripts/netlify-dev.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# netlify dev wrapper that retries once if Netlify CLI crashes while setting up
# the Edge Functions (Deno) environment.
#
# Usage:
#   scripts/netlify-dev.sh
#   scripts/netlify-dev.sh --port 4095 --staticServerPort 49000
#
# Optional env vars (only used if you don't pass flags yourself):
#   NETLIFY_PORT         (default: 3999)
#   NETLIFY_STATIC_PORT  (default: 49000)

if ! command -v netlify >/dev/null 2>&1; then
  echo "ERROR: netlify CLI not found in PATH" >&2
  exit 2
fi

# Load project environment
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export APP_ENV="${APP_ENV:-dev}"

if [[ -f "$SCRIPT_DIR/load-env.sh" ]] &&    [[ -f "$SCRIPT_DIR/../environment/$APP_ENV/db/.env" ]] &&    [[ -f "$SCRIPT_DIR/../environment/$APP_ENV/server/.env" ]]; then
  # shellcheck disable=SC1091
  source "$SCRIPT_DIR/load-env.sh"
else
  echo "==> Skipping environment file load for APP_ENV=$APP_ENV (files not present)"
fi


if [[ -f "$SCRIPT_DIR/load-env.sh" ]] && \
   [[ -f "$SCRIPT_DIR/../environment/$APP_ENV/db/.env" ]] && \
   [[ -f "$SCRIPT_DIR/../environment/$APP_ENV/server/.env" ]]; then
  # shellcheck disable=SC1091
  source "$SCRIPT_DIR/load-env.sh"
else
  echo "==> Skipping environment file load for APP_ENV=$APP_ENV (files not present)"
fi

NETLIFY_PORT="${NETLIFY_PORT:-3999}"
NETLIFY_STATIC_PORT="${NETLIFY_STATIC_PORT:-49000}"

# If the caller didn't provide explicit port args, add our defaults.
args=("$@")
has_port=0
has_static_port=0
for a in "${args[@]}"; do
  if [[ "$a" == "--port" || "$a" == "--port="* ]]; then
    has_port=1
  fi
  if [[ "$a" == "--staticServerPort" || "$a" == "--staticServerPort="* ]]; then
    has_static_port=1
  fi
done

if [[ "$has_port" -eq 0 ]]; then
  args+=("--port" "$NETLIFY_PORT")
fi

if [[ "$has_static_port" -eq 0 ]]; then
  args+=("--staticServerPort" "$NETLIFY_STATIC_PORT")
fi

deno_cache_dir="${HOME}/.config/netlify/deno-cli"

should_retry_log() {
  local log_file="$1"

  # Common Netlify CLI messages when Deno/Edge setup fails.
  if grep -q "There was a problem setting up the Edge Functions environment" "$log_file"; then
    return 0
  fi
  if grep -q "Failed to set up Deno for Edge Functions" "$log_file"; then
    return 0
  fi
  if grep -q "spawn ETXTBSY" "$log_file"; then
    return 0
  fi

  return 1
}

run_once() {
  local log_file="$1"

  # Run netlify dev, mirror output to terminal, and capture to log file.
  # (We must disable pipefail temporarily to read netlify's exit code rather than tee's.)
  set +o pipefail
  set +e
  netlify dev "${args[@]}" 2>&1 | tee "$log_file"
  local status="${PIPESTATUS[0]}"
  set -e
  set -o pipefail

  return "$status"
}

attempt=1
max_attempts=2

while [[ "$attempt" -le "$max_attempts" ]]; do
  log_file="$(mktemp -t netlify-dev.XXXXXX.log)"

  echo "Starting netlify dev (attempt ${attempt}/${max_attempts}). Log: ${log_file}" >&2
  if run_once "$log_file"; then
    rm -f "$log_file" >/dev/null 2>&1 || true
    exit 0
  fi

  status=$?

  # If user hit Ctrl-C, don't retry.
  if [[ "$status" -eq 130 ]]; then
    echo "Interrupted (Ctrl-C). Log: ${log_file}" >&2
    exit 130
  fi

  if [[ "$attempt" -lt "$max_attempts" ]] && should_retry_log "$log_file"; then
    echo "Netlify dev failed during Edge/Deno setup. Clearing cache and retrying..." >&2
    rm -rf "$deno_cache_dir" >/dev/null 2>&1 || true
    attempt=$((attempt + 1))
    continue
  fi

  echo "ERROR: netlify dev failed (exit ${status}). Log: ${log_file}" >&2
  exit "$status"
done

exit 1

```

---

## File: scripts/netlify-env-sync.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

DRY_RUN=0
SITE_ARG=""
# Comma-separated for user convenience; script will pass them to netlify CLI as separate args.
CONTEXTS_CSV="production,deploy-preview,branch-deploy"
FILES=(".env.production" "postgres/env/neon/.env")

DO_DEPLOY=0
DEPLOY_MODE="prod"      # prod|preview
DEPLOY_NO_BUILD=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --site)
      SITE_ARG="${2:-}"
      if [[ -z "$SITE_ARG" ]]; then
        echo "ERROR: --site requires a value" >&2
        exit 2
      fi
      shift 2
      ;;
    --contexts)
      CONTEXTS_CSV="${2:-}"
      if [[ -z "$CONTEXTS_CSV" ]]; then
        echo "ERROR: --contexts requires a value" >&2
        exit 2
      fi
      shift 2
      ;;
    --file)
      f="${2:-}"
      if [[ -z "$f" ]]; then
        echo "ERROR: --file requires a value" >&2
        exit 2
      fi
      FILES+=("$f")
      shift 2
      ;;
    --deploy)
      DO_DEPLOY=1
      DEPLOY_MODE="prod"
      shift
      ;;
    --deploy-preview)
      DO_DEPLOY=1
      DEPLOY_MODE="preview"
      shift
      ;;
    --no-build)
      DEPLOY_NO_BUILD=1
      shift
      ;;
    -*)
      echo "ERROR: unknown option: $1" >&2
      exit 2
      ;;
    *)
      echo "ERROR: unexpected argument: $1" >&2
      exit 2
      ;;
  esac
done

if ! command -v netlify >/dev/null 2>&1; then
  echo "ERROR: netlify CLI not found in PATH" >&2
  exit 2
fi

# Build optional site flag
SITE_FLAGS=()
if [[ -n "$SITE_ARG" ]]; then
  SITE_FLAGS=(--site "$SITE_ARG")
fi

# Split contexts CSV into args for `--context` which expects SPACE-separated contexts.
# e.g. --context production deploy-preview branch-deploy
IFS=',' read -r -a CONTEXTS_ARR <<<"$CONTEXTS_CSV"
CONTEXT_ARGS=()
for c in "${CONTEXTS_ARR[@]}"; do
  c_trimmed="$(printf '%s' "$c" | awk '{$1=$1;print}')"
  if [[ -n "$c_trimmed" ]]; then
    CONTEXT_ARGS+=("$c_trimmed")
  fi
done
if [[ "${#CONTEXT_ARGS[@]}" -eq 0 ]]; then
  echo "ERROR: no contexts parsed from --contexts '$CONTEXTS_CSV'" >&2
  exit 2
fi

# Basic sanity: ensure at least one file exists
any_exists=0
for f in "${FILES[@]}"; do
  if [[ -f "$f" ]]; then
    any_exists=1
    break
  fi
done
if [[ "$any_exists" -ne 1 ]]; then
  echo "ERROR: none of the env files exist:" >&2
  for f in "${FILES[@]}"; do
    echo "  - $f" >&2
  done
  exit 2
fi

# Parse KEY=VALUE lines from files, last one wins on duplicates.
parse_env_files() {
  awk '
    function ltrim(s) { sub(/^[ \t\r\n]+/, "", s); return s }
    function rtrim(s) { sub(/[ \t\r\n]+$/, "", s); return s }
    function trim(s) { return rtrim(ltrim(s)); }

    {
      line=$0
      line=trim(line)
      if (line == "") next
      if (substr(line,1,1) == "#") next

      if (substr(line,1,7) == "export ") {
        line=substr(line,8)
        line=trim(line)
      }

      eq = index(line, "=")
      if (eq <= 1) next

      key = substr(line, 1, eq-1)
      val = substr(line, eq+1)

      key = trim(key)
      if (key !~ /^[A-Za-z_][A-Za-z0-9_]*$/) next

      sub(/\r$/, "", val)

      keys[key] = val
      order[++n] = key
    }
    END {
      for (i=1; i<=n; i++) lastIdx[order[i]] = i
      for (i=1; i<=n; i++) {
        k = order[i]
        if (lastIdx[k] == i) {
          printf "%s%c%s%c", k, 0, keys[k], 0
        }
      }
    }
  ' "${FILES[@]}"
}

declare -A KV=()
while IFS= read -r -d '' k; do
  IFS= read -r -d '' v || true
  if [[ -z "$k" ]]; then
    continue
  fi
  KV["$k"]="$v"
done < <(parse_env_files)

if [[ "${#KV[@]}" -eq 0 ]]; then
  echo "ERROR: no env vars found to sync" >&2
  exit 2
fi

# Denylist (optional)
DENY_KEYS=(
)

is_denied() {
  local k="$1"
  for dk in "${DENY_KEYS[@]}"; do
    if [[ "$k" == "$dk" ]]; then
      return 0
    fi
  done
  return 1
}

is_secret_key() {
  local k="$1"
  case "$k" in
    AUTH_JWT_SECRET|PGPASSWORD)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

echo "Netlify env sync"
echo "  contexts : ${CONTEXT_ARGS[*]}"
if [[ -n "$SITE_ARG" ]]; then
  echo "  site     : $SITE_ARG"
else
  echo "  site     : (linked site)"
fi
echo "  files    :"
for f in "${FILES[@]}"; do
  if [[ -f "$f" ]]; then
    echo "    - $f"
  else
    echo "    - $f (missing; skipped)"
  fi
done
echo ""

apply_one() {
  local k="$1"
  local v="$2"

  if is_denied "$k"; then
    echo "SKIP (deny): $k"
    return 0
  fi

  local extra_flags=()
  if is_secret_key "$k"; then
    extra_flags+=(--secret)
  fi

  if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "DRY-RUN: set $k (value hidden) ${extra_flags[*]}"
    return 0
  fi

  # IMPORTANT:
  # - Use --force to bypass overwrite prompts (prevents hangs)
  # - Pass contexts as separate args (netlify expects space-separated)
  netlify env:set "$k" "$v" \
    --force \
    --context "${CONTEXT_ARGS[@]}" \
    "${extra_flags[@]}" \
    "${SITE_FLAGS[@]}" >/dev/null

  echo "SET: $k"
}

mapfile -t KEYS < <(printf '%s\n' "${!KV[@]}" | LC_ALL=C sort)
for k in "${KEYS[@]}"; do
  apply_one "$k" "${KV[$k]}"
done

echo ""
if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "Dry-run complete. No changes made."
  exit 0
fi

echo "Sync complete."

if [[ "$DO_DEPLOY" -ne 1 ]]; then
  echo "Next: trigger a deploy so the new env vars are guaranteed to be live."
  echo "  - netlify deploy --prod"
  exit 0
fi

DEPLOY_ARGS=()
if [[ "$DEPLOY_NO_BUILD" -eq 1 ]]; then
  DEPLOY_ARGS+=(--no-build)
fi

echo ""
if [[ "$DEPLOY_MODE" == "preview" ]]; then
  echo "Triggering Netlify deploy (preview)..."
  netlify deploy "${DEPLOY_ARGS[@]}" "${SITE_FLAGS[@]}"
else
  echo "Triggering Netlify deploy (production)..."
  netlify deploy --prod "${DEPLOY_ARGS[@]}" "${SITE_FLAGS[@]}"
fi


```

---

## File: scripts/normalize-db-env.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

normalize_one() {
  local env_name="$1"
  local env_file="$ROOT_DIR/environment/$env_name/db/.env"

  if [[ ! -f "$env_file" ]]; then
    echo "Skipping $env_name (no env file)"
    return
  fi

  echo "Normalizing $env_file"

  set -a
  # shellcheck disable=SC1090
  source "$env_file"
  set +a

  local db_dialect="${DB_DIALECT:-postgres}"
  local db_host="${DB_HOST:-${PGHOST:-}}"
  local db_port="${DB_PORT:-${PGPORT:-}}"
  local db_name="${DB_NAME:-${PGDATABASE:-}}"
  local db_user="${DB_USER:-${PGUSER:-}}"
  local db_password="${DB_PASSWORD:-${PGPASSWORD:-}}"
  local db_sslmode="${DB_SSLMODE:-${PGSSLMODE:-require}}"
  local db_label="${DB_LABEL:-IansProject-$env_name}"

  local tmp_file
  tmp_file="$(mktemp)"

  cat > "$tmp_file" <<EOT
# ------------------------------------------------------------
# Database configuration ($env_name)
# Generic DB_* values are the source of truth.
# Compatibility variables (PG*, MYSQL_*, ORACLE_*) are derived in scripts/load-env.sh
# ------------------------------------------------------------

DB_DIALECT=$db_dialect
DB_HOST=$db_host
DB_PORT=$db_port
DB_NAME=$db_name
DB_USER=$db_user
DB_PASSWORD=$db_password
DB_SSLMODE=$db_sslmode
DB_LABEL=$db_label
EOT

  mv "$tmp_file" "$env_file"
  echo "✔ Updated $env_file"
  echo ""
}

normalize_one dev
normalize_one prod

echo "Done."

```

---

## File: scripts/pg_psql.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# Generic psql wrapper.
#
# Loads:
#   environment/${APP_ENV:-dev}/db/.env
#   environment/${APP_ENV:-dev}/server/.env
#
# Usage examples:
#   ./scripts/pg_psql.sh
#   ./scripts/pg_psql.sh -c "select 1;"
#   APP_ENV=prod ./scripts/pg_psql.sh -c "select now();"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export APP_ENV="${APP_ENV:-dev}"
# shellcheck disable=SC1091
source "$SCRIPT_DIR/load-env.sh"

: "${DB_DIALECT:?DB_DIALECT not set}"

if [[ "${DB_DIALECT}" != "postgres" ]]; then
  echo "ERROR: scripts/pg_psql.sh only supports DB_DIALECT=postgres (current: ${DB_DIALECT})" >&2
  exit 2
fi

: "${PGHOST:?PGHOST not set}"
: "${PGDATABASE:?PGDATABASE not set}"
: "${PGUSER:?PGUSER not set}"
: "${PGPASSWORD:?PGPASSWORD not set}"

if [[ -z "${PGSSLMODE:-}" ]]; then
  export PGSSLMODE=require
fi

exec psql "$@"

```

---

## File: scripts/rebuild-db-dev.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export APP_ENV="${APP_ENV:-dev}"
# shellcheck disable=SC1091
source "$SCRIPT_DIR/load-env.sh"

: "${PGHOST:?PGHOST is required}"
: "${PGPORT:?PGPORT is required}"
: "${PGDATABASE:?PGDATABASE is required}"
: "${PGUSER:?PGUSER is required}"
: "${PGPASSWORD:?PGPASSWORD is required}"

export PGPASSWORD

# Open ssh tunnel to freevm, and wait until pg is ready.
#${HOME}/bin/vm-tunnel open postgres
#trap '"${HOME}/bin/vm-tunnel" close postgres >/dev/null 2>&1 || true' EXIT

psql "host=${PGHOST} port=${PGPORT} dbname=${PGDATABASE} user=${PGUSER} sslmode=${PGSSLMODE:-disable}" -f db/identity/reset.sql
psql "host=${PGHOST} port=${PGPORT} dbname=${PGDATABASE} user=${PGUSER} sslmode=${PGSSLMODE:-disable}" -f db/identity/ddl.sql
psql "host=${PGHOST} port=${PGPORT} dbname=${PGDATABASE} user=${PGUSER} sslmode=${PGSSLMODE:-disable}" -f db/identity/seed.sql

echo "OK: profile database rebuilt"



#############################################################
#!/usr/bin/env bash
#set -euo pipefail

# SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# export APP_ENV="${APP_ENV:-dev}"
# # shellcheck disable=SC1091
# source "$SCRIPT_DIR/load-env.sh"

# # Hardcoded DEV-only database rebuild.
# #
# # Drops and recreates the identity schema, then reapplies ddl + seed.
# # This script intentionally refuses to run against any non-dev APP_ENV.

# SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# export APP_ENV=dev
# # shellcheck disable=SC1091
# source "${SCRIPT_DIR}/load-env.sh"

# if [[ "${APP_ENV}" != "dev" ]]; then
#   echo "ERROR: rebuild-db-dev.sh is hardcoded for APP_ENV=dev only" >&2
#   exit 2
# fi

# cd "$ROOT_DIR"

# if [[ ! -x "${SCRIPT_DIR}/pg_psql.sh" ]]; then
#   echo "ERROR: missing scripts/pg_psql.sh" >&2
#   exit 2
# fi

# if [[ ! -f "db/identity/reset.sql" ]]; then
#   echo "ERROR: missing db/identity/reset.sql" >&2
#   exit 2
# fi

# if [[ ! -f "db/identity/ddl.sql" ]]; then
#   echo "ERROR: missing db/identity/ddl.sql" >&2
#   exit 2
# fi

# if [[ ! -f "db/identity/seed.sql" ]]; then
#   echo "ERROR: missing db/identity/seed.sql" >&2
#   exit 2
# fi

# echo "==> Rebuilding identity schema in DEV"
# "${SCRIPT_DIR}/pg_psql.sh" -v ON_ERROR_STOP=1 -f db/identity/reset.sql
# "${SCRIPT_DIR}/pg_psql.sh" -v ON_ERROR_STOP=1 -f db/identity/ddl.sql
# "${SCRIPT_DIR}/pg_psql.sh" -v ON_ERROR_STOP=1 -f db/identity/seed.sql

# echo ""
# echo "OK: DEV database rebuilt."

```

---

## File: scripts/release-prod.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# Rotate JWT secret, sync Netlify env vars, deploy, then run remote smoke.
#
# Usage:
#   ./scripts/release-prod.sh
#   ./scripts/release-prod.sh --site <site-name-or-id>
#   ./scripts/release-prod.sh --base-url https://<site>.netlify.app
#   ./scripts/release-prod.sh --no-build
#   ./scripts/release-prod.sh --skip-rotate
#   ./scripts/release-prod.sh --skip-smoke
#   ./scripts/release-prod.sh --dry-run
#
# Notes:
# - Uses hex secret rotation (default 32 bytes) via scripts/rotate-jwt-secret.sh.
# - Syncs env vars from .env.production and postgres/env/neon/.env via scripts/netlify-env-sync.sh.
# - Triggers a production deploy unless --dry-run.
# - Runs scripts/smoke-api.sh against BASE_URL unless --skip-smoke.

SITE_ARG=""
BASE_URL=""
NO_BUILD=0
SKIP_ROTATE=0
SKIP_SMOKE=0
DRY_RUN=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --site)
      SITE_ARG="${2:-}"
      if [[ -z "$SITE_ARG" ]]; then
        echo "ERROR: --site requires a value" >&2
        exit 2
      fi
      shift 2
      ;;
    --base-url)
      BASE_URL="${2:-}"
      if [[ -z "$BASE_URL" ]]; then
        echo "ERROR: --base-url requires a value" >&2
        exit 2
      fi
      shift 2
      ;;
    --no-build)
      NO_BUILD=1
      shift
      ;;
    --skip-rotate)
      SKIP_ROTATE=1
      shift
      ;;
    --skip-smoke)
      SKIP_SMOKE=1
      shift
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    -*)
      echo "ERROR: unknown option: $1" >&2
      exit 2
      ;;
    *)
      echo "ERROR: unexpected argument: $1" >&2
      exit 2
      ;;
  esac
done

if [[ ! -x scripts/netlify-env-sync.sh ]]; then
  echo "ERROR: missing scripts/netlify-env-sync.sh" >&2
  exit 2
fi
if [[ ! -x scripts/rotate-jwt-secret.sh ]]; then
  echo "ERROR: missing scripts/rotate-jwt-secret.sh" >&2
  exit 2
fi
if [[ ! -x scripts/smoke-api.sh ]]; then
  echo "ERROR: missing scripts/smoke-api.sh" >&2
  exit 2
fi

if [[ "$SKIP_ROTATE" -ne 1 ]]; then
  echo "1) Rotate AUTH_JWT_SECRET (hex) into .env.local and .env.production"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "DRY-RUN: would rotate secret (no file changes)"
  else
    ./scripts/rotate-jwt-secret.sh
  fi
else
  echo "1) Rotate AUTH_JWT_SECRET: skipped"
fi

echo ""
echo "2) Sync env vars to Netlify and deploy production"

SYNC_ARGS=()
if [[ -n "$SITE_ARG" ]]; then
  SYNC_ARGS+=(--site "$SITE_ARG")
fi

if [[ "$DRY_RUN" -eq 1 ]]; then
  SYNC_ARGS+=(--dry-run)
else
  SYNC_ARGS+=(--deploy)
fi

if [[ "$NO_BUILD" -eq 1 ]]; then
  SYNC_ARGS+=(--no-build)
fi

./scripts/netlify-env-sync.sh "${SYNC_ARGS[@]}"

if [[ "$DRY_RUN" -eq 1 ]]; then
  echo ""
  echo "DRY-RUN complete."
  exit 0
fi

if [[ "$SKIP_SMOKE" -eq 1 ]]; then
  echo ""
  echo "3) Remote smoke: skipped"
  exit 0
fi

# Determine BASE_URL if not provided.
if [[ -z "$BASE_URL" ]]; then
  if command -v netlify >/dev/null 2>&1; then
    # Prefer explicit site arg if provided, otherwise linked site.
    # netlify status prints "Site URL" line.
    if [[ -n "$SITE_ARG" ]]; then
      BASE_URL="$(netlify status --site "$SITE_ARG" 2>/dev/null | awk -F': ' '/Site URL:/ {print $2; exit}')"
    else
      BASE_URL="$(netlify status 2>/dev/null | awk -F': ' '/Site URL:/ {print $2; exit}')"
    fi
  fi
fi

if [[ -z "$BASE_URL" ]]; then
  echo "ERROR: unable to determine BASE_URL. Provide --base-url https://<site>.netlify.app" >&2
  exit 2
fi

BASE_URL="${BASE_URL%/}"

echo ""
echo "3) Remote smoke against $BASE_URL"
BASE_URL="$BASE_URL" ./scripts/smoke-api.sh --debug

echo ""
echo "Release complete."


```

---

## File: scripts/rotate-jwt-secret.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

PRINT_ONLY=0
LEN_BYTES=32

while [[ $# -gt 0 ]]; do
  case "$1" in
    --print)
      PRINT_ONLY=1
      shift
      ;;
    --len-bytes)
      LEN_BYTES="${2:-}"
      if [[ -z "$LEN_BYTES" ]]; then
        echo "ERROR: --len-bytes requires a value" >&2
        exit 2
      fi
      shift 2
      ;;
    -*)
      echo "ERROR: unknown option: $1" >&2
      exit 2
      ;;
    *)
      echo "ERROR: unexpected argument: $1" >&2
      exit 2
      ;;
  esac
done

if ! command -v openssl >/dev/null 2>&1; then
  echo "ERROR: openssl is required" >&2
  exit 2
fi

# Generate hex secret
SECRET="$(openssl rand -hex "$LEN_BYTES")"

if [[ "$PRINT_ONLY" -eq 1 ]]; then
  echo "$SECRET"
  exit 0
fi

update_env_file() {
  local path="$1"
  local key="AUTH_JWT_SECRET"

  if [[ ! -f "$path" ]]; then
    # Create file with a trailing newline.
    printf '%s=%s\n' "$key" "$SECRET" > "$path"
    echo "Wrote $path"
    return 0
  fi

  # If key exists, replace; else append.
  if grep -qE "^${key}=" "$path"; then
    # Portable in-place edit using temp file.
    local tmp
    tmp="$(mktemp)"
    awk -v k="$key" -v v="$SECRET" '
      BEGIN { updated=0 }
      $0 ~ "^" k "=" {
        print k "=" v
        updated=1
        next
      }
      { print }
      END {
        if (updated == 0) {
          print k "=" v
        }
      }
    ' "$path" > "$tmp"

    # Ensure file ends with newline (awk does, but keep explicit).
    # shellcheck disable=SC2002
    cat "$tmp" > "$path"
    rm -f "$tmp"
  else
    # Append with a preceding newline only if file doesn't already end with one.
    if [[ -s "$path" ]]; then
      lastchar="$(tail -c 1 "$path" || true)"
      if [[ "$lastchar" != "" && "$lastchar" != $'\n' ]]; then
        printf '\n' >> "$path"
      fi
    fi
    printf '%s=%s\n' "$key" "$SECRET" >> "$path"
  fi

  echo "Updated $path"
}

update_env_file ".env.local"
update_env_file ".env.production"

echo ""
echo "New AUTH_JWT_SECRET (hex, ${LEN_BYTES} bytes):"
echo "$SECRET"
echo ""
echo "Next:"
echo "  - Update Netlify: netlify env:set AUTH_JWT_SECRET \"$SECRET\" --context production,deploy-preview"
echo "  - Redeploy"

```

---

## File: scripts/run-env.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

APP_ENV="${1:-dev}"
if [[ $# -gt 0 ]]; then
  shift
fi

if [[ $# -eq 0 ]]; then
  echo "ERROR: usage: ./scripts/run-env.sh <env> <command> [args...]" >&2
  exit 2
fi

export APP_ENV

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$SCRIPT_DIR/load-env.sh"

exec "$@"

```

---

## File: scripts/smoke-api.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

DEBUG=0
if [[ "${1:-}" == "--debug" ]]; then
  DEBUG=1
fi

# Smoke test:
# - Works against local `netlify dev` or deployed Netlify site.
# - Supports both response envelope shapes:
#   { provider, session, user, ... }
#   { ok, requestId, data: { provider, session, user, ... } }
#
# Usage:
#   scripts/smoke-api.sh [--debug]
#
# Optional env vars:
#   BASE_URL         (default: http://localhost:3999)
#   SMOKE_USERNAME   (optional: only username attempted)
#   SMOKE_PASSWORD   (optional: only password attempted)

BASE_URL="${BASE_URL:-http://localhost:3999}"

if ! command -v curl >/dev/null 2>&1; then
  echo "ERROR: curl is required" >&2
  exit 2
fi

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: node is required (used to parse JSON)" >&2
  exit 2
fi

join_url() {
  local base="$1"
  local path="$2"
  base="${base%/}"
  if [[ "$path" != /* ]]; then
    path="/$path"
  fi
  printf '%s%s' "$base" "$path"
}

request_json() {
  local method="$1"
  local pretty_path="$2"
  local fn_path="$3"
  local data="${4:-}"
  local auth_header="${5:-}"

  local url_fn url_pretty
  url_fn="$(join_url "$BASE_URL" "$fn_path")"
  url_pretty="$(join_url "$BASE_URL" "$pretty_path")"

  local tmp_body
  tmp_body="$(mktemp)"
  trap 'rm -f "$tmp_body"' RETURN

  local out_code=""

  if [[ "$DEBUG" -eq 1 ]]; then
    echo "[DEBUG] curl $method $url_fn" >&2
    if [[ -n "$data" ]]; then
      echo "[DEBUG] payload: $data" >&2
    fi
    if [[ -n "$auth_header" ]]; then
      echo "[DEBUG] auth: $auth_header" >&2
    fi
  fi

  if [[ -n "$data" ]]; then
    if [[ -n "$auth_header" ]]; then
      out_code="$(
        curl -sS -o "$tmp_body" -w "%{http_code}" \
          -X "$method" "$url_fn" \
          -H "content-type: application/json" \
          -H "accept: application/json" \
          -H "authorization: $auth_header" \
          --data "$data" || true
      )"
    else
      out_code="$(
        curl -sS -o "$tmp_body" -w "%{http_code}" \
          -X "$method" "$url_fn" \
          -H "content-type: application/json" \
          -H "accept: application/json" \
          --data "$data" || true
      )"
    fi
  else
    if [[ -n "$auth_header" ]]; then
      out_code="$(
        curl -sS -o "$tmp_body" -w "%{http_code}" \
          -X "$method" "$url_fn" \
          -H "accept: application/json" \
          -H "authorization: $auth_header" || true
      )"
    else
      out_code="$(
        curl -sS -o "$tmp_body" -w "%{http_code}" \
          -X "$method" "$url_fn" \
          -H "accept: application/json" || true
      )"
    fi
  fi

  if [[ "$DEBUG" -eq 1 ]]; then
    echo "[DEBUG] response code: $out_code" >&2
    echo "[DEBUG] response body:" >&2
    cat "$tmp_body" >&2
  fi

  echo "$url_pretty"
  echo "$out_code"
  cat "$tmp_body"
}

node_json_get_first() {
  local key1="$1"
  local key2="$2"
  node -e '
const fs = require("fs");
const raw = fs.readFileSync(0, "utf8");
let j;
try { j = JSON.parse(raw); } catch { process.exit(0); }
function get(obj, path) {
  const parts = path.split(".");
  let cur = obj;
  for (const p of parts) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = cur[p];
  }
  return cur;
}
const k1 = process.argv[1];
const k2 = process.argv[2];
const v1 = get(j, k1);
const v2 = get(j, k2);
const v = (v1 !== undefined ? v1 : v2);
if (v === undefined || v === null) process.exit(0);
process.stdout.write(String(v));
' "$key1" "$key2"
}

make_login_payload() {
  local u="$1"
  local p="$2"
  node -e '
const u = process.argv[1];
const p = process.argv[2];
process.stdout.write(JSON.stringify({ username: u, password: p }));
' "$u" "$p"
}

echo "Smoke test: BASE_URL=$BASE_URL"

candidates=()
if [[ -n "${SMOKE_USERNAME:-}" || -n "${SMOKE_PASSWORD:-}" ]]; then
  if [[ -z "${SMOKE_USERNAME:-}" || -z "${SMOKE_PASSWORD:-}" ]]; then
    echo "ERROR: if you set SMOKE_USERNAME or SMOKE_PASSWORD, you must set both." >&2
    exit 2
  fi
  candidates+=("${SMOKE_USERNAME}|${SMOKE_PASSWORD}")
else
  candidates+=("demo|wrong-password") # for negative test 0
  candidates+=("demo|letmein")
  candidates+=("demo@example.com|letmein")
  candidates+=("alice@example.com|letmein")
  candidates+=("bob@example.com|letmein")
  candidates+=("demo|password")
  candidates+=("test|test")
  candidates+=("test@example.com|test")
fi

# 0) Negative: wrong password should be rejected (401)
echo "0) Negative: POST /auth-login rejects wrong password"
bad_payload="$(make_login_payload "demo" "wrong-password")"
bad_resp="$(request_json "POST" "/auth-login" "/.netlify/functions/auth-login" "$bad_payload")"
bad_url="$(printf '%s' "$bad_resp" | sed -n '1p')"
bad_code="$(printf '%s' "$bad_resp" | sed -n '2p')"
bad_body="$(printf '%s' "$bad_resp" | sed -n '3,$p')"

if [[ "$bad_code" != "401" ]]; then
  echo "ERROR: bad login: expected HTTP 401 but got $bad_code" >&2
  echo "Request: $bad_url" >&2
  echo "$bad_body" >&2
  exit 1
fi
echo "OK: bad login rejected"

# 1) Positive: find a working credential pair
login_code=""
login_url=""
login_body=""
used_username=""

echo "1) POST /auth-login"

last_code=""
last_url=""
last_body=""
for pair in "${candidates[@]}"; do
  username="${pair%%|*}"
  password="${pair#*|}"

  payload="$(make_login_payload "$username" "$password")"
  resp="$(request_json "POST" "/auth-login" "/.netlify/functions/auth-login" "$payload")"
  url="$(printf '%s' "$resp" | sed -n '1p')"
  code="$(printf '%s' "$resp" | sed -n '2p')"
  body="$(printf '%s' "$resp" | sed -n '3,$p')"

  last_code="$code"
  last_url="$url"
  last_body="$body"

  if [[ "$code" == "200" ]]; then
    login_code="$code"
    login_url="$url"
    login_body="$body"
    used_username="$username"
    break
  fi
done

if [[ -z "$login_code" ]]; then
  echo "ERROR: no credential pair succeeded (last code=$last_code) at $last_url" >&2
  echo "$last_body" >&2
  exit 1
fi

provider="$(printf '%s' "$login_body" | node_json_get_first "provider" "data.provider")"
access_token="$(printf '%s' "$login_body" | node_json_get_first "session.accessToken" "data.session.accessToken")"
refresh_token="$(printf '%s' "$login_body" | node_json_get_first "session.refreshToken" "data.session.refreshToken")"
user_id="$(printf '%s' "$login_body" | node_json_get_first "user.id" "data.user.id")"

if [[ -z "$provider" ]]; then
  echo "ERROR: missing provider in /auth-login response" >&2
  echo "$login_body" >&2
  exit 1
fi

if [[ -z "$access_token" ]]; then
  echo "ERROR: missing accessToken in /auth-login response" >&2
  echo "$login_body" >&2
  exit 1
fi

if [[ -z "$refresh_token" ]]; then
  echo "ERROR: missing refreshToken in /auth-login response" >&2
  echo "$login_body" >&2
  exit 1
fi

if [[ -z "$user_id" ]]; then
  echo "ERROR: missing user.id in /auth-login response" >&2
  echo "$login_body" >&2
  exit 1
fi

echo "OK: login succeeded (provider=$provider, username=$used_username)"

auth_header="Bearer ${access_token}"

# 2) Negative: /me without auth should be 401
echo "2) Negative: GET /me without auth"
me0_resp="$(request_json "GET" "/me" "/.netlify/functions/me")"
me0_code="$(printf '%s' "$me0_resp" | sed -n '2p')"
me0_body="$(printf '%s' "$me0_resp" | sed -n '3,$p')"
if [[ "$me0_code" != "401" ]]; then
  echo "ERROR: /me without auth: expected 401 but got $me0_code" >&2
  echo "$me0_body" >&2
  exit 1
fi
echo "OK: /me without auth rejected"

# 3) Positive: /auth-refresh rotates refresh token and returns new access token
echo "3) POST /auth-refresh"
refresh_payload="$(node -e 'const rt=process.argv[1]; process.stdout.write(JSON.stringify({ refreshToken: rt }));' "$refresh_token")"
refresh_resp="$(request_json "POST" "/auth-refresh" "/.netlify/functions/auth-refresh" "$refresh_payload")"
refresh_url="$(printf '%s' "$refresh_resp" | sed -n '1p')"
refresh_code="$(printf '%s' "$refresh_resp" | sed -n '2p')"
refresh_body="$(printf '%s' "$refresh_resp" | sed -n '3,$p')"

if [[ "$refresh_code" != "200" ]]; then
  echo "ERROR: /auth-refresh failed (${refresh_code}) at ${refresh_url}" >&2
  echo "$refresh_body" >&2
  exit 1
fi

new_access_token="$(printf '%s' "$refresh_body" | node_json_get_first "session.accessToken" "data.session.accessToken")"
new_refresh_token="$(printf '%s' "$refresh_body" | node_json_get_first "session.refreshToken" "data.session.refreshToken")"
if [[ -z "$new_access_token" || -z "$new_refresh_token" ]]; then
  echo "ERROR: /auth-refresh missing tokens" >&2
  echo "$refresh_body" >&2
  exit 1
fi
echo "OK: refresh succeeded"

# 4) Negative: old refresh token should now be rejected (401)
echo "4) Negative: old refresh token rejected"
old_refresh_payload="$(node -e 'const rt=process.argv[1]; process.stdout.write(JSON.stringify({ refreshToken: rt }));' "$refresh_token")"
old_refresh_resp="$(request_json "POST" "/auth-refresh" "/.netlify/functions/auth-refresh" "$old_refresh_payload")"
old_refresh_code="$(printf '%s' "$old_refresh_resp" | sed -n '2p')"
old_refresh_body="$(printf '%s' "$old_refresh_resp" | sed -n '3,$p')"
if [[ "$old_refresh_code" != "401" ]]; then
  echo "ERROR: old refresh token: expected 401 but got $old_refresh_code" >&2
  echo "$old_refresh_body" >&2
  exit 1
fi
echo "OK: old refresh token rejected"

# Update current tokens after refresh.
access_token="$new_access_token"
refresh_token="$new_refresh_token"
auth_header="Bearer ${access_token}"

# 4.1) /me with tampered token should be rejected (401)
echo "4.1) Negative: GET /me with tampered token rejected"
tampered="${access_token}x"
me2_resp="$(request_json "GET" "/me" "/.netlify/functions/me" "" "Bearer ${tampered}")"
me2_code="$(printf '%s' "$me2_resp" | sed -n '2p')"
me2_body="$(printf '%s' "$me2_resp" | sed -n '3,$p')"
if [[ "$me2_code" != "401" ]]; then
  echo "ERROR: /me tampered token: expected 401 but got $me2_code" >&2
  echo "$me2_body" >&2
  exit 1
fi
echo "OK: /me tampered token rejected"

# 5) Positive: /me valid token
echo "5) GET /me"
me_resp="$(request_json "GET" "/me" "/.netlify/functions/me" "" "$auth_header")"
me_url="$(printf '%s' "$me_resp" | sed -n '1p')"
me_code="$(printf '%s' "$me_resp" | sed -n '2p')"
me_body="$(printf '%s' "$me_resp" | sed -n '3,$p')"

if [[ "$me_code" != "200" ]]; then
  echo "ERROR: /me failed (${me_code}) at ${me_url}" >&2
  echo "$me_body" >&2
  exit 1
fi

me_user_id="$(printf '%s' "$me_body" | node_json_get_first "user.id" "data.user.id")"
if [[ -z "$me_user_id" ]]; then
  echo "ERROR: missing /me user.id" >&2
  echo "$me_body" >&2
  exit 1
fi

if [[ "$me_user_id" != "$user_id" ]]; then
  echo "ERROR: /me user.id mismatch: expected '$user_id' but got '$me_user_id'" >&2
  echo "$me_body" >&2
  exit 1
fi


# 6) Phase 3: admin users (read-only smoke)
#
# This is intentionally non-destructive by default so it is safe to run against production.
# If you want to exercise create/patch/delete flows in dev, set:
#   SMOKE_ADMIN_MUTATION=1

SMOKE_ADMIN_MUTATION="${SMOKE_ADMIN_MUTATION:-0}"

admin_list_resp="$(request_json "GET" "/admin/users" "/.netlify/functions/admin-users" "" "$auth_header")"
admin_list_url="$(printf '%s' "$admin_list_resp" | sed -n '1p')"
admin_list_code="$(printf '%s' "$admin_list_resp" | sed -n '2p')"
admin_list_body="$(printf '%s' "$admin_list_resp" | sed -n '3,$p')"

if [[ "$admin_list_code" == "404" ]]; then
  echo "OK: /admin/users not deployed; skipping Phase 3 admin smoke"
elif [[ "$admin_list_code" == "403" || "$admin_list_code" == "401" ]]; then
  # If postgres + demo@example.com is not admin, that's a misconfig for Phase 3.
  if [[ "$provider" == "postgres" && "$used_username" == "demo@example.com" ]]; then
    echo "ERROR: expected demo@example.com to be admin, but /admin/users returned $admin_list_code" >&2
    echo "Request: $admin_list_url" >&2
    echo "$admin_list_body" >&2
    exit 1
  fi
  echo "OK: /admin/users forbidden for this user (code=${admin_list_code}); skipping admin checks"
elif [[ "$admin_list_code" != "200" ]]; then
  echo "ERROR: /admin/users failed (${admin_list_code}) at ${admin_list_url}" >&2
  echo "$admin_list_body" >&2
  exit 1
else
  echo "OK: /admin/users list OK"

  admin_first_user_id="$(printf '%s' "$admin_list_body" | node_json_get_first "data.users.0.id" "users.0.id")"
  if [[ -z "$admin_first_user_id" ]]; then
    echo "ERROR: /admin/users missing first user id" >&2
    echo "$admin_list_body" >&2
    exit 1
  fi

  echo "6.1) GET /admin/users/{id}"
  admin_get_resp="$(request_json "GET" "/admin/users/${admin_first_user_id}" "/.netlify/functions/admin-users/${admin_first_user_id}" "" "$auth_header")"
  admin_get_url="$(printf '%s' "$admin_get_resp" | sed -n '1p')"
  admin_get_code="$(printf '%s' "$admin_get_resp" | sed -n '2p')"
  admin_get_body="$(printf '%s' "$admin_get_resp" | sed -n '3,$p')"

  if [[ "$admin_get_code" != "200" ]]; then
    echo "ERROR: /admin/users/{id} failed (${admin_get_code}) at ${admin_get_url}" >&2
    echo "$admin_get_body" >&2
    exit 1
  fi

  admin_get_user_id="$(printf '%s' "$admin_get_body" | node_json_get_first "data.user.id" "user.id")"
  if [[ "$admin_get_user_id" != "$admin_first_user_id" ]]; then
    echo "ERROR: /admin/users/{id} user.id mismatch: expected '$admin_first_user_id' but got '$admin_get_user_id'" >&2
    echo "$admin_get_body" >&2
    exit 1
  fi

  echo "OK: /admin/users/{id} OK"

  if [[ "$SMOKE_ADMIN_MUTATION" == "1" ]]; then
    echo "6.2) POST /admin/users (dev-only mutation smoke)"

    new_email="smoke+$(date +%s)@example.com"
    create_payload="$(node -e 'const email=process.argv[1]; process.stdout.write(JSON.stringify({ email, password: "letmein", displayName: "Smoke User" }));' "$new_email")"

    create_resp="$(request_json "POST" "/admin/users" "/.netlify/functions/admin-users" "$create_payload" "$auth_header")"
    create_url="$(printf '%s' "$create_resp" | sed -n '1p')"
    create_code="$(printf '%s' "$create_resp" | sed -n '2p')"
    create_body="$(printf '%s' "$create_resp" | sed -n '3,$p')"

    if [[ "$create_code" != "201" ]]; then
      echo "ERROR: /admin/users create failed (${create_code}) at ${create_url}" >&2
      echo "$create_body" >&2
      exit 1
    fi

    created_user_id="$(printf '%s' "$create_body" | node_json_get_first "data.user.id" "user.id")"
    if [[ -z "$created_user_id" ]]; then
      echo "ERROR: /admin/users create missing user.id" >&2
      echo "$create_body" >&2
      exit 1
    fi

    echo "6.3) DELETE /admin/users/{id} (soft delete)"
    del_resp="$(request_json "DELETE" "/admin/users/${created_user_id}" "/.netlify/functions/admin-users/${created_user_id}" "" "$auth_header")"
    del_url="$(printf '%s' "$del_resp" | sed -n '1p')"
    del_code="$(printf '%s' "$del_resp" | sed -n '2p')"
    del_body="$(printf '%s' "$del_resp" | sed -n '3,$p')"

    if [[ "$del_code" != "200" ]]; then
      echo "ERROR: /admin/users delete failed (${del_code}) at ${del_url}" >&2
      echo "$del_body" >&2
      exit 1
    fi

    echo "6.4) Negative: deleted user cannot login"
    deleted_login_payload="$(make_login_payload "$new_email" "letmein")"
    deleted_login_resp="$(request_json "POST" "/auth-login" "/.netlify/functions/auth-login" "$deleted_login_payload")"
    deleted_login_code="$(printf '%s' "$deleted_login_resp" | sed -n '2p')"
    deleted_login_body="$(printf '%s' "$deleted_login_resp" | sed -n '3,$p')"
    if [[ "$deleted_login_code" != "401" ]]; then
      echo "ERROR: deleted user login: expected 401 but got $deleted_login_code" >&2
      echo "$deleted_login_body" >&2
      exit 1
    fi

    echo "OK: Phase 3 admin mutation smoke passed"
  fi
fi

echo "OK: smoke test passed (${provider})"



```

---

## File: scripts/smoke-local.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# Robust local smoke runner:
# - Starts `netlify dev` on an available high port
# - Waits for readiness (with timeout) by probing the Functions endpoint(s)
# - Retries once if Netlify CLI crashes during Edge Functions (Deno) setup (ETXTBSY)
# - Runs scripts/smoke-api.sh against it
# - Shuts down netlify dev cleanly (even on failure)
#
# Usage:
#   scripts/smoke-local.sh
#
# Optional env vars:
#   NETLIFY_PORT_MIN (default: 4095)
#   NETLIFY_PORT_MAX (default: 4195)
#   STATIC_PORT_MIN  (default: 49000)
#   STATIC_PORT_MAX  (default: 49100)
#   READY_TIMEOUT_S  (default: 240)
#   READY_STABLE_N   (default: 3)   # number of consecutive successful probes
#   READY_SLEEP_S    (default: 0.35)
#
# Also supports any env vars accepted by scripts/smoke-api.sh:
#   SMOKE_USERNAME, SMOKE_PASSWORD

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

NETLIFY_PORT_MIN="${NETLIFY_PORT_MIN:-4095}"
NETLIFY_PORT_MAX="${NETLIFY_PORT_MAX:-4195}"
STATIC_PORT_MIN="${STATIC_PORT_MIN:-49000}"
STATIC_PORT_MAX="${STATIC_PORT_MAX:-49100}"
READY_TIMEOUT_S="${READY_TIMEOUT_S:-240}"
READY_STABLE_N="${READY_STABLE_N:-3}"
READY_SLEEP_S="${READY_SLEEP_S:-1.0}"

if ! command -v netlify >/dev/null 2>&1; then
  echo "ERROR: netlify CLI not found in PATH" >&2
  exit 2
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "ERROR: curl is required" >&2
  exit 2
fi

if [[ ! -x "scripts/smoke-api.sh" ]]; then
  echo "ERROR: scripts/smoke-api.sh not found or not executable" >&2
  exit 2
fi

is_port_free() {
  local port="$1"
  if (echo >/dev/tcp/127.0.0.1/"$port") >/dev/null 2>&1; then
    return 1
  fi
  return 0
}

find_free_port() {
  local min="$1"
  local max="$2"
  local p
  p="$min"
  while [[ "$p" -le "$max" ]]; do
    if is_port_free "$p"; then
      echo "$p"
      return 0
    fi
    p=$((p + 1))
  done
  return 1
}

NETLIFY_PORT="$(find_free_port "$NETLIFY_PORT_MIN" "$NETLIFY_PORT_MAX" || true)"
if [[ -z "$NETLIFY_PORT" ]]; then
  echo "ERROR: could not find a free netlify port in range ${NETLIFY_PORT_MIN}-${NETLIFY_PORT_MAX}" >&2
  exit 2
fi

STATIC_PORT="$(find_free_port "$STATIC_PORT_MIN" "$STATIC_PORT_MAX" || true)"
if [[ -z "$STATIC_PORT" ]]; then
  echo "ERROR: could not find a free static server port in range ${STATIC_PORT_MIN}-${STATIC_PORT_MAX}" >&2
  exit 2
fi

BASE_URL="http://localhost:${NETLIFY_PORT}"

LOG_FILE=""
NETLIFY_PID=""

stop_netlify() {
  if [[ -n "${NETLIFY_PID:-}" ]]; then
    echo "Stopping netlify dev (pid=${NETLIFY_PID})"
    kill -TERM -"${NETLIFY_PID}" >/dev/null 2>&1 || true

    local i=0
    while kill -0 "${NETLIFY_PID}" >/dev/null 2>&1; do
      i=$((i + 1))
      if [[ "$i" -ge 40 ]]; then
        kill -KILL -"${NETLIFY_PID}" >/dev/null 2>&1 || true
        break
      fi
      sleep 0.2
    done
  fi
  NETLIFY_PID=""
}

cleanup() {
  local code=$?
  stop_netlify

  if [[ "$code" -ne 0 ]]; then
    if [[ -n "${LOG_FILE:-}" && -f "${LOG_FILE:-}" ]]; then
      echo "Smoke-local failed (exit ${code}). netlify dev log: ${LOG_FILE}" >&2
      tail -n 300 "$LOG_FILE" >&2 || true
    else
      echo "Smoke-local failed (exit ${code})." >&2
    fi
  else
    if [[ -n "${LOG_FILE:-}" && -f "${LOG_FILE:-}" ]]; then
      rm -f "$LOG_FILE" >/dev/null 2>&1 || true
    fi
  fi

  exit "$code"
}
trap cleanup EXIT INT TERM

probe_functions() {
  # Returns 0 when we consider Netlify Dev "ready enough" for tests:
  # - We get a non-000 http_code from a functions route
  # - And we get READY_STABLE_N consecutive non-000 responses
  #
  # We probe /health first (if exists), then /auth-login.
  local stable=0
  local deadline=$(( $(date +%s) + READY_TIMEOUT_S ))

  while [[ "$(date +%s)" -lt "$deadline" ]]; do
    if [[ -n "${NETLIFY_PID:-}" ]] && ! kill -0 "$NETLIFY_PID" >/dev/null 2>&1; then
      return 3
    fi

    # Probe candidates (any response code other than 000 indicates a listener).
    local code
    code="$(curl -sS -o /dev/null -w "%{http_code}" "${BASE_URL}/.netlify/functions/health" || true)"
    if [[ "$code" == "404" || "$code" == "405" ]]; then
      code="$(curl -sS -o /dev/null -w "%{http_code}" "${BASE_URL}/.netlify/functions/auth-login" || true)"
    fi

    # 000 = connect failure
    if [[ "$code" != "000" && "$code" != "" ]]; then
      stable=$((stable + 1))
      if [[ "$stable" -ge "$READY_STABLE_N" ]]; then
        return 0
      fi
    else
      stable=0
    fi

    sleep "$READY_SLEEP_S"
  done

  return 1
}

deno_cache_dir() {
  # As per Netlify CLI error messaging, it uses ~/.config/netlify/deno-cli
  echo "${HOME}/.config/netlify/deno-cli"
}

log_has_deno_etxtbsy() {
  [[ -n "${LOG_FILE:-}" && -f "${LOG_FILE:-}" ]] || return 1
  if grep -q "Failed to set up Deno for Edge Functions" "$LOG_FILE" && grep -q "ETXTBSY" "$LOG_FILE"; then
    return 0
  fi
  return 1
}

start_netlify() {
  LOG_FILE="$(mktemp -t netlify-dev-smoke.XXXXXX.log)"

  echo "Starting netlify dev on port ${NETLIFY_PORT} (static: ${STATIC_PORT})"
  # Start in a new session so we can kill the process group reliably.
  setsid netlify dev --port "${NETLIFY_PORT}" --staticServerPort "${STATIC_PORT}" >"$LOG_FILE" 2>&1 &
  NETLIFY_PID="$!"
}

# We retry once if Netlify CLI crashes during Edge Functions (Deno) setup.
attempt=1
max_attempts=2

while [[ "$attempt" -le "$max_attempts" ]]; do
  start_netlify

  if probe_functions; then
    # If we got stable probes, do one last quick sanity request to auth-login with an OPTIONS call
    # to reduce chances of an "empty reply" race.
    curl -sS -o /dev/null -X OPTIONS "${BASE_URL}/.netlify/functions/auth-login" >/dev/null 2>&1 || true

    echo "Netlify dev ready: ${BASE_URL}"
    echo "Running smoke-api.sh"
    BASE_URL="$BASE_URL" scripts/smoke-api.sh
    exit 0
  fi

  # Not ready. Check if netlify died and whether it was the Deno ETXTBSY crash.
  if log_has_deno_etxtbsy; then
    echo "Detected Netlify CLI Deno (Edge Functions) ETXTBSY crash. Clearing cache and retrying..." >&2
    stop_netlify
    rm -rf "$(deno_cache_dir)" >/dev/null 2>&1 || true
    attempt=$((attempt + 1))
    continue
  fi

  # If netlify exited for some other reason, fail (cleanup handler will print logs).
  if [[ -n "${NETLIFY_PID:-}" ]] && ! kill -0 "$NETLIFY_PID" >/dev/null 2>&1; then
    exit 1
  fi

  # Timed out waiting for readiness; no retry unless Deno ETXTBSY specifically detected.
  exit 1
done

exit 1

```

---

## File: scripts/verify-ci-flow.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# Phase 5.6 helper:
# - run local CI parity checks
# - optionally push current branch
# - poll GitHub CI until success/failure
# - optionally verify deployed /health after CI succeeds
#
# Usage:
#   ./scripts/verify-ci-flow.sh
#   ./scripts/verify-ci-flow.sh --push
#   ./scripts/verify-ci-flow.sh --branch main --push --base-url https://auth-backend-netlify.netlify.app
#   ./scripts/verify-ci-flow.sh --skip-local
#   ./scripts/verify-ci-flow.sh --skip-local --wait-only
#
# Notes:
# - Default branch is the current git branch.
# - Uses existing scripts/check-ci-local.sh and scripts/check-gh-ci-status.sh.
# - If a CI run is not yet visible, the script will keep polling until timeout.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "$ROOT_DIR"

RUN_LOCAL=1
DO_PUSH=0
WAIT_FOR_CI=1
HEALTH_BASE_URL=""
TIMEOUT_SECONDS=900
INTERVAL_SECONDS=10
BRANCH=""

usage() {
  cat <<'USAGE'
Usage:
  ./scripts/verify-ci-flow.sh [options]

Options:
  --branch <name>         Branch to use (default: current branch)
  --push                  Push current branch before polling GitHub CI
  --skip-local            Skip local CI parity checks
  --wait-only             Do not run local checks; just wait/poll GitHub CI
  --base-url <url>        After CI success, run scripts/health.sh against this URL
  --timeout-seconds <n>   Max wait for CI visibility/completion (default: 900)
  --interval-seconds <n>  Poll interval in seconds (default: 10)
  -h, --help              Show this help

Examples:
  ./scripts/verify-ci-flow.sh
  ./scripts/verify-ci-flow.sh --push
  ./scripts/verify-ci-flow.sh --branch main --push --base-url https://auth-backend-netlify.netlify.app
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --branch)
      BRANCH="${2:-}"
      if [[ -z "$BRANCH" ]]; then
        echo "ERROR: --branch requires a value" >&2
        exit 2
      fi
      shift 2
      ;;
    --push)
      DO_PUSH=1
      shift
      ;;
    --skip-local)
      RUN_LOCAL=0
      shift
      ;;
    --wait-only)
      RUN_LOCAL=0
      WAIT_FOR_CI=1
      shift
      ;;
    --base-url)
      HEALTH_BASE_URL="${2:-}"
      if [[ -z "$HEALTH_BASE_URL" ]]; then
        echo "ERROR: --base-url requires a value" >&2
        exit 2
      fi
      shift 2
      ;;
    --timeout-seconds)
      TIMEOUT_SECONDS="${2:-}"
      if [[ -z "$TIMEOUT_SECONDS" ]]; then
        echo "ERROR: --timeout-seconds requires a value" >&2
        exit 2
      fi
      shift 2
      ;;
    --interval-seconds)
      INTERVAL_SECONDS="${2:-}"
      if [[ -z "$INTERVAL_SECONDS" ]]; then
        echo "ERROR: --interval-seconds requires a value" >&2
        exit 2
      fi
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "ERROR: unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if ! command -v git >/dev/null 2>&1; then
  echo "ERROR: git is required" >&2
  exit 2
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "ERROR: not inside a git repository" >&2
  exit 2
fi

if [[ -z "$BRANCH" ]]; then
  BRANCH="$(git rev-parse --abbrev-ref HEAD)"
fi

if [[ "$BRANCH" == "HEAD" || -z "$BRANCH" ]]; then
  echo "ERROR: could not determine current branch" >&2
  exit 2
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: gh CLI not found. Install GitHub CLI and authenticate: gh auth login" >&2
  exit 2
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "ERROR: gh is not authenticated. Run: gh auth login" >&2
  exit 2
fi

if [[ ! -x "$SCRIPT_DIR/check-ci-local.sh" ]]; then
  echo "ERROR: missing scripts/check-ci-local.sh" >&2
  exit 2
fi

if [[ ! -x "$SCRIPT_DIR/check-gh-ci-status.sh" ]]; then
  echo "ERROR: missing scripts/check-gh-ci-status.sh" >&2
  exit 2
fi

if [[ -n "$HEALTH_BASE_URL" && ! -x "$SCRIPT_DIR/health.sh" ]]; then
  echo "ERROR: missing scripts/health.sh" >&2
  exit 2
fi

step() {
  echo ""
  echo "==> $1"
}

if [[ "$RUN_LOCAL" -eq 1 ]]; then
  step "Running local CI parity checks on branch '$BRANCH'"
  "$SCRIPT_DIR/check-ci-local.sh"
else
  step "Skipping local CI parity checks"
fi

if [[ "$DO_PUSH" -eq 1 ]]; then
  step "Pushing current HEAD to origin/$BRANCH"
  git push origin "$BRANCH"
else
  step "Not pushing branch (use --push to automate push)"
fi

if [[ "$WAIT_FOR_CI" -ne 1 ]]; then
  echo ""
  echo "OK: local phase complete. Next manual step: ./scripts/check-gh-ci-status.sh $BRANCH"
  exit 0
fi

step "Polling GitHub CI for branch '$BRANCH'"

start_epoch="$(date +%s)"
deadline=$((start_epoch + TIMEOUT_SECONDS))

while true; do
  now="$(date +%s)"
  if (( now > deadline )); then
    echo "ERROR: Timed out waiting for GitHub CI on branch '$BRANCH' after ${TIMEOUT_SECONDS}s." >&2
    exit 7
  fi

  set +e
  output="$("$SCRIPT_DIR/check-gh-ci-status.sh" "$BRANCH" 2>&1)"
  rc=$?
  set -e

  case "$rc" in
    0)
      echo "$output"

      if [[ -n "$HEALTH_BASE_URL" ]]; then
        step "Verifying deployed health endpoint"
        "$SCRIPT_DIR/health.sh" "$HEALTH_BASE_URL"
      fi

      echo ""
      echo "OK: CI flow verified for branch '$BRANCH'."
      exit 0
      ;;
    4|5)
      echo "$output"
      echo "Waiting ${INTERVAL_SECONDS}s before re-checking..."
      sleep "$INTERVAL_SECONDS"
      ;;
    6)
      echo "$output" >&2
      exit 6
      ;;
    *)
      echo "$output" >&2
      exit "$rc"
      ;;
  esac
done

```

---

## File: src/contracts/adminUsers.ts

```ts
import type { AuthUserProfile } from "./auth.js";

export type AdminUsersResponse = {
  users: AuthUserProfile[];
};

export type AdminUserResponse = {
  user: AuthUserProfile;
};

export type AdminCreateUserRequest = {
  email: string;
  password: string;
  displayName?: string;
  roles?: string[];
};

export type AdminUpdateUserRequest = {
  displayName?: string;
  roles?: string[];
};


```

---

## File: src/contracts/auth.ts

```ts
export type AuthLoginRequest = {
  username: string;
  password: string;
};

export type AuthRegisterRequest = {
  email: string;
  password: string;
  displayName?: string;
};

export type AuthRefreshRequest = {
  refreshToken: string;
};

export type AuthLogoutRequest = {
  refreshToken?: string;
};

export type AuthUserProfile = {
  id: string;
  username: string;
  displayName: string;
  roles: string[];
};

export type AuthSession = {
  accessToken: string;
  tokenType: "bearer";
  expiresAt?: string;
  refreshToken?: string;
};

export type AuthProviderId = "fake" | "postgres" | "google" | "github";

export type AuthLoginResponse = {
  provider: AuthProviderId;
  session: AuthSession;
  user: AuthUserProfile;
};

export type AuthRegisterResponse = AuthLoginResponse;

export type AuthRefreshResponse = AuthLoginResponse;


```

---

## File: src/contracts/healthAdmin.ts

```ts
export type HealthAdminResponse = {
  postgres: {
    // Connection and query timings observed from within the Netlify function runtime.
    connectMs: number;
    queryMs: number;

    // Lightweight counts to help debug production state.
    activeSessions: number;
    revokedSessions: number;
    failedLoginCountLastHour: number;

    // Existing config exposure (sanitised).
    passwordSet: boolean;
    configFingerprint: string;

    // These are optional because exactOptionalPropertyTypes is enabled.
    host?: string;
    database?: string;
    user?: string;
    port?: string;
    sslMode?: string;
  };
};


```

---

## File: src/contracts/health.ts

```ts
export type HealthResponse = {
  status: "ok";
  version: string;
  timestamp: string;
  build: {
    version: string;
    buildTime: string;
    node: string;
    sha?: string;
    shortSha?: string;
    buildId?: string;
    branch?: string;
    appEnv?: string;
  };
  project: {
    workPackage?: string;
    phase?: number | string;
    step?: string;
    description?: string;
  };
  env: {
    authProvider?: string;
    postgres: {
      hasHost: boolean;
      hasDatabase: boolean;
      hasUser: boolean;
      hasPassword: boolean;
      hasPort: boolean;
      hasSslMode: boolean;
    };
    netlify: {
      context?: string;
      deployId?: string;
      siteId?: string;
    };
  };
};

```

---

## File: src/contracts/me.ts

```ts
import type { AuthUserProfile } from "./auth.js";

export type MeResponse = {
  user: AuthUserProfile;
};

```

---

## File: src/generated/buildInfo.ts

```ts
export type GeneratedBuildInfo = {
  projectName: string;
  version: string;
  buildTime: string;
  sha?: string;
  shortSha?: string;
  buildId?: string;
  branch?: string;
  appEnv?: string;
  workPackage?: string;
  phase?: number | string;
  step?: string;
  description?: string;
};

export const GENERATED_BUILD_INFO: GeneratedBuildInfo = {
  projectName: "identity-backend-service",
  version: "0.1.0",
  buildTime: "1970-01-01T00:00:00.000Z",
  workPackage: "identity-backend",
  phase: 5,
  step: "5.5.3",
  description: "Environment handling, CI stabilization, and build metadata"
};

```

---

## File: src/lib/authHeader.ts

```ts
import { AppError } from "./errors.js";

export function getBearerToken(headers: Record<string, string | undefined>): string {
  const raw = headers["authorization"] || headers["Authorization"] || "";
  const v = raw.trim();

  if (!v) {
    throw new AppError("Missing Authorization header", { code: "UNAUTHORIZED", status: 401 });
  }

  // Per RFC 9110, auth scheme names are case-insensitive.
  const prefix = "bearer ";
  if (!v.toLowerCase().startsWith(prefix)) {
    throw new AppError("Invalid Authorization header", { code: "UNAUTHORIZED", status: 401 });
  }

  const token = v.slice(prefix.length).trim();
  if (!token) {
    throw new AppError("Missing bearer token", { code: "UNAUTHORIZED", status: 401 });
  }

  return token;
}


```

---

## File: src/lib/body.ts

```ts
import { AppError } from "./errors.js";

export function parseJsonBody<T>(raw: string | null | undefined): T {
  if (!raw || raw.trim().length === 0) {
    throw new AppError("Missing JSON body", { code: "BAD_REQUEST", status: 400 });
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new AppError("Invalid JSON body", { code: "BAD_REQUEST", status: 400 });
  }
}

```

---

## File: src/lib/env.ts

```ts
import { AppError } from "./errors.js";

export function getEnv(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim().length > 0 ? v : undefined;
}

export function requireEnv(name: string): string {
  const v = getEnv(name);
  if (!v) {
    throw new AppError(`Missing required environment variable: ${name}`, {
      code: "INTERNAL_ERROR",
      status: 500,
      details: { name }
    });
  }
  return v;
}

```

---

## File: src/lib/errors.ts

```ts
export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly status: number;
  public readonly details?: unknown;

  constructor(message: string, opts: { code: ErrorCode; status: number; details?: unknown }) {
    super(message);
    this.name = "AppError";
    this.code = opts.code;
    this.status = opts.status;
    this.details = opts.details;
  }
}

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}

```

---

## File: src/lib/jwt.ts

```ts
import crypto from "node:crypto";
import { AppError } from "./errors.js";
import { requireEnv } from "./env.js";

type JwtHeader = {
  alg: "HS256";
  typ: "JWT";
};

type JwtPayload = {
  sub: string;
  iat: number;
  exp: number;
  jti: string;
  iss?: string;
  aud?: string;
};

function base64UrlEncode(buf: Buffer): string {
  return buf
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecodeToBuffer(s: string): Buffer {
  const padLen = (4 - (s.length % 4)) % 4;
  const padded = s + "=".repeat(padLen);
  const b64 = padded.replaceAll("-", "+").replaceAll("_", "/");
  return Buffer.from(b64, "base64");
}

function timingSafeEqualStr(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function getSecret(): Buffer {
  // Accept either hex or utf8; prefer hex if it looks like hex.
  const raw = requireEnv("AUTH_JWT_SECRET");
  const isHex = /^[0-9a-fA-F]+$/.test(raw) && raw.length % 2 === 0;
  return isHex ? Buffer.from(raw, "hex") : Buffer.from(raw, "utf8");
}

function hmacSha256(secret: Buffer, msg: string): string {
  const sig = crypto.createHmac("sha256", secret).update(msg, "utf8").digest();
  return base64UrlEncode(sig);
}

function getOptionalEnv(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim().length > 0 ? v.trim() : undefined;
}

function parsePositiveInt(v: string | undefined): number | undefined {
  const s = (v || "").trim();
  if (!s) return undefined;
  const n = Number(s);
  if (!Number.isFinite(n)) return undefined;
  const i = Math.floor(n);
  return i > 0 ? i : undefined;
}

export function signAccessToken(
  userId: string,
  opts?: { ttlSeconds?: number; now?: Date }
): { token: string; expiresAt: string } {
  const now = opts?.now ?? new Date();
  const ttlSeconds = opts?.ttlSeconds ?? Number(process.env.AUTH_JWT_TTL_SECONDS || "900");
  const iat = Math.floor(now.getTime() / 1000);
  const exp = iat + (Number.isFinite(ttlSeconds) && ttlSeconds > 0 ? ttlSeconds : 900);

  const header: JwtHeader = { alg: "HS256", typ: "JWT" };

  const issuer = getOptionalEnv("AUTH_JWT_ISSUER");
  const audience = getOptionalEnv("AUTH_JWT_AUDIENCE");

  const payload: JwtPayload = {
    sub: userId,
    iat,
    exp,
    jti: crypto.randomUUID(),
    ...(issuer ? { iss: issuer } : {}),
    ...(audience ? { aud: audience } : {})
  };

  const headerPart = base64UrlEncode(Buffer.from(JSON.stringify(header), "utf8"));
  const payloadPart = base64UrlEncode(Buffer.from(JSON.stringify(payload), "utf8"));

  const signingInput = `${headerPart}.${payloadPart}`;
  const secret = getSecret();
  const sigPart = hmacSha256(secret, signingInput);

  return {
    token: `${signingInput}.${sigPart}`,
    expiresAt: new Date(exp * 1000).toISOString()
  };
}

export function verifyAccessToken(
  token: string,
  opts?: { now?: Date; clockSkewSeconds?: number }
): { userId: string; iat: number; exp: number; jti: string } {
  const t = (token || "").trim();
  if (!t) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  const parts = t.split(".");
  if (parts.length !== 3) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  const h = parts[0];
  const p = parts[1];
  const sig = parts[2];

  if (!h || !p || !sig) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  let header: JwtHeader;
  let payload: JwtPayload;

  try {
    header = JSON.parse(base64UrlDecodeToBuffer(h).toString("utf8")) as JwtHeader;
    payload = JSON.parse(base64UrlDecodeToBuffer(p).toString("utf8")) as JwtPayload;
  } catch {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  if (!header || header.alg !== "HS256" || header.typ !== "JWT") {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  const signingInput = `${h}.${p}`;
  const secret = getSecret();
  const expected = hmacSha256(secret, signingInput);

  if (!timingSafeEqualStr(expected, sig)) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  const now = opts?.now ?? new Date();
  const nowSec = Math.floor(now.getTime() / 1000);
  const skew =
    opts?.clockSkewSeconds ??
    parsePositiveInt(getOptionalEnv("AUTH_JWT_CLOCK_SKEW_SECONDS")) ??
    30;

  const userId = (payload.sub || "").trim();
  if (!userId) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  const iat = payload.iat;
  const exp = payload.exp;

  if (!Number.isFinite(iat) || !Number.isFinite(exp)) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }
  if (exp <= iat) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  const jti = (payload.jti || "").trim();
  if (!jti) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  // issuer / audience enforcement (only when configured)
  const requiredIssuer = getOptionalEnv("AUTH_JWT_ISSUER");
  if (requiredIssuer && payload.iss !== requiredIssuer) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  const requiredAudience = getOptionalEnv("AUTH_JWT_AUDIENCE");
  if (requiredAudience && payload.aud !== requiredAudience) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  // issued-at must not be unreasonably in the future
  if (iat > nowSec + skew) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  // expiry check with clock skew
  if (exp <= nowSec - skew) {
    throw new AppError("Token expired", { code: "UNAUTHORIZED", status: 401 });
  }

  // max TTL enforcement (only when configured)
  const maxTtlSeconds = parsePositiveInt(getOptionalEnv("AUTH_JWT_MAX_TTL_SECONDS"));
  if (maxTtlSeconds !== undefined) {
    const ttl = exp - iat;
    if (ttl > maxTtlSeconds) {
      throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
    }
  }

  return { userId, iat, exp, jti };
}


```

---

## File: src/lib/requestId.ts

```ts
import crypto from "node:crypto";

export const REQUEST_ID_HEADER = "x-request-id";
export const CORRELATION_ID_HEADER = "x-correlation-id";

export function getOrCreateRequestId(headers: Record<string, string | undefined>) {
  const existing =
    headers[REQUEST_ID_HEADER] ||
    headers[REQUEST_ID_HEADER.toLowerCase()] ||
    headers[CORRELATION_ID_HEADER] ||
    headers[CORRELATION_ID_HEADER.toLowerCase()];

  return existing && existing.trim().length > 0 ? existing : crypto.randomUUID();
}

```

---

## File: src/lib/response.ts

```ts
import type { HandlerResponse } from "@netlify/functions";
import { AppError, isAppError } from "./errors.js";
import { REQUEST_ID_HEADER } from "./requestId.js";

export type SuccessEnvelope<T> = {
  ok: true;
  requestId: string;
  data: T;
};

export type ErrorEnvelope = {
  ok: false;
  requestId: string;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

function baseHeaders(requestId: string): Record<string, string> {
  return {
    [REQUEST_ID_HEADER]: requestId,
    "cache-control": "no-store",
    pragma: "no-cache",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "no-referrer",
    "content-security-policy": "default-src 'none'",
    "permissions-policy": "geolocation=(), microphone=(), camera=()",
    "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "access-control-allow-headers": "authorization, content-type, x-request-id, x-correlation-id",
    "access-control-expose-headers": "x-request-id, retry-after",
    "access-control-max-age": "86400"
  };
}

function jsonOk<T>(statusCode: number, requestId: string, data: T): HandlerResponse {
  const body: SuccessEnvelope<T> = { ok: true, requestId, data };
  return {
    statusCode,
    headers: {
      ...baseHeaders(requestId),
      "content-type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(body)
  };
}

export function jsonNoContent(statusCode: number, requestId: string): HandlerResponse {
  return {
    statusCode,
    headers: {
      ...baseHeaders(requestId)
    },
    body: ""
  };
}

export function jsonCorsPreflight(requestId: string): HandlerResponse {
  return {
    statusCode: 204,
    headers: {
      ...baseHeaders(requestId)
    },
    body: ""
  };
}

export function jsonError(
  statusCode: number,
  requestId: string,
  code: string,
  message: string,
  details?: unknown
): HandlerResponse {
  const body: ErrorEnvelope = {
    ok: false,
    requestId,
    error: {
      code,
      message,
      ...(details === undefined ? {} : { details })
    }
  };
  return {
    statusCode,
    headers: {
      ...baseHeaders(requestId),
      "content-type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(body)
  };
}

export function jsonBadRequest(requestId: string, message: string, details?: unknown): HandlerResponse {
  return jsonError(400, requestId, "BAD_REQUEST", message, details);
}

export function jsonMethodNotAllowed(requestId: string, details?: unknown): HandlerResponse {
  return jsonError(405, requestId, "BAD_REQUEST", "Method not allowed", details);
}

export function jsonTooManyRequests(requestId: string, retryAfterSeconds?: number): HandlerResponse {
  const details = retryAfterSeconds === undefined ? undefined : { retryAfterSeconds };
  const res = jsonError(429, requestId, "RATE_LIMITED", "Too many attempts. Try again later.", details);

  const headers = { ...(res.headers || {}) };
  if (retryAfterSeconds !== undefined) {
    headers["retry-after"] = String(retryAfterSeconds);
  }

  return { ...res, headers };
}

export function toErrorResponse(requestId: string, err: unknown): HandlerResponse {
  if (isAppError(err)) {
    return jsonError(err.status, requestId, err.code, err.message, err.details);
  }

  const msg = err instanceof Error ? err.message : "Unknown error";
  return jsonError(500, requestId, "INTERNAL_ERROR", msg);
}

export function requireMethod(actual: string | undefined, allowed: string[]) {
  const m = (actual || "").toUpperCase();
  if (!allowed.includes(m)) {
    throw new AppError(`Method ${m || "UNKNOWN"} not allowed`, {
      code: "BAD_REQUEST",
      status: 405,
      details: { allowed }
    });
  }
}

export { jsonOk };

```

---

## File: src/meta.ts

```ts
import { GENERATED_BUILD_INFO } from "./generated/buildInfo.js";

export const PROJECT = {
  name: GENERATED_BUILD_INFO.projectName,
  version: GENERATED_BUILD_INFO.version
};

export type BuildInfo = {
  version: string;
  buildTime: string;
  node: string;
  sha?: string;
  shortSha?: string;
  buildId?: string;
  branch?: string;
  appEnv?: string;
};

export type ProjectProgressInfo = {
  workPackage?: string;
  phase?: number | string;
  step?: string;
  description?: string;
};

function pickFirst(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

export function getBuildInfo(): BuildInfo {
  const sha = pickFirst(
    process.env.GITHUB_SHA,
    process.env.NETLIFY_COMMIT_REF,
    process.env.COMMIT_REF,
    GENERATED_BUILD_INFO.sha
  );

  const shortSha = pickFirst(
    sha ? sha.slice(0, 7) : undefined,
    GENERATED_BUILD_INFO.shortSha
  );

  const buildId = pickFirst(
    process.env.GITHUB_RUN_ID,
    process.env.BUILD_ID,
    process.env.DEPLOY_ID,
    GENERATED_BUILD_INFO.buildId
  );

  const branch = pickFirst(
    process.env.GITHUB_REF_NAME,
    process.env.BRANCH,
    process.env.HEAD,
    GENERATED_BUILD_INFO.branch
  );

  const appEnv = pickFirst(
    process.env.APP_ENV,
    process.env.CONTEXT,
    GENERATED_BUILD_INFO.appEnv
  );

  const buildTime = pickFirst(
    process.env.BUILD_TIME,
    GENERATED_BUILD_INFO.buildTime
  ) || new Date().toISOString();

  return {
    version: PROJECT.version,
    buildTime,
    node: process.version,
    ...(sha ? { sha } : {}),
    ...(shortSha ? { shortSha } : {}),
    ...(buildId ? { buildId } : {}),
    ...(branch ? { branch } : {}),
    ...(appEnv ? { appEnv } : {})
  };
}

export function getProjectProgressInfo(): ProjectProgressInfo {
  return {
    ...(GENERATED_BUILD_INFO.workPackage ? { workPackage: GENERATED_BUILD_INFO.workPackage } : {}),
    ...(GENERATED_BUILD_INFO.phase !== undefined ? { phase: GENERATED_BUILD_INFO.phase } : {}),
    ...(GENERATED_BUILD_INFO.step ? { step: GENERATED_BUILD_INFO.step } : {}),
    ...(GENERATED_BUILD_INFO.description ? { description: GENERATED_BUILD_INFO.description } : {})
  };
}

```

---

## File: src/security/adminAuth.ts

```ts
import { AppError } from "../lib/errors.js";
import { getUserFromToken } from "../services/authService.js";
import type { AuthUserProfile } from "../contracts/auth.js";

export async function requireAdminUser(token: string): Promise<AuthUserProfile> {
  const user = await getUserFromToken(token);
  const roles = Array.isArray(user.roles) ? user.roles : [];
  if (!roles.includes("admin")) {
    throw new AppError("Forbidden", { code: "FORBIDDEN", status: 403 });
  }
  return user;
}


```

---

## File: src/security/adminPolicy.ts

```ts
import { getEnv } from "../lib/env.js";
import type { AuthUserProfile } from "../contracts/auth.js";

function parseCsv(v: string | undefined): string[] {
  if (!v) return [];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function isAdminUser(user: AuthUserProfile): boolean {
  // Primary mechanism (Phase 3 Step 2): DB-backed roles (via provider)
  if (user.roles.includes("admin")) return true;

  // Break-glass / bootstrap allowlists (still useful for emergencies)
  const adminIds = parseCsv(getEnv("ADMIN_USER_IDS"));
  if (adminIds.includes(user.id)) return true;

  const adminEmails = parseCsv(getEnv("ADMIN_USER_EMAILS"));
  if (adminEmails.includes(user.username)) return true;

  return false;
}

```

---

## File: src/security/config.ts

```ts
import { AppError } from "../lib/errors.js";
import { getEnv, requireEnv } from "../lib/env.js";

type Provider = "fake" | "postgres";

let validated = false;

function parseIntEnv(name: string, v: string): number {
  const n = Number.parseInt(v, 10);
  if (!Number.isFinite(n)) {
    throw new AppError(`Invalid integer env var: ${name}`, {
      code: "INTERNAL_ERROR",
      status: 500,
      details: { name, value: v }
    });
  }
  return n;
}

function optionalPositiveInt(name: string): number | undefined {
  const v = getEnv(name);
  if (!v) return undefined;
  const n = parseIntEnv(name, v);
  if (n <= 0) {
    throw new AppError(`Env var must be > 0: ${name}`, {
      code: "INTERNAL_ERROR",
      status: 500,
      details: { name, value: v }
    });
  }
  return n;
}

function determineProvider(): Provider {
  const explicit = getEnv("AUTH_PROVIDER");
  if (explicit) {
    const p = explicit.toLowerCase();
    if (p === "fake") return "fake";
    if (p === "postgres") return "postgres";
    throw new AppError("Invalid AUTH_PROVIDER", {
      code: "INTERNAL_ERROR",
      status: 500,
      details: { value: explicit }
    });
  }

  const isNetlifyDev = (getEnv("NETLIFY_DEV") || "").toLowerCase() === "true";
  const isTest = (getEnv("NODE_ENV") || "").toLowerCase() === "test";
  if (isNetlifyDev || isTest) return "fake";
  return "postgres";
}

export function validateAuthConfig(): void {
  if (validated) return;

  // Always required for JWT signing/verifying.
  requireEnv("AUTH_JWT_SECRET");

  const ttl = optionalPositiveInt("AUTH_JWT_TTL_SECONDS");
  const maxTtl = optionalPositiveInt("AUTH_JWT_MAX_TTL_SECONDS");
  if (ttl !== undefined && maxTtl !== undefined && ttl > maxTtl) {
    throw new AppError("AUTH_JWT_TTL_SECONDS must be <= AUTH_JWT_MAX_TTL_SECONDS", {
      code: "INTERNAL_ERROR",
      status: 500,
      details: { AUTH_JWT_TTL_SECONDS: ttl, AUTH_JWT_MAX_TTL_SECONDS: maxTtl }
    });
  }

  const skew = optionalPositiveInt("AUTH_JWT_CLOCK_SKEW_SECONDS");
  if (skew !== undefined && skew > 300) {
    throw new AppError("AUTH_JWT_CLOCK_SKEW_SECONDS is unreasonably high", {
      code: "INTERNAL_ERROR",
      status: 500,
      details: { AUTH_JWT_CLOCK_SKEW_SECONDS: skew }
    });
  }

  const issuer = getEnv("AUTH_JWT_ISSUER");
  if (issuer !== undefined && issuer.trim().length === 0) {
    throw new AppError("AUTH_JWT_ISSUER must not be empty", {
      code: "INTERNAL_ERROR",
      status: 500
    });
  }

  const audience = getEnv("AUTH_JWT_AUDIENCE");
  if (audience !== undefined && audience.trim().length === 0) {
    throw new AppError("AUTH_JWT_AUDIENCE must not be empty", {
      code: "INTERNAL_ERROR",
      status: 500
    });
  }

  const provider = determineProvider();
  if (provider === "postgres") {
    requireEnv("PGHOST");
    requireEnv("PGDATABASE");
    requireEnv("PGUSER");
    requireEnv("PGPASSWORD");
    requireEnv("PGPORT");
    // PGSSLMODE is optional.
  }

  validated = true;
}


```

---

## File: src/security/loginLockout.ts

```ts
import pg from "pg";
import { getEnv, requireEnv } from "../lib/env.js";
import { writeAuditLog } from "../services/auditLogService.js";

export interface LockoutPolicy {
  windowSeconds: number;
  maxFailures: number;
  lockSeconds: number;
  scope: "ip+identifier";
}

export type LockoutCheckResult = {
  locked: boolean;
  lockedUntil?: string;
  retryAfterSeconds?: number;
};

type MemKey = string;

const mem = new Map<
  MemKey,
  { windowStartMs: number; failures: number; lockedUntilMs?: number }
>();

const { Pool } = pg;

let pool: pg.Pool | undefined;

function hasPgEnv(): boolean {
  return !!getEnv("PGHOST") && !!getEnv("PGDATABASE") && !!getEnv("PGUSER") && !!getEnv("PGPASSWORD");
}

function getPool(): pg.Pool | undefined {
  if (pool) return pool;
  if (!hasPgEnv()) return undefined;

  const host = requireEnv("PGHOST");
  const database = requireEnv("PGDATABASE");
  const user = requireEnv("PGUSER");
  const password = requireEnv("PGPASSWORD");
  const port = getEnv("PGPORT");
  const sslMode = (getEnv("PGSSLMODE") || "require").toLowerCase();

  const ssl = sslMode === "disable" ? undefined : { rejectUnauthorized: false };

  pool = new Pool({
    host,
    database,
    user,
    password,
    ...(port ? { port: Number(port) } : {}),
    ...(ssl ? { ssl } : {})
  });

  return pool;
}

function bucketStart(now: Date, seconds: number): Date {
  const ms = seconds * 1000;
  return new Date(Math.floor(now.getTime() / ms) * ms);
}

function retryAfterSeconds(nowMs: number, untilMs: number): number {
  return Math.max(0, Math.ceil((untilMs - nowMs) / 1000));
}

function makeKey(identifier: string, ip: string): string {
  const id = (identifier || "").trim().toLowerCase() || "unknown";
  const addr = (ip || "").trim() || "unknown";
  return `${addr}|${id}`;
}

export async function checkLockout(
  policy: LockoutPolicy,
  input: { identifier: string; ip: string; requestId?: string; userAgent?: string }
): Promise<LockoutCheckResult> {
  const now = new Date();
  const nowMs = now.getTime();
  const key = makeKey(input.identifier, input.ip);

  const p = getPool();
  if (!p) {
    const windowStart = bucketStart(now, policy.windowSeconds).getTime();
    const s = mem.get(key);

    if (!s || s.windowStartMs !== windowStart) return { locked: false };

    const lockedUntilMs = s.lockedUntilMs;
    if (!lockedUntilMs) return { locked: false };

    if (lockedUntilMs <= nowMs) return { locked: false };

    return {
      locked: true,
      lockedUntil: new Date(lockedUntilMs).toISOString(),
      retryAfterSeconds: retryAfterSeconds(nowMs, lockedUntilMs)
    };
  }

  const bucket = bucketStart(now, policy.windowSeconds);

  const res = await p.query<{ locked_until: string | null }>(
    `
      select locked_until
      from identity.auth_failures
      where identifier = $1::text
        and ip = $2::text
        and window_start = $3::timestamptz
        and window_seconds = $4::int
      limit 1
    `,
    [(input.identifier || "").trim().toLowerCase(), (input.ip || "").trim(), bucket.toISOString(), policy.windowSeconds]
  );

  const row = res.rows[0];
  const lockedUntil = row?.locked_until || null;
  if (!lockedUntil) return { locked: false };

  const untilMs = new Date(lockedUntil).getTime();
  if (Number.isNaN(untilMs) || untilMs <= nowMs) return { locked: false };

  return {
    locked: true,
    lockedUntil,
    retryAfterSeconds: retryAfterSeconds(nowMs, untilMs)
  };
}

export async function recordLoginSuccess(
  policy: LockoutPolicy,
  input: { identifier: string; ip: string }
): Promise<void> {
  const now = new Date();
  const key = makeKey(input.identifier, input.ip);

  const p = getPool();
  if (!p) {
    const s = mem.get(key);
    if (!s) return;
    mem.set(key, { windowStartMs: s.windowStartMs, failures: 0 });
    return;
  }

  const bucket = bucketStart(now, policy.windowSeconds);

  await p.query(
    `
      insert into identity.auth_failures
        (identifier, ip, window_start, window_seconds, failure_count, locked_until, last_success_at, updated_at)
      values
        ($1::text, $2::text, $3::timestamptz, $4::int, 0, null, now(), now())
      on conflict (identifier, ip, window_start, window_seconds)
      do update set
        failure_count = 0,
        locked_until = null,
        last_success_at = now(),
        updated_at = now()
    `,
    [(input.identifier || "").trim().toLowerCase(), (input.ip || "").trim(), bucket.toISOString(), policy.windowSeconds]
  );
}

export async function recordLoginFailure(
  policy: LockoutPolicy,
  input: { identifier: string; ip: string; requestId?: string; userAgent?: string }
): Promise<{ lockedNow: boolean; lockedUntil?: string }> {
  const now = new Date();
  const nowMs = now.getTime();
  const key = makeKey(input.identifier, input.ip);

  const p = getPool();
  if (!p) {
    const windowStart = bucketStart(now, policy.windowSeconds).getTime();
    const s = mem.get(key);
    const withinWindow = s && s.windowStartMs === windowStart;

    const nextFailures = withinWindow ? s.failures + 1 : 1;
    const lockedNow = nextFailures >= policy.maxFailures;

    const lockedUntilMs = lockedNow ? nowMs + policy.lockSeconds * 1000 : s?.lockedUntilMs;

    mem.set(key, {
      windowStartMs: windowStart,
      failures: nextFailures,
      ...(lockedUntilMs ? { lockedUntilMs } : {})
    });

    return lockedNow ? { lockedNow: true, lockedUntil: new Date(lockedUntilMs!).toISOString() } : { lockedNow: false };
  }

  const bucket = bucketStart(now, policy.windowSeconds);

  const res = await p.query<{ failure_count: number; locked_until: string | null }>(
    `
      insert into identity.auth_failures
        (identifier, ip, window_start, window_seconds, failure_count, locked_until, last_failure_at, updated_at)
      values
        ($1::text, $2::text, $3::timestamptz, $4::int, 1, null, now(), now())
      on conflict (identifier, ip, window_start, window_seconds)
      do update set
        failure_count = identity.auth_failures.failure_count + 1,
        last_failure_at = now(),
        updated_at = now(),
        locked_until = case
          when (identity.auth_failures.failure_count + 1) >= $5::int
            then greatest(coalesce(identity.auth_failures.locked_until, now()), now() + ($6::int || ' seconds')::interval)
          else identity.auth_failures.locked_until
        end
      returning failure_count, locked_until
    `,
    [
      (input.identifier || "").trim().toLowerCase(),
      (input.ip || "").trim(),
      bucket.toISOString(),
      policy.windowSeconds,
      policy.maxFailures,
      policy.lockSeconds
    ]
  );

  const row = res.rows[0];
  const lockedUntil = row?.locked_until || null;

  const lockedNow = !!lockedUntil && row?.failure_count === policy.maxFailures;

  if (lockedNow) {
    try {
      const entry = {
        action: "auth.login.locked",
        ip: input.ip,
        details: {
          identifier: (input.identifier || "").trim().toLowerCase(),
          windowSeconds: policy.windowSeconds,
          maxFailures: policy.maxFailures,
          lockSeconds: policy.lockSeconds,
          lockedUntil
        },
        ...(input.requestId ? { requestId: input.requestId } : {}),
        ...(input.userAgent ? { userAgent: input.userAgent } : {})
      };

      await writeAuditLog(entry);
    } catch {
      // Best effort only.
    }
  }

  return lockedUntil ? { lockedNow, lockedUntil } : { lockedNow: false };
}


export async function closeLoginLockoutPool(): Promise<void> {
  if (!pool) return;
  const p = pool;
  pool = undefined;
  await p.end();
}


```

---

## File: src/security/rateLimiter.ts

```ts
import { Pool } from "pg";
import type { RequestContext } from "./requestContext.js";

export interface RateLimitPolicy {
  bucketSeconds: number;
  maxHits: number;
  route: string;
}

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds?: number;
};

let pool: Pool | undefined;

function hasPgEnv(): boolean {
  return (
    !!process.env.PG_CONNECTION_STRING ||
    (!!process.env.PGHOST && !!process.env.PGDATABASE && !!process.env.PGUSER && !!process.env.PGPASSWORD)
  );
}

function getPool(): Pool | undefined {
  if (pool) return pool;
  if (!hasPgEnv()) return undefined;

  if (process.env.PG_CONNECTION_STRING) {
    pool = new Pool({ connectionString: process.env.PG_CONNECTION_STRING });
    return pool;
  }

  const host = process.env.PGHOST!;
  const database = process.env.PGDATABASE!;
  const user = process.env.PGUSER!;
  const password = process.env.PGPASSWORD!;
  const port = Number(process.env.PGPORT || "5432");
  const sslmode = (process.env.PGSSLMODE || "").toLowerCase();

  const ssl =
    sslmode === "require" || sslmode === "verify-ca" || sslmode === "verify-full"
      ? { rejectUnauthorized: false }
      : undefined;

  pool = new Pool({
    host,
    database,
    user,
    password,
    port,
    ...(ssl ? { ssl } : {})
  });

  return pool;
}

export async function closeRateLimiterPool(): Promise<void> {
  if (!pool) return;
  const p = pool;
  pool = undefined;
  await p.end();
}

type MemKey = string;

const memCounters = new Map<MemKey, { hits: number; expiresAtMs: number }>();

function bucketStart(now: Date, seconds: number): Date {
  const ms = seconds * 1000;
  return new Date(Math.floor(now.getTime() / ms) * ms);
}

function calcRetryAfterSeconds(now: Date, bucketSeconds: number): number {
  const bucket = bucketStart(now, bucketSeconds);
  const expires = new Date(bucket.getTime() + bucketSeconds * 1000);
  const remainingMs = expires.getTime() - now.getTime();
  return Math.max(0, Math.ceil(remainingMs / 1000));
}

function toKeyPart(v: string | undefined): string | undefined {
  const s = (v || "").trim();
  return s.length > 0 ? s : undefined;
}

export function makeRateKey(parts: Array<string | undefined>): string {
  const cleaned = parts.map(toKeyPart).filter((v): v is string => Boolean(v));
  return cleaned.length > 0 ? cleaned.join("|") : "unknown";
}

function memKey(policy: RateLimitPolicy, rateKey: string, bucketIso: string): MemKey {
  return `${policy.route}::${rateKey}::${policy.bucketSeconds}::${bucketIso}`;
}

function memCheck(policy: RateLimitPolicy, rateKey: string): RateLimitResult {
  const now = new Date();
  const bucket = bucketStart(now, policy.bucketSeconds);
  const expiresAtMs = bucket.getTime() + policy.bucketSeconds * 1000;
  const key = memKey(policy, rateKey, bucket.toISOString());

  const existing = memCounters.get(key);
  if (!existing || existing.expiresAtMs <= now.getTime()) {
    memCounters.set(key, { hits: 1, expiresAtMs });
    return { allowed: 1 <= policy.maxHits };
  }

  existing.hits += 1;
  memCounters.set(key, existing);

  if (existing.hits <= policy.maxHits) return { allowed: true };
  return { allowed: false, retryAfterSeconds: calcRetryAfterSeconds(now, policy.bucketSeconds) };
}

export async function checkRateLimit(
  policy: RateLimitPolicy,
  rateKey: string
): Promise<RateLimitResult> {
  const key = makeRateKey([rateKey]);

  // Deterministic fallback for tests/dev when PG isn't configured.
  const p = getPool();
  if (!p) {
    return memCheck(policy, key);
  }

  const now = new Date();
  const bucket = bucketStart(now, policy.bucketSeconds);
  const expires = new Date(bucket.getTime() + policy.bucketSeconds * 1000);

  const client = await p.connect();
  try {
    try {
      await client.query(`delete from identity.rate_limits where expires_at < now()`);
    } catch {
      // Best effort only.
    }

    const res = await client.query(
      `
      insert into identity.rate_limits (rate_key, route, bucket_start, bucket_seconds, hit_count, expires_at)
      values ($1,$2,$3,$4,1,$5)
      on conflict (rate_key, route, bucket_start, bucket_seconds)
      do update set hit_count = identity.rate_limits.hit_count + 1, updated_at = now()
      returning hit_count
      `,
      [key, policy.route, bucket.toISOString(), policy.bucketSeconds, expires.toISOString()]
    );

    const hits = Number(res.rows[0]?.hit_count || 0);
    if (hits <= policy.maxHits) return { allowed: true };

    return { allowed: false, retryAfterSeconds: calcRetryAfterSeconds(now, policy.bucketSeconds) };
  } catch {
    // Fail open on infra errors.
    return { allowed: true };
  } finally {
    client.release();
  }
}

export function rateKeyFromContext(ctx: RequestContext): string {
  return makeRateKey([ctx.ip || "unknown"]);
}


```

---

## File: src/security/requestContext.ts

```ts
import type { HandlerEvent } from "@netlify/functions";

export interface RequestContext {
  requestId: string;
  ip: string;
  userAgent: string;
  route: string;
  method: string;
}

export function buildRequestContext(event: HandlerEvent, requestId: string): RequestContext {
  const headers = event.headers || {};
  const xfwd = headers["x-forwarded-for"] || headers["x-nf-client-connection-ip"] || "";
  const first = typeof xfwd === "string" && xfwd.length > 0 ? xfwd.split(",")[0] : undefined;
  const ip = first ? first.trim() : "unknown";
  const ua = headers["user-agent"] || headers["User-Agent"] || "";
  return {
    requestId,
    ip: typeof ip === "string" ? ip : "unknown",
    userAgent: typeof ua === "string" ? ua : "",
    route: event.path || "",
    method: event.httpMethod || "",
  };
}

```

---

## File: src/security/runtimeConfig.ts

```ts
import { AppError } from "../lib/errors.js";
import { getEnv, requireEnv } from "../lib/env.js";

type Provider = "fake" | "postgres";

type RuntimeConfig = {
  provider: Provider;
};

let validated = false;

function parseIntEnv(name: string, v: string): number {
  const n = Number.parseInt(v, 10);
  if (!Number.isFinite(n)) {
    throw new AppError(`Invalid integer env var: ${name}`, {
      code: "INTERNAL_ERROR",
      status: 500,
      details: { name, value: v }
    });
  }
  return n;
}

function optionalPositiveInt(name: string): number | undefined {
  const v = getEnv(name);
  if (!v) return undefined;
  const n = parseIntEnv(name, v);
  if (n <= 0) {
    throw new AppError(`Env var must be > 0: ${name}`, {
      code: "INTERNAL_ERROR",
      status: 500,
      details: { name, value: v }
    });
  }
  return n;
}

function determineProvider(): Provider {
  const explicit = getEnv("AUTH_PROVIDER");
  if (explicit) {
    const p = explicit.toLowerCase();
    if (p === "fake") return "fake";
    if (p === "postgres") return "postgres";
    throw new AppError("Invalid AUTH_PROVIDER", {
      code: "INTERNAL_ERROR",
      status: 500,
      details: { value: explicit }
    });
  }

  const isTest = (getEnv("NODE_ENV") || "").toLowerCase() === "test";
  if (isTest) return "fake";

  return "postgres";
}

export function validateAuthConfig(): void {
  if (validated) return;

  requireEnv("AUTH_JWT_SECRET");

  const ttl = optionalPositiveInt("AUTH_JWT_TTL_SECONDS");
  const maxTtl = optionalPositiveInt("AUTH_JWT_MAX_TTL_SECONDS");
  if (ttl !== undefined && maxTtl !== undefined && ttl > maxTtl) {
    throw new AppError("AUTH_JWT_TTL_SECONDS must be <= AUTH_JWT_MAX_TTL_SECONDS", {
      code: "INTERNAL_ERROR",
      status: 500,
      details: { AUTH_JWT_TTL_SECONDS: ttl, AUTH_JWT_MAX_TTL_SECONDS: maxTtl }
    });
  }

  const skew = optionalPositiveInt("AUTH_JWT_CLOCK_SKEW_SECONDS");
  if (skew !== undefined && skew > 300) {
    throw new AppError("AUTH_JWT_CLOCK_SKEW_SECONDS is unreasonably high", {
      code: "INTERNAL_ERROR",
      status: 500,
      details: { AUTH_JWT_CLOCK_SKEW_SECONDS: skew }
    });
  }

  const issuer = getEnv("AUTH_JWT_ISSUER");
  if (issuer !== undefined && issuer.trim().length === 0) {
    throw new AppError("AUTH_JWT_ISSUER must not be empty", {
      code: "INTERNAL_ERROR",
      status: 500
    });
  }

  const audience = getEnv("AUTH_JWT_AUDIENCE");
  if (audience !== undefined && audience.trim().length === 0) {
    throw new AppError("AUTH_JWT_AUDIENCE must not be empty", {
      code: "INTERNAL_ERROR",
      status: 500
    });
  }

  const provider = determineProvider();
  if (provider === "postgres") {
    requireEnv("PGHOST");
    requireEnv("PGDATABASE");
    requireEnv("PGUSER");
    requireEnv("PGPASSWORD");
    requireEnv("PGPORT");
  }

  validated = true;
}

export function requireRuntimeConfig(): RuntimeConfig {
  validateAuthConfig();
  return {
    provider: determineProvider()
  };
}

```

---

## File: src/services/adminUsersService.ts

```ts
import { AppError } from "../lib/errors.js";
import type { AuthUserProfile } from "../contracts/auth.js";
import type {
  AdminCreateUserRequest,
  AdminUpdateUserRequest,
  AdminUserResponse,
  AdminUsersResponse
} from "../contracts/adminUsers.js";
import { isAdminUser } from "../security/adminPolicy.js";
import { createUser, deleteUser, getUserById, getUserFromToken, listUsers, updateUser } from "./authService.js";

async function requireAdmin(token: string): Promise<AuthUserProfile> {
  const caller = await getUserFromToken(token);
  if (!isAdminUser(caller)) {
    throw new AppError("Forbidden", { code: "FORBIDDEN", status: 403 });
  }
  return caller;
}

export async function getAdminUsers(token: string): Promise<AdminUsersResponse> {
  await requireAdmin(token);
  const users = await listUsers();
  return { users };
}

export async function getAdminUserById(token: string, id: string): Promise<AdminUserResponse> {
  await requireAdmin(token);
  const user = await getUserById(id);
  return { user };
}

export async function createAdminUser(token: string, req: AdminCreateUserRequest): Promise<AdminUserResponse> {
  await requireAdmin(token);

  const email = (req.email || "").trim().toLowerCase();
  const password = req.password || "";
  const displayName = (req.displayName || "").trim();
  const roles = Array.isArray(req.roles) ? req.roles : undefined;

  if (!email || !password) {
    throw new AppError("email and password are required", {
      code: "BAD_REQUEST",
      status: 400,
      details: { fields: ["email", "password"] }
    });
  }

  const user = await createUser({
    email,
    password,
    ...(displayName ? { displayName } : {}),
    ...(roles ? { roles } : {})
  });

  return { user };
}

export async function updateAdminUser(
  token: string,
  id: string,
  req: AdminUpdateUserRequest
): Promise<AdminUserResponse> {
  await requireAdmin(token);

  const displayName = req.displayName === undefined ? undefined : (req.displayName || "").trim();
  const roles = req.roles === undefined ? undefined : req.roles;

  const hasDisplayName = displayName !== undefined;
  const hasRoles = roles !== undefined;

  if (!hasDisplayName && !hasRoles) {
    throw new AppError("At least one field must be provided", {
      code: "BAD_REQUEST",
      status: 400,
      details: { fields: ["displayName", "roles"] }
    });
  }

  const user = await updateUser(id, { ...(hasDisplayName ? { displayName } : {}), ...(hasRoles ? { roles } : {}) });
  return { user };
}

export async function deleteAdminUser(token: string, id: string): Promise<void> {
  await requireAdmin(token);
  await deleteUser(id);
}

```

---

## File: src/services/auditLogService.ts

```ts
import pg from "pg";
import { AppError } from "../lib/errors.js";
import { getEnv, requireEnv } from "../lib/env.js";

export type AuditLogEntryInput = {
  action: string;
  actorUserId?: string;
  targetUserId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  details?: unknown;
};

type DbAuditRow = {
  id: string;
};

let pool: pg.Pool | undefined;

function getPool(): pg.Pool {
  if (pool) return pool;

  // Mirrors the app's normal Postgres env expectations.
  const host = requireEnv("PGHOST");
  const database = requireEnv("PGDATABASE");
  const user = requireEnv("PGUSER");
  const password = requireEnv("PGPASSWORD");
  const port = Number(getEnv("PGPORT") || "5432");
  const sslmode = (getEnv("PGSSLMODE") || "").toLowerCase();

  // neon typically requires SSL; local dev may not.
  const ssl =
    sslmode === "require" || sslmode === "verify-ca" || sslmode === "verify-full"
      ? { rejectUnauthorized: false }
      : undefined;

  pool = new pg.Pool({
    host,
    database,
    user,
    password,
    port,
    ssl
  });

  return pool;
}

export async function writeAuditLog(input: AuditLogEntryInput): Promise<string> {
  const action = (input.action || "").trim();
  if (!action) {
    throw new AppError("Missing audit action", { code: "BAD_REQUEST", status: 400 });
  }

  const p = getPool();

  const actorUserId = (input.actorUserId || "").trim() || null;
  const targetUserId = (input.targetUserId || "").trim() || null;
  const requestId = (input.requestId || "").trim() || null;
  const ip = (input.ip || "").trim() || null;
  const userAgent = (input.userAgent || "").trim() || null;

  const detailsJson =
    input.details === undefined ? null : JSON.stringify(input.details);

  const { rows } = await p.query<DbAuditRow>(
    `
      insert into identity.audit_log (action, actor_user_id, target_user_id, request_id, ip, user_agent, details)
      values ($1::text, $2::uuid, $3::uuid, $4::text, $5::text, $6::text, $7::jsonb)
      returning id
    `,
    [action, actorUserId, targetUserId, requestId, ip, userAgent, detailsJson]
  );

  const row = rows[0];
  if (!row) {
    throw new AppError("Failed to write audit log", { code: "INTERNAL_ERROR", status: 500 });
  }

  return row.id;
}

export async function closeAuditPool(): Promise<void> {
  if (!pool) return;
  const p = pool;
  pool = undefined;
  await p.end();
}


```

---

## File: src/services/authProvider.ts

```ts
import type { RequestContext } from "../security/requestContext.js";
import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutRequest,
  AuthRefreshRequest,
  AuthRefreshResponse,
  AuthRegisterRequest,
  AuthRegisterResponse,
  AuthUserProfile
} from "../contracts/auth.js";

export type CreateUserInput = {
  email: string;
  password: string;
  displayName?: string;
  roles?: string[];
};

export type UpdateUserInput = {
  displayName?: string;
  roles?: string[];
};

export type AuthProvider = {
  login: (req: AuthLoginRequest, ctx?: RequestContext) => Promise<AuthLoginResponse>;
  register: (req: AuthRegisterRequest, ctx?: RequestContext) => Promise<AuthRegisterResponse>;
  refresh: (req: AuthRefreshRequest, ctx?: RequestContext) => Promise<AuthRefreshResponse>;
  logout: (accessToken: string, req?: AuthLogoutRequest, ctx?: RequestContext) => Promise<void>;
  getUserFromToken: (token: string) => Promise<AuthUserProfile>;

  listUsers: () => Promise<AuthUserProfile[]>;
  getUserById: (id: string) => Promise<AuthUserProfile>;
  createUser: (input: CreateUserInput) => Promise<AuthUserProfile>;
  updateUser: (id: string, input: UpdateUserInput) => Promise<AuthUserProfile>;
  deleteUser: (id: string) => Promise<void>;
};

```

---

## File: src/services/authService.ts

```ts
import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutRequest,
  AuthRefreshRequest,
  AuthRefreshResponse,
  AuthRegisterRequest,
  AuthRegisterResponse,
  AuthUserProfile
} from "../contracts/auth.js";
import type { AuthProvider, CreateUserInput, UpdateUserInput } from "./authProvider.js";
import { fakeAuthProvider } from "./fakeAuthProvider.js";
import { postgresAuthProvider } from "./postgresAuthProvider.js";

import { getEnv } from "../lib/env.js";
import { requireRuntimeConfig } from "../security/runtimeConfig.js";

function selectProvider(): AuthProvider {
  // Fail-fast on bad runtime env so API callers get deterministic errors
  // and we don't accidentally run in a partially configured state.
  const cfg = requireRuntimeConfig();

  const explicit = getEnv("AUTH_PROVIDER");
  if (explicit) {
    const p = explicit.toLowerCase();
    if (p === "fake") return fakeAuthProvider;
    if (p === "postgres") return postgresAuthProvider;
  }

  if (cfg.provider === "fake") return fakeAuthProvider;
  return postgresAuthProvider;
}

export async function login(req: AuthLoginRequest): Promise<AuthLoginResponse> {
  return selectProvider().login(req);
}

export async function register(req: AuthRegisterRequest): Promise<AuthRegisterResponse> {
  return selectProvider().register(req);
}

export async function refresh(req: AuthRefreshRequest): Promise<AuthRefreshResponse> {
  return selectProvider().refresh(req);
}

export async function logout(accessToken: string, req?: AuthLogoutRequest): Promise<void> {
  return selectProvider().logout(accessToken, req);
}

export async function getUserFromToken(token: string): Promise<AuthUserProfile> {
  return selectProvider().getUserFromToken(token);
}

export async function listUsers(): Promise<AuthUserProfile[]> {
  return selectProvider().listUsers();
}

export async function getUserById(id: string): Promise<AuthUserProfile> {
  return selectProvider().getUserById(id);
}

export async function createUser(input: CreateUserInput): Promise<AuthUserProfile> {
  return selectProvider().createUser(input);
}

export async function updateUser(id: string, input: UpdateUserInput): Promise<AuthUserProfile> {
  return selectProvider().updateUser(id, input);
}

export async function deleteUser(id: string): Promise<void> {
  return selectProvider().deleteUser(id);
}

```

---

## File: src/services/fakeAuthProvider.ts

```ts
import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import { AppError } from "../lib/errors.js";
import type { AuthProvider, CreateUserInput, UpdateUserInput } from "./authProvider.js";
import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutRequest,
  AuthRefreshRequest,
  AuthRefreshResponse,
  AuthRegisterRequest,
  AuthRegisterResponse,
  AuthUserProfile
} from "../contracts/auth.js";

type FakeUser = AuthUserProfile & {
  email: string;
  password: string;
  deletedAt?: string;
};

type FakeSession = {
  userId: string;
  refreshToken: string;
  revokedAt?: string;
  expiresAt: string;
};

type FakeUserStore = {
  usersById: Record<string, FakeUser>;
};

type FakeSessionStore = {
  sessionsByRefreshToken: Record<string, FakeSession>;
};

const USERS_STORE_PATH = "/tmp/identity-backend-fake-users.json";
const SESSIONS_STORE_PATH = "/tmp/identity-backend-fake-sessions.json";

async function loadUserStore(): Promise<FakeUserStore> {
  try {
    const raw = await fs.readFile(USERS_STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as FakeUserStore;
    if (!parsed || typeof parsed !== "object") return { usersById: {} };
    if (!parsed.usersById || typeof parsed.usersById !== "object") return { usersById: {} };
    return parsed;
  } catch {
    return { usersById: {} };
  }
}

async function saveUserStore(store: FakeUserStore): Promise<void> {
  const tmp = `${USERS_STORE_PATH}.${crypto.randomBytes(6).toString("hex")}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(store), "utf8");
  await fs.rename(tmp, USERS_STORE_PATH);
}

async function ensureSeedUsers(): Promise<void> {
  const store = await loadUserStore();

  const DEMO_USER_ID = "user_demo_001";
  const USER_USER_ID = "user_basic_002";

  if (!store.usersById[DEMO_USER_ID]) {
    store.usersById[DEMO_USER_ID] = {
      id: DEMO_USER_ID,
      username: "demo",
      displayName: "Demo User",
      roles: ["user"],
      email: "demo@example.com",
      password: "letmein"
    };
  }

  if (!store.usersById[USER_USER_ID]) {
    store.usersById[USER_USER_ID] = {
      id: USER_USER_ID,
      username: "user",
      displayName: "Basic User",
      roles: ["user"],
      email: "user@example.com",
      password: "letmein"
    };
  }

  await saveUserStore(store);
}

async function loadSessionStore(): Promise<FakeSessionStore> {
  try {
    const raw = await fs.readFile(SESSIONS_STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as FakeSessionStore;
    if (!parsed || typeof parsed !== "object") return { sessionsByRefreshToken: {} };
    if (!parsed.sessionsByRefreshToken || typeof parsed.sessionsByRefreshToken !== "object") {
      return { sessionsByRefreshToken: {} };
    }
    return parsed;
  } catch {
    return { sessionsByRefreshToken: {} };
  }
}

async function saveSessionStore(store: FakeSessionStore): Promise<void> {
  const tmp = `${SESSIONS_STORE_PATH}.${crypto.randomBytes(6).toString("hex")}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(store), "utf8");
  await fs.rename(tmp, SESSIONS_STORE_PATH);
}

function nowIso() {
  return new Date().toISOString();
}

function addMinutesIso(minutes: number) {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

function accessTokenForUser(userId: string): string {
  return `fake-access-token.${userId}`;
}

function newRefreshToken(userId: string): string {
  const nonce = crypto.randomBytes(12).toString("hex");
  return `fake-refresh-token.${userId}.${nonce}`;
}

async function createSession(userId: string): Promise<{ refreshToken: string; expiresAt: string }> {
  const refreshToken = newRefreshToken(userId);
  const expiresAt = addMinutesIso(60);

  const store = await loadSessionStore();
  store.sessionsByRefreshToken[refreshToken] = {
    userId,
    refreshToken,
    expiresAt
  };
  await saveSessionStore(store);

  return { refreshToken, expiresAt };
}

function isUuid(v: string): boolean {
  const s = (v || "").trim();
  if (!s) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

function parseAccessToken(token: string): string {
  const t = (token || "").trim();
  if (!t) throw new AppError("Missing token", { code: "UNAUTHORIZED", status: 401 });
  if (!t.startsWith("fake-access-token.")) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  const userId = t.slice("fake-access-token.".length);
  if (!userId) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  if (!userId.startsWith("user_") && !isUuid(userId)) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  return userId;
}

function parseRefreshToken(token: string): { userId: string } {
  const t = (token || "").trim();
  if (!t) throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });

  const parts = t.split(".");
  if (parts.length !== 3) throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });
  if (parts[0] !== "fake-refresh-token") throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });

  const userId = (parts[1] || "").trim();
  if (!userId) throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });

  return { userId };
}

async function findUserByEmail(email: string): Promise<FakeUser | undefined> {
  await ensureSeedUsers();
  const store = await loadUserStore();
  for (const u of Object.values(store.usersById)) {
    if (!u) continue;
    if ((u.email || "").toLowerCase() === email.toLowerCase()) return u;
  }
  return undefined;
}

async function requireActiveUserByEmail(email: string): Promise<FakeUser> {
  const u = await findUserByEmail(email);
  if (!u || u.deletedAt) throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
  return u;
}

async function requireUserById(id: string): Promise<FakeUser> {
  await ensureSeedUsers();
  const store = await loadUserStore();
  const u = store.usersById[id];
  if (!u) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });
  return u;
}

async function requireActiveUserById(id: string): Promise<FakeUser> {
  const u = await requireUserById(id);
  if (u.deletedAt) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  return u;
}

function toAuthResponse(user: FakeUser, session: { refreshToken: string; expiresAt: string }): AuthLoginResponse {
  return {
    provider: "fake",
    session: {
      accessToken: accessTokenForUser(user.id),
      tokenType: "bearer",
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt
    },
    user: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      roles: user.roles
    }
  };
}

function normalizeRoles(roles: string[] | undefined): string[] {
  const r = Array.isArray(roles) ? roles.map((x) => (x || "").trim()).filter((x) => x.length > 0) : [];
  const unique = Array.from(new Set(r));
  return unique.length > 0 ? unique : ["user"];
}

async function revokeSessionsForUser(userId: string): Promise<void> {
  const store = await loadSessionStore();
  let changed = false;

  for (const k of Object.keys(store.sessionsByRefreshToken)) {
    const v = store.sessionsByRefreshToken[k];
    if (!v) continue;
    if (v.userId !== userId) continue;
    if (v.revokedAt) continue;

    v.revokedAt = nowIso();
    store.sessionsByRefreshToken[k] = v;
    changed = true;
  }

  if (changed) {
    await saveSessionStore(store);
  }
}

export const fakeAuthProvider: AuthProvider = {
  login: async (req: AuthLoginRequest): Promise<AuthLoginResponse> => {
    const username = (req.username || "").trim();
    const password = req.password || "";

    if (!username || !password) {
      throw new AppError("username and password are required", {
        code: "BAD_REQUEST",
        status: 400,
        details: { fields: ["username", "password"] }
      });
    }

    const email = username === "demo" ? "demo@example.com" : username;
    const u = await requireActiveUserByEmail(email);

    if (u.password !== password) {
      throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
    }

    const s = await createSession(u.id);
    return toAuthResponse(u, s);
  },

  register: async (req: AuthRegisterRequest): Promise<AuthRegisterResponse> => {
    const email = (req.email || "").trim().toLowerCase();
    const password = req.password || "";
    const displayName = (req.displayName || "").trim();

    if (!email || !password) {
      throw new AppError("email and password are required", {
        code: "BAD_REQUEST",
        status: 400,
        details: { fields: ["email", "password"] }
      });
    }

    const existing = await findUserByEmail(email);
    if (existing && !existing.deletedAt) {
      throw new AppError("Email already exists", { code: "CONFLICT", status: 409 });
    }

    await ensureSeedUsers();
    const store = await loadUserStore();

    const id = `user_${crypto.randomBytes(6).toString("hex")}`;

    const user: FakeUser = {
      id,
      username: email,
      displayName: displayName || email,
      roles: ["user"],
      email,
      password
    };

    store.usersById[id] = user;
    await saveUserStore(store);

    const s = await createSession(id);
    return toAuthResponse(user, s);
  },

  refresh: async (req: AuthRefreshRequest): Promise<AuthRefreshResponse> => {
    const refreshToken = (req.refreshToken || "").trim();
    if (!refreshToken) {
      throw new AppError("refreshToken is required", {
        code: "BAD_REQUEST",
        status: 400,
        details: { fields: ["refreshToken"] }
      });
    }

    const parsed = parseRefreshToken(refreshToken);

    const store = await loadSessionStore();
    const existing = store.sessionsByRefreshToken[refreshToken];

    if (!existing) {
      throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });
    }

    if (existing.userId !== parsed.userId) {
      throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });
    }

    if (existing.revokedAt) {
      throw new AppError("Refresh token revoked", { code: "UNAUTHORIZED", status: 401 });
    }

    if (new Date(existing.expiresAt).getTime() <= Date.now()) {
      throw new AppError("Refresh token expired", { code: "UNAUTHORIZED", status: 401 });
    }

    existing.revokedAt = nowIso();
    store.sessionsByRefreshToken[refreshToken] = existing;
    await saveSessionStore(store);

    const u = await requireActiveUserById(parsed.userId);

    const s = await createSession(u.id);
    return toAuthResponse(u, s);
  },

  logout: async (accessToken: string, req?: AuthLogoutRequest): Promise<void> => {
    const userId = parseAccessToken(accessToken);
    const rt = (req?.refreshToken || "").trim();

    if (rt) {
      const store = await loadSessionStore();
      const existing = store.sessionsByRefreshToken[rt];
      if (existing && existing.userId === userId && !existing.revokedAt) {
        existing.revokedAt = nowIso();
        store.sessionsByRefreshToken[rt] = existing;
        await saveSessionStore(store);
      }
      return;
    }

    await revokeSessionsForUser(userId);
  },

  getUserFromToken: async (token: string): Promise<AuthUserProfile> => {
    const userId = parseAccessToken(token);
    const u = await requireActiveUserById(userId);

    return {
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      roles: u.roles
    };
  },

  listUsers: async (): Promise<AuthUserProfile[]> => {
    await ensureSeedUsers();
    const store = await loadUserStore();

    return Object.values(store.usersById)
      .filter((u): u is FakeUser => !!u)
      .map((u) => ({
        id: u.id,
        username: u.username,
        displayName: u.displayName,
        roles: u.roles
      }));
  },

  getUserById: async (id: string): Promise<AuthUserProfile> => {
    const u = await requireUserById(id);
    return {
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      roles: u.roles
    };
  },

  createUser: async (input: CreateUserInput): Promise<AuthUserProfile> => {
    const email = (input.email || "").trim().toLowerCase();
    const password = input.password || "";
    const displayName = (input.displayName || "").trim();

    if (!email || !password) {
      throw new AppError("email and password are required", {
        code: "BAD_REQUEST",
        status: 400,
        details: { fields: ["email", "password"] }
      });
    }

    const existing = await findUserByEmail(email);
    if (existing && !existing.deletedAt) {
      throw new AppError("Email already exists", { code: "CONFLICT", status: 409 });
    }

    await ensureSeedUsers();
    const store = await loadUserStore();

    const id = `user_${crypto.randomBytes(6).toString("hex")}`;

    const user: FakeUser = {
      id,
      username: email,
      displayName: displayName || email,
      roles: normalizeRoles(input.roles),
      email,
      password
    };

    store.usersById[id] = user;
    await saveUserStore(store);

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      roles: user.roles
    };
  },

  updateUser: async (id: string, input: UpdateUserInput): Promise<AuthUserProfile> => {
    await ensureSeedUsers();
    const store = await loadUserStore();

    const existing = store.usersById[id];
    if (!existing) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });

    store.usersById[id] = {
      ...existing,
      ...(typeof input.displayName === "string" ? { displayName: input.displayName } : {}),
      ...(Array.isArray(input.roles) ? { roles: normalizeRoles(input.roles) } : {})
    };

    await saveUserStore(store);

    const u = store.usersById[id];
    if (!u) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });

    return {
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      roles: u.roles
    };
  },

  deleteUser: async (id: string): Promise<void> => {
    await ensureSeedUsers();
    const store = await loadUserStore();

    const existing = store.usersById[id];
    if (!existing) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });

    store.usersById[id] = { ...existing, deletedAt: nowIso() };
    await saveUserStore(store);

    await revokeSessionsForUser(id);
  }
};


```

---

## File: src/services/healthAdminService.ts

```ts
import pg from "pg";
import { AppError } from "../lib/errors.js";
import { getEnv, requireEnv } from "../lib/env.js";
import { isAdminUser } from "../security/adminPolicy.js";
import { getUserFromToken } from "./authService.js";
import type { HealthAdminResponse } from "../contracts/healthAdmin.js";

const { Pool } = pg;

let pool: pg.Pool | undefined;

function hasPgEnv(): boolean {
  return !!getEnv("PGHOST") && !!getEnv("PGDATABASE") && !!getEnv("PGUSER") && !!getEnv("PGPASSWORD");
}

function getPool(): pg.Pool | undefined {
  if (pool) return pool;
  if (!hasPgEnv()) return undefined;

  const host = requireEnv("PGHOST");
  const database = requireEnv("PGDATABASE");
  const user = requireEnv("PGUSER");
  const password = requireEnv("PGPASSWORD");
  const port = getEnv("PGPORT");
  const sslMode = (getEnv("PGSSLMODE") || "require").toLowerCase();

  const ssl = sslMode === "disable" ? undefined : { rejectUnauthorized: false };

  pool = new Pool({
    host,
    database,
    user,
    password,
    ...(port ? { port: Number(port) } : {}),
    ...(ssl ? { ssl } : {})
  });

  return pool;
}

function fingerprint(parts: Record<string, string | undefined>): string {
  const keys = Object.keys(parts).sort();
  const s = keys.map((k) => `${k}=${parts[k] || ""}`).join("|");
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `fnv1a32:${(h >>> 0).toString(16).padStart(8, "0")}`;
}

export async function getHealthAdmin(token: string): Promise<HealthAdminResponse> {
  const caller = await getUserFromToken(token);
  if (!isAdminUser(caller)) {
    throw new AppError("Forbidden", { code: "FORBIDDEN", status: 403 });
  }

  const host = getEnv("PGHOST");
  const database = getEnv("PGDATABASE");
  const user = getEnv("PGUSER");
  const port = getEnv("PGPORT");
  const sslMode = (getEnv("PGSSLMODE") || "require").toLowerCase();
  const passwordSet = !!getEnv("PGPASSWORD");

  const configFingerprint = fingerprint({
    host,
    database,
    user,
    port,
    sslMode,
    passwordSet: passwordSet ? "1" : "0"
  });

  const out: HealthAdminResponse = {
    postgres: {
      connectMs: -1,
      queryMs: -1,
      activeSessions: -1,
      revokedSessions: -1,
      failedLoginCountLastHour: -1,
      passwordSet,
      configFingerprint,
      ...(host ? { host } : {}),
      ...(database ? { database } : {}),
      ...(user ? { user } : {}),
      ...(port ? { port } : {}),
      ...(sslMode ? { sslMode } : {})
    }
  };

  const p = getPool();
  if (!p) return out;

  const t0 = Date.now();
  const client = await p.connect();
  const t1 = Date.now();
  out.postgres.connectMs = t1 - t0;

  try {
    const q0 = Date.now();

    // Quick liveness query + simple counts for observability.
    const res = await client.query(
      `
      with
        active_sessions as (
          select count(*)::int as n
          from identity.sessions
          where revoked_at is null
            and expires_at > now()
        ),
        revoked_sessions as (
          select count(*)::int as n
          from identity.sessions
          where revoked_at is not null
        ),
        failed_last_hour as (
          select coalesce(sum(failure_count), 0)::int as n
          from identity.auth_failures
          where last_failure_at is not null
            and last_failure_at >= now() - interval '1 hour'
        )
      select
        (select n from active_sessions) as active_sessions,
        (select n from revoked_sessions) as revoked_sessions,
        (select n from failed_last_hour) as failed_last_hour
      `
    );

    const q1 = Date.now();
    out.postgres.queryMs = q1 - q0;

    out.postgres.activeSessions = Number(res.rows[0]?.active_sessions || 0);
    out.postgres.revokedSessions = Number(res.rows[0]?.revoked_sessions || 0);
    out.postgres.failedLoginCountLastHour = Number(res.rows[0]?.failed_last_hour || 0);

    return out;
  } catch (err) {
    // Health-admin should not take the service down; return what we can.
    const msg = err instanceof Error ? err.message : "Unknown error";
    throw new AppError("Health admin query failed", {
      code: "INTERNAL_ERROR",
      status: 500,
      details: { message: msg }
    });
  } finally {
    client.release();
  }
}


```

---

## File: src/services/healthService.ts

```ts
import { getEnv } from "../lib/env.js";
import type { HealthResponse } from "../contracts/health.js";
import { getBuildInfo, getProjectProgressInfo, PROJECT } from "../meta.js";

export async function getHealth(): Promise<HealthResponse> {
  const build = getBuildInfo();
  const project = getProjectProgressInfo();

  const authProvider = getEnv("AUTH_PROVIDER") || undefined;
  const context = getEnv("CONTEXT") || undefined;
  const deployId = getEnv("DEPLOY_ID") || undefined;
  const siteId = getEnv("SITE_ID") || undefined;

  return {
    status: "ok",
    version: PROJECT.version,
    timestamp: new Date().toISOString(),
    build: {
      version: build.version,
      buildTime: build.buildTime,
      node: build.node,
      ...(build.sha ? { sha: build.sha } : {}),
      ...(build.shortSha ? { shortSha: build.shortSha } : {}),
      ...(build.buildId ? { buildId: build.buildId } : {}),
      ...(build.branch ? { branch: build.branch } : {}),
      ...(build.appEnv ? { appEnv: build.appEnv } : {})
    },
    project: {
      ...(project.workPackage ? { workPackage: project.workPackage } : {}),
      ...(project.phase !== undefined ? { phase: project.phase } : {}),
      ...(project.step ? { step: project.step } : {}),
      ...(project.description ? { description: project.description } : {})
    },
    env: {
      ...(authProvider ? { authProvider } : {}),
      postgres: {
        hasHost: !!getEnv("PGHOST"),
        hasDatabase: !!getEnv("PGDATABASE"),
        hasUser: !!getEnv("PGUSER"),
        hasPassword: !!getEnv("PGPASSWORD"),
        hasPort: !!getEnv("PGPORT"),
        hasSslMode: !!getEnv("PGSSLMODE")
      },
      netlify: {
        ...(context ? { context } : {}),
        ...(deployId ? { deployId } : {}),
        ...(siteId ? { siteId } : {})
      }
    }
  };
}

```

---

## File: src/services/meService.ts

```ts
import type { MeResponse } from "../contracts/me.js";
import { getUserFromToken } from "./authService.js";

export async function getMe(token: string): Promise<MeResponse> {
  const user = await getUserFromToken(token);
  return { user };
}

```

---

## File: src/services/postgresAuthProvider.ts

```ts
import crypto from "node:crypto";
import pg from "pg";
import { AppError } from "../lib/errors.js";
import { getEnv, requireEnv } from "../lib/env.js";
import type { RequestContext } from "../security/requestContext.js";
import type { AuthProvider, CreateUserInput, UpdateUserInput } from "./authProvider.js";
import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutRequest,
  AuthRefreshRequest,
  AuthRefreshResponse,
  AuthRegisterRequest,
  AuthRegisterResponse,
  AuthUserProfile
} from "../contracts/auth.js";

const { Pool } = pg;

type DbUserRow = {
  id: string;
  email: string;
  display_name: string;
  roles?: string[] | null;
  deleted_at?: string | null;
  password_salt?: string | null;
  password_hash?: string | null;
};

type DbSessionRow = {
  id: string;
  user_id: string;
  refresh_token_hash: string;
  expires_at: string;
  revoked_at: string | null;
};

let pool: pg.Pool | undefined;

function getPool(): pg.Pool {
  if (pool) return pool;

  const host = requireEnv("PGHOST");
  const database = requireEnv("PGDATABASE");
  const user = requireEnv("PGUSER");
  const password = requireEnv("PGPASSWORD");
  const port = getEnv("PGPORT");
  const sslMode = (getEnv("PGSSLMODE") || "require").toLowerCase();

  const ssl = sslMode === "disable" ? undefined : { rejectUnauthorized: false };

  pool = new Pool({
    host,
    database,
    user,
    password,
    ...(port ? { port: Number(port) } : {}),
    ...(ssl ? { ssl } : {})
  });

  return pool;
}

function toProfile(row: DbUserRow): AuthUserProfile {
  const roles = Array.isArray(row.roles) && row.roles.length > 0 ? row.roles : ["user"];
  return {
    id: row.id,
    username: row.email,
    displayName: row.display_name,
    roles
  };
}

function requireNotDeleted(row: DbUserRow): void {
  if (row.deleted_at) {
    throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
  }
}

const TOKEN_PREFIX = "pg-access-token.";

function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input, "utf8").digest("hex");
}

function randomHex(bytes: number): string {
  return crypto.randomBytes(bytes).toString("hex");
}

function nowIso() {
  return new Date().toISOString();
}

function addMinutesIso(minutes: number) {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

function accessTokenForUser(userId: string, sessionId: string): string {
  return `${TOKEN_PREFIX}${userId}.${sessionId}`;
}

function isUuid(v: string): boolean {
  const s = (v || "").trim();
  if (!s) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

function parseAccessToken(token: string): { userId: string; sessionId: string } {
  const t = (token || "").trim();
  if (!t) throw new AppError("Missing token", { code: "UNAUTHORIZED", status: 401 });
  if (!t.startsWith(TOKEN_PREFIX)) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  const rest = t.slice(TOKEN_PREFIX.length);
  if (!rest) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });

  const parts = rest.split(".");
  const userId = (parts[0] || "").trim();
  const sessionId = (parts[1] || "").trim();
  if (!userId || !sessionId) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  if (!isUuid(userId) || !isUuid(sessionId)) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  return { userId, sessionId };
}

async function createSession(userId: string): Promise<{ sessionId: string; refreshToken: string; expiresAt: string }> {
  const refreshToken = `pg-refresh-token.${randomHex(24)}`;
  const refreshTokenHash = sha256Hex(refreshToken);
  const expiresAt = addMinutesIso(60);

  const p = getPool();
  const { rows } = await p.query<{ id: string }>(
    `
    insert into identity.sessions (user_id, refresh_token_hash, expires_at)
    values ($1::uuid, $2, $3::timestamptz)
    returning id
    `,
    [userId, refreshTokenHash, expiresAt]
  );

  const sessionId = (rows[0]?.id || "").trim();
  if (!sessionId || !isUuid(sessionId)) {
    throw new AppError("Failed to create session", { code: "INTERNAL_ERROR", status: 500 });
  }

  return { sessionId, refreshToken, expiresAt };
}

async function revokeSessionByHash(refreshTokenHash: string): Promise<void> {
  const p = getPool();
  await p.query(
    `
    update identity.sessions
    set revoked_at = $2::timestamptz
    where refresh_token_hash = $1
      and revoked_at is null
    `,
    [refreshTokenHash, nowIso()]
  );
}

async function revokeSessionsByUserId(userId: string): Promise<void> {
  const p = getPool();
  await p.query(
    `
    update identity.sessions
    set revoked_at = $2::timestamptz
    where user_id = $1::uuid
      and revoked_at is null
    `,
    [userId, nowIso()]
  );
}

async function requireActiveSession(sessionId: string, userId: string): Promise<void> {
  const p = getPool();
  const { rows } = await p.query<{ id: string }>(
    `
    select id
    from identity.sessions
    where id = $1::uuid
      and user_id = $2::uuid
      and revoked_at is null
      and expires_at > now()
    limit 1
    `,
    [sessionId, userId]
  );

  if (!rows[0]) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }
}

function requirePasswordFields(row: DbUserRow): { salt: string; hash: string } {
  const salt = (row.password_salt || "").trim();
  const hash = (row.password_hash || "").trim();
  if (!salt || !hash) {
    throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
  }
  return { salt, hash };
}

function hashPassword(salt: string, password: string): string {
  // Must match DB seeding formula:
  // encode(digest(convert_to(password_salt || password_plain,'utf8'),'sha256'),'hex')
  return sha256Hex(`${salt}${password}`);
}

function normalizeRoles(roles: string[] | undefined): string[] {
  const r = Array.isArray(roles) ? roles.map((x) => (x || "").trim()).filter((x) => x.length > 0) : [];
  const unique = Array.from(new Set(r));
  return unique.length > 0 ? unique : ["user"];
}

export const postgresAuthProvider: AuthProvider = {
  login: async (req: AuthLoginRequest): Promise<AuthLoginResponse> => {
    const username = (req.username || "").trim();
    const password = req.password || "";

    if (!username || !password) {
      throw new AppError("username and password are required", {
        code: "BAD_REQUEST",
        status: 400,
        details: { fields: ["username", "password"] }
      });
    }

    const email = username === "demo" ? "demo@example.com" : username;
    const p = getPool();
    const { rows } = await p.query<DbUserRow>(
      "select id, email, display_name, roles, deleted_at, password_salt, password_hash from identity.users where email = $1 limit 1",
      [email]
    );

    const row = rows[0];
    if (!row) {
      throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
    }

    requireNotDeleted(row);

    const { salt, hash } = requirePasswordFields(row);
    const expected = hashPassword(salt, password);
    if (expected !== hash) {
      throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
    }

    const { sessionId, refreshToken, expiresAt } = await createSession(row.id);
    const accessToken = accessTokenForUser(row.id, sessionId);

    return {
      provider: "postgres",
      session: {
        accessToken,
        tokenType: "bearer",
        refreshToken,
        expiresAt
      },
      user: toProfile(row)
    };
  },

  register: async (req: AuthRegisterRequest): Promise<AuthRegisterResponse> => {
    const email = (req.email || "").trim().toLowerCase();
    const password = req.password || "";
    const displayName = (req.displayName || "").trim();

    if (!email || !password) {
      throw new AppError("email and password are required", {
        code: "BAD_REQUEST",
        status: 400,
        details: { fields: ["email", "password"] }
      });
    }

    const p = getPool();
    const { rows: existing } = await p.query<{ id: string }>(
      "select id from identity.users where email = $1 limit 1",
      [email]
    );
    if (existing[0]) {
      throw new AppError("Email already exists", { code: "CONFLICT", status: 409 });
    }

    const roles = ["user"];
    const salt = randomHex(16);
    const hash = hashPassword(salt, password);

    const { rows } = await p.query<DbUserRow>(
      `
      insert into identity.users (email, display_name, roles, password_salt, password_hash)
      values ($1, $2, $3, $4, $5)
      returning id, email, display_name, roles, deleted_at, password_salt, password_hash
      `,
      [email, displayName || email, roles, salt, hash]
    );

    const u = rows[0];
    if (!u) throw new AppError("Failed to create user", { code: "INTERNAL_ERROR", status: 500 });

    const { sessionId, refreshToken, expiresAt } = await createSession(u.id);
    const accessToken = accessTokenForUser(u.id, sessionId);

    return {
      provider: "postgres",
      session: {
        accessToken,
        tokenType: "bearer",
        refreshToken,
        expiresAt
      },
      user: toProfile(u)
    };
  },

  refresh: async (req: AuthRefreshRequest): Promise<AuthRefreshResponse> => {
    const refreshToken = (req.refreshToken || "").trim();
    if (!refreshToken) {
      throw new AppError("refreshToken is required", {
        code: "BAD_REQUEST",
        status: 400,
        details: { fields: ["refreshToken"] }
      });
    }

    const refreshTokenHash = sha256Hex(refreshToken);

    const p = getPool();
    const { rows } = await p.query<DbSessionRow>(
      `
      select id, user_id, refresh_token_hash, expires_at, revoked_at
      from identity.sessions
      where refresh_token_hash = $1
      limit 1
      `,
      [refreshTokenHash]
    );

    const s = rows[0];
    if (!s) {
      throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });
    }

    if (s.revoked_at) {
      throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });
    }

    if (new Date(s.expires_at).getTime() <= Date.now()) {
      throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });
    }

    const { rows: users } = await p.query<DbUserRow>(
      "select id, email, display_name, roles, deleted_at, password_salt, password_hash from identity.users where id = $1::uuid limit 1",
      [s.user_id]
    );

    const u = users[0];
    if (!u) {
      throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });
    }
    requireNotDeleted(u);

    await revokeSessionByHash(refreshTokenHash);

    const { sessionId, refreshToken: nextRefreshToken, expiresAt } = await createSession(s.user_id);

    const accessToken = accessTokenForUser(u.id, sessionId);

    return {
      provider: "postgres",
      session: {
        accessToken,
        tokenType: "bearer",
        refreshToken: nextRefreshToken,
        expiresAt
      },
      user: toProfile(u)
    };
  },

  logout: async (accessToken: string, req?: AuthLogoutRequest, _ctx?: RequestContext): Promise<void> => {
    const refreshToken = (req?.refreshToken || "").trim();

    if (refreshToken) {
      const refreshTokenHash = sha256Hex(refreshToken);
      await revokeSessionByHash(refreshTokenHash);
      return;
    }

    const { userId } = parseAccessToken(accessToken);
    await revokeSessionsByUserId(userId);
  },

  getUserFromToken: async (token: string): Promise<AuthUserProfile> => {
    const { userId, sessionId } = parseAccessToken(token);

    await requireActiveSession(sessionId, userId);

    const p = getPool();
    const { rows } = await p.query<DbUserRow>(
      "select id, email, display_name, roles, deleted_at, password_salt, password_hash from identity.users where id = $1::uuid limit 1",
      [userId]
    );

    const row = rows[0];
    if (!row) {
      throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
    }
    requireNotDeleted(row);

    return toProfile(row);
  },

  listUsers: async (): Promise<AuthUserProfile[]> => {
    const p = getPool();
    const { rows } = await p.query<DbUserRow>(
      "select id, email, display_name, roles, deleted_at from identity.users where deleted_at is null order by created_at desc"
    );
    return rows.map(toProfile);
  },

  getUserById: async (id: string): Promise<AuthUserProfile> => {
    if (!isUuid(id)) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });

    const p = getPool();
    const { rows } = await p.query<DbUserRow>(
      "select id, email, display_name, roles, deleted_at from identity.users where id = $1::uuid limit 1",
      [id]
    );
    const row = rows[0];
    if (!row || row.deleted_at) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });
    return toProfile(row);
  },

  createUser: async (input: CreateUserInput): Promise<AuthUserProfile> => {
    const email = (input.email || "").trim().toLowerCase();
    const password = input.password || "";
    const displayName = (input.displayName || "").trim();
    const roles = normalizeRoles(input.roles);

    if (!email || !password) {
      throw new AppError("email and password are required", {
        code: "BAD_REQUEST",
        status: 400,
        details: { fields: ["email", "password"] }
      });
    }

    const p = getPool();
    const { rows: existing } = await p.query<{ id: string }>(
      "select id from identity.users where email = $1 limit 1",
      [email]
    );
    if (existing[0]) {
      throw new AppError("Email already exists", { code: "CONFLICT", status: 409 });
    }

    const salt = randomHex(16);
    const hash = hashPassword(salt, password);

    const { rows } = await p.query<DbUserRow>(
      `
      insert into identity.users (email, display_name, roles, password_salt, password_hash)
      values ($1, $2, $3, $4, $5)
      returning id, email, display_name, roles, deleted_at
      `,
      [email, displayName || email, roles, salt, hash]
    );

    const u = rows[0];
    if (!u) throw new AppError("Failed to create user", { code: "INTERNAL_ERROR", status: 500 });
    return toProfile(u);
  },

  updateUser: async (id: string, input: UpdateUserInput): Promise<AuthUserProfile> => {
    if (!isUuid(id)) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });

    const displayName = input.displayName === undefined ? undefined : (input.displayName || "").trim();
    const roles = input.roles === undefined ? undefined : normalizeRoles(input.roles);

    const p = getPool();

    const { rows: existing } = await p.query<DbUserRow>(
      "select id, email, display_name, roles, deleted_at from identity.users where id = $1::uuid limit 1",
      [id]
    );
    const current = existing[0];
    if (!current || current.deleted_at) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });

    const nextDisplayName = displayName === undefined ? current.display_name : displayName || current.email;
    const nextRoles = roles === undefined ? (Array.isArray(current.roles) ? current.roles : ["user"]) : roles;

    const { rows } = await p.query<DbUserRow>(
      `
      update identity.users
      set display_name = $2,
          roles = $3
      where id = $1::uuid
      returning id, email, display_name, roles, deleted_at
      `,
      [id, nextDisplayName, nextRoles]
    );

    const updated = rows[0];
    if (!updated) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });

    return toProfile(updated);
  },

  deleteUser: async (id: string): Promise<void> => {
    if (!isUuid(id)) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });

    const p = getPool();

    const { rowCount } = await p.query(
      `
      update identity.users
      set deleted_at = $2::timestamptz
      where id = $1::uuid
        and deleted_at is null
      `,
      [id, nowIso()]
    );

    if (!rowCount) {
      const { rows } = await p.query<{ id: string }>("select id from identity.users where id = $1::uuid limit 1", [id]);
      if (!rows[0]) {
        throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });
      }
    }
  }
};

```

---

## File: src/services/postgres/pgPool.ts

```ts
import pg from "pg";
import { getEnv, requireEnv } from "../../lib/env.js";

const { Pool } = pg;

let pool: pg.Pool | undefined;

export function getPool(): pg.Pool {
  if (pool) return pool;

  const host = requireEnv("PGHOST");
  const database = requireEnv("PGDATABASE");
  const user = requireEnv("PGUSER");
  const password = requireEnv("PGPASSWORD");
  const port = getEnv("PGPORT");
  const sslMode = (getEnv("PGSSLMODE") || "require").toLowerCase();

  const ssl = sslMode === "disable" ? undefined : { rejectUnauthorized: false };

  pool = new Pool({
    host,
    database,
    user,
    password,
    ...(port ? { port: Number(port) } : {}),
    ...(ssl ? { ssl } : {})
  });

  return pool;
}

export async function closePool(): Promise<void> {
  if (!pool) return;
  const p = pool;
  pool = undefined;
  await p.end();
}


```

---

## File: src/services/postgres/postgresAuthProvider.ts

```ts
export { postgresAuthProvider } from "../postgresAuthProvider.js";

```

---

## File: src/services/postgres/usersRepo.ts

```ts
import type pg from "pg";
import { getPool } from "./pgPool.js";

export type DbUserRow = {
  id: string;
  email: string;
  display_name: string;
};

export async function getUserByEmail(email: string): Promise<DbUserRow | undefined> {
  const p = getPool();
  const { rows } = await p.query<DbUserRow>(
    "select id, email, display_name from identity.users where email = $1 limit 1",
    [email]
  );
  return rows[0];
}

export async function getUserById(userId: string): Promise<DbUserRow | undefined> {
  const p: pg.Pool = getPool();
  const { rows } = await p.query<DbUserRow>(
    "select id, email, display_name from identity.users where id = $1::uuid limit 1",
    [userId]
  );
  return rows[0];
}


```

---

## File: test/adminUsers.test.ts

```ts
import { describe, it, expect, beforeAll } from "vitest";
import type { SuccessEnvelope, ErrorEnvelope } from "../src/lib/response.js";
import type { AuthLoginResponse, AuthRefreshResponse } from "../src/contracts/auth.js";
import type {
  AdminCreateUserRequest,
  AdminUpdateUserRequest,
  AdminUserResponse,
  AdminUsersResponse
} from "../src/contracts/adminUsers.js";

let baseUrl = "";

beforeAll(() => {
  baseUrl = process.env.TEST_BASE_URL || "";
  if (!baseUrl) {
    throw new Error("Missing TEST_BASE_URL (global setup did not run?)");
  }
});

function uniqueEmail(tag: string): string {
  return `test+${tag}+${Date.now()}@example.com`;
}

async function login(username: string, password: string, rid: string) {
  const res = await fetch(`${baseUrl}/.netlify/functions/auth-login`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-request-id": rid },
    body: JSON.stringify({ username, password })
  });

  return res;
}

async function loginOk(username: string, password: string, rid: string) {
  const res = await login(username, password, rid);
  expect(res.status).toBe(200);
  const body = (await res.json()) as SuccessEnvelope<AuthLoginResponse>;
  expect(body.ok).toBe(true);
  return body.data;
}

describe("admin users (/.netlify/functions/admin-users)", () => {
  it("requires auth", async () => {
    const res = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      headers: { "x-request-id": "admin-users-401" }
    });

    expect(res.status).toBe(401);
    const body = (await res.json()) as ErrorEnvelope;
    expect(body.ok).toBe(false);
  });

  it("returns ok:false for method not allowed and missing id", async () => {
    const adminAccess = (await loginOk("demo", "letmein", "admin-users-login-demo-errs")).session.accessToken;

    const postIdRes = await fetch(`${baseUrl}/.netlify/functions/admin-users/00000000-0000-0000-0000-000000000000`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${adminAccess}`,
        "content-type": "application/json",
        "x-request-id": "admin-users-post-id-405"
      },
      body: JSON.stringify({ email: "x@example.com", password: "letmein" } satisfies AdminCreateUserRequest)
    });

    expect(postIdRes.status).toBe(405);
    const postIdBody = (await postIdRes.json()) as ErrorEnvelope;
    expect(postIdBody.ok).toBe(false);
    expect(postIdBody.error.code).toBe("BAD_REQUEST");

    const patchNoIdRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${adminAccess}`,
        "content-type": "application/json",
        "x-request-id": "admin-users-patch-noid-400"
      },
      body: JSON.stringify({ displayName: "x" } satisfies AdminUpdateUserRequest)
    });

    expect(patchNoIdRes.status).toBe(400);
    const patchNoIdBody = (await patchNoIdRes.json()) as ErrorEnvelope;
    expect(patchNoIdBody.ok).toBe(false);
    expect(patchNoIdBody.error.code).toBe("BAD_REQUEST");
  });

  it("admin can list users and get by id", async () => {
    const adminAccess = (await loginOk("demo", "letmein", "admin-users-login-demo")).session.accessToken;

    const listRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      headers: { authorization: `Bearer ${adminAccess}`, "x-request-id": "admin-users-list-200" }
    });

    expect(listRes.status).toBe(200);
    const listBody = (await listRes.json()) as SuccessEnvelope<AdminUsersResponse>;
    expect(listBody.ok).toBe(true);
    expect(Array.isArray(listBody.data.users)).toBe(true);
    expect(listBody.data.users.length).toBeGreaterThan(0);

    const first = listBody.data.users[0]!;
    expect(typeof first.id).toBe("string");

    const getRes = await fetch(`${baseUrl}/.netlify/functions/admin-users/${first.id}`, {
      headers: { authorization: `Bearer ${adminAccess}`, "x-request-id": "admin-users-get-200" }
    });

    expect(getRes.status).toBe(200);
    const getBody = (await getRes.json()) as SuccessEnvelope<AdminUserResponse>;
    expect(getBody.ok).toBe(true);
    expect(getBody.data.user.id).toBe(first.id);
  });

  it("admin can create and patch users; non-admin forbidden", async () => {
    const adminAccess = (await loginOk("demo", "letmein", "admin-users-login-admin")).session.accessToken;
    const userAccess = (await loginOk("user@example.com", "letmein", "admin-users-login-user")).session.accessToken;

    const forbiddenRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${userAccess}`,
        "content-type": "application/json",
        "x-request-id": "admin-users-nonadmin-403"
      },
      body: JSON.stringify({ email: "x@example.com", password: "letmein" } satisfies AdminCreateUserRequest)
    });

    expect(forbiddenRes.status).toBe(403);
    const forbiddenBody = (await forbiddenRes.json()) as ErrorEnvelope;
    expect(forbiddenBody.ok).toBe(false);
    expect(forbiddenBody.error.code).toBe("FORBIDDEN");

    const badReqRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${adminAccess}`,
        "content-type": "application/json",
        "x-request-id": "admin-users-create-400"
      },
      body: JSON.stringify({ email: "", password: "" } satisfies AdminCreateUserRequest)
    });

    expect(badReqRes.status).toBe(400);

    const email = uniqueEmail("admin-create");

    const createRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${adminAccess}`,
        "content-type": "application/json",
        "x-request-id": "admin-users-create-201"
      },
      body: JSON.stringify({
        email,
        password: "letmein",
        displayName: "Created User",
        roles: ["user"]
      } satisfies AdminCreateUserRequest)
    });

    expect(createRes.status).toBe(201);
    const createBody = (await createRes.json()) as SuccessEnvelope<AdminUserResponse>;
    expect(createBody.ok).toBe(true);
    expect(createBody.data.user.username).toBe(email);
    expect(createBody.data.user.roles).toContain("user");

    const conflictRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${adminAccess}`,
        "content-type": "application/json",
        "x-request-id": "admin-users-create-409"
      },
      body: JSON.stringify({
        email,
        password: "letmein"
      } satisfies AdminCreateUserRequest)
    });

    expect(conflictRes.status).toBe(409);

    const patchRes = await fetch(`${baseUrl}/.netlify/functions/admin-users/${createBody.data.user.id}`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${adminAccess}`,
        "content-type": "application/json",
        "x-request-id": "admin-users-patch-200"
      },
      body: JSON.stringify({
        displayName: "Updated Name",
        roles: ["admin", "user"]
      } satisfies AdminUpdateUserRequest)
    });

    expect(patchRes.status).toBe(200);
    const patchBody = (await patchRes.json()) as SuccessEnvelope<AdminUserResponse>;
    expect(patchBody.ok).toBe(true);
    expect(patchBody.data.user.displayName).toBe("Updated Name");
    expect(patchBody.data.user.roles).toContain("admin");
  });

  it("admin can soft delete users; deleted user cannot login or refresh", async () => {
    const adminAccess = (await loginOk("demo", "letmein", "admin-users-login-admin-2")).session.accessToken;

    const email = uniqueEmail("to-delete");

    const createRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${adminAccess}`,
        "content-type": "application/json",
        "x-request-id": "admin-users-create-softdel-201"
      },
      body: JSON.stringify({
        email,
        password: "letmein",
        displayName: "To Delete",
        roles: ["user"]
      } satisfies AdminCreateUserRequest)
    });

    expect(createRes.status).toBe(201);
    const createBody = (await createRes.json()) as SuccessEnvelope<AdminUserResponse>;
    expect(createBody.ok).toBe(true);

    const loginBody = await loginOk(email, "letmein", "admin-users-login-todelete");
    const refreshToken = loginBody.session.refreshToken;

    const delRes = await fetch(`${baseUrl}/.netlify/functions/admin-users/${createBody.data.user.id}`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${adminAccess}`, "x-request-id": "admin-users-del-204" }
    });

    expect(delRes.status).toBe(204);

    const loginAfterRes = await login(email, "letmein", "admin-users-login-todelete-after");
    expect(loginAfterRes.status).toBe(401);

    const refreshAfterRes = await fetch(`${baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-request-id": "admin-users-refresh-after-del" },
      body: JSON.stringify({ refreshToken })
    });

    expect(refreshAfterRes.status).toBe(401);
    const refreshAfterBody = (await refreshAfterRes.json()) as ErrorEnvelope | SuccessEnvelope<AuthRefreshResponse>;
    expect(refreshAfterBody.ok).toBe(false);
  });
});

```

---

## File: test/auditLog.test.ts

```ts
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import pg from "pg";
import { closeAuditPool, writeAuditLog } from "../src/services/auditLogService.js";
import { ensurePgEnvLoaded } from "./loadPgEnv.js";

const RUN_PG_TESTS = (process.env.RUN_PG_TESTS || "").trim() === "1";

function makePgClient(): pg.Client {
  const host = process.env.PGHOST || "";
  const database = process.env.PGDATABASE || "";
  const user = process.env.PGUSER || "";
  const password = process.env.PGPASSWORD || "";
  const port = Number(process.env.PGPORT || "5432");
  const sslmode = (process.env.PGSSLMODE || "").toLowerCase();

  const ssl =
    sslmode === "require" || sslmode === "verify-ca" || sslmode === "verify-full"
      ? { rejectUnauthorized: false }
      : undefined;

  return new pg.Client({ host, database, user, password, port, ssl });
}

describe("audit log (RUN_PG_TESTS=1)", () => {
  beforeAll(() => {
    ensurePgEnvLoaded();
  });

  afterAll(async () => {
    await closeAuditPool();
  });

  it.skipIf(!RUN_PG_TESTS)("can write and read back an audit event", async () => {
    const auditId = await writeAuditLog({
      action: "test.audit.write",
      actorUserId: "00000000-0000-0000-0000-000000000001",
      targetUserId: "00000000-0000-0000-0000-000000000001",
      requestId: "test-audit-req-001",
      ip: "127.0.0.1",
      userAgent: "vitest",
      details: { hello: "world" }
    });

    expect(typeof auditId).toBe("string");

    const client = makePgClient();
    await client.connect();
    try {
      const { rows } = await client.query(
        `
          select id, action, request_id
          from identity.audit_log
          where id = $1::uuid
          limit 1
        `,
        [auditId]
      );

      expect(rows.length).toBe(1);
      expect(rows[0].action).toBe("test.audit.write");
      expect(rows[0].request_id).toBe("test-audit-req-001");
    } finally {
      await client.end();
    }
  });
});


```

---

## File: test/authLogin.test.ts

```ts
import { beforeAll, describe, expect, it } from "vitest";
import type { SuccessEnvelope, ErrorEnvelope } from "../src/lib/response.js";
import type { AuthLoginResponse } from "../src/contracts/auth.js";

let baseUrl = "";

beforeAll(() => {
  baseUrl = process.env.TEST_BASE_URL || "";
  if (!baseUrl) {
    throw new Error("Missing TEST_BASE_URL (global setup did not run?)");
  }
});

describe("POST /.netlify/functions/auth-login", () => {
  it("rejects invalid credentials", async () => {
    const res = await fetch(`${baseUrl}/.netlify/functions/auth-login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "test-auth-401"
      },
      body: JSON.stringify({ username: "demo", password: "bad" })
    });

    expect(res.status).toBe(401);
    const body = (await res.json()) as ErrorEnvelope;
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("accepts demo/letmein", async () => {
    const res = await fetch(`${baseUrl}/.netlify/functions/auth-login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "test-auth-200"
      },
      body: JSON.stringify({ username: "demo", password: "letmein" })
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as SuccessEnvelope<AuthLoginResponse>;
    expect(body.ok).toBe(true);

    expect(body.data.provider).toBe("fake");
    expect(body.data.user.username).toBe("demo");
    expect(typeof body.data.session.accessToken).toBe("string");
    expect(body.data.session.tokenType).toBe("bearer");
    expect(typeof body.data.session.refreshToken).toBe("string");
  });
});


```

---

## File: test/authRefreshLogout.test.ts

```ts
import { beforeAll, describe, expect, it } from "vitest";
import type { SuccessEnvelope, ErrorEnvelope } from "../src/lib/response.js";
import type { AuthLoginResponse, AuthRefreshResponse } from "../src/contracts/auth.js";

let baseUrl = "";

beforeAll(() => {
  baseUrl = process.env.TEST_BASE_URL || "";
  if (!baseUrl) {
    throw new Error("Missing TEST_BASE_URL (global setup did not run?)");
  }
});

async function loginDemo(): Promise<AuthLoginResponse> {
  const res = await fetch(`${baseUrl}/.netlify/functions/auth-login`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-request-id": "test-refresh-login" },
    body: JSON.stringify({ username: "demo", password: "letmein" })
  });

  expect(res.status).toBe(200);
  const body = (await res.json()) as SuccessEnvelope<AuthLoginResponse>;
  expect(body.ok).toBe(true);
  return body.data;
}

describe("POST /.netlify/functions/auth-refresh + auth-logout", () => {
  it("rejects invalid refresh token", async () => {
    const res = await fetch(`${baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-request-id": "test-refresh-401" },
      body: JSON.stringify({ refreshToken: "bogus" })
    });

    expect(res.status).toBe(401);
    const body = (await res.json()) as ErrorEnvelope;
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("refresh rotates refresh token, and logout revokes it", async () => {
    const login = await loginDemo();

    const rt1 = login.session.refreshToken as string;
    expect(typeof rt1).toBe("string");

    const refreshRes = await fetch(`${baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-request-id": "test-refresh-200" },
      body: JSON.stringify({ refreshToken: rt1 })
    });

    expect(refreshRes.status).toBe(200);
    const refreshBody = (await refreshRes.json()) as SuccessEnvelope<AuthRefreshResponse>;
    expect(refreshBody.ok).toBe(true);

    const rt2 = refreshBody.data.session.refreshToken as string;
    expect(typeof rt2).toBe("string");
    expect(rt2).not.toBe(rt1);

    // old refresh token should now be invalid
    const refreshOld = await fetch(`${baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-request-id": "test-refresh-old-401" },
      body: JSON.stringify({ refreshToken: rt1 })
    });

    expect(refreshOld.status).toBe(401);

    const logoutRes = await fetch(`${baseUrl}/.netlify/functions/auth-logout`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "test-logout-204",
        authorization: `Bearer ${refreshBody.data.session.accessToken}`
      },
      body: JSON.stringify({ refreshToken: rt2 })
    });

    expect(logoutRes.status).toBe(204);

    // refreshed token should now be invalid
    const refreshAfterLogout = await fetch(`${baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-request-id": "test-refresh-after-logout-401" },
      body: JSON.stringify({ refreshToken: rt2 })
    });

    expect(refreshAfterLogout.status).toBe(401);
  });
});


```

---

## File: .testGitHubActions.txt

```

```

---

## File: test/globalSetup.ts

```ts
import { startNetlifyDev } from "./netlifyDevHarness.js";

type Harness = Awaited<ReturnType<typeof startNetlifyDev>>;

declare global {
  var __NETLIFY_DEV_HARNESS__: Harness | undefined;
}

export default async function globalSetup() {
  // Force deterministic CI-safe provider for ALL unit/integration tests, regardless of developer env.
  process.env.AUTH_PROVIDER = "fake";
  process.env.NODE_ENV = "test";

  // Make the demo user an admin for the admin-users endpoint tests.
  // (Changing env during a test won't affect the already-running netlify dev process.)
  process.env.ADMIN_USER_EMAILS = "demo";

  // JWT unit tests require this even if the Netlify functions don't.
  if (!process.env.AUTH_JWT_SECRET) {
    process.env.AUTH_JWT_SECRET = "test-auth-jwt-secret-0123456789abcdef0123456789abcdef";
  }

  const harness = await startNetlifyDev();
  globalThis.__NETLIFY_DEV_HARNESS__ = harness;

  process.env.TEST_BASE_URL = harness.baseUrl;
}

```

---

## File: test/globalTeardown.ts

```ts
import { startNetlifyDev } from "./netlifyDevHarness.js";

type Harness = Awaited<ReturnType<typeof startNetlifyDev>>;

declare global {
  var __NETLIFY_DEV_HARNESS__: Harness | undefined;
}

export default async function globalTeardown() {
  const h = globalThis.__NETLIFY_DEV_HARNESS__;
  if (!h) return;

  try {
    await h.stop();
  } finally {
    globalThis.__NETLIFY_DEV_HARNESS__ = undefined;
    delete process.env.TEST_BASE_URL;
  }
}


```

---

## File: test/health.test.ts

```ts
import { beforeAll, describe, expect, it } from "vitest";
import type { SuccessEnvelope } from "../src/lib/response.js";
import type { HealthResponse } from "../src/contracts/health.js";

let baseUrl = "";

beforeAll(() => {
  baseUrl = process.env.TEST_BASE_URL || "";
  if (!baseUrl) {
    throw new Error("Missing TEST_BASE_URL (global setup did not run?)");
  }
});

describe("GET /.netlify/functions/health", () => {
  it("returns ok envelope", async () => {
    const res = await fetch(`${baseUrl}/.netlify/functions/health`, {
      headers: { "x-request-id": "test-health-001" }
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("x-request-id")).toBe("test-health-001");

    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("x-frame-options")).toBe("DENY");

    const body = (await res.json()) as SuccessEnvelope<HealthResponse>;
    expect(body.ok).toBe(true);
    expect(body.requestId).toBe("test-health-001");
    expect(body.data.status).toBe("ok");

    expect(typeof body.data.version).toBe("string");
    expect(body.data.version.length).toBeGreaterThan(0);

    expect(typeof body.data.timestamp).toBe("string");
    expect(body.data.timestamp.length).toBeGreaterThan(0);

    expect(body.data.build.version).toBe(body.data.version);
    expect(typeof body.data.build.buildTime).toBe("string");
    expect(body.data.build.buildTime.length).toBeGreaterThan(0);
    expect(typeof body.data.build.node).toBe("string");
    expect(body.data.build.node.length).toBeGreaterThan(0);

    if (body.data.build.sha !== undefined) {
      expect(typeof body.data.build.sha).toBe("string");
      expect(body.data.build.sha.length).toBeGreaterThan(0);
    }

    if (body.data.build.shortSha !== undefined) {
      expect(typeof body.data.build.shortSha).toBe("string");
      expect(body.data.build.shortSha.length).toBeGreaterThan(0);
    }

    if (body.data.build.branch !== undefined) {
      expect(typeof body.data.build.branch).toBe("string");
      expect(body.data.build.branch.length).toBeGreaterThan(0);
    }

    if (body.data.project.workPackage !== undefined) {
      expect(typeof body.data.project.workPackage).toBe("string");
      expect(body.data.project.workPackage.length).toBeGreaterThan(0);
    }

    if (body.data.project.phase !== undefined) {
      expect(["number", "string"]).toContain(typeof body.data.project.phase);
      if (typeof body.data.project.phase === "string") {
        expect(body.data.project.phase.length).toBeGreaterThan(0);
      }
    }

    if (body.data.project.step !== undefined) {
      expect(typeof body.data.project.step).toBe("string");
      expect(body.data.project.step.length).toBeGreaterThan(0);
    }

    if (body.data.project.description !== undefined) {
      expect(typeof body.data.project.description).toBe("string");
      expect(body.data.project.description.length).toBeGreaterThan(0);
    }
  });
});

```

---

## File: test/jwt.test.ts

```ts
import { beforeEach, describe, expect, it } from "vitest";
import { signAccessToken, verifyAccessToken } from "../src/lib/jwt.js";

describe("jwt", () => {
  beforeEach(() => {
    // Unit tests should be deterministic and not depend on developer/prod env.
    // The JWT module reads AUTH_JWT_SECRET from env.
    process.env.AUTH_JWT_SECRET = "test-secret-for-jwt-unit-tests";
    delete process.env.AUTH_JWT_ISSUER;
    delete process.env.AUTH_JWT_AUDIENCE;
    delete process.env.AUTH_JWT_MAX_TTL_SECONDS;
    delete process.env.AUTH_JWT_CLOCK_SKEW_SECONDS;
  });

  it("accepts a valid token before expiry", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    const { token } = signAccessToken("00000000-0000-0000-0000-000000000001", {
      ttlSeconds: 60,
      now
    });

    const verified = verifyAccessToken(token, { now });
    expect(verified.userId).toBe("00000000-0000-0000-0000-000000000001");
    expect(typeof verified.jti).toBe("string");
    expect(verified.jti.length).toBeGreaterThan(10);
  });

  it("rejects an expired token", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    const { token } = signAccessToken("00000000-0000-0000-0000-000000000001", {
      ttlSeconds: 1,
      now
    });

    // jwt verifier allows a small clock skew; move well past expiry to ensure rejection
    const tooLate = new Date("2026-01-01T00:00:40.000Z");

    expect(() => verifyAccessToken(token, { now: tooLate })).toThrow();
  });

  it("enforces issuer/audience when configured", () => {
    process.env.AUTH_JWT_ISSUER = "identity-backend";
    process.env.AUTH_JWT_AUDIENCE = "netlify-client";

    const now = new Date("2026-01-01T00:00:00.000Z");
    const { token } = signAccessToken("00000000-0000-0000-0000-000000000001", {
      ttlSeconds: 60,
      now
    });

    expect(() => verifyAccessToken(token, { now })).not.toThrow();

    process.env.AUTH_JWT_ISSUER = "different-issuer";
    expect(() => verifyAccessToken(token, { now })).toThrow();

    process.env.AUTH_JWT_ISSUER = "identity-backend";
    process.env.AUTH_JWT_AUDIENCE = "different-audience";
    expect(() => verifyAccessToken(token, { now })).toThrow();
  });

  it("rejects tokens issued in the future beyond clock skew", () => {
    process.env.AUTH_JWT_CLOCK_SKEW_SECONDS = "30";

    const base = new Date("2026-01-01T00:00:00.000Z");
    const future = new Date("2026-01-01T00:05:00.000Z");
    const { token } = signAccessToken("00000000-0000-0000-0000-000000000001", {
      ttlSeconds: 60,
      now: future
    });

    expect(() => verifyAccessToken(token, { now: base })).toThrow();
  });

  it("enforces max token ttl", () => {
    process.env.AUTH_JWT_MAX_TTL_SECONDS = "120";

    const now = new Date("2026-01-01T00:00:00.000Z");
    const { token } = signAccessToken("00000000-0000-0000-0000-000000000001", {
      ttlSeconds: 600,
      now
    });

    expect(() => verifyAccessToken(token, { now })).toThrow();
  });
});


```

---

## File: test/loadPgEnv.ts

```ts
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

function parseDotEnv(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  const lines = raw.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if (!key) continue;

    // strip surrounding quotes if present
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
      (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
    ) {
      value = value.slice(1, -1);
    }

    out[key] = value;
  }

  return out;
}

export function ensurePgEnvLoaded(): void {
  const shouldRun = (process.env.RUN_PG_TESTS || "").trim() === "1";
  if (!shouldRun) return;

  // If already set, do nothing.
  if (process.env.PGHOST && process.env.PGDATABASE && process.env.PGUSER && process.env.PGPASSWORD) return;

  const pgSystem = (process.env.PGSYSTEM || "neon").trim() || "neon";
  const root = process.cwd();
  const envPath = path.join(root, "postgres", "env", pgSystem, ".env");

  if (!existsSync(envPath)) {
    return;
  }

  const raw = readFileSync(envPath, "utf8");
  const parsed = parseDotEnv(raw);

  for (const [k, v] of Object.entries(parsed)) {
    if (!process.env[k] && v.trim().length > 0) {
      process.env[k] = v;
    }
  }
}


```

---

## File: test/lockout.test.ts

```ts
import { beforeAll, describe, expect, it } from "vitest";
import type { ErrorEnvelope, SuccessEnvelope } from "../src/lib/response.js";
import type { AuthRegisterResponse } from "../src/contracts/auth.js";

let baseUrl = "";

beforeAll(() => {
  baseUrl = process.env.TEST_BASE_URL || "";
  if (!baseUrl) {
    throw new Error("Missing TEST_BASE_URL (global setup did not run?)");
  }
});

describe("login lockout", () => {
  it("locks after repeated invalid credentials and returns retry-after", async () => {
    const email = `lockout_${Date.now()}@example.com`;
    const password = "letmein";

    const reg = await fetch(`${baseUrl}/.netlify/functions/auth-register`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-request-id": "test-lockout-register" },
      body: JSON.stringify({ email, password, displayName: "Lockout User" }),
    });
    expect(reg.status).toBe(201);
    const regBody = (await reg.json()) as SuccessEnvelope<AuthRegisterResponse>;
    expect(regBody.ok).toBe(true);

    // Lockout policy is enforced server-side; we just drive enough 401s to trigger it.
    for (let i = 0; i < 8; i++) {
      const res = await fetch(`${baseUrl}/.netlify/functions/auth-login`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-request-id": `test-lockout-bad-${i}` },
        body: JSON.stringify({ username: email, password: "wrong" }),
      });
      expect(res.status).toBe(401);
      const body = (await res.json()) as ErrorEnvelope;
      expect(body.ok).toBe(false);
      expect(body.error.code).toBe("UNAUTHORIZED");
    }

    // Next attempt should be locked.
    const locked = await fetch(`${baseUrl}/.netlify/functions/auth-login`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-request-id": "test-lockout-429" },
      body: JSON.stringify({ username: email, password: "wrong" }),
    });

    expect(locked.status).toBe(429);

    const retryAfter = locked.headers.get("retry-after");
    expect(typeof retryAfter).toBe("string");
    expect((retryAfter || "").trim().length).toBeGreaterThan(0);

    const lockedBody = (await locked.json()) as ErrorEnvelope;
    expect(lockedBody.ok).toBe(false);
    expect(lockedBody.error.code).toBe("RATE_LIMITED");

    // Another identifier should not be impacted (still returns 401, not 429).
    const other = await fetch(`${baseUrl}/.netlify/functions/auth-login`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-request-id": "test-lockout-other-401" },
      body: JSON.stringify({ username: `other_${Date.now()}@example.com`, password: "wrong" }),
    });

    expect(other.status).toBe(401);
  });
});

```

---

## File: test/me.test.ts

```ts
import { beforeAll, describe, expect, it } from "vitest";
import type { SuccessEnvelope, ErrorEnvelope } from "../src/lib/response.js";
import type { MeResponse } from "../src/contracts/me.js";
import type { AuthLoginResponse } from "../src/contracts/auth.js";

let baseUrl = "";

beforeAll(() => {
  baseUrl = process.env.TEST_BASE_URL || "";
  if (!baseUrl) {
    throw new Error("Missing TEST_BASE_URL (global setup did not run?)");
  }
});

async function loginDemo(): Promise<AuthLoginResponse> {
  const res = await fetch(`${baseUrl}/.netlify/functions/auth-login`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-request-id": "test-me-login" },
    body: JSON.stringify({ username: "demo", password: "letmein" })
  });
  expect(res.status).toBe(200);
  const body = (await res.json()) as SuccessEnvelope<AuthLoginResponse>;
  expect(body.ok).toBe(true);
  return body.data;
}

describe("GET /.netlify/functions/me", () => {
  it("rejects missing auth header", async () => {
    const res = await fetch(`${baseUrl}/.netlify/functions/me`, {
      headers: { "x-request-id": "test-me-401a" }
    });

    expect(res.status).toBe(401);
    const body = (await res.json()) as ErrorEnvelope;
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("returns profile for valid token", async () => {
    const login = await loginDemo();

    const res = await fetch(`${baseUrl}/.netlify/functions/me`, {
      headers: {
        authorization: `Bearer ${login.session.accessToken}`,
        "x-request-id": "test-me-200"
      }
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as SuccessEnvelope<MeResponse>;
    expect(body.ok).toBe(true);
    expect(body.data.user.username).toBe(login.user.username);
  });

  it("accepts lowercase bearer scheme", async () => {
    const login = await loginDemo();

    const res = await fetch(`${baseUrl}/.netlify/functions/me`, {
      headers: {
        authorization: `bearer ${login.session.accessToken}`,
        "x-request-id": "test-me-200b"
      }
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as SuccessEnvelope<MeResponse>;
    expect(body.ok).toBe(true);
    expect(body.data.user.username).toBe(login.user.username);
  });
});


```

---

## File: test/netlifyDevHarness.ts

```ts
import { spawn } from "node:child_process";
import net from "node:net";

type Harness = {
  baseUrl: string;
  pid: number;
  stop: () => Promise<void>;
};

async function isPortFree(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on("error", () => resolve(false));
    server.listen(port, "127.0.0.1", () => {
      server.close(() => resolve(true));
    });
  });
}

async function pickPort(preferred: number, opts?: { exclude?: Set<number> }): Promise<number> {
  const exclude = opts?.exclude ?? new Set<number>();
  for (let p = preferred; p < preferred + 200; p++) {
    if (exclude.has(p)) continue;
    if (await isPortFree(p)) return p;
  }
  throw new Error(`No free port found near ${preferred}`);
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function waitForHealthy(baseUrl: string, timeoutMs: number) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${baseUrl}/.netlify/functions/health`);
      if (res.ok) return;
    } catch {
      // netlify dev not ready yet
    }
    await sleep(250);
  }
  throw new Error("Timed out waiting for netlify dev");
}

type KillSignal = Parameters<typeof process.kill>[1];

function killProcessTree(pid: number, signal: KillSignal) {
  if (pid <= 0) return;

  if (process.platform !== "win32") {
    try {
      process.kill(-pid, signal);
      return;
    } catch {
      // fallback to direct kill
    }
  }

  try {
    process.kill(pid, signal);
  } catch {
    // process may already be gone
  }
}

export async function startNetlifyDev(): Promise<Harness> {
  const preferredProxyPort = Number(process.env.NETLIFY_DEV_PORT || "3999");
  const preferredStaticPort = Number(process.env.NETLIFY_STATIC_PORT || "4000");

  const proxyPort = await pickPort(preferredProxyPort);

  const staticPreferred =
    preferredStaticPort === proxyPort ? preferredStaticPort + 1 : preferredStaticPort;

  const staticPort = await pickPort(staticPreferred, { exclude: new Set([proxyPort]) });

  const isWindows = process.platform === "win32";

  const cmd = isWindows ? (process.platform === "win32" ? "npx.cmd" : "npx") : "bash";
  const args = isWindows
    ? [
        "netlify",
        "dev",
        "--offline",
        "--no-open",
        "--port",
        String(proxyPort),
        "--staticServerPort",
        String(staticPort)
      ]
    : [
        "scripts/netlify-dev.sh",
        "--offline",
        "--no-open",
        "--port",
        String(proxyPort),
        "--staticServerPort",
        String(staticPort)
      ];

  // IMPORTANT:
  // Using stdio: "ignore" prevents PIPEWRAP/FILEHANDLE handles from keeping Vitest alive.
  // We rely on health polling for readiness and return a helpful error message on failure.
  const child = spawn(cmd, args, {
    stdio: "ignore",
    detached: process.platform !== "win32",
    env: {
      ...process.env,
      NETLIFY_DEV: "true",
      NETLIFY_TELEMETRY_DISABLED: "1"
    }
  });

  // Allow the parent process to exit even if a child lingers.
  // We still attempt to terminate it in globalTeardown.
  child.unref();

  const baseUrl = `http://localhost:${proxyPort}`;

  try {
    await waitForHealthy(baseUrl, 90000);
  } catch (err) {
    killProcessTree(child.pid ?? 0, "SIGTERM");
    const original = err instanceof Error ? err.message : String(err);

    const tip = isWindows
      ? `npx netlify dev --offline --no-open --port ${proxyPort} --staticServerPort ${staticPort}`
      : `bash scripts/netlify-dev.sh --offline --no-open --port ${proxyPort} --staticServerPort ${staticPort}`;

    throw new Error(
      `Failed to start netlify dev.\n\nBase URL: ${baseUrl}\nProxy port: ${proxyPort}\nStatic port: ${staticPort}\n\nOriginal error: ${original}\n\nTip: run manually for logs:\n  ${tip}\n`
    );
  }

  return {
    baseUrl,
    pid: child.pid ?? 0,
    stop: async () => {
      if (child.exitCode !== null) return;

      const pid = child.pid ?? 0;

      killProcessTree(pid, "SIGTERM");

      await new Promise<void>((resolve) => {
        child.once("exit", () => resolve());
        setTimeout(() => {
          killProcessTree(pid, "SIGKILL");
          resolve();
        }, 5000);
      });
    }
  };
}

```

---

## File: test/postgresRefreshFlow.test.ts

```ts
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import pg from "pg";
import { startNetlifyDev } from "./netlifyDevHarness.js";
import type { SuccessEnvelope, ErrorEnvelope } from "../src/lib/response.js";
import type { AuthLoginResponse, AuthRefreshResponse } from "../src/contracts/auth.js";
import { ensurePgEnvLoaded } from "./loadPgEnv.js";

const SHOULD_RUN = process.env.RUN_PG_TESTS === "1";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`RUN_PG_TESTS=1 requires env var ${name}`);
  return v;
}

function tamperToken(t: string): string {
  if (t.length < 2) return `${t}x`;
  const last = t.slice(-1);
  const repl = last === "a" ? "b" : "a";
  return `${t.slice(0, -1)}${repl}`;
}

let harness: Awaited<ReturnType<typeof startNetlifyDev>> | undefined;

const suite = SHOULD_RUN ? describe : describe.skip;

let db: pg.Pool | undefined;

function getDb(): pg.Pool {
  if (db) return db;

  const host = requireEnv("PGHOST");
  const database = requireEnv("PGDATABASE");
  const user = requireEnv("PGUSER");
  const password = requireEnv("PGPASSWORD");
  const port = process.env.PGPORT;
  const sslMode = (process.env.PGSSLMODE || "require").toLowerCase();
  const ssl = sslMode === "disable" ? undefined : { rejectUnauthorized: false };

  db = new pg.Pool({
    host,
    database,
    user,
    password,
    ...(port ? { port: Number(port) } : {}),
    ...(ssl ? { ssl } : {})
  });

  return db;
}

async function countAudit(action: string, requestId: string): Promise<number> {
  const p = getDb();
  const { rows } = await p.query<{ n: string }>(
    "select count(*)::text as n from identity.audit_log where action = $1::text and request_id = $2::text",
    [action, requestId]
  );
  const n = Number(rows[0]?.n || "0");
  return Number.isFinite(n) ? n : 0;
}

suite("postgres refresh flow (RUN_PG_TESTS=1)", () => {
  beforeAll(async () => {
    ensurePgEnvLoaded();

    requireEnv("PGHOST");
    requireEnv("PGDATABASE");
    requireEnv("PGUSER");
    requireEnv("PGPASSWORD");
    requireEnv("AUTH_JWT_SECRET");

    process.env.AUTH_PROVIDER = "postgres";

    harness = await startNetlifyDev();
  });

  afterAll(async () => {
    await harness?.stop();
    if (db) {
      const p = db;
      db = undefined;
      await p.end();
    }
  });

  it("login -> me -> refresh rotates tokens -> old refresh rejected -> logout revokes", async () => {
    if (!harness) throw new Error("Harness not started");

    const loginRes = await fetch(`${harness.baseUrl}/.netlify/functions/auth-login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "pg-login-200",
      },
      body: JSON.stringify({ username: "demo", password: "letmein" }),
    });

    expect(loginRes.status).toBe(200);
    const loginBody = (await loginRes.json()) as SuccessEnvelope<AuthLoginResponse>;
    expect(loginBody.ok).toBe(true);
    expect(loginBody.data.provider).toBe("postgres");

    const access1 = loginBody.data.session.accessToken;
    const refresh1 = loginBody.data.session.refreshToken as string;

    const meRes = await fetch(`${harness.baseUrl}/.netlify/functions/me`, {
      headers: {
        authorization: `Bearer ${access1}`,
        "x-request-id": "pg-me-200",
      },
    });
    expect(meRes.status).toBe(200);

    const refreshRes = await fetch(`${harness.baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "pg-refresh-200",
      },
      body: JSON.stringify({ refreshToken: refresh1 }),
    });

    expect(refreshRes.status).toBe(200);
    const refreshBody = (await refreshRes.json()) as SuccessEnvelope<AuthRefreshResponse>;
    expect(refreshBody.ok).toBe(true);

    const access2 = refreshBody.data.session.accessToken;
    const refresh2 = refreshBody.data.session.refreshToken as string;

    // Postgres provider now issues signed JWT access tokens; these may rotate on refresh.
    expect(access2).not.toBe(access1);
    // Refresh tokens must rotate.
    expect(refresh2).not.toBe(refresh1);

    expect(await countAudit("auth.refresh.rotated", "pg-refresh-200")).toBeGreaterThan(0);

    // Old refresh should now be rejected
    const refreshOldRes = await fetch(`${harness.baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "pg-refresh-old-401",
      },
      body: JSON.stringify({ refreshToken: refresh1 }),
    });
    expect(refreshOldRes.status).toBe(401);
    const refreshOldBody = (await refreshOldRes.json()) as ErrorEnvelope;
    expect(refreshOldBody.ok).toBe(false);

    const logoutRes = await fetch(`${harness.baseUrl}/.netlify/functions/auth-logout`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${access2}`,
        "x-request-id": "pg-logout-200",
      },
      body: JSON.stringify({ refreshToken: refresh2 }),
    });
    expect(logoutRes.status).toBe(204);

    expect(await countAudit("auth.logout", "pg-logout-200")).toBeGreaterThan(0);

    const refreshAfterLogout = await fetch(`${harness.baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "pg-refresh-after-logout-401",
      },
      body: JSON.stringify({ refreshToken: refresh2 }),
    });
    expect(refreshAfterLogout.status).toBe(401);

    const meTampered = await fetch(`${harness.baseUrl}/.netlify/functions/me`, {
      headers: {
        authorization: `Bearer ${tamperToken(access2)}`,
        "x-request-id": "pg-me-tampered-401",
      },
    });
    expect(meTampered.status).toBe(401);
  });
});


```

---

## File: test/rateLimit.test.ts

```ts
import { beforeAll, describe, expect, it } from "vitest";
import type { ErrorEnvelope, SuccessEnvelope } from "../src/lib/response.js";
import type { AuthRegisterResponse } from "../src/contracts/auth.js";

let baseUrl = "";

beforeAll(() => {
  baseUrl = process.env.TEST_BASE_URL || "";
  if (!baseUrl) {
    throw new Error("Missing TEST_BASE_URL (global setup did not run?)");
  }
});

describe("rate limiting", () => {
  it("eventually 429s after too many auth-login attempts (ip+identifier) and returns retry-after", async () => {
    const email = `ratelimit_${Date.now()}@example.com`;
    const password = "secret123";

    const registerRes = await fetch(`${baseUrl}/.netlify/functions/auth-register`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-request-id": "rate-limit-register" },
      body: JSON.stringify({
        email,
        password,
        displayName: "Rate Limit User"
      })
    });

    expect(registerRes.status).toBe(201);
    const registerBody = (await registerRes.json()) as SuccessEnvelope<AuthRegisterResponse>;
    expect(registerBody.ok).toBe(true);

    let limited: Response | null = null;
    let limitedAttempt = -1;

    for (let i = 0; i < 25; i++) {
      const res = await fetch(`${baseUrl}/.netlify/functions/auth-login`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-request-id": `rate-limit-${i}`,
          "x-forwarded-for": "127.0.0.1"
        },
        body: JSON.stringify({
          username: email,
          password
        })
      });

      if (res.status === 429) {
        limited = res;
        limitedAttempt = i + 1;
        break;
      }

      expect(res.status).toBe(200);
    }

    expect(limited, "expected rate limiter to trip within 25 attempts").not.toBeNull();
    expect(limitedAttempt).toBeGreaterThan(0);
    expect(limitedAttempt).toBeLessThanOrEqual(25);

    const limitedRes = limited as Response;
    expect(limitedRes.status).toBe(429);

    const retryAfter = limitedRes.headers.get("retry-after");
    expect(retryAfter).toBeTruthy();
    expect(Number(retryAfter)).toBeGreaterThan(0);

    const limitedBody = (await limitedRes.json()) as ErrorEnvelope;
    expect(limitedBody.ok).toBe(false);
    expect(limitedBody.error.code).toBe("RATE_LIMITED");
  });
});

```

---

## File: tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ES2022",
    "moduleResolution": "Bundler",
    "types": ["node"],
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "verbatimModuleSyntax": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "dist",
    "baseUrl": "."
  },
  "include": ["src/**/*.ts", "netlify/functions/**/*.ts", "test/**/*.ts"]
}

```

---

## File: vitest.config.ts

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Integration tests start a real Netlify Dev process; running files in parallel
    // can cause port collisions and flakiness. Keep deterministic: run serially.
    fileParallelism: false,
    sequence: {
      concurrent: false
    },
    poolOptions: {
      threads: {
        singleThread: true
      }
    },
    globalSetup: ["./test/globalSetup.ts"],
    globalTeardown: ["./test/globalTeardown.ts"],
    // Keep current defaults (explicitly), but give hooks room on slower machines.
    hookTimeout: 120_000,
    testTimeout: 120_000
  }
});


```

---

## File: .vitest-netlify-dev.json

```json
{
  "baseUrl": "http://127.0.0.1:4010",
  "pid": 3504158
}
```

---

