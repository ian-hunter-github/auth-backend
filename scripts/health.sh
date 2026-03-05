#!/usr/bin/env bash
set -euo pipefail

# Pretty-print the /health endpoint and optionally show a focused env summary.
#
# Usage:
#   scripts/health.sh [--debug] [--env-only] [BASE_URL]
#
# Examples:
#   scripts/health.sh
#   scripts/health.sh https://auth-backend-netlify.netlify.app
#   scripts/health.sh --env-only https://auth-backend-netlify.netlify.app
#   BASE_URL=http://localhost:3999 scripts/health.sh
#
# Notes:
# - Uses node (no jq dependency).
# - Expects the standard envelope: { ok, requestId, data: ... }

DEBUG=0
ENV_ONLY=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --debug)
      DEBUG=1
      shift
      ;;
    --env-only)
      ENV_ONLY=1
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
  echo "ERROR: curl is required" >&2
  exit 2
fi

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: node is required" >&2
  exit 2
fi

URL="${BASE_URL}/.netlify/functions/health"

if [[ "$DEBUG" -eq 1 ]]; then
  echo "[DEBUG] GET $URL" >&2
fi

raw="$(curl -sS "$URL")"

# Pretty-print full envelope (or env-only) using node.
if [[ "$ENV_ONLY" -eq 1 ]]; then
  echo "$raw" | node -e '
    const fs = require("fs");
    const raw = fs.readFileSync(0, "utf8").trim();
    let j;
    try { j = JSON.parse(raw); } catch (e) { console.error("ERROR: invalid JSON"); process.exit(1); }
    const data = j && typeof j === "object" ? (j.data ?? j) : null;
    const env = data && typeof data === "object" ? (data.env ?? (data.data ? data.data.env : undefined)) : undefined;

    if (!env) {
      console.log(JSON.stringify({ error: "missing env in response", haveKeys: data ? Object.keys(data) : [] }, null, 2));
      process.exit(0);
    }

    console.log(JSON.stringify(env, null, 2));
  '
  exit 0
fi

echo "$raw" | node -e '
  const fs = require("fs");
  const raw = fs.readFileSync(0, "utf8").trim();
  let j;
  try { j = JSON.parse(raw); } catch (e) { console.error("ERROR: invalid JSON"); process.exit(1); }
  console.log(JSON.stringify(j, null, 2));
'

# Add a concise human summary after JSON, without extra dependencies.
echo ""
echo "Summary:"
echo "$raw" | node -e '
  const fs = require("fs");
  const raw = fs.readFileSync(0, "utf8").trim();
  let j;
  try { j = JSON.parse(raw); } catch { process.exit(0); }

  const ok = j && typeof j === "object" ? j.ok : undefined;
  const rid = j && typeof j === "object" ? j.requestId : undefined;
  const data = j && typeof j === "object" ? j.data : undefined;

  function b(v) { return v ? "yes" : "no"; }

  const d = (data && typeof data === "object") ? data : {};
  const env = (d.env && typeof d.env === "object") ? d.env : {};
  const pg = (env.postgres && typeof env.postgres === "object") ? env.postgres : {};

  const authProvider = env.authProvider ?? "<unset>";
  const nodeVer = d.build && d.build.node ? d.build.node : "<unknown>";

  console.log(`  ok        : ${ok === true ? "true" : ok === false ? "false" : "<unknown>"}`);
  if (rid) console.log(`  requestId : ${rid}`);
  console.log(`  node      : ${nodeVer}`);
  console.log(`  provider  : ${authProvider}`);
  console.log(`  postgres  : host=${b(pg.hasHost)} db=${b(pg.hasDatabase)} user=${b(pg.hasUser)} pass=${b(pg.hasPassword)} port=${b(pg.hasPort)} sslmode=${b(pg.hasSslMode)}`);
'

