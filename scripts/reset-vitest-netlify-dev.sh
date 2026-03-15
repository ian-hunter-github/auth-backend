#!/usr/bin/env bash
set -euo pipefail

if [ -f .vitest-netlify-dev.json ]; then
  pid="$(python3 - <<'PY'
import json
from pathlib import Path
p = Path('.vitest-netlify-dev.json')
try:
    data = json.loads(p.read_text(encoding='utf-8'))
    print(data.get('pid', ''))
except Exception:
    print('')
PY
)"
  if [ -n "${pid:-}" ] && kill -0 "$pid" 2>/dev/null; then
    kill -TERM "-$pid" 2>/dev/null || kill -TERM "$pid" 2>/dev/null || true
    sleep 1
    kill -KILL "-$pid" 2>/dev/null || kill -KILL "$pid" 2>/dev/null || true
  fi
fi

pkill -f "netlify dev" 2>/dev/null || true
pkill -f "scripts/netlify-dev.sh" 2>/dev/null || true
rm -f .vitest-netlify-dev.json

echo "Reset local vitest/netlify dev harness state."
