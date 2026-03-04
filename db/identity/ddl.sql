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
  created_at timestamptz not null default now()
);

-- Backward/forward compatible guards (for DBs created with older ddl.sql)
alter table identity.users
  add column if not exists roles text[] not null default array['user'];

alter table identity.users
  add column if not exists deleted_at timestamptz null;

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

create index if not exists idx_identity_audit_log_created_at on identity.audit_log(created_at);
create index if not exists idx_identity_audit_log_action on identity.audit_log(action);
create index if not exists idx_identity_audit_log_actor_user_id on identity.audit_log(actor_user_id);
create index if not exists idx_identity_audit_log_target_user_id on identity.audit_log(target_user_id);

