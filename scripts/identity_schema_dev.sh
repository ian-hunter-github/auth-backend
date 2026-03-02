#!/usr/bin/env bash
set -euo pipefail

# Build/reset the identity schema in the currently selected Postgres system.
#
# Uses scripts/pg_psql.sh which loads:
#   postgres/env/${PGSYSTEM:-neon}/.env
#
# Usage:
#   scripts/identity_schema_dev.sh
#   PGSYSTEM=neon scripts/identity_schema_dev.sh
#
# Notes:
# - This DROPS the identity schema and recreates it.
# - Intended for dev only.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PSQL_WRAPPER="${ROOT_DIR}/scripts/pg_psql.sh"

if [[ ! -x "$PSQL_WRAPPER" ]]; then
  echo "ERROR: missing executable wrapper: $PSQL_WRAPPER" >&2
  exit 2
fi

echo "Resetting schema: identity"
"$PSQL_WRAPPER" -v ON_ERROR_STOP=1 -f "${ROOT_DIR}/db/identity/reset.sql"

echo "Applying DDL"
"$PSQL_WRAPPER" -v ON_ERROR_STOP=1 -f "${ROOT_DIR}/db/identity/ddl.sql"

echo "Seeding data"
"$PSQL_WRAPPER" -v ON_ERROR_STOP=1 -f "${ROOT_DIR}/db/identity/seed.sql"

echo "OK: identity schema built and seeded"
