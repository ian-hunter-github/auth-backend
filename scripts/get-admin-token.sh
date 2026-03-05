#!/usr/bin/env bash
set -euo pipefail

# Logs in using the seeded admin user and prints ONLY the access token.
#
# Usage:
#   ./scripts/get-admin-token.sh [BASE_URL]
#
# Examples:
#   ./scripts/get-admin-token.sh https://auth-backend-netlify.netlify.app
#   BASE_URL=http://localhost:3999 ./scripts/get-admin-token.sh

BASE_URL="${1:-${BASE_URL:-}}"
BASE_URL="${BASE_URL%/}"

if [[ -z "${BASE_URL}" ]]; then
  echo "Usage: $0 [BASE_URL]" >&2
  exit 2
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "ERROR: curl required" >&2
  exit 2
fi

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: node required" >&2
  exit 2
fi

USERNAME="${ADMIN_USERNAME:-admin}"
PASSWORD="${ADMIN_PASSWORD:-196900}"

LOGIN_URL="${BASE_URL}/.netlify/functions/auth-login"

tmp_headers="$(mktemp)"
tmp_body="$(mktemp)"
cleanup() {
  rm -f "$tmp_headers" "$tmp_body"
}
trap cleanup EXIT

curl -sS \
  -D "$tmp_headers" \
  -o "$tmp_body" \
  -H "content-type: application/json" \
  -X POST \
  "$LOGIN_URL" \
  -d "{\"username\":\"${USERNAME}\",\"password\":\"${PASSWORD}\"}"

status="$(awk 'NR==1{print $2}' "$tmp_headers" || true)"
content_type="$(awk -F': ' 'tolower($1)=="content-type"{print $2; exit}' "$tmp_headers" | tr -d '\r' || true)"

if [[ ! -s "$tmp_body" ]]; then
  echo "ERROR: auth-login returned empty body (status=${status:-unknown}, content-type=${content_type:-unknown})" >&2
  echo "URL: $LOGIN_URL" >&2
  exit 1
fi

token="$(
  node -e '
    const fs = require("fs");
    const raw = fs.readFileSync(0, "utf8");
    let j;
    try { j = JSON.parse(raw); }
    catch (e) {
      console.error("ERROR: auth-login response was not valid JSON");
      process.exit(2);
    }
    if (!j || typeof j !== "object" || j.ok !== true) {
      console.error("ERROR: auth-login returned ok:false");
      process.exit(3);
    }
    const t = j?.data?.session?.accessToken;
    if (!t || typeof t !== "string" || t.length < 10) {
      console.error("ERROR: missing accessToken in auth-login response");
      process.exit(4);
    }
    process.stdout.write(t);
  ' < "$tmp_body" 2>/dev/null || true
)"

if [[ -z "$token" ]]; then
  # Try again but show useful diagnostics
  echo "ERROR: failed to extract access token from auth-login response." >&2
  echo "status=${status:-unknown} content-type=${content_type:-unknown}" >&2
  echo "URL: $LOGIN_URL" >&2
  echo "--- response (first 400 chars) ---" >&2
  head -c 400 "$tmp_body" >&2 || true
  echo "" >&2
  exit 1
fi

printf '%s\n' "$token"
