#!/usr/bin/env bash
set -euo pipefail

PRINT_ONLY=0
LEN_BYTES=32

while [[ $# -gt 0 ]]; do
  case "$1" in
    --print)
      PRINT_ONLY=1
      shift
      ;;
    --len-bytes)
      LEN_BYTES="${2:-}"
      if [[ -z "$LEN_BYTES" ]]; then
        echo "ERROR: --len-bytes requires a value" >&2
        exit 2
      fi
      shift 2
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

if ! command -v openssl >/dev/null 2>&1; then
  echo "ERROR: openssl is required" >&2
  exit 2
fi

# Generate hex secret
SECRET="$(openssl rand -hex "$LEN_BYTES")"

if [[ "$PRINT_ONLY" -eq 1 ]]; then
  echo "$SECRET"
  exit 0
fi

update_env_file() {
  local path="$1"
  local key="AUTH_JWT_SECRET"

  if [[ ! -f "$path" ]]; then
    # Create file with a trailing newline.
    printf '%s=%s\n' "$key" "$SECRET" > "$path"
    echo "Wrote $path"
    return 0
  fi

  # If key exists, replace; else append.
  if grep -qE "^${key}=" "$path"; then
    # Portable in-place edit using temp file.
    local tmp
    tmp="$(mktemp)"
    awk -v k="$key" -v v="$SECRET" '
      BEGIN { updated=0 }
      $0 ~ "^" k "=" {
        print k "=" v
        updated=1
        next
      }
      { print }
      END {
        if (updated == 0) {
          print k "=" v
        }
      }
    ' "$path" > "$tmp"

    # Ensure file ends with newline (awk does, but keep explicit).
    # shellcheck disable=SC2002
    cat "$tmp" > "$path"
    rm -f "$tmp"
  else
    # Append with a preceding newline only if file doesn't already end with one.
    if [[ -s "$path" ]]; then
      lastchar="$(tail -c 1 "$path" || true)"
      if [[ "$lastchar" != "" && "$lastchar" != $'\n' ]]; then
        printf '\n' >> "$path"
      fi
    fi
    printf '%s=%s\n' "$key" "$SECRET" >> "$path"
  fi

  echo "Updated $path"
}

update_env_file ".env.local"
update_env_file ".env.production"

echo ""
echo "New AUTH_JWT_SECRET (hex, ${LEN_BYTES} bytes):"
echo "$SECRET"
echo ""
echo "Next:"
echo "  - Update Netlify: netlify env:set AUTH_JWT_SECRET \"$SECRET\" --context production,deploy-preview"
echo "  - Redeploy"
