import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/lib/requestId.js";
import { parseJsonBody } from "../../src/lib/body.js";
import { isAppError } from "../../src/lib/errors.js";
import { jsonOk, jsonTooManyRequests, requireMethod, toErrorResponse } from "../../src/lib/response.js";
import type { AuthLoginRequest } from "../../src/contracts/auth.js";
import { login } from "../../src/services/authService.js";
import { buildRequestContext } from "../../src/security/requestContext.js";
import { checkRateLimit, makeRateKey, rateKeyFromContext } from "../../src/security/rateLimiter.js";
import { checkLockout, recordLoginFailure, recordLoginSuccess } from "../../src/security/loginLockout.js";

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

const LOCKOUT_POLICY = {
  windowSeconds: 15 * 60,
  // Must be < LOGIN_IP_IDENTIFIER_POLICY.maxHits so lockout is observable independently of rate limiting.
  maxFailures: 8,
  lockSeconds: 15 * 60,
  scope: "ip+identifier" as const
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

    // Parse early so we can rate-limit and lock out by identifier.
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

    if (identifier) {
      const lock = await checkLockout(LOCKOUT_POLICY, {
        identifier,
        ip: ctx.ip,
        requestId,
        userAgent: ctx.userAgent
      });

      if (lock.locked) {
        return jsonTooManyRequests(requestId, lock.retryAfterSeconds);
      }
    }

    try {
      const data = await login(req);

      if (identifier) {
        await recordLoginSuccess(LOCKOUT_POLICY, { identifier, ip: ctx.ip });
      }

      return jsonOk(200, requestId, data);
    } catch (err) {
      // Only count invalid credential failures towards lockout.
      if (identifier && isAppError(err) && err.code === "UNAUTHORIZED" && err.status === 401) {
        await recordLoginFailure(LOCKOUT_POLICY, {
          identifier,
          ip: ctx.ip,
          requestId,
          userAgent: ctx.userAgent
        });
      }
      throw err;
    }
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};

