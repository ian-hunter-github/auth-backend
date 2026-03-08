import type { ApiError } from "../api/apiClient";
import { IdentityClientError } from "../lib/identity-client";

export function toApiError(err: unknown): ApiError {
  if (err instanceof IdentityClientError) {
    return {
      status: err.status,
      code: err.code || "IDENTITY_CLIENT_ERROR",
      message: err.message,
      ...(err.details !== undefined ? { details: err.details } : {}),
      ...(err.requestId !== undefined ? { requestId: err.requestId } : {})
    };
  }

  if (err && typeof err === "object") {
    const maybe = err as Partial<ApiError>;
    if (typeof maybe.message === "string") {
      return {
        status: typeof maybe.status === "number" ? maybe.status : 0,
        code: typeof maybe.code === "string" ? maybe.code : "UNKNOWN_ERROR",
        message: maybe.message,
        ...(maybe.details !== undefined ? { details: maybe.details } : {}),
        ...(maybe.requestId !== undefined ? { requestId: maybe.requestId } : {})
      };
    }
  }

  return {
    status: 0,
    code: "UNKNOWN_ERROR",
    message: err instanceof Error ? err.message : String(err)
  };
}
