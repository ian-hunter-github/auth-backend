#!/usr/bin/env bash
set -euo pipefail

# check-gh-ci-status.sh
#
# Purpose:
#   Exit 0 if the most recent GitHub Actions run for the CI workflow on the given branch succeeded.
#   Exit non-zero otherwise.
#
# Usage:
#   ./scripts/check-gh-ci-status.sh
#   ./scripts/check-gh-ci-status.sh main
#
# Requirements:
#   - gh CLI authenticated (gh auth status)
#
# Notes:
#   Resolves the workflow by file path/name first, because display-name matching can be unreliable.

branch="${1:-}"

if ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: gh CLI not found. Install GitHub CLI and authenticate: gh auth login" >&2
  exit 2
fi

if command -v git >/dev/null 2>&1; then
  if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "ERROR: Not inside a git repository." >&2
    exit 2
  fi
fi

if [[ -z "$branch" ]]; then
  if command -v git >/dev/null 2>&1; then
    branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
  fi
fi
if [[ -z "$branch" ]]; then
  branch="main"
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "ERROR: gh is not authenticated. Run: gh auth login" >&2
  exit 2
fi

resolve_workflow_ref() {
  local candidate

  for candidate in ".github/workflows/ci.yml" "ci.yml" "CI"; do
    if gh run list --workflow "$candidate" --branch "$branch" --limit 1 >/dev/null 2>&1; then
      printf '%s\n' "$candidate"
      return 0
    fi
  done

  return 1
}

workflow_ref="$(resolve_workflow_ref || true)"

if [[ -z "$workflow_ref" ]]; then
  echo "ERROR: Could not resolve the CI workflow by .github/workflows/ci.yml, ci.yml, or CI." >&2
  exit 3
fi

status="$(gh run list --workflow "$workflow_ref" --branch "$branch" --limit 1 --json status --jq '.[0].status // empty' || true)"
conclusion="$(gh run list --workflow "$workflow_ref" --branch "$branch" --limit 1 --json conclusion --jq '.[0].conclusion // empty' || true)"
url="$(gh run list --workflow "$workflow_ref" --branch "$branch" --limit 1 --json url --jq '.[0].url // empty' || true)"
title="$(gh run list --workflow "$workflow_ref" --branch "$branch" --limit 1 --json displayTitle --jq '.[0].displayTitle // empty' || true)"

if [[ -z "$status" && -z "$conclusion" ]]; then
  echo "ERROR: No CI runs found for branch '$branch' (workflow: $workflow_ref)." >&2
  exit 4
fi

if [[ "$status" != "completed" ]]; then
  echo "CI is not completed yet on branch '$branch'."
  echo "  workflow:   $workflow_ref"
  echo "  status:     $status"
  echo "  conclusion: ${conclusion:-<none>}"
  echo "  title:      ${title:-<none>}"
  echo "  url:        ${url:-<none>}"
  exit 5
fi

if [[ "$conclusion" != "success" ]]; then
  echo "CI is completed but NOT successful on branch '$branch'."
  echo "  workflow:   $workflow_ref"
  echo "  status:     $status"
  echo "  conclusion: $conclusion"
  echo "  title:      ${title:-<none>}"
  echo "  url:        ${url:-<none>}"
  exit 6
fi

echo "CI is SUCCESS on branch '$branch'."
echo "  workflow: $workflow_ref"
echo "  title:    ${title:-<none>}"
echo "  url:      ${url:-<none>}"
exit 0
