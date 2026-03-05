import crypto from "node:crypto";
import { getEnv } from "../lib/env.js";
import type { HealthAdminResponse } from "../contracts/healthAdmin.js";
import { requireAdminUser } from "../security/adminAuth.js";
import { getHealth } from "./healthService.js";

function sha256Hex(s: string): string {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

export async function getHealthAdmin(token: string): Promise<HealthAdminResponse> {
  await requireAdminUser(token);

  const host = getEnv("PGHOST");
  const database = getEnv("PGDATABASE");
  const user = getEnv("PGUSER");
  const port = getEnv("PGPORT");
  const sslMode = getEnv("PGSSLMODE");
  const passwordSet = !!getEnv("PGPASSWORD");

  const configFingerprint = sha256Hex(
    JSON.stringify({
      host: host || null,
      database: database || null,
      user: user || null,
      port: port || null,
      sslMode: sslMode || null,
      passwordSet
    })
  );

  const base = getHealth();

  return {
    ...base,
    envValues: {
      postgres: {
        ...(host ? { host } : {}),
        ...(database ? { database } : {}),
        ...(user ? { user } : {}),
        ...(port ? { port } : {}),
        ...(sslMode ? { sslMode } : {}),
        passwordSet,
        configFingerprint
      }
    }
  };
}

