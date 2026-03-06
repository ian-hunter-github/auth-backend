#!/usr/bin/env bash
set -euo pipefail

# Generic psql wrapper.
#
# Loads:
#   environment/${APP_ENV:-dev}/db/.env
#   environment/${APP_ENV:-dev}/server/.env
#
# Usage examples:
#   ./scripts/pg_psql.sh
#   ./scripts/pg_psql.sh -c "select 1;"
#   APP_ENV=prod ./scripts/pg_psql.sh -c "select now();"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export APP_ENV="${APP_ENV:-dev}"
# shellcheck disable=SC1091
source "$SCRIPT_DIR/load-env.sh"

: "${DB_DIALECT:?DB_DIALECT not set}"

if [[ "${DB_DIALECT}" != "postgres" ]]; then
  echo "ERROR: scripts/pg_psql.sh only supports DB_DIALECT=postgres (current: ${DB_DIALECT})" >&2
  exit 2
fi

: "${PGHOST:?PGHOST not set}"
: "${PGDATABASE:?PGDATABASE not set}"
: "${PGUSER:?PGUSER not set}"
: "${PGPASSWORD:?PGPASSWORD not set}"

if [[ -z "${PGSSLMODE:-}" ]]; then
  export PGSSLMODE=require
fi

exec psql "$@"
