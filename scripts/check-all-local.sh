#!/usr/bin/env bash
set -euo pipefail

# Canonical local refactor gate for Stage 0.
# Intentionally composes existing project scripts rather than replacing them.
# This keeps behavior aligned with the current repository while giving a single
# entry point for local verification during the refactor.
#
# Usage:
#   ./scripts/check-all-local.sh
#   ./scripts/check-all-local.sh --skip-install
#   ./scripts/check-all-local.sh --skip-smoke
#   ./scripts/check-all-local.sh --smoke-only
#
# Notes:
# - Lint, typecheck, and tests are delegated to scripts/check-ci-local.sh.
# - Smoke is delegated to scripts/smoke-local.sh.
# - Postgres-backed tests remain separate via scripts/check-pg-local.sh.
# - Demo GUI remains a manual verification gate for now.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "$ROOT_DIR"

SKIP_INSTALL=0
SKIP_SMOKE=0
SMOKE_ONLY=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-install)
      SKIP_INSTALL=1
      shift
      ;;
    --skip-smoke)
      SKIP_SMOKE=1
      shift
      ;;
    --smoke-only)
      SMOKE_ONLY=1
      shift
      ;;
    -h|--help)
      cat <<'HELP'
Usage:
  ./scripts/check-all-local.sh [options]

Options:
  --skip-install   Pass --no-install to scripts/check-ci-local.sh
  --skip-smoke     Skip scripts/smoke-local.sh
  --smoke-only     Run smoke only
  -h, --help       Show this help
HELP
      exit 0
      ;;
    *)
      echo "ERROR: unknown option: $1" >&2
      exit 2
      ;;
  esac
done

step() {
  echo
  echo "==> $1"
}

if [[ "$SMOKE_ONLY" -ne 1 ]]; then
  CI_ARGS=()
  if [[ "$SKIP_INSTALL" -eq 1 ]]; then
    CI_ARGS+=(--no-install)
  fi

  step "Local CI parity checks"
  ./scripts/check-ci-local.sh "${CI_ARGS[@]}"
fi

if [[ "$SKIP_SMOKE" -ne 1 ]]; then
  step "Local smoke checks"
  ./scripts/smoke-local.sh
else
  step "Skipping local smoke (--skip-smoke)"
fi

echo
cat <<'DONE'
Stage gate reminder:
- lint/typecheck/tests completed via scripts/check-ci-local.sh
- smoke completed via scripts/smoke-local.sh
- Postgres-backed tests remain optional via scripts/check-pg-local.sh
- demo GUI check remains manual
- GitHub CI / Netlify preview remain remote gates
DONE
