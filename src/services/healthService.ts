import type { HealthResponse } from "../contracts/health.js";
import { getEnv } from "../lib/env.js";
import { getSelectedAuthProviderName } from "./authService.js";

function has(name: string): boolean {
  return !!getEnv(name);
}

export function getHealth(): HealthResponse {
  const authProviderRaw = getEnv("AUTH_PROVIDER");

  let authProvider: string | undefined = undefined;
  try {
    authProvider = getSelectedAuthProviderName();
  } catch {
    authProvider = authProviderRaw || undefined;
  }

  const context = getEnv("CONTEXT");
  const deployId = getEnv("DEPLOY_ID");
  const siteId = getEnv("SITE_ID");

  return {
    status: "ok",
    version: getEnv("APP_VERSION") || "0.1.0",
    timestamp: new Date().toISOString(),
    build: {
      node: process.version
    },
    env: {
      ...(authProvider ? { authProvider } : {}),
      postgres: {
        hasHost: has("PGHOST"),
        hasDatabase: has("PGDATABASE"),
        hasUser: has("PGUSER"),
        hasPassword: has("PGPASSWORD"),
        hasPort: has("PGPORT"),
        hasSslMode: has("PGSSLMODE")
      },
      supabase: {
        hasUrl: false,
        hasAnonKey: false
      },
      netlify: {
        ...(context ? { context } : {}),
        ...(deployId ? { deployId } : {}),
        ...(siteId ? { siteId } : {})
      }
    }
  };
}

