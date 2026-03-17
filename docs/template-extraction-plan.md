# Template Extraction Plan

## 1. Purpose

Extract a reusable backend service template from the now-cleaned `auth-backend` so future services can be created quickly, consistently, and with working tests and deployment scaffolding from day one.

Initial target services:

- `settings-backend`
- `profile-backend`
- `audit-backend`

The template should preserve the architectural strengths of the current repo while removing auth-specific assumptions.

---

## 2. Objectives

The template should provide:

- a consistent folder structure
- working Netlify function entrypoints
- a clean application/domain/platform separation
- standard contracts and response envelopes
- reusable scripts for local development and validation
- out-of-box test coverage
- optional DB-backed support
- a path to future deployment portability

The template should **not** try to solve every future service variant in one pass.

---

## 3. Guiding Principles

### 3.1 Start concrete, then generalize
Do not begin with a highly parameterized generator.
First create a **concrete generic service seed** derived from `auth-backend`.

### 3.2 Keep changes reversible
Each extraction step should leave the source repo and the new template in a working, testable state.

### 3.3 Separate generic from service-specific
Do not let auth-era assumptions leak into the template.

### 3.4 Prefer small capability profiles
Not every future service needs auth, DB persistence, or admin flows.

### 3.5 Preserve developer ergonomics
The template should be easy to run locally, test locally, and deploy with minimal friction.

---

## 4. Target Template Outcome

Create a generic service seed with a structure like:

```text
template-service/
  db/                        # optional for DB-backed services
  docs/
  netlify/
    functions/
  scripts/
  src/
    adapters/
      netlify/
    app/
      composition/
      handlers/
      http/
    contracts/
    domains/
      demo/
    platform/
      config/
      errors/
      http/
      runtime/
      security/
    services/                # infra/provider code only, if needed
  test/
    integration/
    smoke/
    unit/
```

This seed should build, lint, typecheck, test, and run before any generator work begins.

---

## 5. What to Extract from auth-backend

### 5.1 Strong generic candidates

These are likely reusable in nearly every service:

- `src/adapters/netlify/*`
- `src/app/*` orchestration pattern
- `src/platform/*` where truly generic
- response envelope and HTTP helpers
- request context extraction pattern
- project config files:
  - `package.json`
  - `tsconfig.json`
  - `vitest.config.ts`
  - `eslint.config.js`
  - `netlify.toml`
- common local scripts such as:
  - local check scripts
  - build info generation
  - dev launch wrappers
  - smoke helpers
- test harness structure:
  - `globalSetup`
  - `globalTeardown`
  - base URL helpers

### 5.2 Service-specific candidates to exclude from template core

These should not be part of the generic baseline:

- auth login/register/refresh/logout flows
- admin user management
- user profile / `me` flows
- auth-specific contracts
- auth-specific tests
- auth role / admin policy logic
- refresh token lifecycle behavior
- auth audit behavior tied directly to identity flows

### 5.3 Maybe-generic items requiring judgment

These might become template options or capability profiles:

- DB-backed repo layer
- fake provider support
- Postgres provider pattern
- lockout / rate limiting
- health-admin endpoint
- build metadata endpoints
- audit support

---

## 6. Capability Profiles

The template should evolve toward small composable profiles.

### 6.1 Core API profile
Includes:

- health endpoint
- one example domain
- standard request/response handling
- basic tests
- local scripts
- Netlify deploy support

### 6.2 DB-backed profile
Adds:

- `db/` folder
- DB env wiring
- pool / repo support
- example persistence path
- DB-aware tests

### 6.3 Auth-enabled profile
Adds:

- auth provider abstractions
- JWT/session flows
- access control helpers
- auth-related contracts and tests

### 6.4 Admin/ops profile
Adds:

- health-admin or diagnostics
- operational endpoints
- extra smoke/test helpers

Do **not** implement all profiles immediately.
First prove the base service seed.

---

## 7. Extraction Phases

## 7.1 Phase 1 — Inventory and classification

Create a file-by-file inventory of the current repo and classify each item as:

- generic
- auth-specific
- maybe-generic
- historical/stale

Deliverable:

- `TEMPLATE-EXTRACTION-INVENTORY.md`

Acceptance criteria:

- every top-level code area reviewed
- no ambiguity around what forms the seed

---

## 7.2 Phase 2 — Define the seed service

Create a concrete target called something like:

- `service-template-seed`
- or `template-backend-service`

This should include one simple non-auth domain such as:

- `demo`
- `settings`
- or `system-demo`

Deliverable:

- a runnable generic seed repo shape
- minimal docs describing purpose and conventions

Acceptance criteria:

- structure agreed
- seed domain chosen
- no auth-specific behavior required for green baseline

---

## 7.3 Phase 3 — Extract generic platform and app layers

Copy and adapt the reusable parts of:

- `src/adapters`
- `src/app`
- `src/platform`

Strip out auth-specific references.

Deliverable:

- generic request pipeline
- generic error handling
- generic response helpers

Acceptance criteria:

- no auth-specific imports remain in extracted generic layers

---

## 7.4 Phase 4 — Add minimal domain example

Create one tiny example domain showing the intended pattern.

Suggested example:

- `src/domains/demo/services/demoService.ts`

Possible endpoint examples:

- `GET /.netlify/functions/demo`
- `GET /.netlify/functions/health`

Deliverable:

- one simple domain flow from Netlify function to app handler to domain service

Acceptance criteria:

- demonstrates the architecture clearly
- keeps implementation trivial

---

## 7.5 Phase 5 — Extract common scripts and configs

Bring over only the scripts that help every service.

Likely keep:

- local check scripts
- netlify dev helper
- smoke helper
- build-info generation

Review carefully before keeping:

- DB reset scripts
- env sync scripts
- release scripts
- CI helper scripts

Deliverable:

- reduced script set for template seed

Acceptance criteria:

- every retained script has a clear purpose in a generic service
- no auth-only script remains in template seed

---

## 7.6 Phase 6 — Extract test harness

Set up the minimum useful test structure.

Template should include:

- one integration test
- one smoke test
- optional one unit test
- shared setup/teardown helpers

Deliverable:

- green baseline tests for seed service

Acceptance criteria:

- `npm run test:run` passes in the seed
- tests are understandable and small

---

## 7.7 Phase 7 — Make the seed fully green

Before any generator work:

- lint passes
- typecheck passes
- tests pass
- build passes
- local dev run works

Acceptance criteria:

- seed is credible as a standalone service
- no broken placeholders

---

## 7.8 Phase 8 — Derive a real service from the seed

Use the seed manually to create the first real extracted service.

Recommended first derived service:

- `settings-backend`

Why:

- simpler than auth
- likely useful
- realistic enough to prove the template

Deliverable:

- one manually derived service based on the seed

Acceptance criteria:

- the derived service validates the template shape
- lessons learned are fed back into the seed

---

## 7.9 Phase 9 — Build generator/scaffold automation

Only after the seed and one derived service are proven, create the automation.

Generator responsibilities:

- copy seed
- replace service name/slug tokens
- rename example domain to target domain
- optionally enable profiles
- create a green starting project

Acceptance criteria:

- generated service builds and tests immediately
- no manual repair needed after generation

---

## 8. Naming and Token Strategy

Keep parameterization minimal.

Likely tokens:

- service slug
- package name
- display name
- primary domain name
- function path prefix if required

Avoid over-parameterizing:

- every file name
- every example string
- every script name
- every env var

The seed should stay readable without generator substitution.

---

## 9. Acceptance Criteria for the Template

The template is successful when:

- a new service can be created in minutes
- the new service builds, typechecks, tests, and runs immediately
- the structure is obvious to a developer reading it for the first time
- auth-specific assumptions are absent unless explicitly enabled
- Netlify deployment still works
- future OCI/deployment abstraction remains possible

---

## 10. Risks

### 10.1 Over-generalization
Trying to make the template support every future service immediately will make it brittle.

### 10.2 Hidden auth coupling
Some platform or app code may still depend on auth-era concepts and must be stripped carefully.

### 10.3 Script bloat
Keeping too many project-specific scripts in the template will make it noisy and harder to maintain.

### 10.4 Premature generator work
Automation before the seed is proven will lock in bad assumptions.

---

## 11. Immediate Next Steps

### Step 1
Create a classification inventory from the current green `auth-backend`.

### Step 2
Define the exact target structure for `template-service`.

### Step 3
Create the concrete generic seed with one tiny domain and two working endpoints.

### Step 4
Get the seed green on:
- lint
- typecheck
- test
- build

### Step 5
Use the seed manually to create `settings-backend`.

---

## 12. Recommended Working Style

For the next chat/work cycle:

- treat current `auth-backend` as the stable source
- extract into a separate seed, not directly into heavy automation
- make one phase green before starting the next
- keep each extraction step small and reviewable

---

## 13. Suggested First Deliverables

1. `TEMPLATE-EXTRACTION-INVENTORY.md`
2. `template-service` seed repo
3. minimal domain example
4. green validation gates
5. first derived service (`settings-backend`)
6. scaffold/generator script

---

## 14. Final Recommendation

Do **not** try to turn `auth-backend` directly into a parameterized scaffold in one jump.

The best path is:

1. inventory
2. concrete generic seed
3. green baseline
4. one real derived service
5. automation last

That will give you a robust, reusable foundation for the rest of your microservices.
