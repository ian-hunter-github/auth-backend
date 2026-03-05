import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/lib/requestId.js";
import { parseJsonBody } from "../../src/lib/body.js";
import { getBearerToken } from "../../src/lib/authHeader.js";
import { jsonCorsPreflight, jsonNoContent, requireMethod, toErrorResponse } from "../../src/lib/response.js";
import type { AuthLogoutRequest } from "../../src/contracts/auth.js";
import { logout } from "../../src/services/authService.js";
import { buildRequestContext } from "../../src/security/requestContext.js";
import { verifyAccessToken } from "../../src/lib/jwt.js"; // ✅ FIXED PATH
import { writeAuditLog } from "../../src/services/auditLogService.js";

export const handler: Handler = async (event) => {
  const requestId = getOrCreateRequestId(event.headers || {});
  const ctx = buildRequestContext(event, requestId);

  try {
    if ((event.httpMethod || "").toUpperCase() === "OPTIONS") {
      return jsonCorsPreflight(requestId);
    }

    requireMethod(event.httpMethod, ["POST"]);

    const accessToken = getBearerToken(event.headers || {});
    const req = event.body ? parseJsonBody<AuthLogoutRequest>(event.body) : undefined;

    await logout(accessToken, req);

    if (process.env.AUTH_PROVIDER === "postgres") {
      let actorUserId: string | undefined;

      try {
        const verified = verifyAccessToken(accessToken);
        actorUserId = verified.userId;
      } catch {
        actorUserId = undefined;
      }

      await writeAuditLog({
        action: "auth.logout",
        ...(actorUserId ? { actorUserId, targetUserId: actorUserId } : {}),
        requestId,
        ip: ctx.ip,
        userAgent: ctx.userAgent,
      });
    }

    return jsonNoContent(204, requestId);
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};
