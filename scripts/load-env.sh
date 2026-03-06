#!/usr/bin/env bash
set -euo pipefail

# ------------------------------------------------------------
# load-env.sh
#
# Loads environment variables for the selected environment.
#
# Layout:
#   environment/
#     dev/
#       db/.env
#       server/.env
#     prod/
#       db/.env
#       server/.env
#
# Behaviour:
#   • APP_ENV selects environment (default: dev)
#   • Existing env vars are NOT overwritten
#   • DB_* variables are mapped to PG* if needed
# ------------------------------------------------------------

APP_ENV="${APP_ENV:-dev}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

DB_ENV_FILE="$ROOT_DIR/environment/$APP_ENV/db/.env"
SERVER_ENV_FILE="$ROOT_DIR/environment/$APP_ENV/server/.env"

# ------------------------------------------------------------
# helper: load .env but preserve already-set variables
# ------------------------------------------------------------

load_env_preserve_existing() {
  local file="$1"
  local line key value

  while IFS= read -r line || [[ -n "$line" ]]; do

    # skip blanks
    [[ -z "$line" ]] && continue

    # skip comments
    [[ "$line" =~ ^[[:space:]]*# ]] && continue

    # require KEY=VALUE
    [[ "$line" != *=* ]] && continue

    key="${line%%=*}"
    value="${line#*=}"

    key="$(printf '%s' "$key" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"

    # skip empty keys
    [[ -z "$key" ]] && continue

    # do not overwrite existing env vars
    if [[ -n "${!key:-}" ]]; then
      continue
    fi

    export "$key=$value"

  done < "$file"
}

# ------------------------------------------------------------
# validate files exist
# ------------------------------------------------------------

if [[ ! -f "$DB_ENV_FILE" ]]; then
  echo "ERROR: Missing DB env file: $DB_ENV_FILE" >&2
  exit 2
fi

if [[ ! -f "$SERVER_ENV_FILE" ]]; then
  echo "ERROR: Missing server env file: $SERVER_ENV_FILE" >&2
  exit 2
fi

# ------------------------------------------------------------
# load files
# ------------------------------------------------------------

load_env_preserve_existing "$DB_ENV_FILE"
load_env_preserve_existing "$SERVER_ENV_FILE"

# ------------------------------------------------------------
# map DB_* → PG* for postgres compatibility
# ------------------------------------------------------------

if [[ -n "${DB_HOST:-}" && -z "${PGHOST:-}" ]]; then
  export PGHOST="$DB_HOST"
fi

if [[ -n "${DB_PORT:-}" && -z "${PGPORT:-}" ]]; then
  export PGPORT="$DB_PORT"
fi

if [[ -n "${DB_NAME:-}" && -z "${PGDATABASE:-}" ]]; then
  export PGDATABASE="$DB_NAME"
fi

if [[ -n "${DB_USER:-}" && -z "${PGUSER:-}" ]]; then
  export PGUSER="$DB_USER"
fi

if [[ -n "${DB_PASSWORD:-}" && -z "${PGPASSWORD:-}" ]]; then
  export PGPASSWORD="$DB_PASSWORD"
fi

if [[ -n "${DB_SSLMODE:-}" && -z "${PGSSLMODE:-}" ]]; then
  export PGSSLMODE="$DB_SSLMODE"
fi

# ------------------------------------------------------------
# summary (safe values only)
# ------------------------------------------------------------

echo "==> Loading environment: $APP_ENV"
echo "DB_LABEL=${DB_LABEL:-unknown}"
echo "DB_HOST=${DB_HOST:-${PGHOST:-unknown}}"
echo "SERVER_LABEL=${SERVER_LABEL:-unknown}"
echo "AUTH_PROVIDER=${AUTH_PROVIDER:-<unset>}"
echo ""
