-- Seed data for identity schema (dev).
-- Idempotent.

with seed_users as (
  select
    '00000000-0000-0000-0000-000000000001'::uuid as id,
    'demo@example.com' as email,
    'Demo User' as display_name,
    array['user','admin']::text[] as roles,
    'demo_salt_v1' as password_salt,
    'letmein' as password_plain,
    'Demo' as given_name,
    'User' as family_name,
    null::text as avatar_url,
    'Admin demo account for development and testing.' as bio,
    null::text as phone_number,
    'en' as locale,
    'UTC' as timezone

  union all
  select
    '00000000-0000-0000-0000-000000000002'::uuid as id,
    'alice@example.com' as email,
    'Alice Example' as display_name,
    array['user']::text[] as roles,
    'alice_salt_v1' as password_salt,
    'letmein' as password_plain,
    'Alice' as given_name,
    'Example' as family_name,
    null::text as avatar_url,
    'Software engineer and coffee enthusiast.' as bio,
    '+44 7700 900000' as phone_number,
    'en-GB' as locale,
    'Europe/London' as timezone

  union all
  select
    '00000000-0000-0000-0000-000000000003'::uuid as id,
    'bob@example.com' as email,
    'Bob Example' as display_name,
    array['user']::text[] as roles,
    'bob_salt_v1' as password_salt,
    'letmein' as password_plain,
    'Bob' as given_name,
    'Example' as family_name,
    null::text as avatar_url,
    null::text as bio,
    '+1 555 000 0001' as phone_number,
    'en-US' as locale,
    'America/New_York' as timezone

  union all
  select
    '00000000-0000-0000-0000-000000000004'::uuid as id,
    'admin' as email,
    'Admin User' as display_name,
    array['admin']::text[] as roles,
    'admin_salt_v1' as password_salt,
    '196900' as password_plain,
    'Admin' as given_name,
    null::text as family_name,
    null::text as avatar_url,
    null::text as bio,
    null::text as phone_number,
    'en' as locale,
    'UTC' as timezone
)

insert into identity.users (
  id,
  email,
  display_name,
  roles,
  password_salt,
  password_hash,
  given_name,
  family_name,
  avatar_url,
  bio,
  phone_number,
  locale,
  timezone
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
  ) as password_hash,
  given_name,
  family_name,
  avatar_url,
  bio,
  phone_number,
  locale,
  timezone
from seed_users
on conflict (email) do update
set
  display_name = excluded.display_name,
  roles = excluded.roles,
  password_salt = excluded.password_salt,
  password_hash = excluded.password_hash,
  given_name = excluded.given_name,
  family_name = excluded.family_name,
  avatar_url = excluded.avatar_url,
  bio = excluded.bio,
  phone_number = excluded.phone_number,
  locale = excluded.locale,
  timezone = excluded.timezone;
