import { createClient } from "@supabase/supabase-js";
import { AppError } from "../lib/errors.js";
import { requireEnv } from "../lib/env.js";
import type { AuthProvider } from "./authProvider.js";
import type { AuthLoginRequest, AuthLoginResponse, AuthUserProfile } from "../contracts/auth.js";

function getSupabaseClient() {
  const url = requireEnv("SUPABASE_URL");
  const anonKey = requireEnv("SUPABASE_ANON_KEY");
  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
}

function getUserMetadataName(userMetadata: unknown): string | undefined {
  if (!userMetadata || typeof userMetadata !== "object") return undefined;
  const obj = userMetadata as Record<string, unknown>;

  const fullName = obj["full_name"];
  if (typeof fullName === "string" && fullName.trim().length > 0) return fullName;

  const name = obj["name"];
  if (typeof name === "string" && name.trim().length > 0) return name;

  return undefined;
}

function toProfile(user: { id: string; email?: string | null; user_metadata?: unknown }): AuthUserProfile {
  const username = user.email || user.id;
  const displayName = getUserMetadataName(user.user_metadata) || username;

  return {
    id: user.id,
    username,
    displayName,
    roles: ["user"]
  };
}

export const supabaseAuthProvider: AuthProvider = {
  login: async (req: AuthLoginRequest): Promise<AuthLoginResponse> => {
    const username = (req.username || "").trim();
    const password = req.password || "";

    if (!username || !password) {
      throw new AppError("username and password are required", {
        code: "BAD_REQUEST",
        status: 400,
        details: { fields: ["username", "password"] }
      });
    }

    // Phase 1 default: treat "username" as an email for Supabase password auth.
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password
    });

    if (error) {
      throw new AppError("Invalid credentials", {
        code: "UNAUTHORIZED",
        status: 401,
        details: { message: error.message }
      });
    }

    const accessToken = data.session?.access_token;
    const refreshToken = data.session?.refresh_token;
    const expiresAtSeconds = data.session?.expires_at;
    const user = data.user;

    if (!accessToken || !user) {
      throw new AppError("Auth login failed", { code: "INTERNAL_ERROR", status: 500 });
    }

    const expiresAt =
      typeof expiresAtSeconds === "number" ? new Date(expiresAtSeconds * 1000).toISOString() : undefined;

    return {
      provider: "supabase",
      session: {
        accessToken,
        tokenType: "bearer",
        ...(expiresAt ? { expiresAt } : {}),
        ...(refreshToken ? { refreshToken } : {})
      },
      user: toProfile(user)
    };
  },

  getUserFromToken: async (token: string): Promise<AuthUserProfile> => {
    const t = (token || "").trim();
    if (!t) {
      throw new AppError("Missing token", { code: "UNAUTHORIZED", status: 401 });
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.getUser(t);

    if (error || !data.user) {
      throw new AppError("Invalid token", {
        code: "UNAUTHORIZED",
        status: 401,
        details: { message: error?.message }
      });
    }

    return toProfile(data.user);
  }
};
