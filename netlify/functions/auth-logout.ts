import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/lib/requestId.js";
import { parseJsonBody } from "../../src/lib/body.js";
import { getBearerToken } from "../../src/lib/authHeader.js";
import { jsonNoContent, requireMethod, toErrorResponse } from "../../src/lib/response.js";
import type { AuthLogoutRequest } from "../../src/contracts/auth.js";
import { logout } from "../../src/services/authService.js";
import { buildRequestContext } from "../../src/security/requestContext.js";

export const handler: Handler = async (event) => {
  const requestId = getOrCreateRequestId(event.headers || {});
  const ctx = buildRequestContext(event, requestId);

  try {
    requireMethod(event.httpMethod, ["POST"]);

    const accessToken = getBearerToken(event.headers || {});
    const req = parseJsonBody<AuthLogoutRequest>(event.body);

    await logout(accessToken, req, ctx);
    return jsonNoContent(204, requestId);
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};

