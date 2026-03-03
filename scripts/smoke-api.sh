#!/usr/bin/env bash
set -euo pipefail

DEBUG=0
if [[ "${1:-}" == "--debug" ]]; then
  DEBUG=1
fi

# Smoke test:
# - Works against local `netlify dev` or deployed Netlify site.
# - Supports both response envelope shapes:
#   { provider, session, user, ... }
#   { ok, requestId, data: { provider, session, user, ... } }
#
# Usage:
#   scripts/smoke-api.sh [--debug]
#
# Optional env vars:
#   BASE_URL         (default: http://localhost:3999)
#   SMOKE_USERNAME   (optional: only username attempted)
#   SMOKE_PASSWORD   (optional: only password attempted)

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

  local out_code=""

  if [[ "$DEBUG" -eq 1 ]]; then
    echo "[DEBUG] curl $method $url_fn" >&2
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
        "$url_fn" || true)"
    else
      out_code="$(curl -sS -o "$tmp_body" -w "%{http_code}" -X "$method" \
        -H "content-type: application/json" -H "accept: application/json" \
        --data "$data" \
        "$url_fn" || true)"
    fi
  else
    if [[ -n "$auth_header" ]]; then
      out_code="$(curl -sS -o "$tmp_body" -w "%{http_code}" -X "$method" \
        -H "accept: application/json" \
        -H "authorization: $auth_header" \
        "$url_fn" || true)"
    else
      out_code="$(curl -sS -o "$tmp_body" -w "%{http_code}" -X "$method" \
        -H "accept: application/json" \
        "$url_fn" || true)"
    fi
  fi

  if [[ "$DEBUG" -eq 1 ]]; then
    echo "[DEBUG] response code: $out_code" >&2
    echo "[DEBUG] response body:" >&2
    cat "$tmp_body" >&2
  fi

  echo "$url_pretty"
  echo "$out_code"
  cat "$tmp_body"
}

node_json_get_first() {
  local key1="$1"
  local key2="$2"
  node -e '
const fs = require("fs");
const raw = fs.readFileSync(0, "utf8");
let j;
try { j = JSON.parse(raw); } catch { process.exit(0); }
function get(obj, path) {
  const parts = path.split(".");
  let cur = obj;
  for (const p of parts) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = cur[p];
  }
  return cur;
}
const k1 = process.argv[1];
const k2 = process.argv[2];
const v1 = get(j, k1);
const v2 = get(j, k2);
const v = (v1 !== undefined ? v1 : v2);
if (v === undefined || v === null) process.exit(0);
process.stdout.write(String(v));
' "$key1" "$key2"
}

make_login_payload() {
  local u="$1"
  local p="$2"
  node -e '
const u = process.argv[1];
const p = process.argv[2];
process.stdout.write(JSON.stringify({ username: u, password: p }));
' "$u" "$p"
}

echo "Smoke test: BASE_URL=$BASE_URL"

candidates=()
if [[ -n "${SMOKE_USERNAME:-}" || -n "${SMOKE_PASSWORD:-}" ]]; then
  if [[ -z "${SMOKE_USERNAME:-}" || -z "${SMOKE_PASSWORD:-}" ]]; then
    echo "ERROR: if you set SMOKE_USERNAME or SMOKE_PASSWORD, you must set both." >&2
    exit 2
  fi
  candidates+=("${SMOKE_USERNAME}|${SMOKE_PASSWORD}")
else
  candidates+=("demo|wrong-password") # for negative test 0
  candidates+=("demo|letmein")
  candidates+=("demo@example.com|letmein")
  candidates+=("alice@example.com|letmein")
  candidates+=("bob@example.com|letmein")
  candidates+=("demo|password")
  candidates+=("test|test")
  candidates+=("test@example.com|test")
fi

# 0) Negative: wrong password should be rejected (401)
echo "0) Negative: POST /auth-login rejects wrong password"
bad_payload="$(make_login_payload "demo" "wrong-password")"
bad_resp="$(request_json "POST" "/auth-login" "/.netlify/functions/auth-login" "$bad_payload")"
bad_url="$(printf '%s' "$bad_resp" | sed -n '1p')"
bad_code="$(printf '%s' "$bad_resp" | sed -n '2p')"
bad_body="$(printf '%s' "$bad_resp" | sed -n '3,$p')"

if [[ "$bad_code" != "401" ]]; then
  echo "ERROR: bad login: expected HTTP 401 but got $bad_code" >&2
  echo "Request: $bad_url" >&2
  echo "$bad_body" >&2
  exit 1
fi
echo "OK: bad login rejected"

# 1) Positive: find a working credential pair
login_code=""
login_url=""
login_body=""
used_username=""

echo "1) POST /auth-login"

last_code=""
last_url=""
last_body=""

for pair in "${candidates[@]}"; do
  u="${pair%%|*}"
  p="${pair##*|}"

  # Skip wrong-password pair for positive login attempts.
  if [[ "$p" == "wrong-password" ]]; then
    continue
  fi

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
  echo "" >&2
  echo "Tried credential pairs:" >&2
  for pair in "${candidates[@]}"; do
    if [[ "${pair##*|}" == "wrong-password" ]]; then
      continue
    fi
    echo "  - ${pair%%|*} / ${pair##*|}" >&2
  done
  exit 1
fi

provider="$(printf '%s' "$login_body" | node_json_get_first "provider" "data.provider")"
access_token="$(printf '%s' "$login_body" | node_json_get_first "session.accessToken" "data.session.accessToken")"
token_type="$(printf '%s' "$login_body" | node_json_get_first "session.tokenType" "data.session.tokenType")"
user_id="$(printf '%s' "$login_body" | node_json_get_first "user.id" "data.user.id")"

if [[ -z "$provider" ]]; then
  provider="<unknown>"
fi

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

echo "OK: login succeeded as '${used_username}' via ${login_url}"

auth_header="${token_type} ${access_token}"

# 2) Negative: /me missing header
echo "2) Negative: GET /me rejects missing Authorization header"
me0_resp="$(request_json "GET" "/me" "/.netlify/functions/me")"
me0_code="$(printf '%s' "$me0_resp" | sed -n '2p')"
me0_body="$(printf '%s' "$me0_resp" | sed -n '3,$p')"
if [[ "$me0_code" != "401" ]]; then
  echo "ERROR: /me missing auth: expected 401 but got $me0_code" >&2
  echo "$me0_body" >&2
  exit 1
fi
echo "OK: /me missing auth rejected"

# 3) Negative: /me bogus token
echo "3) Negative: GET /me rejects invalid token"
me1_resp="$(request_json "GET" "/me" "/.netlify/functions/me" "" "Bearer bogus-token")"
me1_code="$(printf '%s' "$me1_resp" | sed -n '2p')"
me1_body="$(printf '%s' "$me1_resp" | sed -n '3,$p')"
if [[ "$me1_code" != "401" ]]; then
  echo "ERROR: /me invalid token: expected 401 but got $me1_code" >&2
  echo "$me1_body" >&2
  exit 1
fi
echo "OK: /me invalid token rejected"

# 4) Negative: /me tampered token (one character changed)
echo "4) Negative: GET /me rejects tampered token"
tampered="$access_token"
if [[ "${#tampered}" -gt 10 ]]; then
  # flip last character deterministically
  last="${tampered: -1}"
  repl="a"
  if [[ "$last" == "a" ]]; then
    repl="b"
  fi
  tampered="${tampered:0:${#tampered}-1}${repl}"
fi

me2_resp="$(request_json "GET" "/me" "/.netlify/functions/me" "" "Bearer ${tampered}")"
me2_code="$(printf '%s' "$me2_resp" | sed -n '2p')"
me2_body="$(printf '%s' "$me2_resp" | sed -n '3,$p')"
if [[ "$me2_code" != "401" ]]; then
  echo "ERROR: /me tampered token: expected 401 but got $me2_code" >&2
  echo "$me2_body" >&2
  exit 1
fi
echo "OK: /me tampered token rejected"

# 5) Positive: /me valid token
echo "5) GET /me"
me_resp="$(request_json "GET" "/me" "/.netlify/functions/me" "" "$auth_header")"
me_url="$(printf '%s' "$me_resp" | sed -n '1p')"
me_code="$(printf '%s' "$me_resp" | sed -n '2p')"
me_body="$(printf '%s' "$me_resp" | sed -n '3,$p')"

if [[ "$me_code" != "200" ]]; then
  echo "ERROR: /me failed (${me_code}) at ${me_url}" >&2
  echo "$me_body" >&2
  exit 1
fi

me_user_id="$(printf '%s' "$me_body" | node_json_get_first "user.id" "data.user.id")"
if [[ -z "$me_user_id" ]]; then
  echo "ERROR: missing /me user.id" >&2
  echo "$me_body" >&2
  exit 1
fi

if [[ "$me_user_id" != "$user_id" ]]; then
  echo "ERROR: /me user.id mismatch: expected '$user_id' but got '$me_user_id'" >&2
  echo "$me_body" >&2
  exit 1
fi

echo "OK: smoke test passed (${provider})"

