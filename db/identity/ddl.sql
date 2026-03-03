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

