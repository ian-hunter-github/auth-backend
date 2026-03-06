#!/usr/bin/env bash
set -euo pipefail

# --------------------------------------------
# Environment Loader
#
# Loads environment variables from:
#   environment/<APP_ENV>/db/.env
#   environment/<APP_ENV>/server/.env
#
# Default environment = dev
# --------------------------------------------

APP_ENV="${APP_ENV:-dev}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

DB_ENV_FILE="$ROOT_DIR/environment/$APP_ENV/db/.env"
SERVER_ENV_FILE="$ROOT_DIR/environment/$APP_ENV/server/.env"

echo "==> Loading environment: $APP_ENV"

if [[ ! -f "$DB_ENV_FILE" ]]; then
  echo "ERROR: Missing DB env file: $DB_ENV_FILE"
  exit 1
fi

if [[ ! -f "$SERVER_ENV_FILE" ]]; then
  echo "ERROR: Missing server env file: $SERVER_ENV_FILE"
  exit 1
fi

# Export variables
set -a

# shellcheck disable=SC1090
source "$DB_ENV_FILE"

# shellcheck disable=SC1090
source "$SERVER_ENV_FILE"

set +a

echo "DB_LABEL=${DB_LABEL:-unknown}"
echo "DB_HOST=${DB_HOST:-${PGHOST:-unknown}}"
echo "SERVER_LABEL=${SERVER_LABEL:-unknown}"
echo
