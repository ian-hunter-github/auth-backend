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

const pool = process.env.PG_CONNECTION_STRING
  ? new Pool({ connectionString: process.env.PG_CONNECTION_STRING })
  : undefined;

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

export async function checkRateLimit(ctx: RequestContext, policy: RateLimitPolicy): Promise<RateLimitResult> {
  if (!pool) return { allowed: true };

  const now = new Date();
  const bucket = bucketStart(now, policy.bucketSeconds);
  const expires = new Date(bucket.getTime() + policy.bucketSeconds * 1000);

  const key = ctx.ip || "unknown";

  const client = await pool.connect();
  try {
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
