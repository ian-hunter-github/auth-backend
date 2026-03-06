#!/usr/bin/env bash
set -euo pipefail

echo "==> Creating environment directory structure"

mkdir -p environment/dev/db
mkdir -p environment/dev/server
mkdir -p environment/prod/db
mkdir -p environment/prod/server

SOURCE_DB_ENV="postgres/env/neon/.env"
DEV_DB_ENV="environment/dev/db/.env"
DEV_SERVER_ENV="environment/dev/server/.env"
PROD_DB_ENV="environment/prod/db/.env"
PROD_SERVER_ENV="environment/prod/server/.env"

echo "==> Creating DEV database env"

if [ -f "$DEV_DB_ENV" ]; then
  echo "    exists: $DEV_DB_ENV (skipping)"
else
  if [ -f "$SOURCE_DB_ENV" ]; then
    echo "    copying from $SOURCE_DB_ENV"

    cp "$SOURCE_DB_ENV" "$DEV_DB_ENV"

    cat >> "$DEV_DB_ENV" <<'EOF'

# ---- Generic DB variables (technology agnostic) ----
DB_DIALECT=postgres
DB_HOST=${PGHOST}
DB_PORT=${PGPORT}
DB_NAME=${PGDATABASE}
DB_USER=${PGUSER}
DB_PASSWORD=${PGPASSWORD}
DB_SSLMODE=${PGSSLMODE}

DB_LABEL=IansProject-dev
EOF

  else
    echo "ERROR: starter env not found: $SOURCE_DB_ENV"
    exit 1
  fi
fi


echo "==> Creating DEV server env"

if [ -f "$DEV_SERVER_ENV" ]; then
  echo "    exists: $DEV_SERVER_ENV (skipping)"
else
  cat > "$DEV_SERVER_ENV" <<'EOF'
APP_ENV=dev

AUTH_PROVIDER=postgres

# JWT secret for development only
AUTH_JWT_SECRET=dev-secret-change-me

# Demo client / API
API_BASE_URL=http://localhost:8888

SERVER_LABEL=dev-server
EOF
fi


echo "==> Creating PROD database env (template)"

if [ -f "$PROD_DB_ENV" ]; then
  echo "    exists: $PROD_DB_ENV (skipping)"
else
  cat > "$PROD_DB_ENV" <<'EOF'
# Production database configuration
# Fill these when production DB is created

DB_DIALECT=postgres

PGHOST=
PGPORT=5432
PGDATABASE=neondb
PGUSER=
PGPASSWORD=
PGSSLMODE=require

# Generic DB variables
DB_HOST=${PGHOST}
DB_PORT=${PGPORT}
DB_NAME=${PGDATABASE}
DB_USER=${PGUSER}
DB_PASSWORD=${PGPASSWORD}
DB_SSLMODE=${PGSSLMODE}

DB_LABEL=IansProject-prod
EOF
fi


echo "==> Creating PROD server env"

if [ -f "$PROD_SERVER_ENV" ]; then
  echo "    exists: $PROD_SERVER_ENV (skipping)"
else
  cat > "$PROD_SERVER_ENV" <<'EOF'
APP_ENV=prod

AUTH_PROVIDER=postgres

# Replace before real production
AUTH_JWT_SECRET=replace-before-production

SERVER_LABEL=prod-server
EOF
fi


echo
echo "Environment layout created:"
echo
tree environment || true
echo
echo "Next step suggestion:"
echo "Add environment/**/.env to .gitignore to avoid committing secrets."
