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
  getAdminUserById,
  getAdminUsers,
  updateAdminUser
} from "../../src/services/adminUsersService.js";

function getIdFromPath(pathname: string | undefined): string | undefined {
  const p = (pathname || "").trim();
  if (!p) return undefined;

  const marker = "/.netlify/functions/admin-users";
  const i = p.indexOf(marker);
  if (i < 0) return undefined;

  const rest = p.slice(i + marker.length);
  const seg = rest.startsWith("/") ? rest.slice(1) : rest;
  const id = seg.split("/")[0];
  return id && id.trim().length > 0 ? id.trim() : undefined;
}

export const handler: Handler = async (event) => {
  const requestId = getOrCreateRequestId(event.headers || {});
  try {
    if ((event.httpMethod || "").toUpperCase() === "OPTIONS") {
      return jsonCorsPreflight(requestId);
    }

    requireMethod(event.httpMethod, ["GET", "POST", "PATCH", "DELETE"]);

    const token = getBearerToken(event.headers || {});
    const id = getIdFromPath(event.path);

    if (event.httpMethod === "GET") {
      if (id) {
        const data = await getAdminUserById(token, id);
        return jsonOk(200, requestId, data);
      }
      const data = await getAdminUsers(token);
      return jsonOk(200, requestId, data);
    }

    if (event.httpMethod === "POST") {
      if (id) {
        // POST to /admin-users/:id is not supported
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
    await deleteAdminUser(token, id);
    return jsonNoContent(204, requestId);
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};
