import { getEnv } from "../lib/env.js";
import type { HealthResponse } from "../contracts/health.js";

function has(name: string): boolean {
  const v = getEnv(name);
  return !!v;
}

export function getHealth(): HealthResponse {
  const authProvider = getEnv("AUTH_PROVIDER");
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
      netlify: {
        ...(context ? { context } : {}),
        ...(deployId ? { deployId } : {}),
        ...(siteId ? { siteId } : {})
      }
    }
  };
}

