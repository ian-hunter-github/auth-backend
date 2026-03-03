#!/usr/bin/env bash
set -euo pipefail

# Rotate JWT secret, sync Netlify env vars, deploy, then run remote smoke.
#
# Usage:
#   ./scripts/release-prod.sh
#   ./scripts/release-prod.sh --site <site-name-or-id>
#   ./scripts/release-prod.sh --base-url https://<site>.netlify.app
#   ./scripts/release-prod.sh --no-build
#   ./scripts/release-prod.sh --skip-rotate
#   ./scripts/release-prod.sh --skip-smoke
#   ./scripts/release-prod.sh --dry-run
#
# Notes:
# - Uses hex secret rotation (default 32 bytes) via scripts/rotate-jwt-secret.sh.
# - Syncs env vars from .env.production and postgres/env/neon/.env via scripts/netlify-env-sync.sh.
# - Triggers a production deploy unless --dry-run.
# - Runs scripts/smoke-api.sh against BASE_URL unless --skip-smoke.

SITE_ARG=""
BASE_URL=""
NO_BUILD=0
SKIP_ROTATE=0
SKIP_SMOKE=0
DRY_RUN=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --site)
      SITE_ARG="${2:-}"
      if [[ -z "$SITE_ARG" ]]; then
        echo "ERROR: --site requires a value" >&2
        exit 2
      fi
      shift 2
      ;;
    --base-url)
      BASE_URL="${2:-}"
      if [[ -z "$BASE_URL" ]]; then
        echo "ERROR: --base-url requires a value" >&2
        exit 2
      fi
      shift 2
      ;;
    --no-build)
      NO_BUILD=1
      shift
      ;;
    --skip-rotate)
      SKIP_ROTATE=1
      shift
      ;;
    --skip-smoke)
      SKIP_SMOKE=1
      shift
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    -*)
      echo "ERROR: unknown option: $1" >&2
      exit 2
      ;;
    *)
      echo "ERROR: unexpected argument: $1" >&2
      exit 2
      ;;
  esac
done

if [[ ! -x scripts/netlify-env-sync.sh ]]; then
  echo "ERROR: missing scripts/netlify-env-sync.sh" >&2
  exit 2
fi
if [[ ! -x scripts/rotate-jwt-secret.sh ]]; then
  echo "ERROR: missing scripts/rotate-jwt-secret.sh" >&2
  exit 2
fi
if [[ ! -x scripts/smoke-api.sh ]]; then
  echo "ERROR: missing scripts/smoke-api.sh" >&2
  exit 2
fi

if [[ "$SKIP_ROTATE" -ne 1 ]]; then
  echo "1) Rotate AUTH_JWT_SECRET (hex) into .env.local and .env.production"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "DRY-RUN: would rotate secret (no file changes)"
  else
    ./scripts/rotate-jwt-secret.sh
  fi
else
  echo "1) Rotate AUTH_JWT_SECRET: skipped"
fi

echo ""
echo "2) Sync env vars to Netlify and deploy production"

SYNC_ARGS=()
if [[ -n "$SITE_ARG" ]]; then
  SYNC_ARGS+=(--site "$SITE_ARG")
fi

if [[ "$DRY_RUN" -eq 1 ]]; then
  SYNC_ARGS+=(--dry-run)
else
  SYNC_ARGS+=(--deploy)
fi

if [[ "$NO_BUILD" -eq 1 ]]; then
  SYNC_ARGS+=(--no-build)
fi

./scripts/netlify-env-sync.sh "${SYNC_ARGS[@]}"

if [[ "$DRY_RUN" -eq 1 ]]; then
  echo ""
  echo "DRY-RUN complete."
  exit 0
fi

if [[ "$SKIP_SMOKE" -eq 1 ]]; then
  echo ""
  echo "3) Remote smoke: skipped"
  exit 0
fi

# Determine BASE_URL if not provided.
if [[ -z "$BASE_URL" ]]; then
  if command -v netlify >/dev/null 2>&1; then
    # Prefer explicit site arg if provided, otherwise linked site.
    # netlify status prints "Site URL" line.
    if [[ -n "$SITE_ARG" ]]; then
      BASE_URL="$(netlify status --site "$SITE_ARG" 2>/dev/null | awk -F': ' '/Site URL:/ {print $2; exit}')"
    else
      BASE_URL="$(netlify status 2>/dev/null | awk -F': ' '/Site URL:/ {print $2; exit}')"
    fi
  fi
fi

if [[ -z "$BASE_URL" ]]; then
  echo "ERROR: unable to determine BASE_URL. Provide --base-url https://<site>.netlify.app" >&2
  exit 2
fi

BASE_URL="${BASE_URL%/}"

echo ""
echo "3) Remote smoke against $BASE_URL"
BASE_URL="$BASE_URL" ./scripts/smoke-api.sh --debug

echo ""
echo "Release complete."

