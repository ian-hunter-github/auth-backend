#!/usr/bin/env bash
set -euo pipefail

# Local CI parity check.
#
# Runs the same steps CI should run, using a clean install to surface issues early.
#
# Usage:
#   ./scripts/check-ci-local.sh
#   ./scripts/check-ci-local.sh --no-install
#   ./scripts/check-ci-local.sh --no-tests
#   ./scripts/check-ci-local.sh --no-typecheck
#   ./scripts/check-ci-local.sh --no-lint
#
# Notes:
# - Default uses `npm ci` for parity with CI.
# - If you want faster iteration after you've already installed deps, use --no-install.

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

step() {
  local msg="$1"
  echo ""
  echo "==> $msg"
}

if [[ "$NO_INSTALL" -ne 1 ]]; then
  step "npm ci"
  npm ci
else
  step "skip install (--no-install)"
fi

if [[ "$NO_LINT" -ne 1 ]]; then
  step "npm run lint"
  npm run lint
else
  step "skip lint (--no-lint)"
fi

if [[ "$NO_TYPECHECK" -ne 1 ]]; then
  step "npm run typecheck"
  npm run typecheck
else
  step "skip typecheck (--no-typecheck)"
fi

if [[ "$NO_TESTS" -ne 1 ]]; then
  step "npm run test:run"
  npm run test:run
else
  step "skip tests (--no-tests)"
fi

echo ""
echo "OK: local CI checks passed."
