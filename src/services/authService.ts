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
import { requireRuntimeConfig } from "../security/runtimeConfig.js";

function selectProvider(): AuthProvider {
  // Fail-fast on bad runtime env so API callers get deterministic errors
  // and we don't accidentally run in a partially configured state.
  const cfg = requireRuntimeConfig();

  const explicit = getEnv("AUTH_PROVIDER");
  if (explicit) {
    const p = explicit.toLowerCase();
    if (p === "fake") return fakeAuthProvider;
    if (p === "postgres") return postgresAuthProvider;
  }

  if (cfg.provider === "fake") return fakeAuthProvider;
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

export async function revokeUserSessions(userId: string): Promise<void> {
  return selectProvider().revokeUserSessions(userId);
}
