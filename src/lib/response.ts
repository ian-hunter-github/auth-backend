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

function jsonOk<T>(statusCode: number, requestId: string, data: T): HandlerResponse {
  const body: SuccessEnvelope<T> = { ok: true, requestId, data };
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      [REQUEST_ID_HEADER]: requestId
    },
    body: JSON.stringify(body)
  };
}

export function jsonNoContent(statusCode: number, requestId: string): HandlerResponse {
  return {
    statusCode,
    headers: {
      [REQUEST_ID_HEADER]: requestId
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
      "content-type": "application/json; charset=utf-8",
      [REQUEST_ID_HEADER]: requestId
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
  const res = jsonError(429, requestId, "RATE_LIMITED", "Too many requests", details);

  const headers = res.headers || {};
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
