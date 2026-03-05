import { AppError } from "../lib/errors.js";
import { getUserFromToken } from "../services/authService.js";
import type { AuthUserProfile } from "../contracts/auth.js";

export async function requireAdminUser(token: string): Promise<AuthUserProfile> {
  const user = await getUserFromToken(token);
  const roles = Array.isArray(user.roles) ? user.roles : [];
  if (!roles.includes("admin")) {
    throw new AppError("Forbidden", { code: "FORBIDDEN", status: 403 });
  }
  return user;
}

