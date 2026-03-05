#!/usr/bin/env bash
set -euo pipefail

# ------------------------------------------------------------------
# health-admin.sh
#
# Calls the authenticated health-admin endpoint (admin-only).
#
# Default: human readable output
# --json : raw JSON output only
# --watch: repeatedly poll and print (human-readable only)
#   --interval <seconds>  (default: 2)
#
# Usage:
#   ./scripts/health-admin.sh [BASE_URL]
#   ./scripts/health-admin.sh --json [BASE_URL]
#   ./scripts/health-admin.sh --watch [--interval N] [BASE_URL]
# ------------------------------------------------------------------

JSON=false
WATCH=false
INTERVAL_SECONDS=2

while [[ $# -gt 0 ]]; do
  case "$1" in
    --json)
      JSON=true
      shift
      ;;
    --watch)
      WATCH=true
      shift
      ;;
    --interval)
      shift
      if [[ $# -lt 1 ]]; then
        echo "ERROR: --interval requires a number of seconds" >&2
        exit 2
      fi
      INTERVAL_SECONDS="$1"
      shift
      ;;
    -*)
      echo "ERROR: unknown option: $1" >&2
      exit 2
      ;;
    *)
      break
      ;;
  esac
done

BASE_URL="${1:-${BASE_URL:-http://localhost:3999}}"
BASE_URL="${BASE_URL%/}"

if ! command -v curl >/dev/null 2>&1; then
  echo "ERROR: curl required" >&2
  exit 2
fi

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: node required" >&2
  exit 2
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ ! -x "${SCRIPT_DIR}/get-admin-token.sh" ]]; then
  echo "ERROR: scripts/get-admin-token.sh not found or not executable" >&2
  exit 2
fi

URL="${BASE_URL}/.netlify/functions/health-admin"

FETCH_STATUS=""
FETCH_CONTENT_TYPE=""

get_token() {
  "${SCRIPT_DIR}/get-admin-token.sh" "$BASE_URL"
}

fetch_health_admin() {
  local token="$1"
  local tmp_headers
  local tmp_body
  local status
  local content_type

  tmp_headers="$(mktemp)"
  tmp_body="$(mktemp)"
  cleanup_fetch() {
    rm -f "$tmp_headers" "$tmp_body"
  }
  trap cleanup_fetch RETURN

  curl -sS \
    -D "$tmp_headers" \
    -o "$tmp_body" \
    -H "accept: application/json" \
    -H "authorization: Bearer ${token}" \
    "$URL" || true

  status="$(awk 'NR==1{print $2}' "$tmp_headers" || true)"
  content_type="$(awk -F': ' 'tolower($1)=="content-type"{print $2; exit}' "$tmp_headers" | tr -d '\r' || true)"

  FETCH_STATUS="${status:-unknown}"
  FETCH_CONTENT_TYPE="${content_type:-unknown}"

  if [[ ! -s "$tmp_body" ]]; then
    echo ""
    return 0
  fi

  cat "$tmp_body"
}

fetch_json_with_reauth() {
  local token="$1"
  local raw

  raw="$(fetch_health_admin "$token")"

  # If token is expired/invalid, re-login once and retry.
  if [[ "${FETCH_STATUS}" == "401" || "${FETCH_STATUS}" == "403" ]]; then
    token="$(get_token || true)"
    if [[ -z "${token}" ]]; then
      echo ""
      return 1
    fi
    raw="$(fetch_health_admin "$token")"
    printf '%s' "${raw}"
    # Echo token back to caller via global.
    TOKEN_CURRENT="${token}"
    return 0
  fi

  printf '%s' "${raw}"
  TOKEN_CURRENT="${token}"
  return 0
}

print_human() {
  node -e '
const fs = require("fs");

const raw = fs.readFileSync(0, "utf8");
let j;

try {
  j = JSON.parse(raw);
} catch {
  console.error("ERROR: health-admin response was not JSON");
  console.error("");
  console.error("--- raw response ---");
  console.error(raw.trim().slice(0, 2000));
  process.exit(1);
}

const pg =
  j?.data?.postgres ||
  j?.postgres ||
  (j?.data?.envValues?.postgres ? j.data.envValues.postgres : undefined);

if (!pg) {
  console.log(JSON.stringify(j, null, 2));
  process.exit(0);
}

console.log("Postgres Observability");
console.log("----------------------");

if (pg.connectMs !== undefined) console.log("connect latency      :", pg.connectMs, "ms");
if (pg.queryMs !== undefined) console.log("query latency        :", pg.queryMs, "ms");
if (pg.activeSessions !== undefined) console.log("active sessions      :", pg.activeSessions);
if (pg.revokedSessions !== undefined) console.log("revoked sessions     :", pg.revokedSessions);
if (pg.failedLoginCountLastHour !== undefined) console.log("failed logins (1h)   :", pg.failedLoginCountLastHour);

console.log("");

if (pg.host) console.log("host                 :", pg.host);
if (pg.database) console.log("database             :", pg.database);
if (pg.user) console.log("user                 :", pg.user);
if (pg.port) console.log("port                 :", pg.port);
if (pg.sslMode) console.log("ssl mode             :", pg.sslMode);
if (pg.passwordSet !== undefined) console.log("password set         :", pg.passwordSet);
if (pg.configFingerprint) console.log("config fingerprint   :", pg.configFingerprint);
'
}

watch_extract_banner() {
  node -e '
const fs = require("fs");
const raw = fs.readFileSync(0, "utf8");
let j;
try { j = JSON.parse(raw); } catch { process.exit(2); }

const pg =
  j?.data?.postgres ||
  j?.postgres ||
  (j?.data?.envValues?.postgres ? j.data.envValues.postgres : undefined);

if (!pg) process.exit(3);

function s(v) { return (typeof v === "string" && v.length) ? v : "-"; }

const host = s(pg.host);
const finger = s(pg.configFingerprint);

process.stdout.write(host + "\n" + finger + "\n");
'
}

watch_print_header() {
  printf '%-16s %-6s %-6s %-5s %-5s %-7s\n' "ts" "conn" "qry" "act" "rev" "fail1h"
}

watch_print_line() {
  node -e '
const fs = require("fs");
const raw = fs.readFileSync(0, "utf8");
let j;
try { j = JSON.parse(raw); } catch { process.exit(2); }

const pg =
  j?.data?.postgres ||
  j?.postgres ||
  (j?.data?.envValues?.postgres ? j.data.envValues.postgres : undefined);

if (!pg) process.exit(3);

function n(v) { return (typeof v === "number" && Number.isFinite(v)) ? String(v) : "-"; }

function ts() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const HH = String(d.getHours()).padStart(2, "0");
  const MM = String(d.getMinutes()).padStart(2, "0");
  const SS = String(d.getSeconds()).padStart(2, "0");
  const ms = String(d.getMilliseconds()).padStart(3, "0");
  return `${dd}-${mm} ${HH}:${MM}:${SS}.${ms}`;
}

const conn = n(pg.connectMs);
const qry = n(pg.queryMs);
const act = n(pg.activeSessions);
const rev = n(pg.revokedSessions);
const fail1h = n(pg.failedLoginCountLastHour);

const line =
  ts().padEnd(16) + " " +
  (conn + "ms").padEnd(6) + " " +
  (qry + "ms").padEnd(6) + " " +
  act.padEnd(5) + " " +
  rev.padEnd(5) + " " +
  fail1h.padEnd(7);

process.stdout.write(line + "\n");
'
}

if [[ "${WATCH}" == true && "${JSON}" == true ]]; then
  echo "ERROR: --watch cannot be combined with --json" >&2
  exit 2
fi

# Acquire token once for the run (avoid auth-login rate limits). Reauth only on 401/403 from health-admin.
TOKEN_CURRENT="$(get_token || true)"
if [[ -z "${TOKEN_CURRENT}" ]]; then
  echo "ERROR: Failed to obtain admin token." >&2
  exit 1
fi

if [[ "${WATCH}" == true ]]; then
  if ! [[ "${INTERVAL_SECONDS}" =~ ^[0-9]+$ ]]; then
    echo "ERROR: --interval must be an integer number of seconds" >&2
    exit 2
  fi

  echo "health-admin --watch  baseUrl=${BASE_URL}  interval=${INTERVAL_SECONDS}s" >&2
  echo "endpoint: ${URL}" >&2

  FETCH_STATUS=""
  FETCH_CONTENT_TYPE=""
  first="$(fetch_json_with_reauth "${TOKEN_CURRENT}" || true)"
  TOKEN_CURRENT="${TOKEN_CURRENT:-${TOKEN_CURRENT}}"

  if [[ -z "${first}" ]]; then
    echo "ERROR: initial fetch failed (status=${FETCH_STATUS:-unknown} content-type=${FETCH_CONTENT_TYPE:-unknown})" >&2
    exit 1
  fi

  banner="$(printf '%s' "${first}" | watch_extract_banner || true)"
  if [[ -z "${banner}" ]]; then
    echo "ERROR: health-admin response did not contain postgres banner data (status=${FETCH_STATUS:-unknown} content-type=${FETCH_CONTENT_TYPE:-unknown})" >&2
    exit 1
  fi

  host="$(printf '%s\n' "${banner}" | sed -n '1p')"
  finger="$(printf '%s\n' "${banner}" | sed -n '2p')"

  echo "" >&2
  echo "pg.host   : ${host}" >&2
  echo "pg.finger : ${finger}" >&2
  echo "" >&2

  watch_print_header
  printf '%s' "${first}" | watch_print_line || true

  while true; do
    FETCH_STATUS=""
    FETCH_CONTENT_TYPE=""
    raw="$(fetch_json_with_reauth "${TOKEN_CURRENT}" || true)"
    TOKEN_CURRENT="${TOKEN_CURRENT:-${TOKEN_CURRENT}}"

    if [[ -z "${raw}" ]]; then
      ts="$(date +'%d-%m %H:%M:%S.000')"
      printf '%-16s %-6s %-6s %-5s %-5s %-7s\n' "${ts}" "-ms" "-ms" "-" "-" "-"
    else
      if ! printf '%s' "${raw}" | watch_print_line; then
        ts="$(date +'%d-%m %H:%M:%S.000')"
        printf '%-16s %-6s %-6s %-5s %-5s %-7s\n' "${ts}" "-ms" "-ms" "-" "-" "-"
      fi
    fi

    sleep "${INTERVAL_SECONDS}"
  done
fi

# Single-shot mode (token already acquired above)
FETCH_STATUS=""
FETCH_CONTENT_TYPE=""
raw="$(fetch_json_with_reauth "${TOKEN_CURRENT}" || true)"
TOKEN_CURRENT="${TOKEN_CURRENT:-${TOKEN_CURRENT}}"

if [[ -z "${raw}" ]]; then
  echo "ERROR: health-admin returned empty body (status=${FETCH_STATUS:-unknown}, content-type=${FETCH_CONTENT_TYPE:-unknown})" >&2
  exit 1
fi

if [[ "${JSON}" == true ]]; then
  printf '%s\n' "${raw}"
  exit 0
fi

if ! printf '%s' "${raw}" | print_human; then
  echo "" >&2
  echo "Diagnostics: status=${FETCH_STATUS:-unknown} content-type=${FETCH_CONTENT_TYPE:-unknown}" >&2
  exit 1
fi

echo ""
