import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/platform/http/requestId.js";
import { jsonCorsPreflight, jsonOk, requireMethod, toErrorResponse } from "../../src/platform/http/response.js";
import { getBearerToken } from "../../src/lib/authHeader.js";
import { getHealthAdmin } from "../../src/services/healthAdminService.js";

export const handler: Handler = async (event) => {
  const requestId = getOrCreateRequestId(event.headers || {});
  try {
    if ((event.httpMethod || "").toUpperCase() === "OPTIONS") {
      return jsonCorsPreflight(requestId);
    }

    requireMethod(event.httpMethod, ["GET"]);

    const token = getBearerToken(event.headers || {});
    const data = await getHealthAdmin(token);

    return jsonOk(200, requestId, data);
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};
