import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/lib/requestId.js";
import { jsonOk, requireMethod, toErrorResponse } from "../../src/lib/response.js";
import { getBearerToken } from "../../src/lib/authHeader.js";
import { getMe } from "../../src/services/meService.js";

export const handler: Handler = async (event) => {
  const requestId = getOrCreateRequestId(event.headers || {});
  try {
    requireMethod(event.httpMethod, ["GET"]);
    const token = getBearerToken(event.headers || {});
    const data = await getMe(token);
    return jsonOk(200, requestId, data);
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};
