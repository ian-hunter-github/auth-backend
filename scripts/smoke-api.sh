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
      out_code="$(
        curl -sS -o "$tmp_body" -w "%{http_code}" \
          -X "$method" "$url_fn" \
          -H "content-type: application/json" \
          -H "accept: application/json" \
          -H "authorization: $auth_header" \
          --data "$data" || true
      )"
    else
      out_code="$(
        curl -sS -o "$tmp_body" -w "%{http_code}" \
          -X "$method" "$url_fn" \
          -H "content-type: application/json" \
          -H "accept: application/json" \
          --data "$data" || true
      )"
    fi
  else
    if [[ -n "$auth_header" ]]; then
      out_code="$(
        curl -sS -o "$tmp_body" -w "%{http_code}" \
          -X "$method" "$url_fn" \
          -H "accept: application/json" \
          -H "authorization: $auth_header" || true
      )"
    else
      out_code="$(
        curl -sS -o "$tmp_body" -w "%{http_code}" \
          -X "$method" "$url_fn" \
          -H "accept: application/json" || true
      )"
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
  username="${pair%%|*}"
  password="${pair#*|}"

  payload="$(make_login_payload "$username" "$password")"
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
    used_username="$username"
    break
  fi
done

if [[ -z "$login_code" ]]; then
  echo "ERROR: no credential pair succeeded (last code=$last_code) at $last_url" >&2
  echo "$last_body" >&2
  exit 1
fi

provider="$(printf '%s' "$login_body" | node_json_get_first "provider" "data.provider")"
access_token="$(printf '%s' "$login_body" | node_json_get_first "session.accessToken" "data.session.accessToken")"
refresh_token="$(printf '%s' "$login_body" | node_json_get_first "session.refreshToken" "data.session.refreshToken")"
user_id="$(printf '%s' "$login_body" | node_json_get_first "user.id" "data.user.id")"

if [[ -z "$provider" ]]; then
  echo "ERROR: missing provider in /auth-login response" >&2
  echo "$login_body" >&2
  exit 1
fi

if [[ -z "$access_token" ]]; then
  echo "ERROR: missing accessToken in /auth-login response" >&2
  echo "$login_body" >&2
  exit 1
fi

if [[ -z "$refresh_token" ]]; then
  echo "ERROR: missing refreshToken in /auth-login response" >&2
  echo "$login_body" >&2
  exit 1
fi

if [[ -z "$user_id" ]]; then
  echo "ERROR: missing user.id in /auth-login response" >&2
  echo "$login_body" >&2
  exit 1
fi

echo "OK: login succeeded (provider=$provider, username=$used_username)"

auth_header="Bearer ${access_token}"

# 2) Negative: /me without auth should be 401
echo "2) Negative: GET /me without auth"
me0_resp="$(request_json "GET" "/me" "/.netlify/functions/me")"
me0_code="$(printf '%s' "$me0_resp" | sed -n '2p')"
me0_body="$(printf '%s' "$me0_resp" | sed -n '3,$p')"
if [[ "$me0_code" != "401" ]]; then
  echo "ERROR: /me without auth: expected 401 but got $me0_code" >&2
  echo "$me0_body" >&2
  exit 1
fi
echo "OK: /me without auth rejected"

# 3) Positive: /auth-refresh rotates refresh token and returns new access token
echo "3) POST /auth-refresh"
refresh_payload="$(node -e 'const rt=process.argv[1]; process.stdout.write(JSON.stringify({ refreshToken: rt }));' "$refresh_token")"
refresh_resp="$(request_json "POST" "/auth-refresh" "/.netlify/functions/auth-refresh" "$refresh_payload")"
refresh_url="$(printf '%s' "$refresh_resp" | sed -n '1p')"
refresh_code="$(printf '%s' "$refresh_resp" | sed -n '2p')"
refresh_body="$(printf '%s' "$refresh_resp" | sed -n '3,$p')"

if [[ "$refresh_code" != "200" ]]; then
  echo "ERROR: /auth-refresh failed (${refresh_code}) at ${refresh_url}" >&2
  echo "$refresh_body" >&2
  exit 1
fi

new_access_token="$(printf '%s' "$refresh_body" | node_json_get_first "session.accessToken" "data.session.accessToken")"
new_refresh_token="$(printf '%s' "$refresh_body" | node_json_get_first "session.refreshToken" "data.session.refreshToken")"
if [[ -z "$new_access_token" || -z "$new_refresh_token" ]]; then
  echo "ERROR: /auth-refresh missing tokens" >&2
  echo "$refresh_body" >&2
  exit 1
fi
echo "OK: refresh succeeded"

# 4) Negative: old refresh token should now be rejected (401)
echo "4) Negative: old refresh token rejected"
old_refresh_payload="$(node -e 'const rt=process.argv[1]; process.stdout.write(JSON.stringify({ refreshToken: rt }));' "$refresh_token")"
old_refresh_resp="$(request_json "POST" "/auth-refresh" "/.netlify/functions/auth-refresh" "$old_refresh_payload")"
old_refresh_code="$(printf '%s' "$old_refresh_resp" | sed -n '2p')"
old_refresh_body="$(printf '%s' "$old_refresh_resp" | sed -n '3,$p')"
if [[ "$old_refresh_code" != "401" ]]; then
  echo "ERROR: old refresh token: expected 401 but got $old_refresh_code" >&2
  echo "$old_refresh_body" >&2
  exit 1
fi
echo "OK: old refresh token rejected"

# Update current tokens after refresh.
access_token="$new_access_token"
refresh_token="$new_refresh_token"
auth_header="Bearer ${access_token}"

# 4.1) /me with tampered token should be rejected (401)
echo "4.1) Negative: GET /me with tampered token rejected"
tampered="${access_token}x"
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


# 6) Phase 3: admin users (read-only smoke)
#
# This is intentionally non-destructive by default so it is safe to run against production.
# If you want to exercise create/patch/delete flows in dev, set:
#   SMOKE_ADMIN_MUTATION=1

SMOKE_ADMIN_MUTATION="${SMOKE_ADMIN_MUTATION:-0}"

admin_list_resp="$(request_json "GET" "/admin/users" "/.netlify/functions/admin-users" "" "$auth_header")"
admin_list_url="$(printf '%s' "$admin_list_resp" | sed -n '1p')"
admin_list_code="$(printf '%s' "$admin_list_resp" | sed -n '2p')"
admin_list_body="$(printf '%s' "$admin_list_resp" | sed -n '3,$p')"

if [[ "$admin_list_code" == "404" ]]; then
  echo "OK: /admin/users not deployed; skipping Phase 3 admin smoke"
elif [[ "$admin_list_code" == "403" || "$admin_list_code" == "401" ]]; then
  # If postgres + demo@example.com is not admin, that's a misconfig for Phase 3.
  if [[ "$provider" == "postgres" && "$used_username" == "demo@example.com" ]]; then
    echo "ERROR: expected demo@example.com to be admin, but /admin/users returned $admin_list_code" >&2
    echo "Request: $admin_list_url" >&2
    echo "$admin_list_body" >&2
    exit 1
  fi
  echo "OK: /admin/users forbidden for this user (code=${admin_list_code}); skipping admin checks"
elif [[ "$admin_list_code" != "200" ]]; then
  echo "ERROR: /admin/users failed (${admin_list_code}) at ${admin_list_url}" >&2
  echo "$admin_list_body" >&2
  exit 1
else
  echo "OK: /admin/users list OK"

  admin_first_user_id="$(printf '%s' "$admin_list_body" | node_json_get_first "data.users.0.id" "users.0.id")"
  if [[ -z "$admin_first_user_id" ]]; then
    echo "ERROR: /admin/users missing first user id" >&2
    echo "$admin_list_body" >&2
    exit 1
  fi

  echo "6.1) GET /admin/users/{id}"
  admin_get_resp="$(request_json "GET" "/admin/users/${admin_first_user_id}" "/.netlify/functions/admin-users/${admin_first_user_id}" "" "$auth_header")"
  admin_get_url="$(printf '%s' "$admin_get_resp" | sed -n '1p')"
  admin_get_code="$(printf '%s' "$admin_get_resp" | sed -n '2p')"
  admin_get_body="$(printf '%s' "$admin_get_resp" | sed -n '3,$p')"

  if [[ "$admin_get_code" != "200" ]]; then
    echo "ERROR: /admin/users/{id} failed (${admin_get_code}) at ${admin_get_url}" >&2
    echo "$admin_get_body" >&2
    exit 1
  fi

  admin_get_user_id="$(printf '%s' "$admin_get_body" | node_json_get_first "data.user.id" "user.id")"
  if [[ "$admin_get_user_id" != "$admin_first_user_id" ]]; then
    echo "ERROR: /admin/users/{id} user.id mismatch: expected '$admin_first_user_id' but got '$admin_get_user_id'" >&2
    echo "$admin_get_body" >&2
    exit 1
  fi

  echo "OK: /admin/users/{id} OK"

  if [[ "$SMOKE_ADMIN_MUTATION" == "1" ]]; then
    echo "6.2) POST /admin/users (dev-only mutation smoke)"

    new_email="smoke+$(date +%s)@example.com"
    create_payload="$(node -e 'const email=process.argv[1]; process.stdout.write(JSON.stringify({ email, password: "letmein", displayName: "Smoke User" }));' "$new_email")"

    create_resp="$(request_json "POST" "/admin/users" "/.netlify/functions/admin-users" "$create_payload" "$auth_header")"
    create_url="$(printf '%s' "$create_resp" | sed -n '1p')"
    create_code="$(printf '%s' "$create_resp" | sed -n '2p')"
    create_body="$(printf '%s' "$create_resp" | sed -n '3,$p')"

    if [[ "$create_code" != "201" ]]; then
      echo "ERROR: /admin/users create failed (${create_code}) at ${create_url}" >&2
      echo "$create_body" >&2
      exit 1
    fi

    created_user_id="$(printf '%s' "$create_body" | node_json_get_first "data.user.id" "user.id")"
    if [[ -z "$created_user_id" ]]; then
      echo "ERROR: /admin/users create missing user.id" >&2
      echo "$create_body" >&2
      exit 1
    fi

    echo "6.3) DELETE /admin/users/{id} (soft delete)"
    del_resp="$(request_json "DELETE" "/admin/users/${created_user_id}" "/.netlify/functions/admin-users/${created_user_id}" "" "$auth_header")"
    del_url="$(printf '%s' "$del_resp" | sed -n '1p')"
    del_code="$(printf '%s' "$del_resp" | sed -n '2p')"
    del_body="$(printf '%s' "$del_resp" | sed -n '3,$p')"

    if [[ "$del_code" != "200" ]]; then
      echo "ERROR: /admin/users delete failed (${del_code}) at ${del_url}" >&2
      echo "$del_body" >&2
      exit 1
    fi

    echo "6.4) Negative: deleted user cannot login"
    deleted_login_payload="$(make_login_payload "$new_email" "letmein")"
    deleted_login_resp="$(request_json "POST" "/auth-login" "/.netlify/functions/auth-login" "$deleted_login_payload")"
    deleted_login_code="$(printf '%s' "$deleted_login_resp" | sed -n '2p')"
    deleted_login_body="$(printf '%s' "$deleted_login_resp" | sed -n '3,$p')"
    if [[ "$deleted_login_code" != "401" ]]; then
      echo "ERROR: deleted user login: expected 401 but got $deleted_login_code" >&2
      echo "$deleted_login_body" >&2
      exit 1
    fi

    echo "OK: Phase 3 admin mutation smoke passed"
  fi
fi

echo "OK: smoke test passed (${provider})"


