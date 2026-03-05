import type { HandlerResponse } from "@netlify/functions";
import { AppError, isAppError } from "./errors.js";
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

function jsonOk<T>(statusCode: number, requestId: string, data: T): HandlerResponse {
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

  const headers = { ...(res.headers || {}) };
  if (retryAfterSeconds !== undefined) {
    headers["retry-after"] = String(retryAfterSeconds);
  }

  return { ...res, headers };
}

export function toErrorResponse(requestId: string, err: unknown): HandlerResponse {
  if (isAppError(err)) {
    return jsonError(err.status, requestId, err.code, err.message, err.details);
  }

  const msg = err instanceof Error ? err.message : "Unknown error";
  return jsonError(500, requestId, "INTERNAL_ERROR", msg);
}

export function requireMethod(actual: string | undefined, allowed: string[]) {
  const m = (actual || "").toUpperCase();
  if (!allowed.includes(m)) {
    throw new AppError(`Method ${m || "UNKNOWN"} not allowed`, {
      code: "BAD_REQUEST",
      status: 405,
      details: { allowed }
    });
  }
}

export { jsonOk };
