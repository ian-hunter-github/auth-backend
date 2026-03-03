import { PROJECT, getBuildInfo } from "../meta.js";
import type { HealthResponse } from "../contracts/health.js";
import { getEnv } from "../lib/env.js";

export function getHealth(): HealthResponse {
  return {
    status: "ok",
    version: PROJECT.version,
    timestamp: new Date().toISOString(),
    build: getBuildInfo(),
    env: {
      authProvider: getEnv("AUTH_PROVIDER"),
      postgres: {
        hasHost: Boolean(getEnv("PGHOST")),
        hasDatabase: Boolean(getEnv("PGDATABASE")),
        hasUser: Boolean(getEnv("PGUSER")),
        hasPassword: Boolean(getEnv("PGPASSWORD")),
        hasPort: Boolean(getEnv("PGPORT")),
        hasSslMode: Boolean(getEnv("PGSSLMODE"))
      },
      supabase: {
        hasUrl: Boolean(getEnv("SUPABASE_URL")),
        hasAnonKey: Boolean(getEnv("SUPABASE_ANON_KEY"))
      },
      netlify: {
        context: getEnv("CONTEXT"),
        deployId: getEnv("DEPLOY_ID"),
        siteId: getEnv("SITE_ID")
      }
    }
  };
}

