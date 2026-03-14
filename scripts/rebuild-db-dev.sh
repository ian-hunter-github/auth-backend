#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export APP_ENV="${APP_ENV:-dev}"
# shellcheck disable=SC1091
source "$SCRIPT_DIR/load-env.sh"

: "${PGHOST:?PGHOST is required}"
: "${PGPORT:?PGPORT is required}"
: "${PGDATABASE:?PGDATABASE is required}"
: "${PGUSER:?PGUSER is required}"
: "${PGPASSWORD:?PGPASSWORD is required}"

export PGPASSWORD

# Open ssh tunnel to freevm, and wait until pg is ready.
#${HOME}/bin/vm-tunnel open postgres
#trap '"${HOME}/bin/vm-tunnel" close postgres >/dev/null 2>&1 || true' EXIT

psql "host=${PGHOST} port=${PGPORT} dbname=${PGDATABASE} user=${PGUSER} sslmode=${PGSSLMODE:-disable}" -f db/identity/reset.sql
psql "host=${PGHOST} port=${PGPORT} dbname=${PGDATABASE} user=${PGUSER} sslmode=${PGSSLMODE:-disable}" -f db/identity/ddl.sql
psql "host=${PGHOST} port=${PGPORT} dbname=${PGDATABASE} user=${PGUSER} sslmode=${PGSSLMODE:-disable}" -f db/identity/seed.sql

echo "OK: profile database rebuilt"



#############################################################
#!/usr/bin/env bash
#set -euo pipefail

# SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# export APP_ENV="${APP_ENV:-dev}"
# # shellcheck disable=SC1091
# source "$SCRIPT_DIR/load-env.sh"

# # Hardcoded DEV-only database rebuild.
# #
# # Drops and recreates the identity schema, then reapplies ddl + seed.
# # This script intentionally refuses to run against any non-dev APP_ENV.

# SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# export APP_ENV=dev
# # shellcheck disable=SC1091
# source "${SCRIPT_DIR}/load-env.sh"

# if [[ "${APP_ENV}" != "dev" ]]; then
#   echo "ERROR: rebuild-db-dev.sh is hardcoded for APP_ENV=dev only" >&2
#   exit 2
# fi

# cd "$ROOT_DIR"

# if [[ ! -x "${SCRIPT_DIR}/pg_psql.sh" ]]; then
#   echo "ERROR: missing scripts/pg_psql.sh" >&2
#   exit 2
# fi

# if [[ ! -f "db/identity/reset.sql" ]]; then
#   echo "ERROR: missing db/identity/reset.sql" >&2
#   exit 2
# fi

# if [[ ! -f "db/identity/ddl.sql" ]]; then
#   echo "ERROR: missing db/identity/ddl.sql" >&2
#   exit 2
# fi

# if [[ ! -f "db/identity/seed.sql" ]]; then
#   echo "ERROR: missing db/identity/seed.sql" >&2
#   exit 2
# fi

# echo "==> Rebuilding identity schema in DEV"
# "${SCRIPT_DIR}/pg_psql.sh" -v ON_ERROR_STOP=1 -f db/identity/reset.sql
# "${SCRIPT_DIR}/pg_psql.sh" -v ON_ERROR_STOP=1 -f db/identity/ddl.sql
# "${SCRIPT_DIR}/pg_psql.sh" -v ON_ERROR_STOP=1 -f db/identity/seed.sql

# echo ""
# echo "OK: DEV database rebuilt."
