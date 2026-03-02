#!/usr/bin/env bash
set -euo pipefail

# Generic psql wrapper.
#
# Selects environment based on:
#   PGSYSTEM (default: neon)
#
# Loads:
#   postgres/env/${PGSYSTEM}/.env
#
# Usage examples:
#   PGSYSTEM=neon scripts/pg_psql.sh
#   scripts/pg_psql.sh -c "select 1;"
#   PGSYSTEM=supabase scripts/pg_psql.sh -f db/identity_backend/0001_init.sql

PGSYSTEM="${PGSYSTEM:-neon}"
ENV_FILE="postgres/env/${PGSYSTEM}/.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: environment file not found: $ENV_FILE" >&2
  exit 2
fi

# Export all variables from env file
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

# Sanity checks
: "${PGHOST:?PGHOST not set in $ENV_FILE}"
: "${PGDATABASE:?PGDATABASE not set in $ENV_FILE}"
: "${PGUSER:?PGUSER not set in $ENV_FILE}"
: "${PGPASSWORD:?PGPASSWORD not set in $ENV_FILE}"

# Default SSL mode if not provided
if [[ -z "${PGSSLMODE:-}" ]]; then
  export PGSSLMODE=require
fi

exec psql "$@"
