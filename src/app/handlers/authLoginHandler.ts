import type { AppHttpHandler } from "../http/types.js";
import { parseJsonBody } from "../../platform/http/body.js";
import { isAppError } from "../../platform/errors/apiError.js";
import {
  jsonCorsPreflight,
  jsonOk,
  jsonTooManyRequests,
  requireMethod,
  toErrorResponse
} from "../../platform/http/response.js";
import type { AuthLoginRequest } from "../../contracts/auth.js";
import { login } from "../../services/authService.js";
import { checkRateLimit, makeRateKey, rateKeyFromContext } from "../../platform/security/rateLimiter.js";
import { checkLockout, recordLoginFailure, recordLoginSuccess } from "../../platform/security/loginLockout.js";

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
  maxFailures: 8,
  lockSeconds: 15 * 60,
  scope: "ip+identifier" as const
};

function normalizeIdentifier(v: string | undefined): string | undefined {
  const s = (v || "").trim().toLowerCase();
  return s.length > 0 ? s : undefined;
}

function toAppResponse(response: {
  statusCode: number;
  headers?: Record<string, string | number | boolean>;
  body?: string;
}) {
  return {
    statusCode: response.statusCode,
    headers: Object.fromEntries(
      Object.entries(response.headers ?? {}).map(([k, v]) => [k, String(v)])
    ),
    body: response.body ?? ""
  };
}

export const authLoginHandler: AppHttpHandler = async (request) => {
  const requestId = request.requestId;
  const ctx = {
    requestId,
    ip: request.ip || "unknown",
    userAgent: request.userAgent || "",
    route: request.path,
    method: request.method
  };

  try {
    if ((request.method || "").toUpperCase() === "OPTIONS") {
      return toAppResponse(jsonCorsPreflight(requestId));
    }

    requireMethod(request.method, ["POST"]);

    const req = parseJsonBody<AuthLoginRequest>(request.body);
    const identifier = normalizeIdentifier(req.username);

    const ipKey = rateKeyFromContext(ctx);
    const ipLimit = await checkRateLimit(LOGIN_IP_POLICY, ipKey);
    if (!ipLimit.allowed) {
      return toAppResponse(jsonTooManyRequests(requestId, ipLimit.retryAfterSeconds));
    }

    const ipIdKey = makeRateKey([ctx.ip, identifier]);
    const ipIdLimit = await checkRateLimit(LOGIN_IP_IDENTIFIER_POLICY, ipIdKey);
    if (!ipIdLimit.allowed) {
      return toAppResponse(jsonTooManyRequests(requestId, ipIdLimit.retryAfterSeconds));
    }

    if (identifier) {
      const lock = await checkLockout(LOCKOUT_POLICY, {
        identifier,
        ip: ctx.ip,
        requestId,
        userAgent: ctx.userAgent
      });

      if (lock.locked) {
        return toAppResponse(jsonTooManyRequests(requestId, lock.retryAfterSeconds));
      }
    }

    try {
      const data = await login(req);

      if (identifier) {
        await recordLoginSuccess(LOCKOUT_POLICY, { identifier, ip: ctx.ip });
      }

      return toAppResponse(jsonOk(200, requestId, data));
    } catch (err) {
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
    return toAppResponse(toErrorResponse(requestId, err));
  }
};

