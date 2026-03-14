import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/lib/requestId.js";
import { jsonCorsPreflight, jsonOk, requireMethod, toErrorResponse } from "../../src/lib/response.js";
import { parseJsonBody } from "../../src/lib/body.js";
import { getBearerToken } from "../../src/lib/authHeader.js";
import { getMe, updateMe } from "../../src/services/meService.js";
import type { UpdateMeRequest } from "../../src/contracts/me.js";

export const handler: Handler = async (event) => {
  const requestId = getOrCreateRequestId(event.headers || {});
  try {
    if ((event.httpMethod || "").toUpperCase() === "OPTIONS") {
      return jsonCorsPreflight(requestId);
    }

    requireMethod(event.httpMethod, ["GET", "PATCH"]);
    const token = getBearerToken(event.headers || {});

    if (event.httpMethod === "PATCH") {
      const req = parseJsonBody<UpdateMeRequest>(event.body);
      const data = await updateMe(token, req);
      return jsonOk(200, requestId, data);
    }

    const data = await getMe(token);
    return jsonOk(200, requestId, data);
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};
