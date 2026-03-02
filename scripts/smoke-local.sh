#!/usr/bin/env bash
set -euo pipefail

# Robust local smoke runner:
# - Starts `netlify dev` on an available high port
# - Waits for readiness (with timeout) by probing the Functions endpoint(s)
# - Retries once if Netlify CLI crashes during Edge Functions (Deno) setup (ETXTBSY)
# - Runs scripts/smoke-api.sh against it
# - Shuts down netlify dev cleanly (even on failure)
#
# Usage:
#   scripts/smoke-local.sh
#
# Optional env vars:
#   NETLIFY_PORT_MIN (default: 4095)
#   NETLIFY_PORT_MAX (default: 4195)
#   STATIC_PORT_MIN  (default: 49000)
#   STATIC_PORT_MAX  (default: 49100)
#   READY_TIMEOUT_S  (default: 240)
#   READY_STABLE_N   (default: 3)   # number of consecutive successful probes
#   READY_SLEEP_S    (default: 0.35)
#
# Also supports any env vars accepted by scripts/smoke-api.sh:
#   USERNAME, PASSWORD

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

NETLIFY_PORT_MIN="${NETLIFY_PORT_MIN:-4095}"
NETLIFY_PORT_MAX="${NETLIFY_PORT_MAX:-4195}"
STATIC_PORT_MIN="${STATIC_PORT_MIN:-49000}"
STATIC_PORT_MAX="${STATIC_PORT_MAX:-49100}"
READY_TIMEOUT_S="${READY_TIMEOUT_S:-240}"
READY_STABLE_N="${READY_STABLE_N:-3}"
READY_SLEEP_S="${READY_SLEEP_S:-1.0}"

if ! command -v netlify >/dev/null 2>&1; then
  echo "ERROR: netlify CLI not found in PATH" >&2
  exit 2
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "ERROR: curl is required" >&2
  exit 2
fi

if [[ ! -x "scripts/smoke-api.sh" ]]; then
  echo "ERROR: scripts/smoke-api.sh not found or not executable" >&2
  exit 2
fi

is_port_free() {
  local port="$1"
  if (echo >/dev/tcp/127.0.0.1/"$port") >/dev/null 2>&1; then
    return 1
  fi
  return 0
}

find_free_port() {
  local min="$1"
  local max="$2"
  local p
  p="$min"
  while [[ "$p" -le "$max" ]]; do
    if is_port_free "$p"; then
      echo "$p"
      return 0
    fi
    p=$((p + 1))
  done
  return 1
}

NETLIFY_PORT="$(find_free_port "$NETLIFY_PORT_MIN" "$NETLIFY_PORT_MAX" || true)"
if [[ -z "$NETLIFY_PORT" ]]; then
  echo "ERROR: could not find a free netlify port in range ${NETLIFY_PORT_MIN}-${NETLIFY_PORT_MAX}" >&2
  exit 2
fi

STATIC_PORT="$(find_free_port "$STATIC_PORT_MIN" "$STATIC_PORT_MAX" || true)"
if [[ -z "$STATIC_PORT" ]]; then
  echo "ERROR: could not find a free static server port in range ${STATIC_PORT_MIN}-${STATIC_PORT_MAX}" >&2
  exit 2
fi

BASE_URL="http://localhost:${NETLIFY_PORT}"

LOG_FILE=""
NETLIFY_PID=""

stop_netlify() {
  if [[ -n "${NETLIFY_PID:-}" ]]; then
    echo "Stopping netlify dev (pid=${NETLIFY_PID})"
    kill -TERM -"${NETLIFY_PID}" >/dev/null 2>&1 || true

    local i=0
    while kill -0 "${NETLIFY_PID}" >/dev/null 2>&1; do
      i=$((i + 1))
      if [[ "$i" -ge 40 ]]; then
        kill -KILL -"${NETLIFY_PID}" >/dev/null 2>&1 || true
        break
      fi
      sleep 0.2
    done
  fi
  NETLIFY_PID=""
}

cleanup() {
  local code=$?
  stop_netlify

  if [[ "$code" -ne 0 ]]; then
    if [[ -n "${LOG_FILE:-}" && -f "${LOG_FILE:-}" ]]; then
      echo "Smoke-local failed (exit ${code}). netlify dev log: ${LOG_FILE}" >&2
      tail -n 300 "$LOG_FILE" >&2 || true
    else
      echo "Smoke-local failed (exit ${code})." >&2
    fi
  else
    if [[ -n "${LOG_FILE:-}" && -f "${LOG_FILE:-}" ]]; then
      rm -f "$LOG_FILE" >/dev/null 2>&1 || true
    fi
  fi

  exit "$code"
}
trap cleanup EXIT INT TERM

probe_functions() {
  # Returns 0 when we consider Netlify Dev "ready enough" for tests:
  # - We get a non-000 http_code from a functions route
  # - And we get READY_STABLE_N consecutive non-000 responses
  #
  # We probe /health first (if exists), then /auth-login.
  local stable=0
  local deadline=$(( $(date +%s) + READY_TIMEOUT_S ))

  while [[ "$(date +%s)" -lt "$deadline" ]]; do
    if [[ -n "${NETLIFY_PID:-}" ]] && ! kill -0 "$NETLIFY_PID" >/dev/null 2>&1; then
      return 3
    fi

    # Probe candidates (any response code other than 000 indicates a listener).
    local code
    code="$(curl -sS -o /dev/null -w "%{http_code}" "${BASE_URL}/.netlify/functions/health" || true)"
    if [[ "$code" == "404" || "$code" == "405" ]]; then
      code="$(curl -sS -o /dev/null -w "%{http_code}" "${BASE_URL}/.netlify/functions/auth-login" || true)"
    fi

    # 000 = connect failure
    if [[ "$code" != "000" && "$code" != "" ]]; then
      stable=$((stable + 1))
      if [[ "$stable" -ge "$READY_STABLE_N" ]]; then
        return 0
      fi
    else
      stable=0
    fi

    sleep "$READY_SLEEP_S"
  done

  return 1
}

deno_cache_dir() {
  # As per Netlify CLI error messaging, it uses ~/.config/netlify/deno-cli
  echo "${HOME}/.config/netlify/deno-cli"
}

log_has_deno_etxtbsy() {
  [[ -n "${LOG_FILE:-}" && -f "${LOG_FILE:-}" ]] || return 1
  if grep -q "Failed to set up Deno for Edge Functions" "$LOG_FILE" && grep -q "ETXTBSY" "$LOG_FILE"; then
    return 0
  fi
  return 1
}

start_netlify() {
  LOG_FILE="$(mktemp -t netlify-dev-smoke.XXXXXX.log)"

  echo "Starting netlify dev on port ${NETLIFY_PORT} (static: ${STATIC_PORT})"
  # Start in a new session so we can kill the process group reliably.
  setsid netlify dev --port "${NETLIFY_PORT}" --staticServerPort "${STATIC_PORT}" >"$LOG_FILE" 2>&1 &
  NETLIFY_PID="$!"
}

# We retry once if Netlify CLI crashes during Edge Functions (Deno) setup.
attempt=1
max_attempts=2

while [[ "$attempt" -le "$max_attempts" ]]; do
  start_netlify

  if probe_functions; then
    # If we got stable probes, do one last quick sanity request to auth-login with an OPTIONS call
    # to reduce chances of an "empty reply" race.
    curl -sS -o /dev/null -X OPTIONS "${BASE_URL}/.netlify/functions/auth-login" >/dev/null 2>&1 || true

    echo "Netlify dev ready: ${BASE_URL}"
    echo "Running smoke-api.sh"
    BASE_URL="$BASE_URL" scripts/smoke-api.sh
    exit 0
  fi

  # Not ready. Check if netlify died and whether it was the Deno ETXTBSY crash.
  if log_has_deno_etxtbsy; then
    echo "Detected Netlify CLI Deno (Edge Functions) ETXTBSY crash. Clearing cache and retrying..." >&2
    stop_netlify
    rm -rf "$(deno_cache_dir)" >/dev/null 2>&1 || true
    attempt=$((attempt + 1))
    continue
  fi

  # If netlify exited for some other reason, fail (cleanup handler will print logs).
  if [[ -n "${NETLIFY_PID:-}" ]] && ! kill -0 "$NETLIFY_PID" >/dev/null 2>&1; then
    exit 1
  fi

  # Timed out waiting for readiness; no retry unless Deno ETXTBSY specifically detected.
  exit 1
done

exit 1
