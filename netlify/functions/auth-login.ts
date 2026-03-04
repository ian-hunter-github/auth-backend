import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/lib/requestId.js";
import { parseJsonBody } from "../../src/lib/body.js";
import { jsonOk, jsonTooManyRequests, requireMethod, toErrorResponse } from "../../src/lib/response.js";
import type { AuthLoginRequest } from "../../src/contracts/auth.js";
import { login } from "../../src/services/authService.js";
import { buildRequestContext } from "../../src/security/requestContext.js";
import { checkRateLimit } from "../../src/security/rateLimiter.js";

const RATE_POLICY = {
  bucketSeconds: 60,
  // Keep intentionally high for now; we will tighten once we add dedicated rate limit tests and endpoint-specific keys.
  maxHits: 1000,
  route: "auth-login"
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

    const req = parseJsonBody<AuthLoginRequest>(event.body);
    const data = await login(req);
    return jsonOk(200, requestId, data);
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};
