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
