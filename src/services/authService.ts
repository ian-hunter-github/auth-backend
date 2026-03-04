import type { RequestContext } from "../security/requestContext.js";
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

export async function login(req: AuthLoginRequest, ctx?: RequestContext): Promise<AuthLoginResponse> {
  return selectProvider().login(req, ctx);
}

export async function register(req: AuthRegisterRequest, ctx?: RequestContext): Promise<AuthRegisterResponse> {
  return selectProvider().register(req, ctx);
}

export async function refresh(req: AuthRefreshRequest, ctx?: RequestContext): Promise<AuthRefreshResponse> {
  return selectProvider().refresh(req, ctx);
}

export async function logout(accessToken: string, req?: AuthLogoutRequest, ctx?: RequestContext): Promise<void> {
  return selectProvider().logout(accessToken, req, ctx);
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

