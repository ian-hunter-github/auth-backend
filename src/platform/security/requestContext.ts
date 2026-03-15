import type { HandlerEvent } from "@netlify/functions";

export interface RequestContext {
  requestId: string;
  ip: string;
  userAgent: string;
  route: string;
  method: string;
}

export function buildRequestContext(event: HandlerEvent, requestId: string): RequestContext {
  const headers = event.headers || {};
  const xfwd = headers["x-forwarded-for"] || headers["x-nf-client-connection-ip"] || "";
  const first = typeof xfwd === "string" && xfwd.length > 0 ? xfwd.split(",")[0] : undefined;
  const ip = first ? first.trim() : "unknown";
  const ua = headers["user-agent"] || headers["User-Agent"] || "";
  return {
    requestId,
    ip: typeof ip === "string" ? ip : "unknown",
    userAgent: typeof ua === "string" ? ua : "",
    route: event.path || "",
    method: event.httpMethod || "",
  };
}
