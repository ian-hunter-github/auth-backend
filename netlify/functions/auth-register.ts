import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/lib/requestId.js";
import { parseJsonBody } from "../../src/lib/body.js";
import { jsonOk, requireMethod, toErrorResponse } from "../../src/lib/response.js";
import type { AuthRegisterRequest } from "../../src/contracts/auth.js";
import { register } from "../../src/services/authService.js";

export const handler: Handler = async (event) => {
  const requestId = getOrCreateRequestId(event.headers || {});
  try {
    requireMethod(event.httpMethod, ["POST"]);
    const req = parseJsonBody<AuthRegisterRequest>(event.body);
    const data = await register(req);
    return jsonOk(201, requestId, data);
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};

