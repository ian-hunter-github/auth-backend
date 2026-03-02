-- Seed data for identity schema (dev).
-- Idempotent.

insert into identity.users (id, email, display_name)
values
  ('00000000-0000-0000-0000-000000000001'::uuid, 'demo@example.com', 'Demo User')
on conflict (email) do update
set
  display_name = excluded.display_name;
