import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutRequest,
  AuthRefreshRequest,
  AuthRefreshResponse,
  AuthRegisterRequest,
  AuthRegisterResponse,
  AuthUserProfile
} from "../contracts/auth.js";
import type { AuthProvider } from "./authProvider.js";
import { fakeAuthProvider } from "./fakeAuthProvider.js";
import { postgresAuthProvider } from "./postgresAuthProvider.js";

import { getEnv } from "../lib/env.js";

function selectProvider(): AuthProvider {
  const explicit = getEnv("AUTH_PROVIDER");
  if (explicit) {
    const p = explicit.toLowerCase();
    if (p === "fake") return fakeAuthProvider;
    if (p === "postgres") return postgresAuthProvider;
  }

  // Deterministic default:
  // - In local Netlify Dev / test harness runs, default to FAKE unless explicitly overridden.
  // - In deployed environments, default to postgres.
  const isNetlifyDev = (getEnv("NETLIFY_DEV") || "").toLowerCase() === "true";
  const isTest = (getEnv("NODE_ENV") || "").toLowerCase() === "test";

  if (isNetlifyDev || isTest) return fakeAuthProvider;
  return postgresAuthProvider;
}

export async function login(req: AuthLoginRequest): Promise<AuthLoginResponse> {
  return selectProvider().login(req);
}

export async function register(req: AuthRegisterRequest): Promise<AuthRegisterResponse> {
  return selectProvider().register(req);
}

export async function refresh(req: AuthRefreshRequest): Promise<AuthRefreshResponse> {
  return selectProvider().refresh(req);
}

export async function logout(accessToken: string, req?: AuthLogoutRequest): Promise<void> {
  return selectProvider().logout(accessToken, req);
}

export async function getUserFromToken(token: string): Promise<AuthUserProfile> {
  return selectProvider().getUserFromToken(token);
}

export async function listUsers(): Promise<AuthUserProfile[]> {
  return selectProvider().listUsers();
}
