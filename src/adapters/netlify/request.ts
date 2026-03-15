import type { HandlerEvent } from "@netlify/functions";
import type { AppHttpMethod, AppHttpRequest } from "../../app/http/types.js";
import { getOrCreateRequestId } from "../../platform/http/requestId.js";

function normalizeMethod(method: string | undefined): AppHttpMethod {
  const upper = (method || "GET").toUpperCase();
  switch (upper) {
    case "GET":
    case "POST":
    case "PUT":
    case "PATCH":
    case "DELETE":
    case "OPTIONS":
    case "HEAD":
      return upper;
    default:
      return "GET";
  }
}

export function fromNetlifyEvent(event: HandlerEvent): AppHttpRequest {
  const headers = event.headers || {};
  const requestId = getOrCreateRequestId(headers);
  const ip = headers["client-ip"] ?? headers["x-forwarded-for"];
  const userAgent = headers["user-agent"];

  return {
    method: normalizeMethod(event.httpMethod),
    path: event.path || "/",
    headers,
    query: event.queryStringParameters || {},
    body: event.body,
    requestId,
    ...(typeof ip === "string" ? { ip } : {}),
    ...(typeof userAgent === "string" ? { userAgent } : {})
  };
}
