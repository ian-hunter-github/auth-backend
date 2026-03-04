import { Pool } from "pg";
import type { RequestContext } from "./requestContext.js";

export interface RateLimitPolicy {
  bucketSeconds: number;
  maxHits: number;
  route: string;
}

const pool = process.env.PG_CONNECTION_STRING
  ? new Pool({ connectionString: process.env.PG_CONNECTION_STRING })
  : undefined;

function bucketStart(now: Date, seconds: number): Date {
  const ms = seconds * 1000;
  return new Date(Math.floor(now.getTime() / ms) * ms);
}

export async function checkRateLimit(
  ctx: RequestContext,
  policy: RateLimitPolicy,
): Promise<boolean> {
  if (!pool) return true;

  const now = new Date();
  const bucket = bucketStart(now, policy.bucketSeconds);
  const expires = new Date(bucket.getTime() + policy.bucketSeconds * 1000);

  const key = ctx.ip || "unknown";

  const client = await pool.connect();
  try {
    await client.query("begin");

    const res = await client.query(
      `
      insert into identity.rate_limits (rate_key, route, bucket_start, bucket_seconds, hit_count, expires_at)
      values ($1,$2,$3,$4,1,$5)
      on conflict (rate_key, route, bucket_start, bucket_seconds)
      do update set hit_count = identity.rate_limits.hit_count + 1, updated_at = now()
      returning hit_count
      `,
      [key, policy.route, bucket.toISOString(), policy.bucketSeconds, expires.toISOString()],
    );

    await client.query("commit");

    const hits = Number(res.rows[0]?.hit_count || 0);
    return hits <= policy.maxHits;
  } catch {
    await client.query("rollback");
    return true;
  } finally {
    client.release();
  }
}
