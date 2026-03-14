import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/lib/requestId.js";
import { parseJsonBody } from "../../src/lib/body.js";
import { getBearerToken } from "../../src/lib/authHeader.js";
import {
  jsonBadRequest,
  jsonCorsPreflight,
  jsonMethodNotAllowed,
  jsonNoContent,
  jsonOk,
  requireMethod,
  toErrorResponse
} from "../../src/lib/response.js";
import type { AdminCreateUserRequest, AdminUpdateUserRequest } from "../../src/contracts/adminUsers.js";
import {
  createAdminUser,
  deleteAdminUser,
  disableAdminUser,
  enableAdminUser,
  getAdminUserById,
  getAdminUsers,
  revokeAdminUserSessions,
  updateAdminUser
} from "../../src/services/adminUsersService.js";

function getPathParts(pathname: string | undefined): { id?: string; action?: string } {
  const p = (pathname || "").trim();
  if (!p) return {};

  const marker = "/.netlify/functions/admin-users";
  const i = p.indexOf(marker);
  if (i < 0) return {};

  const rest = p.slice(i + marker.length);
  const seg = rest.startsWith("/") ? rest.slice(1) : rest;
  const parts = seg.split("/");
  const idVal = parts[0] && parts[0].trim().length > 0 ? parts[0].trim() : "";
  const actionVal = parts[1] && parts[1].trim().length > 0 ? parts[1].trim() : "";
  return {
    ...(idVal ? { id: idVal } : {}),
    ...(actionVal ? { action: actionVal } : {})
  };
}

export const handler: Handler = async (event) => {
  const requestId = getOrCreateRequestId(event.headers || {});
  try {
    if ((event.httpMethod || "").toUpperCase() === "OPTIONS") {
      return jsonCorsPreflight(requestId);
    }

    requireMethod(event.httpMethod, ["GET", "POST", "PATCH", "DELETE"]);

    const token = getBearerToken(event.headers || {});
    const { id, action } = getPathParts(event.path);

    if (event.httpMethod === "GET") {
      if (id) {
        const data = await getAdminUserById(token, id);
        return jsonOk(200, requestId, data);
      }
      const data = await getAdminUsers(token);
      return jsonOk(200, requestId, data);
    }

    if (event.httpMethod === "POST") {
      if (id && action === "disable") {
        await disableAdminUser(token, id);
        return jsonNoContent(204, requestId);
      }
      if (id && action === "enable") {
        await enableAdminUser(token, id);
        return jsonNoContent(204, requestId);
      }
      if (id) {
        return jsonMethodNotAllowed(requestId);
      }
      const req = parseJsonBody<AdminCreateUserRequest>(event.body);
      const data = await createAdminUser(token, req);
      return jsonOk(201, requestId, data);
    }

    if (event.httpMethod === "PATCH") {
      if (!id) {
        return jsonBadRequest(requestId, "Missing user id");
      }
      const req = parseJsonBody<AdminUpdateUserRequest>(event.body);
      const data = await updateAdminUser(token, id, req);
      return jsonOk(200, requestId, data);
    }

    // DELETE
    if (!id) {
      return jsonBadRequest(requestId, "Missing user id");
    }

    // DELETE /admin-users/:id/sessions — revoke all sessions for a user
    if (action === "sessions") {
      await revokeAdminUserSessions(token, id);
      return jsonNoContent(204, requestId);
    }

    // DELETE /admin-users/:id — soft delete user
    await deleteAdminUser(token, id);
    return jsonNoContent(204, requestId);
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};
