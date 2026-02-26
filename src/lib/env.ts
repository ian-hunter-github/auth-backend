import { AppError } from "./errors.js";

export function getEnv(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim().length > 0 ? v : undefined;
}

export function requireEnv(name: string): string {
  const v = getEnv(name);
  if (!v) {
    throw new AppError(`Missing required environment variable: ${name}`, {
      code: "INTERNAL_ERROR",
      status: 500,
      details: { name }
    });
  }
  return v;
}
