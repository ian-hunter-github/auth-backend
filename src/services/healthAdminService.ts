import pg from "pg";
import { AppError } from "../lib/errors.js";
import { getEnv, requireEnv } from "../lib/env.js";
import { isAdminUser } from "../security/adminPolicy.js";
import { getUserFromToken } from "./authService.js";
import type { HealthAdminResponse } from "../contracts/healthAdmin.js";

const { Pool } = pg;

let pool: pg.Pool | undefined;

function hasPgEnv(): boolean {
  return !!getEnv("PGHOST") && !!getEnv("PGDATABASE") && !!getEnv("PGUSER") && !!getEnv("PGPASSWORD");
}

function getPool(): pg.Pool | undefined {
  if (pool) return pool;
  if (!hasPgEnv()) return undefined;

  const host = requireEnv("PGHOST");
  const database = requireEnv("PGDATABASE");
  const user = requireEnv("PGUSER");
  const password = requireEnv("PGPASSWORD");
  const port = getEnv("PGPORT");
  const sslMode = (getEnv("PGSSLMODE") || "require").toLowerCase();

  const ssl = sslMode === "disable" ? undefined : { rejectUnauthorized: false };

  pool = new Pool({
    host,
    database,
    user,
    password,
    ...(port ? { port: Number(port) } : {}),
    ...(ssl ? { ssl } : {})
  });

  return pool;
}

function fingerprint(parts: Record<string, string | undefined>): string {
  const keys = Object.keys(parts).sort();
  const s = keys.map((k) => `${k}=${parts[k] || ""}`).join("|");
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `fnv1a32:${(h >>> 0).toString(16).padStart(8, "0")}`;
}

export async function getHealthAdmin(token: string): Promise<HealthAdminResponse> {
  const caller = await getUserFromToken(token);
  if (!isAdminUser(caller)) {
    throw new AppError("Forbidden", { code: "FORBIDDEN", status: 403 });
  }

  const host = getEnv("PGHOST");
  const database = getEnv("PGDATABASE");
  const user = getEnv("PGUSER");
  const port = getEnv("PGPORT");
  const sslMode = (getEnv("PGSSLMODE") || "require").toLowerCase();
  const passwordSet = !!getEnv("PGPASSWORD");

  const configFingerprint = fingerprint({
    host,
    database,
    user,
    port,
    sslMode,
    passwordSet: passwordSet ? "1" : "0"
  });

  const out: HealthAdminResponse = {
    postgres: {
      connectMs: -1,
      queryMs: -1,
      activeSessions: -1,
      revokedSessions: -1,
      failedLoginCountLastHour: -1,
      passwordSet,
      configFingerprint,
      ...(host ? { host } : {}),
      ...(database ? { database } : {}),
      ...(user ? { user } : {}),
      ...(port ? { port } : {}),
      ...(sslMode ? { sslMode } : {})
    }
  };

  const p = getPool();
  if (!p) return out;

  const t0 = Date.now();
  const client = await p.connect();
  const t1 = Date.now();
  out.postgres.connectMs = t1 - t0;

  try {
    const q0 = Date.now();

    // Quick liveness query + simple counts for observability.
    const res = await client.query(
      `
      with
        active_sessions as (
          select count(*)::int as n
          from identity.sessions
          where revoked_at is null
            and expires_at > now()
        ),
        revoked_sessions as (
          select count(*)::int as n
          from identity.sessions
          where revoked_at is not null
        ),
        failed_last_hour as (
          select coalesce(sum(failure_count), 0)::int as n
          from identity.auth_failures
          where last_failure_at is not null
            and last_failure_at >= now() - interval '1 hour'
        )
      select
        (select n from active_sessions) as active_sessions,
        (select n from revoked_sessions) as revoked_sessions,
        (select n from failed_last_hour) as failed_last_hour
      `
    );

    const q1 = Date.now();
    out.postgres.queryMs = q1 - q0;

    out.postgres.activeSessions = Number(res.rows[0]?.active_sessions || 0);
    out.postgres.revokedSessions = Number(res.rows[0]?.revoked_sessions || 0);
    out.postgres.failedLoginCountLastHour = Number(res.rows[0]?.failed_last_hour || 0);

    return out;
  } catch (err) {
    // Health-admin should not take the service down; return what we can.
    const msg = err instanceof Error ? err.message : "Unknown error";
    throw new AppError("Health admin query failed", {
      code: "INTERNAL_ERROR",
      status: 500,
      details: { message: msg }
    });
  } finally {
    client.release();
  }
}

