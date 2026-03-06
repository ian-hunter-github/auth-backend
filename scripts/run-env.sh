#!/usr/bin/env bash
set -euo pipefail

APP_ENV="${1:-dev}"
shift || true

export APP_ENV

source "$(dirname "$0")/load-env.sh"

exec "$@"
