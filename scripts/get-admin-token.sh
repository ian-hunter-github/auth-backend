#!/usr/bin/env bash
set -euo pipefail

# Logs in using the seeded admin demo user and prints ONLY the access token.
# Usage: ./scripts/get-admin-token.sh [BASE_URL]
# Example: ./scripts/get-admin-token.sh https://auth-backend-netlify.netlify.app

BASE_URL="${1:-${BASE_URL:-}}"
if [[ -z "${BASE_URL}" ]]; then
  echo "Usage: $0 [BASE_URL]" >&2
  echo "Or set BASE_URL env var." >&2
  exit 2
fi

# Seeded admin user in db/identity/seed.sql
USERNAME="${ADMIN_USERNAME:-demo}"
PASSWORD="${ADMIN_PASSWORD:-letmein}"

res="$(
  curl -sS \
    -H "content-type: application/json" \
    -X POST \
    "${BASE_URL}/.netlify/functions/auth-login" \
    -d "{\"username\":\"${USERNAME}\",\"password\":\"${PASSWORD}\"}"
)"

python3 - <<'PY'
import json,sys
data=json.loads(sys.stdin.read())
if not data.get("ok"):
  sys.exit(1)
print(data["data"]["session"]["accessToken"])
PY <<<"${res}"

