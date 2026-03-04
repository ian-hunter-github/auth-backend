import { AppError } from "../lib/errors.js";
import { getEnv } from "../lib/env.js";
import type { AuthUserProfile } from "../contracts/auth.js";
import type { AdminUsersResponse } from "../contracts/adminUsers.js";
import { getUserFromToken, listUsers } from "./authService.js";

function parseCsv(v: string | undefined): string[] {
  if (!v) return [];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function isAdminUser(user: AuthUserProfile): boolean {
  if (user.roles.includes("admin")) return true;

  const adminIds = parseCsv(getEnv("ADMIN_USER_IDS"));
  if (adminIds.includes(user.id)) return true;

  const adminEmails = parseCsv(getEnv("ADMIN_USER_EMAILS"));
  if (adminEmails.includes(user.username)) return true;

  return false;
}

export async function getAdminUsers(token: string): Promise<AdminUsersResponse> {
  const caller = await getUserFromToken(token);
  if (!isAdminUser(caller)) {
    throw new AppError("Forbidden", { code: "FORBIDDEN", status: 403 });
  }

  const users = await listUsers();
  return { users };
}
