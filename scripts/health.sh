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

  const env = j && j.data && j.data.env ? j.data.env : undefined;
  const requestId = j && typeof j === "object" ? (j.requestId ?? "<none>") : "<none>";
  const ok = j && typeof j === "object" ? (j.ok ?? "<unknown>") : "<unknown>";

  const authProvider = env && env.authProvider ? env.authProvider : "<unset>";
  const pg = env && env.postgres ? env.postgres : {};
  const nodeVer = j && j.data && j.data.build && j.data.build.node ? j.data.build.node : "<unknown>";

  const yesno = (b) => (b ? "yes" : "no");
  console.log("");
  console.log("Summary:");
  console.log(`  ok        : ${ok}`);
  console.log(`  requestId : ${requestId}`);
  console.log(`  node      : ${nodeVer}`);
  console.log(`  provider  : ${authProvider}`);
  console.log(
    `  postgres  : host=${yesno(pg.hasHost)} db=${yesno(pg.hasDatabase)} user=${yesno(pg.hasUser)} pass=${yesno(pg.hasPassword)} port=${yesno(pg.hasPort)} sslmode=${yesno(pg.hasSslMode)}`
  );
'
