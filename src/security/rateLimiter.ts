import { Pool } from "pg";
import type { RequestContext } from "./requestContext.js";

export interface RateLimitPolicy {
  bucketSeconds: number;
  maxHits: number;
  route: string;
}

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds?: number;
};

let pool: Pool | undefined;

function hasPgEnv(): boolean {
  return (
    !!process.env.PG_CONNECTION_STRING ||
    (!!process.env.PGHOST && !!process.env.PGDATABASE && !!process.env.PGUSER && !!process.env.PGPASSWORD)
  );
}

function getPool(): Pool | undefined {
  if (pool) return pool;
  if (!hasPgEnv()) return undefined;

  if (process.env.PG_CONNECTION_STRING) {
    pool = new Pool({ connectionString: process.env.PG_CONNECTION_STRING });
    return pool;
  }

  const host = process.env.PGHOST!;
  const database = process.env.PGDATABASE!;
  const user = process.env.PGUSER!;
  const password = process.env.PGPASSWORD!;
  const port = Number(process.env.PGPORT || "5432");
  const sslmode = (process.env.PGSSLMODE || "").toLowerCase();

  const ssl =
    sslmode === "require" || sslmode === "verify-ca" || sslmode === "verify-full"
      ? { rejectUnauthorized: false }
      : undefined;

  pool = new Pool({
    host,
    database,
    user,
    password,
    port,
    ...(ssl ? { ssl } : {})
  });

  return pool;
}

export async function closeRateLimiterPool(): Promise<void> {
  if (!pool) return;
  const p = pool;
  pool = undefined;
  await p.end();
}

type MemKey = string;

const memCounters = new Map<MemKey, { hits: number; expiresAtMs: number }>();

function bucketStart(now: Date, seconds: number): Date {
  const ms = seconds * 1000;
  return new Date(Math.floor(now.getTime() / ms) * ms);
}

function calcRetryAfterSeconds(now: Date, bucketSeconds: number): number {
  const bucket = bucketStart(now, bucketSeconds);
  const expires = new Date(bucket.getTime() + bucketSeconds * 1000);
  const remainingMs = expires.getTime() - now.getTime();
  return Math.max(0, Math.ceil(remainingMs / 1000));
}

function toKeyPart(v: string | undefined): string | undefined {
  const s = (v || "").trim();
  return s.length > 0 ? s : undefined;
}

export function makeRateKey(parts: Array<string | undefined>): string {
  const cleaned = parts.map(toKeyPart).filter((v): v is string => Boolean(v));
  return cleaned.length > 0 ? cleaned.join("|") : "unknown";
}

function memKey(policy: RateLimitPolicy, rateKey: string, bucketIso: string): MemKey {
  return `${policy.route}::${rateKey}::${policy.bucketSeconds}::${bucketIso}`;
}

function memCheck(policy: RateLimitPolicy, rateKey: string): RateLimitResult {
  const now = new Date();
  const bucket = bucketStart(now, policy.bucketSeconds);
  const expiresAtMs = bucket.getTime() + policy.bucketSeconds * 1000;
  const key = memKey(policy, rateKey, bucket.toISOString());

  const existing = memCounters.get(key);
  if (!existing || existing.expiresAtMs <= now.getTime()) {
    memCounters.set(key, { hits: 1, expiresAtMs });
    return { allowed: 1 <= policy.maxHits };
  }

  existing.hits += 1;
  memCounters.set(key, existing);

  if (existing.hits <= policy.maxHits) return { allowed: true };
  return { allowed: false, retryAfterSeconds: calcRetryAfterSeconds(now, policy.bucketSeconds) };
}

export async function checkRateLimit(
  policy: RateLimitPolicy,
  rateKey: string
): Promise<RateLimitResult> {
  const key = makeRateKey([rateKey]);

  // Deterministic fallback for tests/dev when PG isn't configured.
  const p = getPool();
  if (!p) {
    return memCheck(policy, key);
  }

  const now = new Date();
  const bucket = bucketStart(now, policy.bucketSeconds);
  const expires = new Date(bucket.getTime() + policy.bucketSeconds * 1000);

  const client = await p.connect();
  try {
    try {
      await client.query(`delete from identity.rate_limits where expires_at < now()`);
    } catch {
      // Best effort only.
    }

    const res = await client.query(
      `
      insert into identity.rate_limits (rate_key, route, bucket_start, bucket_seconds, hit_count, expires_at)
      values ($1,$2,$3,$4,1,$5)
      on conflict (rate_key, route, bucket_start, bucket_seconds)
      do update set hit_count = identity.rate_limits.hit_count + 1, updated_at = now()
      returning hit_count
      `,
      [key, policy.route, bucket.toISOString(), policy.bucketSeconds, expires.toISOString()]
    );

    const hits = Number(res.rows[0]?.hit_count || 0);
    if (hits <= policy.maxHits) return { allowed: true };

    return { allowed: false, retryAfterSeconds: calcRetryAfterSeconds(now, policy.bucketSeconds) };
  } catch {
    // Fail open on infra errors.
    return { allowed: true };
  } finally {
    client.release();
  }
}

export function rateKeyFromContext(ctx: RequestContext): string {
  return makeRateKey([ctx.ip || "unknown"]);
}

