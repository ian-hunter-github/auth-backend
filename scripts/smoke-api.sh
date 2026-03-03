#!/usr/bin/env bash
set -euo pipefail

DEBUG=0
if [[ "${1:-}" == "--debug" ]]; then
  DEBUG=1
fi

# Smoke test (scheme A).
#
# Assumptions:
# - Your Netlify dev server is already running (e.g. `netlify dev ...`)
# - AUTH_PROVIDER is active (default)
#
# Usage:
#   scripts/smoke-api.sh [--debug]
#
# Optional env vars:
#   BASE_URL   (default: http://localhost:3999)
#   SMOKE_USERNAME   (if set, used as the only username attempted)
#   SMOKE_PASSWORD   (if set, used as the only password attempted)
#
# Response envelope:
# - Supports both shapes:
#   { provider, session, user, ... }
#   { ok, requestId, data: { provider, session, user, ... } }

BASE_URL="${BASE_URL:-http://localhost:3999}"

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

    if [[ "$DEBUG" -eq 1 ]]; then
      echo "[DEBUG] curl $method $url" >&2
      if [[ -n "$data" ]]; then
        echo "[DEBUG] payload: $data" >&2
      fi
      if [[ -n "$auth_header" ]]; then
        echo "[DEBUG] auth: $auth_header" >&2
      fi
    fi

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

  code="$(do_curl "$url_fn")"
  used_url="$url_fn"

  if [[ "$code" == "404" || "$code" == "000" || "$code" == "405" ]]; then
    code="$(do_curl "$url_pretty")"
    used_url="$url_pretty"
  fi

  if [[ "$DEBUG" -eq 1 ]]; then
    echo "[DEBUG] response code: $code" >&2
    echo "[DEBUG] response body:" >&2
    cat "$tmp_body" >&2
  fi

  printf '%s\n' "$used_url"
  printf '%s\n' "$code"
  cat "$tmp_body"
}

node_json_get() {
  local json="$1"
  local expr="$2"
  node -e '
    const expr = process.argv[1];
    const raw = process.argv[2] ?? "";
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
  ' "$expr" "$json"
}

node_json_get_first() {
  local json="$1"
  shift
  local p
  for p in "$@"; do
    val="$(node_json_get "$json" "$p")" || true
    if [[ -n "${val:-}" ]]; then
      printf '%s' "$val"
      return 0
    fi
  done
  printf '%s' ""
  return 0
}

make_login_payload() {
  local u="$1"
  local p="$2"
  node -e 'process.stdout.write(JSON.stringify({ username: process.argv[1], password: process.argv[2] }))' "$u" "$p"
}

echo "Smoke test (fake): BASE_URL=$BASE_URL"

candidates=()

if [[ -n "${SMOKE_USERNAME:-}" || -n "${SMOKE_PASSWORD:-}" ]]; then
  if [[ -z "${SMOKE_USERNAME:-}" || -z "${SMOKE_PASSWORD:-}" ]]; then
    echo "ERROR: if you set SMOKE_USERNAME or SMOKE_PASSWORD, you must set both." >&2
    exit 2
  fi
  candidates+=("${SMOKE_USERNAME}|${SMOKE_PASSWORD}")
else
  candidates+=("demo|letmein")
fi

login_code=""
login_body=""
login_url=""
used_username=""

echo "1) POST /auth-login"

last_code=""
last_url=""
last_body=""

for pair in "${candidates[@]}"; do
  u="${pair%%|*}"
  p="${pair##*|}"

  payload="$(make_login_payload "$u" "$p")"

  resp="$(request_json "POST" "/auth-login" "/.netlify/functions/auth-login" "$payload")"
  url="$(printf '%s' "$resp" | sed -n '1p')"
  code="$(printf '%s' "$resp" | sed -n '2p')"
  body="$(printf '%s' "$resp" | sed -n '3,$p')"

  last_code="$code"
  last_url="$url"
  last_body="$body"

  if [[ "$code" == "200" ]]; then
    login_code="$code"
    login_url="$url"
    login_body="$body"
    used_username="$u"
    break
  fi
done

if [[ "$login_code" != "200" ]]; then
  echo "ERROR: login failed (last attempt: ${last_code:-<none>}) at ${last_url:-<none>}" >&2
  echo "${last_body:-<no body>}" >&2
  exit 1
fi

provider="$(node_json_get_first "$login_body" "provider" "data.provider")"

if [[ "$provider" != "fake" && "$provider" != "postgres" ]]; then
  echo "ERROR: expected provider 'fake' or 'postgres' but got '${provider:-<empty>}'" >&2
  echo "$login_body" >&2
  exit 1
fi

access_token="$(node_json_get_first "$login_body" "session.accessToken" "data.session.accessToken")"
user_id="$(node_json_get_first "$login_body" "user.id" "data.user.id")"

if [[ -z "$access_token" ]]; then
  echo "ERROR: missing session.accessToken" >&2
  echo "$login_body" >&2
  exit 1
fi

if [[ -z "$user_id" ]]; then
  echo "ERROR: missing user.id" >&2
  echo "$login_body" >&2
  exit 1
fi

echo "OK: login succeeded as '${used_username}' via ${login_url}"

auth_header="Bearer ${access_token}"

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

# /me may (currently) not include provider in its response body.
# If it does, it must be 'fake' for this smoke scenario.
me_provider="$(node_json_get_first "$me_body" "provider" "data.provider")"
if [[ -n "${me_provider:-}" && "$me_provider" != "$provider" ]]; then
  echo "ERROR: expected /me provider '$provider' but got '${me_provider:-<empty>}'" >&2
  echo "$me_body" >&2
  exit 1
fi

me_user_id="$(node_json_get_first "$me_body" "user.id" "data.user.id")"
if [[ -z "$me_user_id" ]]; then
  echo "ERROR: missing /me user.id" >&2
  echo "$me_body" >&2
  exit 1
fi

echo "OK: smoke test passed ($provider)"
