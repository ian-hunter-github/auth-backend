import { afterAll, beforeAll, describe, expect, it } from "vitest";
import pg from "pg";
import { startNetlifyDev } from "./netlifyDevHarness.js";
import type { SuccessEnvelope, ErrorEnvelope } from "../src/lib/response.js";
import type { AuthLoginResponse, AuthRefreshResponse } from "../src/contracts/auth.js";
import { ensurePgEnvLoaded } from "./loadPgEnv.js";

const SHOULD_RUN = process.env.RUN_PG_TESTS === "1";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`RUN_PG_TESTS=1 requires env var ${name}`);
  return v;
}

function tamperToken(t: string): string {
  if (t.length < 2) return `${t}x`;
  const last = t.slice(-1);
  const repl = last === "a" ? "b" : "a";
  return `${t.slice(0, -1)}${repl}`;
}

let harness: Awaited<ReturnType<typeof startNetlifyDev>> | undefined;

const suite = SHOULD_RUN ? describe : describe.skip;

let db: pg.Pool | undefined;

function getDb(): pg.Pool {
  if (db) return db;

  const host = requireEnv("PGHOST");
  const database = requireEnv("PGDATABASE");
  const user = requireEnv("PGUSER");
  const password = requireEnv("PGPASSWORD");
  const port = process.env.PGPORT;
  const sslMode = (process.env.PGSSLMODE || "require").toLowerCase();
  const ssl = sslMode === "disable" ? undefined : { rejectUnauthorized: false };

  db = new pg.Pool({
    host,
    database,
    user,
    password,
    ...(port ? { port: Number(port) } : {}),
    ...(ssl ? { ssl } : {})
  });

  return db;
}

async function countAudit(action: string, requestId: string): Promise<number> {
  const p = getDb();
  const { rows } = await p.query<{ n: string }>(
    "select count(*)::text as n from identity.audit_log where action = $1::text and request_id = $2::text",
    [action, requestId]
  );
  const n = Number(rows[0]?.n || "0");
  return Number.isFinite(n) ? n : 0;
}

suite("postgres refresh flow (RUN_PG_TESTS=1)", () => {
  beforeAll(async () => {
    ensurePgEnvLoaded();

    requireEnv("PGHOST");
    requireEnv("PGDATABASE");
    requireEnv("PGUSER");
    requireEnv("PGPASSWORD");
    requireEnv("AUTH_JWT_SECRET");

    process.env.AUTH_PROVIDER = "postgres";

    harness = await startNetlifyDev();
  });

  afterAll(async () => {
    await harness?.stop();
    if (db) {
      const p = db;
      db = undefined;
      await p.end();
    }
  });

  it("login -> me -> refresh rotates tokens -> old refresh rejected -> logout revokes", async () => {
    if (!harness) throw new Error("Harness not started");

    const loginRes = await fetch(`${harness.baseUrl}/.netlify/functions/auth-login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "pg-login-200",
      },
      body: JSON.stringify({ username: "demo", password: "letmein" }),
    });

    expect(loginRes.status).toBe(200);
    const loginBody = (await loginRes.json()) as SuccessEnvelope<AuthLoginResponse>;
    expect(loginBody.ok).toBe(true);
    expect(loginBody.data.provider).toBe("postgres");

    const access1 = loginBody.data.session.accessToken;
    const refresh1 = loginBody.data.session.refreshToken as string;

    const meRes = await fetch(`${harness.baseUrl}/.netlify/functions/me`, {
      headers: {
        authorization: `Bearer ${access1}`,
        "x-request-id": "pg-me-200",
      },
    });
    expect(meRes.status).toBe(200);

    const refreshRes = await fetch(`${harness.baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "pg-refresh-200",
      },
      body: JSON.stringify({ refreshToken: refresh1 }),
    });

    expect(refreshRes.status).toBe(200);
    const refreshBody = (await refreshRes.json()) as SuccessEnvelope<AuthRefreshResponse>;
    expect(refreshBody.ok).toBe(true);

    const access2 = refreshBody.data.session.accessToken;
    const refresh2 = refreshBody.data.session.refreshToken as string;

    // Postgres provider now issues signed JWT access tokens; these may rotate on refresh.
    expect(access2).not.toBe(access1);
    // Refresh tokens must rotate.
    expect(refresh2).not.toBe(refresh1);

    expect(await countAudit("auth.refresh.rotated", "pg-refresh-200")).toBeGreaterThan(0);

    // Old refresh should now be rejected
    const refreshOldRes = await fetch(`${harness.baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "pg-refresh-old-401",
      },
      body: JSON.stringify({ refreshToken: refresh1 }),
    });
    expect(refreshOldRes.status).toBe(401);
    const refreshOldBody = (await refreshOldRes.json()) as ErrorEnvelope;
    expect(refreshOldBody.ok).toBe(false);

    const logoutRes = await fetch(`${harness.baseUrl}/.netlify/functions/auth-logout`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${access2}`,
        "x-request-id": "pg-logout-200",
      },
      body: JSON.stringify({ refreshToken: refresh2 }),
    });
    expect(logoutRes.status).toBe(204);

    expect(await countAudit("auth.logout", "pg-logout-200")).toBeGreaterThan(0);

    const refreshAfterLogout = await fetch(`${harness.baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "pg-refresh-after-logout-401",
      },
      body: JSON.stringify({ refreshToken: refresh2 }),
    });
    expect(refreshAfterLogout.status).toBe(401);

    const meTampered = await fetch(`${harness.baseUrl}/.netlify/functions/me`, {
      headers: {
        authorization: `Bearer ${tamperToken(access2)}`,
        "x-request-id": "pg-me-tampered-401",
      },
    });
    expect(meTampered.status).toBe(401);
  });
});

