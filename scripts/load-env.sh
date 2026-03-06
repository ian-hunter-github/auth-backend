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
#   • DB_* variables are the single source of truth
#   • Compatibility vars are derived based on DB_DIALECT
# ------------------------------------------------------------

APP_ENV="${APP_ENV:-dev}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

DB_ENV_FILE="$ROOT_DIR/environment/$APP_ENV/db/.env"
SERVER_ENV_FILE="$ROOT_DIR/environment/$APP_ENV/server/.env"

load_env_preserve_existing() {
  local file="$1"
  local line key value

  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ -z "$line" ]] && continue
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    [[ "$line" != *=* ]] && continue

    key="${line%%=*}"
    value="${line#*=}"

    key="$(printf '%s' "$key" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"

    [[ -z "$key" ]] && continue

    if [[ -n "${!key:-}" ]]; then
      continue
    fi

    export "$key=$value"
  done < "$file"
}

if [[ ! -f "$DB_ENV_FILE" ]]; then
  echo "ERROR: Missing DB env file: $DB_ENV_FILE" >&2
  exit 2
fi

if [[ ! -f "$SERVER_ENV_FILE" ]]; then
  echo "ERROR: Missing server env file: $SERVER_ENV_FILE" >&2
  exit 2
fi

load_env_preserve_existing "$DB_ENV_FILE"
load_env_preserve_existing "$SERVER_ENV_FILE"

case "${DB_DIALECT:-postgres}" in
  postgres)
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
    ;;
  mysql)
    if [[ -n "${DB_HOST:-}" && -z "${MYSQL_HOST:-}" ]]; then
      export MYSQL_HOST="$DB_HOST"
    fi
    if [[ -n "${DB_PORT:-}" && -z "${MYSQL_PORT:-}" ]]; then
      export MYSQL_PORT="$DB_PORT"
    fi
    if [[ -n "${DB_NAME:-}" && -z "${MYSQL_DATABASE:-}" ]]; then
      export MYSQL_DATABASE="$DB_NAME"
    fi
    if [[ -n "${DB_USER:-}" && -z "${MYSQL_USER:-}" ]]; then
      export MYSQL_USER="$DB_USER"
    fi
    if [[ -n "${DB_PASSWORD:-}" && -z "${MYSQL_PASSWORD:-}" ]]; then
      export MYSQL_PASSWORD="$DB_PASSWORD"
    fi
    ;;
  oracle)
    if [[ -n "${DB_HOST:-}" && -z "${ORACLE_HOST:-}" ]]; then
      export ORACLE_HOST="$DB_HOST"
    fi
    if [[ -n "${DB_PORT:-}" && -z "${ORACLE_PORT:-}" ]]; then
      export ORACLE_PORT="$DB_PORT"
    fi
    if [[ -n "${DB_NAME:-}" && -z "${ORACLE_SERVICE_NAME:-}" ]]; then
      export ORACLE_SERVICE_NAME="$DB_NAME"
    fi
    if [[ -n "${DB_USER:-}" && -z "${ORACLE_USER:-}" ]]; then
      export ORACLE_USER="$DB_USER"
    fi
    if [[ -n "${DB_PASSWORD:-}" && -z "${ORACLE_PASSWORD:-}" ]]; then
      export ORACLE_PASSWORD="$DB_PASSWORD"
    fi
    ;;
esac

echo "==> Loading environment: $APP_ENV"
echo "DB_LABEL=${DB_LABEL:-unknown}"
echo "DB_DIALECT=${DB_DIALECT:-unknown}"
echo "DB_HOST=${DB_HOST:-unknown}"
echo "SERVER_LABEL=${SERVER_LABEL:-unknown}"
echo "AUTH_PROVIDER=${AUTH_PROVIDER:-<unset>}"
echo ""
