import pg from "pg";
import { getEnv, requireEnv } from "../../lib/env.js";

const { Pool } = pg;

let pool: pg.Pool | undefined;

export function getPool(): pg.Pool {
  if (pool) return pool;

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

export async function closePool(): Promise<void> {
  if (!pool) return;
  const p = pool;
  pool = undefined;
  await p.end();
}

