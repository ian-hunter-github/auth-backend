import type { AuthLoginRequest, AuthLoginResponse, AuthUserProfile } from "../contracts/auth.js";
import type { AuthProvider } from "./authProvider.js";
import { fakeAuthProvider } from "./fakeAuthProvider.js";
import { postgresAuthProvider } from "./postgresAuthProvider.js";
import { getEnv } from "../lib/env.js";
import { AppError } from "../lib/errors.js";

function selectProvider(): AuthProvider {
  const explicit = getEnv("AUTH_PROVIDER");
  if (explicit) {
    const p = explicit.toLowerCase();
    if (p === "fake") return fakeAuthProvider;
    if (p === "postgres") return postgresAuthProvider;

    throw new AppError(`Unknown AUTH_PROVIDER: ${explicit}`, {
      code: "INTERNAL_ERROR",
      status: 500,
      details: { name: "AUTH_PROVIDER", value: explicit }
    });
  }

  // Deterministic default:
  // - In local Netlify Dev / test harness runs, default to FAKE unless explicitly overridden.
  // - In deployed environments, default to Postgres.
  const isNetlifyDev = (getEnv("NETLIFY_DEV") || "").toLowerCase() === "true";
  const isTest = (getEnv("NODE_ENV") || "").toLowerCase() === "test";

  if (isNetlifyDev || isTest) return fakeAuthProvider;
  return postgresAuthProvider;
}

export async function login(req: AuthLoginRequest): Promise<AuthLoginResponse> {
  return selectProvider().login(req);
}

export async function getUserFromToken(token: string): Promise<AuthUserProfile> {
  return selectProvider().getUserFromToken(token);
}

