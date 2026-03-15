# `src/domains`

Purpose: hold business capabilities organized by domain.

Likely domains for this service:

- `auth`
- `users`
- `profile`

Examples expected later:

- domain services
- domain policies
- domain-specific provider abstractions
- domain-focused tests/helpers when appropriate

What does **not** belong here:

- generic HTTP helpers
- deployment/runtime adapters
- platform-only infrastructure

Likely future inputs from the current repo:

- `src/services/authService.ts`
- `src/services/authProvider.ts`
- `src/services/adminUsersService.ts`
- `src/services/meService.ts`
- `src/services/auditLogService.ts`
- auth-specific policy pieces from `src/security` when explicitly planned

Stage 1 rule:

This folder is only a destination for later extraction. No code should be moved here yet.
