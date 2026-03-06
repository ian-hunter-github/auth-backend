#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export APP_ENV="${APP_ENV:-dev}"
# shellcheck disable=SC1091
source "$SCRIPT_DIR/load-env.sh"

ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "$ROOT_DIR"

NO_INSTALL=0
NO_LINT=0
NO_TYPECHECK=0
NO_TESTS=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-install)
      NO_INSTALL=1
      shift
      ;;
    --no-lint)
      NO_LINT=1
      shift
      ;;
    --no-typecheck)
      NO_TYPECHECK=1
      shift
      ;;
    --no-tests)
      NO_TESTS=1
      shift
      ;;
    *)
      echo "ERROR: unknown option: $1" >&2
      exit 2
      ;;
  esac
done

if [[ $NO_INSTALL -eq 0 ]]; then
  echo "==> npm ci"
  npm ci
fi

if [[ $NO_LINT -eq 0 ]]; then
  echo ""
  echo "==> npm run lint"
  npm run lint
fi

if [[ $NO_TYPECHECK -eq 0 ]]; then
  echo ""
  echo "==> npm run typecheck"
  npm run typecheck
fi

if [[ $NO_TESTS -eq 0 ]]; then
  echo ""
  echo "==> npm run test:run"

  # Default local CI parity should run the deterministic fake-provider suite.
  # Postgres-backed tests remain opt-in via explicit commands / env.
  export AUTH_PROVIDER=fake
  unset RUN_PG_TESTS || true

  npm run test:run
fi

echo ""
echo "OK: local CI checks passed."
