#!/usr/bin/env bash
set -euo pipefail

APP_ENV="${APP_ENV:-dev}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

DB_ENV_FILE="$ROOT_DIR/environment/$APP_ENV/db/.env"
SERVER_ENV_FILE="$ROOT_DIR/environment/$APP_ENV/server/.env"

if [[ ! -f "$DB_ENV_FILE" ]]; then
  echo "ERROR: Missing DB env file: $DB_ENV_FILE" >&2
  exit 2
fi

if [[ ! -f "$SERVER_ENV_FILE" ]]; then
  echo "ERROR: Missing server env file: $SERVER_ENV_FILE" >&2
  exit 2
fi

set -a
# shellcheck disable=SC1090
source "$DB_ENV_FILE"
# shellcheck disable=SC1090
source "$SERVER_ENV_FILE"
set +a

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

echo "==> Loading environment: $APP_ENV"
echo "DB_LABEL=${DB_LABEL:-unknown}"
echo "DB_HOST=${DB_HOST:-${PGHOST:-unknown}}"
echo "SERVER_LABEL=${SERVER_LABEL:-unknown}"
echo ""
