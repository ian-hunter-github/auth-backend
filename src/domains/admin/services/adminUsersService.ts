import { AppError } from "../../../lib/errors.js";
import type { AuthUserProfile } from "../../../contracts/auth.js";
import type {
  AdminCreateUserRequest,
  AdminUpdateUserRequest,
  AdminUserResponse,
  AdminUsersResponse
} from "../../../contracts/adminUsers.js";
import { isAdminUser } from "../../../security/adminPolicy.js";
import {
  createUser,
  deleteUser,
  disableUser,
  enableUser,
  getUserById,
  getUserFromToken,
  listUsers,
  revokeUserSessions,
  updateUser
} from "../../../services/authService.js";

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
    ...(roles ? { roles } : {}),
    ...(req.givenName !== undefined ? { givenName: req.givenName } : {}),
    ...(req.familyName !== undefined ? { familyName: req.familyName } : {}),
    ...(req.avatarUrl !== undefined ? { avatarUrl: req.avatarUrl } : {}),
    ...(req.bio !== undefined ? { bio: req.bio } : {}),
    ...(req.phoneNumber !== undefined ? { phoneNumber: req.phoneNumber } : {}),
    ...(req.locale !== undefined ? { locale: req.locale } : {}),
    ...(req.timezone !== undefined ? { timezone: req.timezone } : {})
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

  const profileFields = ["givenName", "familyName", "avatarUrl", "bio", "phoneNumber", "locale", "timezone"] as const;
  const hasProfileField = profileFields.some((f) => req[f] !== undefined);
  const hasDisplayName = displayName !== undefined;
  const hasRoles = roles !== undefined;

  if (!hasDisplayName && !hasRoles && !hasProfileField) {
    throw new AppError("At least one field must be provided", {
      code: "BAD_REQUEST",
      status: 400,
      details: { fields: ["displayName", "roles", ...profileFields] }
    });
  }

  const user = await updateUser(id, {
    ...(displayName !== undefined ? { displayName } : {}),
    ...(roles !== undefined ? { roles } : {}),
    ...(req.givenName !== undefined ? { givenName: req.givenName } : {}),
    ...(req.familyName !== undefined ? { familyName: req.familyName } : {}),
    ...(req.avatarUrl !== undefined ? { avatarUrl: req.avatarUrl } : {}),
    ...(req.bio !== undefined ? { bio: req.bio } : {}),
    ...(req.phoneNumber !== undefined ? { phoneNumber: req.phoneNumber } : {}),
    ...(req.locale !== undefined ? { locale: req.locale } : {}),
    ...(req.timezone !== undefined ? { timezone: req.timezone } : {})
  });

  return { user };
}

export async function deleteAdminUser(token: string, id: string): Promise<void> {
  await requireAdmin(token);
  await deleteUser(id);
}

export async function disableAdminUser(token: string, id: string): Promise<void> {
  await requireAdmin(token);
  await disableUser(id);
}

export async function enableAdminUser(token: string, id: string): Promise<void> {
  await requireAdmin(token);
  await enableUser(id);
}

export async function revokeAdminUserSessions(token: string, id: string): Promise<void> {
  await requireAdmin(token);
  await revokeUserSessions(id);
}
