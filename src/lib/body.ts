import { AppError } from "./errors.js";

export function parseJsonBody<T>(raw: string | null | undefined): T {
  if (!raw || raw.trim().length === 0) {
    throw new AppError("Missing JSON body", { code: "BAD_REQUEST", status: 400 });
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new AppError("Invalid JSON body", { code: "BAD_REQUEST", status: 400 });
  }
}
