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

export function jsonOk<T>(statusCode: number, requestId: string, data: T): HandlerResponse {
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
