import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/lib/requestId.js";
import { parseJsonBody } from "../../src/lib/body.js";
import { jsonOk, jsonTooManyRequests, requireMethod, toErrorResponse } from "../../src/lib/response.js";
import type { AuthLoginRequest } from "../../src/contracts/auth.js";
import { login } from "../../src/services/authService.js";
import { buildRequestContext } from "../../src/security/requestContext.js";
import { checkRateLimit, makeRateKey, rateKeyFromContext } from "../../src/security/rateLimiter.js";

const LOGIN_IP_POLICY = {
  bucketSeconds: 60,
  maxHits: 60,
  route: "auth-login:ip"
};

const LOGIN_IP_IDENTIFIER_POLICY = {
  bucketSeconds: 60,
  maxHits: 10,
  route: "auth-login:ip+identifier"
};

function normalizeIdentifier(v: string | undefined): string | undefined {
  const s = (v || "").trim().toLowerCase();
  return s.length > 0 ? s : undefined;
}

export const handler: Handler = async (event) => {
  const requestId = getOrCreateRequestId(event.headers || {});
  const ctx = buildRequestContext(event, requestId);

  try {
    requireMethod(event.httpMethod, ["POST"]);

    // Parse early so we can rate-limit by identifier. This is cheap and avoids per-request password hashing work under attack.
    const req = parseJsonBody<AuthLoginRequest>(event.body);
    const identifier = normalizeIdentifier(req.username);

    const ipKey = rateKeyFromContext(ctx);
    const ipLimit = await checkRateLimit(LOGIN_IP_POLICY, ipKey);
    if (!ipLimit.allowed) {
      return jsonTooManyRequests(requestId, ipLimit.retryAfterSeconds);
    }

    const ipIdKey = makeRateKey([ctx.ip, identifier]);
    const ipIdLimit = await checkRateLimit(LOGIN_IP_IDENTIFIER_POLICY, ipIdKey);
    if (!ipIdLimit.allowed) {
      return jsonTooManyRequests(requestId, ipIdLimit.retryAfterSeconds);
    }

    const data = await login(req);
    return jsonOk(200, requestId, data);
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};
