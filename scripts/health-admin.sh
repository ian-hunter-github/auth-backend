#!/usr/bin/env bash
set -euo pipefail

# Admin health check
# Automatically obtains an admin access token via scripts/get-admin-token.sh, then calls health-admin.
#
# Usage:
#   scripts/health-admin.sh [BASE_URL]
#
# Examples:
#   scripts/health-admin.sh
#   scripts/health-admin.sh https://auth-backend-netlify.netlify.app
#
# If BASE_URL is omitted it is auto-detected from .netlify/state.json by scripts/get-admin-token.sh.

if ! command -v curl >/dev/null 2>&1; then
  echo "ERROR: curl required" >&2
  exit 2
fi

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: node required" >&2
  exit 2
fi

if [[ ! -x scripts/get-admin-token.sh ]]; then
  echo "ERROR: scripts/get-admin-token.sh not found or not executable" >&2
  exit 2
fi

BASE_URL="${1:-${BASE_URL:-}}"
BASE_URL="${BASE_URL%/}"

# get-admin-token.sh prints a small human-friendly block. Extract the token line reliably.
token_output="$(
  if [[ -n "${BASE_URL}" ]]; then
    scripts/get-admin-token.sh "${BASE_URL}"
  else
    scripts/get-admin-token.sh
  fi
)"

TOKEN="$(
  printf '%s\n' "$token_output" | awk '
    BEGIN{found=0}
    /^ADMIN_TOKEN:$/ {found=1; next}
    found==1 && $0 ~ /./ {print; exit}
  '
)"

if [[ -z "${TOKEN}" ]]; then
  echo "ERROR: could not extract ADMIN_TOKEN from scripts/get-admin-token.sh output" >&2
  echo "$token_output" >&2
  exit 1
fi

default_base_url="$(node -e '
const fs=require("fs");
try{
  const s=JSON.parse(fs.readFileSync(".netlify/state.json","utf8"));
  if(s?.siteData?.url){process.stdout.write(String(s.siteData.url).trim());process.exit(0);}
}catch{}
process.stdout.write("http://localhost:3999");
')"

if [[ -z "${BASE_URL}" ]]; then
  BASE_URL="${default_base_url}"
fi
BASE_URL="${BASE_URL%/}"

URL="${BASE_URL}/.netlify/functions/health-admin"

echo "Calling admin health at ${BASE_URL}..." >&2

raw="$(curl -sS \
  -H "Authorization: Bearer ${TOKEN}" \
  "$URL")"

echo "$raw" | node -e '
const fs=require("fs");
const raw=fs.readFileSync(0,"utf8").trim();
let j;
try{ j=JSON.parse(raw); }
catch{ console.error("ERROR: invalid JSON"); process.exit(1); }

console.log(JSON.stringify(j,null,2));

const pg=j?.data?.envValues?.postgres;
if(pg){
  console.log("");
  console.log("Postgres config:");
  console.log("  host             :", pg.host ?? "<unset>");
  console.log("  database         :", pg.database ?? "<unset>");
  console.log("  user             :", pg.user ?? "<unset>");
  console.log("  port             :", pg.port ?? "<unset>");
  console.log("  sslMode          :", pg.sslMode ?? "<unset>");
  console.log("  passwordSet      :", pg.passwordSet);
  console.log("  configFingerprint:", pg.configFingerprint);
}
'
