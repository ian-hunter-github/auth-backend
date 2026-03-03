#!/usr/bin/env bash
set -euo pipefail

DRY_RUN=0
SITE_ARG=""
# Comma-separated for user convenience; script will pass them to netlify CLI as separate args.
CONTEXTS_CSV="production,deploy-preview,branch-deploy"
FILES=(".env.production" "postgres/env/neon/.env")

DO_DEPLOY=0
DEPLOY_MODE="prod"      # prod|preview
DEPLOY_NO_BUILD=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --site)
      SITE_ARG="${2:-}"
      if [[ -z "$SITE_ARG" ]]; then
        echo "ERROR: --site requires a value" >&2
        exit 2
      fi
      shift 2
      ;;
    --contexts)
      CONTEXTS_CSV="${2:-}"
      if [[ -z "$CONTEXTS_CSV" ]]; then
        echo "ERROR: --contexts requires a value" >&2
        exit 2
      fi
      shift 2
      ;;
    --file)
      f="${2:-}"
      if [[ -z "$f" ]]; then
        echo "ERROR: --file requires a value" >&2
        exit 2
      fi
      FILES+=("$f")
      shift 2
      ;;
    --deploy)
      DO_DEPLOY=1
      DEPLOY_MODE="prod"
      shift
      ;;
    --deploy-preview)
      DO_DEPLOY=1
      DEPLOY_MODE="preview"
      shift
      ;;
    --no-build)
      DEPLOY_NO_BUILD=1
      shift
      ;;
    -*)
      echo "ERROR: unknown option: $1" >&2
      exit 2
      ;;
    *)
      echo "ERROR: unexpected argument: $1" >&2
      exit 2
      ;;
  esac
done

if ! command -v netlify >/dev/null 2>&1; then
  echo "ERROR: netlify CLI not found in PATH" >&2
  exit 2
fi

# Build optional site flag
SITE_FLAGS=()
if [[ -n "$SITE_ARG" ]]; then
  SITE_FLAGS=(--site "$SITE_ARG")
fi

# Split contexts CSV into args for `--context` which expects SPACE-separated contexts.
# e.g. --context production deploy-preview branch-deploy
IFS=',' read -r -a CONTEXTS_ARR <<<"$CONTEXTS_CSV"
CONTEXT_ARGS=()
for c in "${CONTEXTS_ARR[@]}"; do
  c_trimmed="$(printf '%s' "$c" | awk '{$1=$1;print}')"
  if [[ -n "$c_trimmed" ]]; then
    CONTEXT_ARGS+=("$c_trimmed")
  fi
done
if [[ "${#CONTEXT_ARGS[@]}" -eq 0 ]]; then
  echo "ERROR: no contexts parsed from --contexts '$CONTEXTS_CSV'" >&2
  exit 2
fi

# Basic sanity: ensure at least one file exists
any_exists=0
for f in "${FILES[@]}"; do
  if [[ -f "$f" ]]; then
    any_exists=1
    break
  fi
done
if [[ "$any_exists" -ne 1 ]]; then
  echo "ERROR: none of the env files exist:" >&2
  for f in "${FILES[@]}"; do
    echo "  - $f" >&2
  done
  exit 2
fi

# Parse KEY=VALUE lines from files, last one wins on duplicates.
parse_env_files() {
  awk '
    function ltrim(s) { sub(/^[ \t\r\n]+/, "", s); return s }
    function rtrim(s) { sub(/[ \t\r\n]+$/, "", s); return s }
    function trim(s) { return rtrim(ltrim(s)); }

    {
      line=$0
      line=trim(line)
      if (line == "") next
      if (substr(line,1,1) == "#") next

      if (substr(line,1,7) == "export ") {
        line=substr(line,8)
        line=trim(line)
      }

      eq = index(line, "=")
      if (eq <= 1) next

      key = substr(line, 1, eq-1)
      val = substr(line, eq+1)

      key = trim(key)
      if (key !~ /^[A-Za-z_][A-Za-z0-9_]*$/) next

      sub(/\r$/, "", val)

      keys[key] = val
      order[++n] = key
    }
    END {
      for (i=1; i<=n; i++) lastIdx[order[i]] = i
      for (i=1; i<=n; i++) {
        k = order[i]
        if (lastIdx[k] == i) {
          printf "%s%c%s%c", k, 0, keys[k], 0
        }
      }
    }
  ' "${FILES[@]}"
}

declare -A KV=()
while IFS= read -r -d '' k; do
  IFS= read -r -d '' v || true
  if [[ -z "$k" ]]; then
    continue
  fi
  KV["$k"]="$v"
done < <(parse_env_files)

if [[ "${#KV[@]}" -eq 0 ]]; then
  echo "ERROR: no env vars found to sync" >&2
  exit 2
fi

# Denylist (optional)
DENY_KEYS=(
)

is_denied() {
  local k="$1"
  for dk in "${DENY_KEYS[@]}"; do
    if [[ "$k" == "$dk" ]]; then
      return 0
    fi
  done
  return 1
}

is_secret_key() {
  local k="$1"
  case "$k" in
    AUTH_JWT_SECRET|PGPASSWORD)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

echo "Netlify env sync"
echo "  contexts : ${CONTEXT_ARGS[*]}"
if [[ -n "$SITE_ARG" ]]; then
  echo "  site     : $SITE_ARG"
else
  echo "  site     : (linked site)"
fi
echo "  files    :"
for f in "${FILES[@]}"; do
  if [[ -f "$f" ]]; then
    echo "    - $f"
  else
    echo "    - $f (missing; skipped)"
  fi
done
echo ""

apply_one() {
  local k="$1"
  local v="$2"

  if is_denied "$k"; then
    echo "SKIP (deny): $k"
    return 0
  fi

  local extra_flags=()
  if is_secret_key "$k"; then
    extra_flags+=(--secret)
  fi

  if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "DRY-RUN: set $k (value hidden) ${extra_flags[*]}"
    return 0
  fi

  # IMPORTANT:
  # - Use --force to bypass overwrite prompts (prevents hangs)
  # - Pass contexts as separate args (netlify expects space-separated)
  netlify env:set "$k" "$v" \
    --force \
    --context "${CONTEXT_ARGS[@]}" \
    "${extra_flags[@]}" \
    "${SITE_FLAGS[@]}" >/dev/null

  echo "SET: $k"
}

mapfile -t KEYS < <(printf '%s\n' "${!KV[@]}" | LC_ALL=C sort)
for k in "${KEYS[@]}"; do
  apply_one "$k" "${KV[$k]}"
done

echo ""
if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "Dry-run complete. No changes made."
  exit 0
fi

echo "Sync complete."

if [[ "$DO_DEPLOY" -ne 1 ]]; then
  echo "Next: trigger a deploy so the new env vars are guaranteed to be live."
  echo "  - netlify deploy --prod"
  exit 0
fi

DEPLOY_ARGS=()
if [[ "$DEPLOY_NO_BUILD" -eq 1 ]]; then
  DEPLOY_ARGS+=(--no-build)
fi

echo ""
if [[ "$DEPLOY_MODE" == "preview" ]]; then
  echo "Triggering Netlify deploy (preview)..."
  netlify deploy "${DEPLOY_ARGS[@]}" "${SITE_FLAGS[@]}"
else
  echo "Triggering Netlify deploy (production)..."
  netlify deploy --prod "${DEPLOY_ARGS[@]}" "${SITE_FLAGS[@]}"
fi

