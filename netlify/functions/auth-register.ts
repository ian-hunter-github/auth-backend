import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/lib/requestId.js";
import { parseJsonBody } from "../../src/lib/body.js";
import { jsonOk, jsonTooManyRequests, requireMethod, toErrorResponse } from "../../src/lib/response.js";
import type { AuthRegisterRequest } from "../../src/contracts/auth.js";
import { register } from "../../src/services/authService.js";
import { buildRequestContext } from "../../src/security/requestContext.js";
import { checkRateLimit } from "../../src/security/rateLimiter.js";

const RATE_POLICY = {
  bucketSeconds: 60,
  // Keep intentionally high for now; we will tighten once we add dedicated tests and add email/IP dual-keying.
  maxHits: 500,
  route: "auth-register"
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

    const req = parseJsonBody<AuthRegisterRequest>(event.body);
    const data = await register(req);
    return jsonOk(201, requestId, data);
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};
