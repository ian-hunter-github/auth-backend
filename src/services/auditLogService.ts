import pg from "pg";
import { AppError } from "../lib/errors.js";
import { getEnv, requireEnv } from "../lib/env.js";

export type AuditLogEntryInput = {
  action: string;
  actorUserId?: string;
  targetUserId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  details?: unknown;
};

type DbAuditRow = {
  id: string;
};

let pool: pg.Pool | undefined;

function getPool(): pg.Pool {
  if (pool) return pool;

  // Mirrors the app's normal Postgres env expectations.
  const host = requireEnv("PGHOST");
  const database = requireEnv("PGDATABASE");
  const user = requireEnv("PGUSER");
  const password = requireEnv("PGPASSWORD");
  const port = Number(getEnv("PGPORT") || "5432");
  const sslmode = (getEnv("PGSSLMODE") || "").toLowerCase();

  // neon typically requires SSL; local dev may not.
  const ssl =
    sslmode === "require" || sslmode === "verify-ca" || sslmode === "verify-full"
      ? { rejectUnauthorized: false }
      : undefined;

  pool = new pg.Pool({
    host,
    database,
    user,
    password,
    port,
    ssl
  });

  return pool;
}

export async function writeAuditLog(input: AuditLogEntryInput): Promise<string> {
  const action = (input.action || "").trim();
  if (!action) {
    throw new AppError("Missing audit action", { code: "BAD_REQUEST", status: 400 });
  }

  const p = getPool();

  const actorUserId = (input.actorUserId || "").trim() || null;
  const targetUserId = (input.targetUserId || "").trim() || null;
  const requestId = (input.requestId || "").trim() || null;
  const ip = (input.ip || "").trim() || null;
  const userAgent = (input.userAgent || "").trim() || null;

  const detailsJson =
    input.details === undefined ? null : JSON.stringify(input.details);

  const { rows } = await p.query<DbAuditRow>(
    `
      insert into identity.audit_log (action, actor_user_id, target_user_id, request_id, ip, user_agent, details)
      values ($1::text, $2::uuid, $3::uuid, $4::text, $5::text, $6::text, $7::jsonb)
      returning id
    `,
    [action, actorUserId, targetUserId, requestId, ip, userAgent, detailsJson]
  );

  const row = rows[0];
  if (!row) {
    throw new AppError("Failed to write audit log", { code: "INTERNAL_ERROR", status: 500 });
  }

  return row.id;
}

export async function closeAuditPool(): Promise<void> {
  if (!pool) return;
  const p = pool;
  pool = undefined;
  await p.end();
}

