# `src/adapters`

Purpose: hold delivery/runtime adapters that connect external environments to the application layer.

Examples expected later:

- Netlify adapter
- Node HTTP adapter

What belongs here:

- translation between runtime-specific request/response shapes and app handlers
- thin host-specific wrappers

What does **not** belong here:

- business logic
- generic reusable platform helpers
- direct long-term ownership of endpoint behavior

Likely future relationship to the current repo:

- `netlify/functions/*` should become thinner over time as adapter logic moves into this area

Stage 1 rule:

This folder exists only as a structural boundary. No runtime code should be moved here yet.
