import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/lib/requestId.js";
import { parseJsonBody } from "../../src/lib/body.js";
import { jsonOk, jsonTooManyRequests, requireMethod, toErrorResponse } from "../../src/lib/response.js";
import type { AuthRefreshRequest } from "../../src/contracts/auth.js";
import { refresh } from "../../src/services/authService.js";
import { buildRequestContext } from "../../src/security/requestContext.js";
import { checkRateLimit } from "../../src/security/rateLimiter.js";

const RATE_POLICY = {
  bucketSeconds: 60,
  // Keep intentionally high for now; we will tighten and key by user/session later.
  maxHits: 2000,
  route: "auth-refresh"
};

export const handler: Handler = async (event) => {
  const requestId = getOrCreateRequestId(event.headers || {});
  const ctx = buildRequestContext(event, requestId);

  try {
    requireMethod(event.httpMethod, ["POST"]);

    const rl = await checkRateLimit(ctx, RATE_POLICY);
    if (!rl.allowed) {
      return jsonTooManyRequests(requestId, rl.retryAfterSeconds);
    }

    const req = parseJsonBody<AuthRefreshRequest>(event.body);
    const data = await refresh(req);
    return jsonOk(200, requestId, data);
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};
