import type { AuthLoginRequest, AuthLoginResponse, AuthUserProfile } from "../contracts/auth.js";
import type { AuthProvider } from "./authProvider.js";
import { fakeAuthProvider } from "./fakeAuthProvider.js";
import { supabaseAuthProvider } from "./supabaseAuthProvider.js";
import { getEnv } from "../lib/env.js";

function selectProvider(): AuthProvider {
  const p = (getEnv("AUTH_PROVIDER") || "supabase").toLowerCase();
  if (p === "fake") return fakeAuthProvider;
  return supabaseAuthProvider;
}

export async function login(req: AuthLoginRequest): Promise<AuthLoginResponse> {
  return selectProvider().login(req);
}

export async function getUserFromToken(token: string): Promise<AuthUserProfile> {
  return selectProvider().getUserFromToken(token);
}
