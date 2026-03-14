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
  given_name text null,
  family_name text null,
  avatar_url text null,
  bio text null,
  phone_number text null,
  locale text not null default 'en',
  timezone text not null default 'UTC',
  deleted_at timestamptz null,
  disabled_at timestamptz null,
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

-- User profile extended fields (backward compatible)
alter table identity.users add column if not exists given_name text null;
alter table identity.users add column if not exists family_name text null;
alter table identity.users add column if not exists avatar_url text null;
alter table identity.users add column if not exists bio text null;
alter table identity.users add column if not exists phone_number text null;
alter table identity.users add column if not exists locale text not null default 'en';
alter table identity.users add column if not exists timezone text not null default 'UTC';

-- Account disable/enable (backward compatible)
alter table identity.users add column if not exists disabled_at timestamptz null;

create index if not exists idx_identity_users_deleted_at on identity.users(deleted_at);
create index if not exists idx_identity_users_disabled_at on identity.users(disabled_at);

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
