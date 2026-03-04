-- DDL for identity schema (Neon/Postgres).
-- Safe to re-run after reset.sql.

create extension if not exists pgcrypto;

create table if not exists identity.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text not null,
  password_salt text not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

-- Phase 3 Step 2: DB-backed roles
alter table identity.users
  add column if not exists roles text[] not null default array['user'];

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

