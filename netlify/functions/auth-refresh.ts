import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/lib/requestId.js";
import { parseJsonBody } from "../../src/lib/body.js";
import { jsonCorsPreflight, jsonOk, jsonTooManyRequests, requireMethod, toErrorResponse } from "../../src/lib/response.js";
import type { AuthRefreshRequest } from "../../src/contracts/auth.js";
import { refresh } from "../../src/services/authService.js";
import { buildRequestContext } from "../../src/security/requestContext.js";
import { checkRateLimit, rateKeyFromContext } from "../../src/security/rateLimiter.js";
import { writeAuditLog } from "../../src/services/auditLogService.js";

const REFRESH_IP_POLICY = {
  bucketSeconds: 60,
  maxHits: 120,
  route: "auth-refresh:ip"
};

export const handler: Handler = async (event) => {
  const requestId = getOrCreateRequestId(event.headers || {});
  const ctx = buildRequestContext(event, requestId);

  try {
    if ((event.httpMethod || "").toUpperCase() === "OPTIONS") {
      return jsonCorsPreflight(requestId);
    }

    requireMethod(event.httpMethod, ["POST"]);

    const ipKey = rateKeyFromContext(ctx);
    const ipLimit = await checkRateLimit(REFRESH_IP_POLICY, ipKey);
    if (!ipLimit.allowed) {
      return jsonTooManyRequests(requestId, ipLimit.retryAfterSeconds);
    }

    const req = parseJsonBody<AuthRefreshRequest>(event.body);
    const data = await refresh(req);

    if (process.env.AUTH_PROVIDER === "postgres") {
      await writeAuditLog({
        action: "auth.refresh.rotated",
        actorUserId: data.user?.id,
        targetUserId: data.user?.id,
        requestId,
        ip: ctx.ip,
        userAgent: ctx.userAgent,
        details: { provider: data.provider }
      });
    }

    return jsonOk(200, requestId, data);
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};
