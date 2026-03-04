import { getEnv } from "../lib/env.js";
import type { AuthUserProfile } from "../contracts/auth.js";

function parseCsv(v: string | undefined): string[] {
  if (!v) return [];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function isAdminUser(user: AuthUserProfile): boolean {
  // Primary mechanism (Phase 3 Step 2): DB-backed roles (via provider)
  if (user.roles.includes("admin")) return true;

  // Break-glass / bootstrap allowlists (still useful for emergencies)
  const adminIds = parseCsv(getEnv("ADMIN_USER_IDS"));
  if (adminIds.includes(user.id)) return true;

  const adminEmails = parseCsv(getEnv("ADMIN_USER_EMAILS"));
  if (adminEmails.includes(user.username)) return true;

  return false;
}
