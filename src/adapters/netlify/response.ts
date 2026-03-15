import type { HandlerResponse } from "@netlify/functions";
import type { AppHttpResponse } from "../../app/http/types.js";

export function toNetlifyResponse(response: AppHttpResponse): HandlerResponse {
  return {
    statusCode: response.statusCode,
    ...(response.headers ? { headers: response.headers } : {}),
    body: response.body
  };
}
