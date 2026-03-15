#!/usr/bin/env bash
set -euo pipefail

mkdir -p \
  src/platform/http \
  src/platform/config \
  src/platform/errors

cat > src/platform/errors/apiError.ts <<'EOF'
export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly status: number;
  public readonly details?: unknown;

  constructor(message: string, opts: { code: ErrorCode; status: number; details?: unknown }) {
    super(message);
    this.name = "AppError";
    this.code = opts.code;
    this.status = opts.status;
    this.details = opts.details;
  }
}

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}
EOF

cat > src/platform/config/env.ts <<'EOF'
import { AppError } from "../errors/apiError.js";

export function getEnv(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim().length > 0 ? v : undefined;
}

export function requireEnv(name: string): string {
  const v = getEnv(name);
  if (!v) {
    throw new AppError(`Missing required environment variable: ${name}`, {
      code: "INTERNAL_ERROR",
      status: 500,
      details: { name }
    });
  }
  return v;
}
EOF

cat > src/platform/http/body.ts <<'EOF'
import { AppError } from "../errors/apiError.js";

export function parseJsonBody<T>(raw: string | null | undefined): T {
  if (!raw || raw.trim().length === 0) {
    throw new AppError("Missing JSON body", { code: "BAD_REQUEST", status: 400 });
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new AppError("Invalid JSON body", { code: "BAD_REQUEST", status: 400 });
  }
}
EOF

cat > src/platform/http/requestId.ts <<'EOF'
import crypto from "node:crypto";

export const REQUEST_ID_HEADER = "x-request-id";
export const CORRELATION_ID_HEADER = "x-correlation-id";

export function getOrCreateRequestId(headers: Record<string, string | undefined>) {
  const existing =
    headers[REQUEST_ID_HEADER] ||
    headers[REQUEST_ID_HEADER.toLowerCase()] ||
    headers[CORRELATION_ID_HEADER] ||
    headers[CORRELATION_ID_HEADER.toLowerCase()];

  return existing && existing.trim().length > 0 ? existing : crypto.randomUUID();
}
EOF

cat > src/platform/http/response.ts <<'EOF'
import type { HandlerResponse } from "@netlify/functions";
import { AppError, isAppError } from "../errors/apiError.js";
import { REQUEST_ID_HEADER } from "./requestId.js";

export type SuccessEnvelope<T> = {
  ok: true;
  requestId: string;
  data: T;
};

export type ErrorEnvelope = {
  ok: false;
  requestId: string;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

function baseHeaders(requestId: string): Record<string, string> {
  return {
    [REQUEST_ID_HEADER]: requestId,
    "cache-control": "no-store",
    pragma: "no-cache",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "no-referrer",
    "content-security-policy": "default-src 'none'",
    "permissions-policy": "geolocation=(), microphone=(), camera=()",
    "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "access-control-allow-headers": "authorization, content-type, x-request-id, x-correlation-id",
    "access-control-expose-headers": "x-request-id, retry-after",
    "access-control-max-age": "86400"
  };
}

export function jsonOk<T>(statusCode: number, requestId: string, data: T): HandlerResponse {
  const body: SuccessEnvelope<T> = { ok: true, requestId, data };
  return {
    statusCode,
    headers: {
      ...baseHeaders(requestId),
      "content-type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(body)
  };
}

export function jsonNoContent(statusCode: number, requestId: string): HandlerResponse {
  return {
    statusCode,
    headers: {
      ...baseHeaders(requestId)
    },
    body: ""
  };
}

export function jsonCorsPreflight(requestId: string): HandlerResponse {
  return {
    statusCode: 204,
    headers: {
      ...baseHeaders(requestId)
    },
    body: ""
  };
}

export function jsonError(
  statusCode: number,
  requestId: string,
  code: string,
  message: string,
  details?: unknown
): HandlerResponse {
  const body: ErrorEnvelope = {
    ok: false,
    requestId,
    error: {
      code,
      message,
      ...(details === undefined ? {} : { details })
    }
  };
  return {
    statusCode,
    headers: {
      ...baseHeaders(requestId),
      "content-type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(body)
  };
}

export function jsonBadRequest(requestId: string, message: string, details?: unknown): HandlerResponse {
  return jsonError(400, requestId, "BAD_REQUEST", message, details);
}

export function jsonMethodNotAllowed(requestId: string, details?: unknown): HandlerResponse {
  return jsonError(405, requestId, "BAD_REQUEST", "Method not allowed", details);
}

export function jsonTooManyRequests(requestId: string, retryAfterSeconds?: number): HandlerResponse {
  const details = retryAfterSeconds === undefined ? undefined : { retryAfterSeconds };
  const res = jsonError(429, requestId, "RATE_LIMITED", "Too many attempts. Try again later.", details);
  if (retryAfterSeconds !== undefined) {
    res.headers = {
      ...(res.headers ?? {}),
      "retry-after": String(retryAfterSeconds)
    };
  }
  return res;
}

export function toErrorResponse(requestId: string, err: unknown): HandlerResponse {
  if (isAppError(err)) {
    return jsonError(err.status, requestId, err.code, err.message, err.details);
  }
  return jsonError(500, requestId, "INTERNAL_ERROR", "Internal server error");
}

export function requireMethod(method: string | undefined, allowed: string[]): void {
  const upper = (method || "").toUpperCase();
  if (!allowed.includes(upper)) {
    throw new AppError("Method not allowed", {
      code: "BAD_REQUEST",
      status: 405,
      details: { allowed }
    });
  }
}
EOF

cat > src/platform/http/index.ts <<'EOF'
export * from "./body.js";
export * from "./requestId.js";
export * from "./response.js";
EOF

cat > src/platform/config/index.ts <<'EOF'
export * from "./env.js";
EOF

cat > src/platform/errors/index.ts <<'EOF'
export * from "./apiError.js";
EOF

cat > src/platform/index.ts <<'EOF'
export * from "./http/index.js";
export * from "./config/index.js";
export * from "./errors/index.js";
EOF

cat > src/lib/body.ts <<'EOF'
export * from "../platform/http/body.js";
EOF

cat > src/lib/env.ts <<'EOF'
export * from "../platform/config/env.js";
EOF

cat > src/lib/errors.ts <<'EOF'
export * from "../platform/errors/apiError.js";
EOF

cat > src/lib/requestId.ts <<'EOF'
export * from "../platform/http/requestId.js";
EOF

cat > src/lib/response.ts <<'EOF'
export * from "../platform/http/response.js";
EOF

echo "Stage 2A corrective rewrite applied."
echo "Now run:"
echo "  npm run lint"
echo "  npm run typecheck"
echo "  npm run test:run"
echo "  ./scripts/smoke-local.sh"

