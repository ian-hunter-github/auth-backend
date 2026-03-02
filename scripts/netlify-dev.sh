#!/usr/bin/env bash
set -euo pipefail

# netlify dev wrapper that retries once if Netlify CLI crashes while setting up
# the Edge Functions (Deno) environment.
#
# Usage:
#   scripts/netlify-dev.sh
#   scripts/netlify-dev.sh --port 4095 --staticServerPort 49000
#
# Optional env vars (only used if you don't pass flags yourself):
#   NETLIFY_PORT         (default: 3999)
#   NETLIFY_STATIC_PORT  (default: 49000)

if ! command -v netlify >/dev/null 2>&1; then
  echo "ERROR: netlify CLI not found in PATH" >&2
  exit 2
fi

NETLIFY_PORT="${NETLIFY_PORT:-3999}"
NETLIFY_STATIC_PORT="${NETLIFY_STATIC_PORT:-49000}"

# If the caller didn't provide explicit port args, add our defaults.
args=("$@")
has_port=0
has_static_port=0
for a in "${args[@]}"; do
  if [[ "$a" == "--port" || "$a" == "--port="* ]]; then
    has_port=1
  fi
  if [[ "$a" == "--staticServerPort" || "$a" == "--staticServerPort="* ]]; then
    has_static_port=1
  fi
done

if [[ "$has_port" -eq 0 ]]; then
  args+=("--port" "$NETLIFY_PORT")
fi

if [[ "$has_static_port" -eq 0 ]]; then
  args+=("--staticServerPort" "$NETLIFY_STATIC_PORT")
fi

deno_cache_dir="${HOME}/.config/netlify/deno-cli"

should_retry_log() {
  local log_file="$1"

  # Common Netlify CLI messages when Deno/Edge setup fails.
  if grep -q "There was a problem setting up the Edge Functions environment" "$log_file"; then
    return 0
  fi
  if grep -q "Failed to set up Deno for Edge Functions" "$log_file"; then
    return 0
  fi
  if grep -q "spawn ETXTBSY" "$log_file"; then
    return 0
  fi

  return 1
}

run_once() {
  local log_file="$1"

  # Run netlify dev, mirror output to terminal, and capture to log file.
  # (We must disable pipefail temporarily to read netlify's exit code rather than tee's.)
  set +o pipefail
  set +e
  netlify dev "${args[@]}" 2>&1 | tee "$log_file"
  local status="${PIPESTATUS[0]}"
  set -e
  set -o pipefail

  return "$status"
}

attempt=1
max_attempts=2

while [[ "$attempt" -le "$max_attempts" ]]; do
  log_file="$(mktemp -t netlify-dev.XXXXXX.log)"

  echo "Starting netlify dev (attempt ${attempt}/${max_attempts}). Log: ${log_file}" >&2
  if run_once "$log_file"; then
    rm -f "$log_file" >/dev/null 2>&1 || true
    exit 0
  fi

  status=$?

  # If user hit Ctrl-C, don't retry.
  if [[ "$status" -eq 130 ]]; then
    echo "Interrupted (Ctrl-C). Log: ${log_file}" >&2
    exit 130
  fi

  if [[ "$attempt" -lt "$max_attempts" ]] && should_retry_log "$log_file"; then
    echo "Netlify dev failed during Edge/Deno setup. Clearing cache and retrying..." >&2
    rm -rf "$deno_cache_dir" >/dev/null 2>&1 || true
    attempt=$((attempt + 1))
    continue
  fi

  echo "ERROR: netlify dev failed (exit ${status}). Log: ${log_file}" >&2
  exit "$status"
done

exit 1
