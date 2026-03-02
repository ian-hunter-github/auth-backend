import { AppError } from "./errors.js";

export function getBearerToken(headers: Record<string, string | undefined>): string {
  const raw = headers["authorization"] || headers["Authorization"] || "";
  const v = raw.trim();

  if (!v) {
    throw new AppError("Missing Authorization header", { code: "UNAUTHORIZED", status: 401 });
  }

  // Per RFC 9110, auth scheme names are case-insensitive.
  const prefix = "bearer ";
  if (!v.toLowerCase().startsWith(prefix)) {
    throw new AppError("Invalid Authorization header", { code: "UNAUTHORIZED", status: 401 });
  }

  const token = v.slice(prefix.length).trim();
  if (!token) {
    throw new AppError("Missing bearer token", { code: "UNAUTHORIZED", status: 401 });
  }

  return token;
}

