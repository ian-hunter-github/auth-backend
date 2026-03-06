#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PACKAGE_JSON="$ROOT_DIR/package.json"
PROJECT_STATUS_JSON="$ROOT_DIR/project-status.json"
OUT_FILE="$ROOT_DIR/src/generated/buildInfo.ts"

if [[ ! -f "$PACKAGE_JSON" ]]; then
  echo "ERROR: package.json not found" >&2
  exit 2
fi

if [[ ! -f "$PROJECT_STATUS_JSON" ]]; then
  echo "ERROR: project-status.json not found" >&2
  exit 2
fi

version="$(python3 - <<'PY'
import json
from pathlib import Path
pkg = json.loads(Path("package.json").read_text())
print(pkg.get("version", "0.0.0"))
PY
)"

project_name="$(python3 - <<'PY'
import json
from pathlib import Path
pkg = json.loads(Path("package.json").read_text())
print(pkg.get("name", "identity-backend-service"))
PY
)"

readarray -t status_fields < <(python3 - <<'PY'
import json
from pathlib import Path
data = json.loads(Path("project-status.json").read_text())
print(data.get("workPackage", ""))
print(data.get("phase", ""))
print(data.get("step", ""))
print(data.get("description", ""))
PY
)

work_package="${status_fields[0]:-}"
phase="${status_fields[1]:-}"
step="${status_fields[2]:-}"
description="${status_fields[3]:-}"

sha="${GITHUB_SHA:-${NETLIFY_COMMIT_REF:-${COMMIT_REF:-}}}"
if [[ -z "$sha" ]] && command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  sha="$(git rev-parse HEAD 2>/dev/null || true)"
fi

short_sha=""
if [[ -n "$sha" ]]; then
  short_sha="${sha:0:7}"
fi

build_time="${BUILD_TIME:-}"
if [[ -z "$build_time" ]]; then
  build_time="$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")"
fi

build_id="${GITHUB_RUN_ID:-${BUILD_ID:-${DEPLOY_ID:-}}}"

branch="${GITHUB_REF_NAME:-${BRANCH:-${HEAD:-}}}"
if [[ -z "$branch" ]] && command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
fi

app_env="${APP_ENV:-${CONTEXT:-}}"

export BUILDINFO_PROJECT_NAME="$project_name"
export BUILDINFO_VERSION="$version"
export BUILDINFO_BUILD_TIME="$build_time"
export BUILDINFO_SHA="$sha"
export BUILDINFO_SHORT_SHA="$short_sha"
export BUILDINFO_BUILD_ID="$build_id"
export BUILDINFO_BRANCH="$branch"
export BUILDINFO_APP_ENV="$app_env"
export BUILDINFO_WORK_PACKAGE="$work_package"
export BUILDINFO_PHASE="$phase"
export BUILDINFO_STEP="$step"
export BUILDINFO_DESCRIPTION="$description"

python3 - <<'PY'
import json
import os
from pathlib import Path

def ts_optional_str(name: str, value: str) -> str:
    if value:
        return f"  {name}: {json.dumps(value)},\n"
    return ""

def ts_optional_num(name: str, value: str) -> str:
    if value:
        try:
            num = int(value)
        except ValueError:
            return f"  {name}: {json.dumps(value)},\n"
        return f"  {name}: {num},\n"
    return ""

project_name = os.environ["BUILDINFO_PROJECT_NAME"]
version = os.environ["BUILDINFO_VERSION"]
build_time = os.environ["BUILDINFO_BUILD_TIME"]
sha = os.environ.get("BUILDINFO_SHA", "")
short_sha = os.environ.get("BUILDINFO_SHORT_SHA", "")
build_id = os.environ.get("BUILDINFO_BUILD_ID", "")
branch = os.environ.get("BUILDINFO_BRANCH", "")
app_env = os.environ.get("BUILDINFO_APP_ENV", "")
work_package = os.environ.get("BUILDINFO_WORK_PACKAGE", "")
phase = os.environ.get("BUILDINFO_PHASE", "")
step = os.environ.get("BUILDINFO_STEP", "")
description = os.environ.get("BUILDINFO_DESCRIPTION", "")

content = (
    "export type GeneratedBuildInfo = {\n"
    "  projectName: string;\n"
    "  version: string;\n"
    "  buildTime: string;\n"
    "  sha?: string;\n"
    "  shortSha?: string;\n"
    "  buildId?: string;\n"
    "  branch?: string;\n"
    "  appEnv?: string;\n"
    "  workPackage?: string;\n"
    "  phase?: number | string;\n"
    "  step?: string;\n"
    "  description?: string;\n"
    "};\n\n"
    "export const GENERATED_BUILD_INFO: GeneratedBuildInfo = {\n"
    f"  projectName: {json.dumps(project_name)},\n"
    f"  version: {json.dumps(version)},\n"
    f"  buildTime: {json.dumps(build_time)},\n"
    f"{ts_optional_str('sha', sha)}"
    f"{ts_optional_str('shortSha', short_sha)}"
    f"{ts_optional_str('buildId', build_id)}"
    f"{ts_optional_str('branch', branch)}"
    f"{ts_optional_str('appEnv', app_env)}"
    f"{ts_optional_str('workPackage', work_package)}"
    f"{ts_optional_num('phase', phase)}"
    f"{ts_optional_str('step', step)}"
    f"{ts_optional_str('description', description)}"
    "};\n"
)

Path("src/generated/buildInfo.ts").write_text(content)
PY

echo "OK: wrote $OUT_FILE"
