# `src/app`

Purpose: hold application-layer orchestration between adapters and domain logic.

Examples expected later:

- route definitions
- request handlers
- composition / wiring
- application-level DTO mapping

What does **not** belong here:

- raw Netlify function wrappers
- low-level generic platform helpers
- auth/business rules themselves

Likely future role in this repo:

- thin, framework-neutral request handling that sits between adapters and domain services

Stage 1 rule:

This folder exists as a boundary marker only. No code should be moved here yet.
