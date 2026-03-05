-- Seed data for identity schema (dev).
-- Idempotent.

with seed_users as (
  select
    '00000000-0000-0000-0000-000000000001'::uuid as id,
    'demo@example.com' as email,
    'Demo User' as display_name,
    array['user','admin']::text[] as roles,
    'demo_salt_v1' as password_salt,
    'letmein' as password_plain

  union all
  select
    '00000000-0000-0000-0000-000000000002'::uuid as id,
    'alice@example.com' as email,
    'Alice Example' as display_name,
    array['user']::text[] as roles,
    'alice_salt_v1' as password_salt,
    'letmein' as password_plain

  union all
  select
    '00000000-0000-0000-0000-000000000003'::uuid as id,
    'bob@example.com' as email,
    'Bob Example' as display_name,
    array['user']::text[] as roles,
    'bob_salt_v1' as password_salt,
    'letmein' as password_plain

  union all
  select
    '00000000-0000-0000-0000-000000000004'::uuid as id,
    'admin' as email,
    'Admin User' as display_name,
    array['admin']::text[] as roles,
    'admin_salt_v1' as password_salt,
    '196900' as password_plain
)

insert into identity.users (
  id,
  email,
  display_name,
  roles,
  password_salt,
  password_hash
)
select
  id,
  email,
  display_name,
  roles,
  password_salt,
  encode(
    digest(
      convert_to(password_salt || password_plain, 'utf8'),
      'sha256'
    ),
    'hex'
  ) as password_hash
from seed_users
on conflict (email) do update
set
  display_name = excluded.display_name,
  roles = excluded.roles,
  password_salt = excluded.password_salt,
  password_hash = excluded.password_hash;
  