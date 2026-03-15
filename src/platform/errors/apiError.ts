export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly status: number;
  public readonly details?: unknown;

  constructor(message: string, opts: { code: ErrorCode; status: number; details?: unknown }) {
    super(message);
    this.name = "AppError";
    this.code = opts.code;
    this.status = opts.status;
    this.details = opts.details;
  }
}

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}
