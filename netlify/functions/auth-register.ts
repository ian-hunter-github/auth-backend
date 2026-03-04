import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/lib/requestId.js";
import { parseJsonBody } from "../../src/lib/body.js";
import { jsonOk, jsonTooManyRequests, requireMethod, toErrorResponse } from "../../src/lib/response.js";
import type { AuthRegisterRequest } from "../../src/contracts/auth.js";
import { register } from "../../src/services/authService.js";
import { buildRequestContext } from "../../src/security/requestContext.js";
import { checkRateLimit, makeRateKey, rateKeyFromContext } from "../../src/security/rateLimiter.js";

const REGISTER_IP_POLICY = {
  bucketSeconds: 60,
  maxHits: 20,
  route: "auth-register:ip"
};

const REGISTER_IP_IDENTIFIER_POLICY = {
  bucketSeconds: 60,
  maxHits: 5,
  route: "auth-register:ip+email"
};

function normalizeEmail(v: string | undefined): string | undefined {
  const s = (v || "").trim().toLowerCase();
  return s.length > 0 ? s : undefined;
}

export const handler: Handler = async (event) => {
  const requestId = getOrCreateRequestId(event.headers || {});
  const ctx = buildRequestContext(event, requestId);

  try {
    requireMethod(event.httpMethod, ["POST"]);

    const req = parseJsonBody<AuthRegisterRequest>(event.body);
    const email = normalizeEmail(req.email);

    const ipKey = rateKeyFromContext(ctx);
    const ipLimit = await checkRateLimit(REGISTER_IP_POLICY, ipKey);
    if (!ipLimit.allowed) {
      return jsonTooManyRequests(requestId, ipLimit.retryAfterSeconds);
    }

    const ipEmailKey = makeRateKey([ctx.ip, email]);
    const ipEmailLimit = await checkRateLimit(REGISTER_IP_IDENTIFIER_POLICY, ipEmailKey);
    if (!ipEmailLimit.allowed) {
      return jsonTooManyRequests(requestId, ipEmailLimit.retryAfterSeconds);
    }

    const data = await register(req, ctx);
    return jsonOk(201, requestId, data);
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};

