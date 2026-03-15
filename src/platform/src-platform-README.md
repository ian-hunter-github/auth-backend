# `src/platform`

Purpose: hold generic runtime and infrastructure code that is reusable across services.

Examples expected later:

- config loading
- HTTP helpers
- error primitives
- database plumbing
- generic runtime utilities
- shared testing helpers

What does **not** belong here:

- auth-specific business rules
- Netlify-specific entrypoint code
- endpoint orchestration that belongs to the application layer

Likely future inputs from the current repo:

- selected files from `src/lib`
- selected generic runtime pieces from `src/security`
- selected shared DB/testing helpers from `src/services/postgres` only when they are proven generic

Stage 1 rule:

This folder exists as a destination only. No implementation should be moved here yet.
