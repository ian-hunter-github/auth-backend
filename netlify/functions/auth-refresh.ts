import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/lib/requestId.js";
import { parseJsonBody } from "../../src/lib/body.js";
import { jsonOk, requireMethod, toErrorResponse } from "../../src/lib/response.js";
import type { AuthRefreshRequest } from "../../src/contracts/auth.js";
import { refresh } from "../../src/services/authService.js";

export const handler: Handler = async (event) => {
  const requestId = getOrCreateRequestId(event.headers || {});
  try {
    requireMethod(event.httpMethod, ["POST"]);
    const req = parseJsonBody<AuthRefreshRequest>(event.body);
    const data = await refresh(req);
    return jsonOk(200, requestId, data);
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};

