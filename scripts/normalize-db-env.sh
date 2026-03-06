#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

normalize_one() {
  local env_name="$1"
  local env_file="$ROOT_DIR/environment/$env_name/db/.env"

  if [[ ! -f "$env_file" ]]; then
    echo "Skipping $env_name (no env file)"
    return
  fi

  echo "Normalizing $env_file"

  set -a
  # shellcheck disable=SC1090
  source "$env_file"
  set +a

  local db_dialect="${DB_DIALECT:-postgres}"
  local db_host="${DB_HOST:-${PGHOST:-}}"
  local db_port="${DB_PORT:-${PGPORT:-}}"
  local db_name="${DB_NAME:-${PGDATABASE:-}}"
  local db_user="${DB_USER:-${PGUSER:-}}"
  local db_password="${DB_PASSWORD:-${PGPASSWORD:-}}"
  local db_sslmode="${DB_SSLMODE:-${PGSSLMODE:-require}}"
  local db_label="${DB_LABEL:-IansProject-$env_name}"

  local tmp_file
  tmp_file="$(mktemp)"

  cat > "$tmp_file" <<EOT
# ------------------------------------------------------------
# Database configuration ($env_name)
# Generic DB_* values are the source of truth.
# Compatibility variables (PG*, MYSQL_*, ORACLE_*) are derived in scripts/load-env.sh
# ------------------------------------------------------------

DB_DIALECT=$db_dialect
DB_HOST=$db_host
DB_PORT=$db_port
DB_NAME=$db_name
DB_USER=$db_user
DB_PASSWORD=$db_password
DB_SSLMODE=$db_sslmode
DB_LABEL=$db_label
EOT

  mv "$tmp_file" "$env_file"
  echo "✔ Updated $env_file"
  echo ""
}

normalize_one dev
normalize_one prod

echo "Done."
