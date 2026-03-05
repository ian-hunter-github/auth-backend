#!/usr/bin/env bash
set -euo pipefail

# Runs the demo client dev server (Vite) from the repo root.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR/demo-client"

if [[ ! -f "package.json" ]]; then
  echo "ERROR: demo-client/package.json not found" >&2
  exit 2
fi

if [[ ! -d "node_modules" ]]; then
  echo "Installing demo-client dependencies..."
  npm install
fi

npm run dev
