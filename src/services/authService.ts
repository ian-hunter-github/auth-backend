import type { AuthLoginRequest, AuthLoginResponse, AuthUserProfile } from "../contracts/auth.js";
import type { AuthProvider } from "./authProvider.js";
import { fakeAuthProvider } from "./fakeAuthProvider.js";
import { supabaseAuthProvider } from "./supabaseAuthProvider.js";
import { getEnv } from "../lib/env.js";

function selectProvider(): AuthProvider {
  const explicit = getEnv("AUTH_PROVIDER");
  if (explicit) {
    const p = explicit.toLowerCase();
    if (p === "fake") return fakeAuthProvider;
    return supabaseAuthProvider;
  }

  // Deterministic default:
  // - In local Netlify Dev / test harness runs, default to FAKE unless explicitly overridden.
  // - In deployed environments, default to Supabase.
  const isNetlifyDev = (getEnv("NETLIFY_DEV") || "").toLowerCase() === "true";
  const isTest = (getEnv("NODE_ENV") || "").toLowerCase() === "test";

  if (isNetlifyDev || isTest) return fakeAuthProvider;
  return supabaseAuthProvider;
}

export async function login(req: AuthLoginRequest): Promise<AuthLoginResponse> {
  return selectProvider().login(req);
}

export async function getUserFromToken(token: string): Promise<AuthUserProfile> {
  return selectProvider().getUserFromToken(token);
}
