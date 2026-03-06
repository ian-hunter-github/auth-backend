#!/usr/bin/env bash
set -euo pipefail

# Optional Postgres-backed local test entry point.
# This keeps DB-backed tests explicit and separate from the default fake-provider local CI run.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export APP_ENV="${APP_ENV:-dev}"
# shellcheck disable=SC1091
source "$SCRIPT_DIR/load-env.sh"

ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "$ROOT_DIR"

echo "==> npm run test:run (Postgres mode)"
export AUTH_PROVIDER=postgres
export RUN_PG_TESTS=1
npm run test:run
