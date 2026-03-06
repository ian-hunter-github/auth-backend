#!/usr/bin/env bash
set -euo pipefail

APP_ENV="${1:-dev}"
if [[ $# -gt 0 ]]; then
  shift
fi

if [[ $# -eq 0 ]]; then
  echo "ERROR: usage: ./scripts/run-env.sh <env> <command> [args...]" >&2
  exit 2
fi

export APP_ENV

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$SCRIPT_DIR/load-env.sh"

exec "$@"
