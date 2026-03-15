#!/usr/bin/env bash
set -euo pipefail

echo "Creating platform security layer..."

mkdir -p src/platform/security

cat > src/platform/security/jwt.ts <<'EOF'
export * from "../../lib/jwt.js";
EOF

cat > src/platform/security/requestContext.ts <<'EOF'
export * from "../../security/requestContext.js";
EOF

cat > src/platform/security/rateLimiter.ts <<'EOF'
export * from "../../security/rateLimiter.js";
EOF

cat > src/platform/security/loginLockout.ts <<'EOF'
export * from "../../security/loginLockout.js";
EOF

cat > src/platform/security/index.ts <<'EOF'
export * from "./jwt.js";
export * from "./requestContext.js";
export * from "./rateLimiter.js";
export * from "./loginLockout.js";
EOF

echo
echo "Stage 3 Pass 1 complete"
echo "New structure:"
echo "  src/platform/security/"
echo
echo "Verification:"
echo "npm run lint"
echo "npm run typecheck"
echo "npm run test:run"
echo "./scripts/smoke-local.sh"
