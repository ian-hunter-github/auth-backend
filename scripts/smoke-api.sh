#!/usr/bin/env bash
set -euo pipefail

# Smoke test (scheme A): Fake provider only.
#
# Assumptions:
# - Your Netlify dev server is already running (e.g. `netlify dev ...`)
# - Fake auth provider is active (default)
#
# Usage:
#   scripts/smoke-api.sh
#
# Optional env vars:
#   BASE_URL   (default: http://localhost:3999)
#   USERNAME   (default: demo)
#   PASSWORD   (default: letmein)

BASE_URL="${BASE_URL:-http://localhost:3999}"
USERNAME="${USERNAME:-demo}"
PASSWORD="${PASSWORD:-letmein}"

if ! command -v curl >/dev/null 2>&1; then
  echo "ERROR: curl is required" >&2
  exit 2
fi

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: node is required (used to parse JSON)" >&2
  exit 2
fi

join_url() {
  local base="$1"
  local path="$2"
  base="${base%/}"
  if [[ "$path" != /* ]]; then
    path="/$path"
  fi
  printf '%s%s' "$base" "$path"
}

# Prefer function routes first (Netlify dev always supports these).
# Fall back to pretty routes if configured.
request_json() {
  local method="$1"
  local pretty_path="$2"
  local fn_path="$3"
  local data="${4:-}"
  local auth_header="${5:-}"

  local url_fn url_pretty
  url_fn="$(join_url "$BASE_URL" "$fn_path")"
  url_pretty="$(join_url "$BASE_URL" "$pretty_path")"

  local tmp_body
  tmp_body="$(mktemp)"
  trap 'rm -f "$tmp_body"' RETURN

  local code=""
  local used_url=""

  do_curl() {
    local url="$1"
    local out_code=""

    if [[ -n "$data" ]]; then
      if [[ -n "$auth_header" ]]; then
        out_code="$(curl -sS -o "$tmp_body" -w "%{http_code}" -X "$method" \
          -H "content-type: application/json" -H "accept: application/json" \
          -H "authorization: $auth_header" \
          --data "$data" \
          "$url" || true)"
      else
        out_code="$(curl -sS -o "$tmp_body" -w "%{http_code}" -X "$method" \
          -H "content-type: application/json" -H "accept: application/json" \
          --data "$data" \
          "$url" || true)"
      fi
    else
      if [[ -n "$auth_header" ]]; then
        out_code="$(curl -sS -o "$tmp_body" -w "%{http_code}" -X "$method" \
          -H "accept: application/json" \
          -H "authorization: $auth_header" \
          "$url" || true)"
      else
        out_code="$(curl -sS -o "$tmp_body" -w "%{http_code}" -X "$method" \
          -H "accept: application/json" \
          "$url" || true)"
      fi
    fi

    printf '%s' "$out_code"
  }

  # 1) Try function URL first
  code="$(do_curl "$url_fn")"
  used_url="$url_fn"

  # Retry on routing/method issues (common when pretty routes are handled by static server)
  if [[ "$code" == "404" || "$code" == "000" || "$code" == "405" ]]; then
    code="$(do_curl "$url_pretty")"
    used_url="$url_pretty"
  fi

  printf '%s\n' "$used_url"
  printf '%s\n' "$code"
  cat "$tmp_body"
}

node_json_get() {
  local expr="$1"
  node -e '
    const fs = require("fs");
    const expr = process.argv[1];
    const raw = fs.readFileSync(0, "utf8");
    let j;
    try { j = JSON.parse(raw); } catch { process.exit(2); }
    function get(obj, path) {
      const parts = path.split(".");
      let cur = obj;
      for (const p of parts) {
        if (!cur || typeof cur !== "object") return undefined;
        cur = cur[p];
      }
      return cur;
    }
    const v = get(j, expr);
    if (v === undefined || v === null) process.stdout.write("");
    else process.stdout.write(String(v));
  ' "$expr"
}

echo "Smoke test (fake): BASE_URL=$BASE_URL"

login_payload="$(node -e 'process.stdout.write(JSON.stringify({ username: process.argv[1], password: process.argv[2] }))' "$USERNAME" "$PASSWORD")"

echo "1) POST /auth-login"
login_resp="$(request_json "POST" "/auth-login" "/.netlify/functions/auth-login" "$login_payload")"
login_url="$(printf '%s' "$login_resp" | sed -n '1p')"
login_code="$(printf '%s' "$login_resp" | sed -n '2p')"
login_body="$(printf '%s' "$login_resp" | sed -n '3,$p')"

if [[ "$login_code" != "200" ]]; then
  echo "ERROR: login failed (${login_code}) at ${login_url}" >&2
  echo "$login_body" >&2
  exit 1
fi

provider="$(printf '%s' "$login_body" | node_json_get "provider")"
if [[ "$provider" != "fake" ]]; then
  echo "ERROR: expected provider 'fake' but got '${provider:-<empty>}'" >&2
  echo "$login_body" >&2
  exit 1
fi

access_token="$(printf '%s' "$login_body" | node_json_get "session.accessToken")"
token_type="$(printf '%s' "$login_body" | node_json_get "session.tokenType")"
user_id="$(printf '%s' "$login_body" | node_json_get "user.id")"

if [[ -z "$access_token" ]]; then
  echo "ERROR: missing session.accessToken" >&2
  echo "$login_body" >&2
  exit 1
fi

if [[ -z "$token_type" ]]; then
  token_type="Bearer"
fi

if [[ -z "$user_id" ]]; then
  echo "ERROR: missing user.id" >&2
  echo "$login_body" >&2
  exit 1
fi

auth_header="${token_type} ${access_token}"

echo "2) GET /me"
me_resp="$(request_json "GET" "/me" "/.netlify/functions/me" "" "$auth_header")"
me_url="$(printf '%s' "$me_resp" | sed -n '1p')"
me_code="$(printf '%s' "$me_resp" | sed -n '2p')"
me_body="$(printf '%s' "$me_resp" | sed -n '3,$p')"

if [[ "$me_code" != "200" ]]; then
  echo "ERROR: /me failed (${me_code}) at ${me_url}" >&2
  echo "$me_body" >&2
  exit 1
fi

me_provider="$(printf '%s' "$me_body" | node_json_get "provider")"
me_user_id="$(printf '%s' "$me_body" | node_json_get "user.id")"

if [[ "$me_provider" != "fake" ]]; then
  echo "ERROR: expected /me provider 'fake' but got '${me_provider:-<empty>}'" >&2
  echo "$me_body" >&2
  exit 1
fi

if [[ -z "$me_user_id" ]]; then
  echo "ERROR: missing /me user.id" >&2
  echo "$me_body" >&2
  exit 1
fi

echo "OK: smoke test passed (fake)"
