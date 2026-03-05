#!/usr/bin/env bash
set -euo pipefail

# Fetch an admin access token from the auth service.
#
# Usage:
#   scripts/get-admin-token.sh [BASE_URL]
#
# Examples:
#   scripts/get-admin-token.sh
#   scripts/get-admin-token.sh http://localhost:3999
#
# Output:
#   Prints token and exports ADMIN_TOKEN for subshell usage.

ADMIN_USERNAME="${ADMIN_USERNAME:-admin}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-196900}"

default_base_url="$(node -e '
const fs=require("fs");
try{
  const s=JSON.parse(fs.readFileSync(".netlify/state.json","utf8"));
  if(s?.siteData?.url){process.stdout.write(s.siteData.url);process.exit(0);}
}catch{}
process.stdout.write("http://localhost:3999");
')"

BASE_URL="${1:-${BASE_URL:-$default_base_url}}"
BASE_URL="${BASE_URL%/}"

LOGIN_URL="${BASE_URL}/.netlify/functions/auth-login"

echo "Logging in as admin at ${BASE_URL}..." >&2

resp="$(curl -sS \
  -H "content-type: application/json" \
  -d "{\"username\":\"${ADMIN_USERNAME}\",\"password\":\"${ADMIN_PASSWORD}\"}" \
  "$LOGIN_URL")"

token="$(echo "$resp" | node -e '
const fs=require("fs");
const j=JSON.parse(fs.readFileSync(0,"utf8"));
const t=j?.data?.session?.accessToken;
if(!t){process.exit(1);}
process.stdout.write(t);
')"

if [[ -z "$token" ]]; then
  echo "ERROR: could not obtain admin token" >&2
  echo "$resp" >&2
  exit 1
fi

export ADMIN_TOKEN="$token"

echo ""
echo "ADMIN_TOKEN:"
echo "$ADMIN_TOKEN"
echo ""
echo "Example usage:"
echo "scripts/health-admin.sh \"\$ADMIN_TOKEN\" $BASE_URL"
