#!/usr/bin/env bash
set -euo pipefail

# Phase 5.6 helper:
# - run local CI parity checks
# - optionally push current branch
# - poll GitHub CI until success/failure
# - optionally verify deployed /health after CI succeeds
#
# Usage:
#   ./scripts/verify-ci-flow.sh
#   ./scripts/verify-ci-flow.sh --push
#   ./scripts/verify-ci-flow.sh --branch main --push --base-url https://auth-backend-netlify.netlify.app
#   ./scripts/verify-ci-flow.sh --skip-local
#   ./scripts/verify-ci-flow.sh --skip-local --wait-only
#
# Notes:
# - Default branch is the current git branch.
# - Uses existing scripts/check-ci-local.sh and scripts/check-gh-ci-status.sh.
# - If a CI run is not yet visible, the script will keep polling until timeout.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "$ROOT_DIR"

RUN_LOCAL=1
DO_PUSH=0
WAIT_FOR_CI=1
HEALTH_BASE_URL=""
TIMEOUT_SECONDS=900
INTERVAL_SECONDS=10
BRANCH=""

usage() {
  cat <<'USAGE'
Usage:
  ./scripts/verify-ci-flow.sh [options]

Options:
  --branch <name>         Branch to use (default: current branch)
  --push                  Push current branch before polling GitHub CI
  --skip-local            Skip local CI parity checks
  --wait-only             Do not run local checks; just wait/poll GitHub CI
  --base-url <url>        After CI success, run scripts/health.sh against this URL
  --timeout-seconds <n>   Max wait for CI visibility/completion (default: 900)
  --interval-seconds <n>  Poll interval in seconds (default: 10)
  -h, --help              Show this help

Examples:
  ./scripts/verify-ci-flow.sh
  ./scripts/verify-ci-flow.sh --push
  ./scripts/verify-ci-flow.sh --branch main --push --base-url https://auth-backend-netlify.netlify.app
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --branch)
      BRANCH="${2:-}"
      if [[ -z "$BRANCH" ]]; then
        echo "ERROR: --branch requires a value" >&2
        exit 2
      fi
      shift 2
      ;;
    --push)
      DO_PUSH=1
      shift
      ;;
    --skip-local)
      RUN_LOCAL=0
      shift
      ;;
    --wait-only)
      RUN_LOCAL=0
      WAIT_FOR_CI=1
      shift
      ;;
    --base-url)
      HEALTH_BASE_URL="${2:-}"
      if [[ -z "$HEALTH_BASE_URL" ]]; then
        echo "ERROR: --base-url requires a value" >&2
        exit 2
      fi
      shift 2
      ;;
    --timeout-seconds)
      TIMEOUT_SECONDS="${2:-}"
      if [[ -z "$TIMEOUT_SECONDS" ]]; then
        echo "ERROR: --timeout-seconds requires a value" >&2
        exit 2
      fi
      shift 2
      ;;
    --interval-seconds)
      INTERVAL_SECONDS="${2:-}"
      if [[ -z "$INTERVAL_SECONDS" ]]; then
        echo "ERROR: --interval-seconds requires a value" >&2
        exit 2
      fi
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "ERROR: unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if ! command -v git >/dev/null 2>&1; then
  echo "ERROR: git is required" >&2
  exit 2
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "ERROR: not inside a git repository" >&2
  exit 2
fi

if [[ -z "$BRANCH" ]]; then
  BRANCH="$(git rev-parse --abbrev-ref HEAD)"
fi

if [[ "$BRANCH" == "HEAD" || -z "$BRANCH" ]]; then
  echo "ERROR: could not determine current branch" >&2
  exit 2
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: gh CLI not found. Install GitHub CLI and authenticate: gh auth login" >&2
  exit 2
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "ERROR: gh is not authenticated. Run: gh auth login" >&2
  exit 2
fi

if [[ ! -x "$SCRIPT_DIR/check-ci-local.sh" ]]; then
  echo "ERROR: missing scripts/check-ci-local.sh" >&2
  exit 2
fi

if [[ ! -x "$SCRIPT_DIR/check-gh-ci-status.sh" ]]; then
  echo "ERROR: missing scripts/check-gh-ci-status.sh" >&2
  exit 2
fi

if [[ -n "$HEALTH_BASE_URL" && ! -x "$SCRIPT_DIR/health.sh" ]]; then
  echo "ERROR: missing scripts/health.sh" >&2
  exit 2
fi

step() {
  echo ""
  echo "==> $1"
}

if [[ "$RUN_LOCAL" -eq 1 ]]; then
  step "Running local CI parity checks on branch '$BRANCH'"
  "$SCRIPT_DIR/check-ci-local.sh"
else
  step "Skipping local CI parity checks"
fi

if [[ "$DO_PUSH" -eq 1 ]]; then
  step "Pushing current HEAD to origin/$BRANCH"
  git push origin "$BRANCH"
else
  step "Not pushing branch (use --push to automate push)"
fi

if [[ "$WAIT_FOR_CI" -ne 1 ]]; then
  echo ""
  echo "OK: local phase complete. Next manual step: ./scripts/check-gh-ci-status.sh $BRANCH"
  exit 0
fi

step "Polling GitHub CI for branch '$BRANCH'"

start_epoch="$(date +%s)"
deadline=$((start_epoch + TIMEOUT_SECONDS))

while true; do
  now="$(date +%s)"
  if (( now > deadline )); then
    echo "ERROR: Timed out waiting for GitHub CI on branch '$BRANCH' after ${TIMEOUT_SECONDS}s." >&2
    exit 7
  fi

  set +e
  output="$("$SCRIPT_DIR/check-gh-ci-status.sh" "$BRANCH" 2>&1)"
  rc=$?
  set -e

  case "$rc" in
    0)
      echo "$output"

      if [[ -n "$HEALTH_BASE_URL" ]]; then
        step "Verifying deployed health endpoint"
        "$SCRIPT_DIR/health.sh" "$HEALTH_BASE_URL"
      fi

      echo ""
      echo "OK: CI flow verified for branch '$BRANCH'."
      exit 0
      ;;
    4|5)
      echo "$output"
      echo "Waiting ${INTERVAL_SECONDS}s before re-checking..."
      sleep "$INTERVAL_SECONDS"
      ;;
    6)
      echo "$output" >&2
      exit 6
      ;;
    *)
      echo "$output" >&2
      exit "$rc"
      ;;
  esac
done
