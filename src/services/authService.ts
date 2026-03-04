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
import type { AuthProvider, CreateUserInput, UpdateUserInput } from "./authProvider.js";
import { fakeAuthProvider } from "./fakeAuthProvider.js";
import { postgresAuthProvider } from "./postgresAuthProvider.js";

import { getEnv } from "../lib/env.js";
import { AppError } from "../lib/errors.js";

export type AuthProviderName = "fake" | "postgres";

export function getSelectedAuthProviderName(): AuthProviderName {
  const explicit = getEnv("AUTH_PROVIDER");
  if (explicit) {
    const p = explicit.toLowerCase();
    if (p === "fake") return "fake";
    if (p === "postgres") return "postgres";

    throw new AppError("Invalid AUTH_PROVIDER", {
      code: "INTERNAL_ERROR",
      status: 500,
      details: { value: explicit, allowed: ["fake", "postgres"] }
    });
  }

  // Deterministic default:
  // - In local Netlify Dev / test harness runs, default to FAKE unless explicitly overridden.
  // - In deployed environments, default to postgres.
  const isNetlifyDev = (getEnv("NETLIFY_DEV") || "").toLowerCase() === "true";
  const isTest = (getEnv("NODE_ENV") || "").toLowerCase() === "test";

  if (isNetlifyDev || isTest) return "fake";
  return "postgres";
}

function selectProvider(): AuthProvider {
  const name = getSelectedAuthProviderName();
  return name === "fake" ? fakeAuthProvider : postgresAuthProvider;
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

export async function getUserById(id: string): Promise<AuthUserProfile> {
  return selectProvider().getUserById(id);
}

export async function createUser(input: CreateUserInput): Promise<AuthUserProfile> {
  return selectProvider().createUser(input);
}

export async function updateUser(id: string, input: UpdateUserInput): Promise<AuthUserProfile> {
  return selectProvider().updateUser(id, input);
}

export async function deleteUser(id: string): Promise<void> {
  return selectProvider().deleteUser(id);
}

