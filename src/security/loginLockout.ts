import pg from "pg";
import { getEnv, requireEnv } from "../lib/env.js";
import { writeAuditLog } from "../services/auditLogService.js";

export interface LockoutPolicy {
  windowSeconds: number;
  maxFailures: number;
  lockSeconds: number;
  scope: "ip+identifier";
}

export type LockoutCheckResult = {
  locked: boolean;
  lockedUntil?: string;
  retryAfterSeconds?: number;
};

type MemKey = string;

const mem = new Map<
  MemKey,
  { windowStartMs: number; failures: number; lockedUntilMs?: number }
>();

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

function bucketStart(now: Date, seconds: number): Date {
  const ms = seconds * 1000;
  return new Date(Math.floor(now.getTime() / ms) * ms);
}

function retryAfterSeconds(nowMs: number, untilMs: number): number {
  return Math.max(0, Math.ceil((untilMs - nowMs) / 1000));
}

function makeKey(identifier: string, ip: string): string {
  const id = (identifier || "").trim().toLowerCase() || "unknown";
  const addr = (ip || "").trim() || "unknown";
  return `${addr}|${id}`;
}

export async function checkLockout(
  policy: LockoutPolicy,
  input: { identifier: string; ip: string; requestId?: string; userAgent?: string }
): Promise<LockoutCheckResult> {
  const now = new Date();
  const nowMs = now.getTime();
  const key = makeKey(input.identifier, input.ip);

  const p = getPool();
  if (!p) {
    const s = mem.get(key);
    if (!s) return { locked: false };

    if (s.lockedUntilMs && s.lockedUntilMs > nowMs) {
      return {
        locked: true,
        lockedUntil: new Date(s.lockedUntilMs).toISOString(),
        retryAfterSeconds: retryAfterSeconds(nowMs, s.lockedUntilMs)
      };
    }

    if (nowMs - s.windowStartMs > policy.windowSeconds * 1000) {
      mem.delete(key);
    }

    return { locked: false };
  }

  const res = await p.query<{ locked_until: string | null }>(
    `
      select max(locked_until) as locked_until
      from identity.auth_failures
      where identifier = $1::text
        and ip = $2::text
        and window_seconds = $3::int
        and locked_until is not null
        and locked_until > now()
    `,
    [(input.identifier || "").trim().toLowerCase(), (input.ip || "").trim(), policy.windowSeconds]
  );

  const lockedUntil = res.rows[0]?.locked_until || null;
  if (!lockedUntil) return { locked: false };

  const untilMs = new Date(lockedUntil).getTime();
  return {
    locked: true,
    lockedUntil,
    retryAfterSeconds: retryAfterSeconds(nowMs, untilMs)
  };
}

export async function recordLoginSuccess(
  policy: LockoutPolicy,
  input: { identifier: string; ip: string }
): Promise<void> {
  const now = new Date();
  const key = makeKey(input.identifier, input.ip);

  const p = getPool();
  if (!p) {
    const s = mem.get(key);
    if (!s) return;
    mem.set(key, { windowStartMs: s.windowStartMs, failures: 0 });
    return;
  }

  const bucket = bucketStart(now, policy.windowSeconds);

  await p.query(
    `
      insert into identity.auth_failures
        (identifier, ip, window_start, window_seconds, failure_count, locked_until, last_success_at, updated_at)
      values
        ($1::text, $2::text, $3::timestamptz, $4::int, 0, null, now(), now())
      on conflict (identifier, ip, window_start, window_seconds)
      do update set
        failure_count = 0,
        locked_until = null,
        last_success_at = now(),
        updated_at = now()
    `,
    [(input.identifier || "").trim().toLowerCase(), (input.ip || "").trim(), bucket.toISOString(), policy.windowSeconds]
  );
}

export async function recordLoginFailure(
  policy: LockoutPolicy,
  input: { identifier: string; ip: string; requestId?: string; userAgent?: string }
): Promise<{ lockedNow: boolean; lockedUntil?: string }> {
  const now = new Date();
  const nowMs = now.getTime();
  const key = makeKey(input.identifier, input.ip);

  const p = getPool();
  if (!p) {
    const windowStart = bucketStart(now, policy.windowSeconds).getTime();
    const s = mem.get(key);
    const withinWindow = s && s.windowStartMs === windowStart;

    const nextFailures = withinWindow ? s.failures + 1 : 1;
    const lockedNow = nextFailures >= policy.maxFailures;

    const lockedUntilMs = lockedNow ? nowMs + policy.lockSeconds * 1000 : s?.lockedUntilMs;

    mem.set(key, {
      windowStartMs: windowStart,
      failures: nextFailures,
      ...(lockedUntilMs ? { lockedUntilMs } : {})
    });

    return lockedNow ? { lockedNow: true, lockedUntil: new Date(lockedUntilMs!).toISOString() } : { lockedNow: false };
  }

  const bucket = bucketStart(now, policy.windowSeconds);

  const res = await p.query<{ failure_count: number; locked_until: string | null }>(
    `
      insert into identity.auth_failures
        (identifier, ip, window_start, window_seconds, failure_count, locked_until, last_failure_at, updated_at)
      values
        ($1::text, $2::text, $3::timestamptz, $4::int, 1, null, now(), now())
      on conflict (identifier, ip, window_start, window_seconds)
      do update set
        failure_count = identity.auth_failures.failure_count + 1,
        last_failure_at = now(),
        updated_at = now(),
        locked_until = case
          when (identity.auth_failures.failure_count + 1) >= $5::int
            then greatest(coalesce(identity.auth_failures.locked_until, now()), now() + ($6::int || ' seconds')::interval)
          else identity.auth_failures.locked_until
        end
      returning failure_count, locked_until
    `,
    [
      (input.identifier || "").trim().toLowerCase(),
      (input.ip || "").trim(),
      bucket.toISOString(),
      policy.windowSeconds,
      policy.maxFailures,
      policy.lockSeconds
    ]
  );

  const row = res.rows[0];
  const lockedUntil = row?.locked_until || null;

  const lockedNow = !!lockedUntil && row?.failure_count === policy.maxFailures;

  if (lockedNow) {
    try {
      const entry = {
        action: "auth.login.locked",
        ip: input.ip,
        details: {
          identifier: (input.identifier || "").trim().toLowerCase(),
          windowSeconds: policy.windowSeconds,
          maxFailures: policy.maxFailures,
          lockSeconds: policy.lockSeconds,
          lockedUntil
        },
        ...(input.requestId ? { requestId: input.requestId } : {}),
        ...(input.userAgent ? { userAgent: input.userAgent } : {})
      };

      await writeAuditLog(entry);
    } catch {
      // Best effort only.
    }
  }

  return lockedUntil ? { lockedNow, lockedUntil } : { lockedNow: false };
}
