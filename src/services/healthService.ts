import pg from "pg";
import type { HealthResponse } from "../contracts/health.js";
import { getEnv } from "../lib/env.js";
import { getBuildInfo, PROJECT } from "../meta.js";
import { selectRuntimeAuthProvider, validateRuntimeConfig } from "../security/runtimeConfig.js";

const { Pool } = pg;

function has(name: string): boolean {
  return !!getEnv(name);
}

function shouldAttemptPostgresCheck(provider: string): boolean {
  if (provider === "postgres") return true;
  // Also check if the env looks like postgres is configured, even if not selected.
  return has("DATABASE_URL") || has("PG_CONNECTION_STRING") || has("PGHOST");
}

function poolConfig(): pg.PoolConfig {
  const connectionString = getEnv("DATABASE_URL") || getEnv("PG_CONNECTION_STRING") || undefined;

  if (connectionString) {
    return {
      connectionString
    };
  }

  const sslmode = (getEnv("PGSSLMODE") || "").toLowerCase();
  const ssl =
    sslmode === "require" || sslmode === "verify-ca" || sslmode === "verify-full"
      ? { rejectUnauthorized: false }
      : undefined;

  return {
    host: getEnv("PGHOST") || undefined,
    database: getEnv("PGDATABASE") || undefined,
    user: getEnv("PGUSER") || undefined,
    password: getEnv("PGPASSWORD") || undefined,
    port: getEnv("PGPORT") ? Number(getEnv("PGPORT")) : undefined,
    ...(ssl ? { ssl } : {})
  };
}

async function checkPostgres(): Promise<{ ok: boolean; latencyMs?: number; error?: string }> {
  const start = Date.now();

  const cfg = poolConfig();
  const pool = new Pool({
    ...cfg,
    max: 1,
    idleTimeoutMillis: 250,
    connectionTimeoutMillis: 500
  });

  try {
    // Keep it simple and fast.
    await pool.query("select 1 as ok");
    const latencyMs = Date.now() - start;
    return { ok: true, latencyMs };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: msg };
  } finally {
    try {
      await pool.end();
    } catch {
      // ignore
    }
  }
}

export async function getHealth(): Promise<HealthResponse> {
  const authProvider = getEnv("AUTH_PROVIDER");

  const context = getEnv("CONTEXT");
  const deployId = getEnv("DEPLOY_ID");
  const siteId = getEnv("SITE_ID");

  const provider = selectRuntimeAuthProvider();
  const configReport = validateRuntimeConfig();

  const diagnostics: HealthResponse["diagnostics"] = {
    config: {
      ok: configReport.ok,
      provider: configReport.provider,
      issues: configReport.issues.map((i) => ({
        code: i.code,
        message: i.message,
        ...(i.env ? { env: i.env } : {})
      }))
    }
  };

  let degraded = !configReport.ok;

  if (shouldAttemptPostgresCheck(provider)) {
    const pgCheck = await checkPostgres();
    diagnostics.checks = {
      postgres: pgCheck
    };
    if (!pgCheck.ok) degraded = true;
  }

  return {
    status: degraded ? "degraded" : "ok",
    version: getEnv("APP_VERSION") || PROJECT.version,
    timestamp: new Date().toISOString(),
    build: getBuildInfo(),
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
    },
    diagnostics
  };
}

