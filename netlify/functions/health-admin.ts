import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/lib/requestId.js";
import { getBearerToken } from "../../src/lib/authHeader.js";
import { jsonOk, requireMethod, toErrorResponse } from "../../src/lib/response.js";
import { getHealthAdmin } from "../../src/services/healthAdminService.js";

export const handler: Handler = async (event) => {
  const requestId = getOrCreateRequestId(event.headers || {});
  try {
    requireMethod(event.httpMethod, ["GET"]);

    const token = getBearerToken(event.headers || {});
    const data = await getHealthAdmin(token);

    return jsonOk(200, requestId, data);
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};

