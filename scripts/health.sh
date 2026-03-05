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

if ! command -v curl >/dev/null 2>&1; then
  echo "ERROR: curl is required" >&2
  exit 2
fi

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: node is required" >&2
  exit 2
fi

default_base_url="$(node -e '
  const fs = require("fs");
  const path = ".netlify/state.json";
  try {
    const raw = fs.readFileSync(path, "utf8");
    const j = JSON.parse(raw);
    const url = j && j.siteData && typeof j.siteData.url === "string" ? j.siteData.url.trim() : "";
    if (url) { process.stdout.write(url); process.exit(0); }
  } catch {}
  process.stdout.write("http://localhost:3999");
')"

BASE_URL="${1:-${BASE_URL:-$default_base_url}}"
BASE_URL="${BASE_URL%/}"

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

    // Supabase intentionally omitted.
    const { supabase, ...rest } = env;
    console.log(JSON.stringify(rest, null, 2));
  '
  exit 0
fi

echo "$raw" | node -e '
  const fs = require("fs");
  const raw = fs.readFileSync(0, "utf8").trim();
  let j;
  try { j = JSON.parse(raw); } catch (e) { console.error("ERROR: invalid JSON"); process.exit(1); }

  console.log(JSON.stringify(j, null, 2));

  const data = j && typeof j === "object" ? (j.data ?? j) : null;
  const requestId = j && typeof j === "object" ? (j.requestId ?? undefined) : undefined;

  const h = data && typeof data === "object" ? data : {};
  const build = h.build && typeof h.build === "object" ? h.build : {};
  const env = h.env && typeof h.env === "object" ? h.env : {};

  const status = typeof h.status === "string" ? h.status : "unknown";
  const version = typeof h.version === "string" ? h.version : "unknown";
  const node = typeof build.node === "string" ? build.node : "unknown";
  const provider = typeof env.authProvider === "string" ? env.authProvider : "unknown";

  const pg = env.postgres && typeof env.postgres === "object" ? env.postgres : {};
  const yn = (v) => (v ? "yes" : "no");

  const pgHost = yn(!!pg.hasHost);
  const pgDb = yn(!!pg.hasDatabase);
  const pgUser = yn(!!pg.hasUser);
  const pgPass = yn(!!pg.hasPassword);
  const pgPort = yn(!!pg.hasPort);
  const pgSsl = yn(!!pg.hasSslMode);

  console.log("");
  console.log("Summary:");
  console.log(`  status    : ${status}`);
  console.log(`  version   : ${version}`);
  if (requestId) console.log(`  requestId : ${requestId}`);
  console.log(`  node      : ${node}`);
  console.log(`  provider  : ${provider}`);
  console.log(`  postgres  : host=${pgHost} db=${pgDb} user=${pgUser} pass=${pgPass} port=${pgPort} sslmode=${pgSsl}`);
'
