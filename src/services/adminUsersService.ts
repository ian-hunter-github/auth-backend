import { AppError } from "../lib/errors.js";
import type { AuthUserProfile } from "../contracts/auth.js";
import type {
  AdminCreateUserRequest,
  AdminUpdateUserRequest,
  AdminUserResponse,
  AdminUsersResponse
} from "../contracts/adminUsers.js";
import { isAdminUser } from "../security/adminPolicy.js";
import { createUser, deleteUser, getUserById, getUserFromToken, listUsers, updateUser } from "./authService.js";

async function requireAdmin(token: string): Promise<AuthUserProfile> {
  const caller = await getUserFromToken(token);
  if (!isAdminUser(caller)) {
    throw new AppError("Forbidden", { code: "FORBIDDEN", status: 403 });
  }
  return caller;
}

export async function getAdminUsers(token: string): Promise<AdminUsersResponse> {
  await requireAdmin(token);
  const users = await listUsers();
  return { users };
}

export async function getAdminUserById(token: string, id: string): Promise<AdminUserResponse> {
  await requireAdmin(token);
  const user = await getUserById(id);
  return { user };
}

export async function createAdminUser(token: string, req: AdminCreateUserRequest): Promise<AdminUserResponse> {
  await requireAdmin(token);

  const email = (req.email || "").trim().toLowerCase();
  const password = req.password || "";
  const displayName = (req.displayName || "").trim();
  const roles = Array.isArray(req.roles) ? req.roles : undefined;

  if (!email || !password) {
    throw new AppError("email and password are required", {
      code: "BAD_REQUEST",
      status: 400,
      details: { fields: ["email", "password"] }
    });
  }

  const user = await createUser({
    email,
    password,
    ...(displayName ? { displayName } : {}),
    ...(roles ? { roles } : {})
  });

  return { user };
}

export async function updateAdminUser(
  token: string,
  id: string,
  req: AdminUpdateUserRequest
): Promise<AdminUserResponse> {
  await requireAdmin(token);

  const displayName = req.displayName === undefined ? undefined : (req.displayName || "").trim();
  const roles = req.roles === undefined ? undefined : req.roles;

  const hasDisplayName = displayName !== undefined;
  const hasRoles = roles !== undefined;

  if (!hasDisplayName && !hasRoles) {
    throw new AppError("At least one field must be provided", {
      code: "BAD_REQUEST",
      status: 400,
      details: { fields: ["displayName", "roles"] }
    });
  }

  const user = await updateUser(id, { ...(hasDisplayName ? { displayName } : {}), ...(hasRoles ? { roles } : {}) });
  return { user };
}

export async function deleteAdminUser(token: string, id: string): Promise<void> {
  await requireAdmin(token);
  await deleteUser(id);
}
