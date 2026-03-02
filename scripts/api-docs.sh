#!/usr/bin/env bash
set -euo pipefail

# Generate API documentation from openapi.yaml:
# - Markdown: docs/api.md
# - HTML:     docs/api.html
#
# Installs required dev dependencies if missing:
#   - widdershins
#   - @redocly/cli

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f "openapi.yaml" ]]; then
  echo "ERROR: openapi.yaml not found in project root" >&2
  exit 2
fi

mkdir -p docs/generated

need_install=0
if [[ ! -x "node_modules/.bin/widdershins" ]]; then
  need_install=1
fi
if [[ ! -x "node_modules/.bin/redocly" ]]; then
  need_install=1
fi

if [[ "$need_install" -eq 1 ]]; then
  npm install --save-dev widdershins @redocly/cli
fi

npx widdershins openapi.yaml -o docs/api.md
npx redocly build-docs openapi.yaml --output docs/api.html

echo "OK: generated docs/api.md"
echo "OK: generated docs/api.html"
