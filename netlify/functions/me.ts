import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/platform/http/requestId.js";
import { parseJsonBody } from "../../src/platform/http/body.js";
import { jsonCorsPreflight, jsonOk, requireMethod, toErrorResponse } from "../../src/platform/http/response.js";
import { getBearerToken } from "../../src/lib/authHeader.js";

import type { UpdateMeRequest } from "../../src/contracts/me.js";
import { getMe, updateMe } from "../../src/services/meService.js";

export const handler: Handler = async (event) => {
  const requestId = getOrCreateRequestId(event.headers || {});

  try {
    if ((event.httpMethod || "").toUpperCase() === "OPTIONS") {
      return jsonCorsPreflight(requestId);
    }

    const method = (event.httpMethod || "").toUpperCase();
    requireMethod(method, ["GET", "PATCH"]);

    const token = getBearerToken(event.headers || {});

    if (method === "GET") {
      const data = await getMe(token);
      return jsonOk(200, requestId, data);
    }

    const req = parseJsonBody<UpdateMeRequest>(event.body);
    const data = await updateMe(token, req);
    return jsonOk(200, requestId, data);

  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};
