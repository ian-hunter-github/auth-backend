import type { Handler, HandlerEvent } from "@netlify/functions";
import type { AppHttpHandler } from "../../app/http/types.js";
import { fromNetlifyEvent } from "./request.js";
import { toNetlifyResponse } from "./response.js";

export function createNetlifyHandler(handler: AppHttpHandler): Handler {
  return async (event: HandlerEvent) => {
    const request = fromNetlifyEvent(event);
    const response = await handler(request);
    return toNetlifyResponse(response);
  };
}
