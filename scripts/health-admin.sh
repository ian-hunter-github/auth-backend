#!/usr/bin/env bash
set -euo pipefail

# Calls the authenticated health-admin endpoint and prints observability metrics.
# Usage: ./scripts/health-admin.sh [BASE_URL]
# Example: ./scripts/health-admin.sh https://auth-backend-netlify.netlify.app

BASE_URL="${1:-${BASE_URL:-}}"
if [[ -z "${BASE_URL}" ]]; then
  echo "Usage: $0 [BASE_URL]" >&2
  echo "Or set BASE_URL env var." >&2
  exit 2
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOKEN="$("${SCRIPT_DIR}/get-admin-token.sh" "${BASE_URL}")"

if [[ -z "${TOKEN}" ]]; then
  echo "ERROR: Failed to obtain admin token." >&2
  exit 1
fi

curl -sS \
  -H "authorization: Bearer ${TOKEN}" \
  "${BASE_URL}/.netlify/functions/health-admin"

echo
