#!/usr/bin/env bash
set -euo pipefail

URL="${1:-https://auth-backend-netlify.netlify.app/.netlify/functions/health}"

if ! command -v jq >/dev/null 2>&1; then
  echo "ERROR: jq is required"
  exit 1
fi

echo "Checking health endpoint:"
echo "  $URL"
echo

RAW="$(curl -fsS "$URL")"

echo "$RAW" | jq .

echo
echo "Summary:"

OK=$(echo "$RAW" | jq -r '.ok')
REQ=$(echo "$RAW" | jq -r '.requestId')
NODE=$(echo "$RAW" | jq -r '.data.build.node')
PROVIDER=$(echo "$RAW" | jq -r '.data.env.authProvider')

PG_HOST=$(echo "$RAW" | jq -r '.data.env.postgres.hasHost')
PG_DB=$(echo "$RAW" | jq -r '.data.env.postgres.hasDatabase')
PG_USER=$(echo "$RAW" | jq -r '.data.env.postgres.hasUser')
PG_PASS=$(echo "$RAW" | jq -r '.data.env.postgres.hasPassword')
PG_PORT=$(echo "$RAW" | jq -r '.data.env.postgres.hasPort')
PG_SSL=$(echo "$RAW" | jq -r '.data.env.postgres.hasSslMode')

PG_OK=$(echo "$RAW" | jq -r '.data.diagnostics.checks.postgres.ok // "unknown"')
PG_ERR=$(echo "$RAW" | jq -r '.data.diagnostics.checks.postgres.error // ""')

echo "  ok        : $OK"
echo "  requestId : $REQ"
echo "  node      : $NODE"
echo "  provider  : $PROVIDER"

echo "  postgres  : host=$PG_HOST db=$PG_DB user=$PG_USER pass=$PG_PASS port=$PG_PORT sslmode=$PG_SSL"

if [[ "$PG_OK" == "true" ]]; then
  echo "  db-check  : ok"
elif [[ "$PG_OK" == "false" ]]; then
  echo "  db-check  : FAILED"
  echo "  db-error  : $PG_ERR"
else
  echo "  db-check  : not-run"
fi
