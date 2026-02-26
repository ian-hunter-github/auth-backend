#!/usr/bin/env bash
set -euo pipefail

# check-ci.sh
#
# Purpose:
#   Exit 0 if the most recent GitHub Actions run for the "CI" workflow on the given branch succeeded.
#   Exit non-zero otherwise.
#
# Usage:
#   ./check-ci.sh              # checks CI on current branch
#   ./check-ci.sh main         # checks CI on main
#
# Requirements:
#   - gh CLI authenticated (gh auth status)
#
# Notes:
#   Uses `gh --json ... --jq ...` (built into gh). Does NOT require jq installed.

branch="${1:-}"

if ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: gh CLI not found. Install GitHub CLI and authenticate: gh auth login" >&2
  exit 2
fi

# Ensure we're in a git repo (best effort)
if command -v git >/dev/null 2>&1; then
  if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "ERROR: Not inside a git repository." >&2
    exit 2
  fi
fi

# Default to current branch if none provided
if [[ -z "$branch" ]]; then
  if command -v git >/dev/null 2>&1; then
    branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
  fi
fi
if [[ -z "$branch" ]]; then
  branch="main"
fi

# Verify auth (non-fatal, but gives a nicer error)
if ! gh auth status >/dev/null 2>&1; then
  echo "ERROR: gh is not authenticated. Run: gh auth login" >&2
  exit 2
fi

# Fetch latest CI run for branch
# Fields available: status, conclusion, htmlUrl, headSha, createdAt, event, displayTitle
status="$(gh run list --workflow "CI" --branch "$branch" --limit 1 --json status --jq '.[0].status // empty' || true)"
conclusion="$(gh run list --workflow "CI" --branch "$branch" --limit 1 --json conclusion --jq '.[0].conclusion // empty' || true)"
url="$(gh run list --workflow "CI" --branch "$branch" --limit 1 --json url --jq '.[0].url // empty' || true)"
title="$(gh run list --workflow "CI" --branch "$branch" --limit 1 --json displayTitle --jq '.[0].displayTitle // empty' || true)"

if [[ -z "$status" && -z "$conclusion" ]]; then
  echo "ERROR: No CI runs found for branch '$branch' (workflow: CI)." >&2
  exit 3
fi

# `status` may be: queued, in_progress, completed
# `conclusion` may be: success, failure, cancelled, skipped, neutral, stale, timed_out, action_required
if [[ "$status" != "completed" ]]; then
  echo "CI is not completed yet on branch '$branch'."
  echo "  status:     $status"
  echo "  conclusion: ${conclusion:-<none>}"
  echo "  title:      ${title:-<none>}"
  echo "  url:        ${url:-<none>}"
  exit 4
fi

if [[ "$conclusion" != "success" ]]; then
  echo "CI is completed but NOT successful on branch '$branch'."
  echo "  status:     $status"
  echo "  conclusion: $conclusion"
  echo "  title:      ${title:-<none>}"
  echo "  url:        ${url:-<none>}"
  exit 5
fi

echo "CI is SUCCESS on branch '$branch'."
echo "  title: ${title:-<none>}"
echo "  url:   ${url:-<none>}"
exit 0
