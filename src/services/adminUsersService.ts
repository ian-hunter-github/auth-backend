import { AppError } from "../lib/errors.js";
import { getEnv } from "../lib/env.js";
import type { AuthUserProfile } from "../contracts/auth.js";
import type {
  AdminCreateUserRequest,
  AdminUpdateUserRequest,
  AdminUserResponse,
  AdminUsersResponse
} from "../contracts/adminUsers.js";
import { createUser, getUserById, getUserFromToken, listUsers, updateUser } from "./authService.js";

function parseCsv(v: string | undefined): string[] {
  if (!v) return [];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function isAdminUser(user: AuthUserProfile): boolean {
  // Primary mechanism (Phase 3 Step 2): DB-backed roles (via provider)
  if (user.roles.includes("admin")) return true;

  // Break-glass / bootstrap allowlists (still useful for emergencies)
  const adminIds = parseCsv(getEnv("ADMIN_USER_IDS"));
  if (adminIds.includes(user.id)) return true;

  const adminEmails = parseCsv(getEnv("ADMIN_USER_EMAILS"));
  if (adminEmails.includes(user.username)) return true;

  return false;
}

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

