import { afterAll, beforeAll, describe, expect, it } from "vitest";
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
    const _userId = loginBody.data.user.id;

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
    expect(refreshBody.data.provider).toBe("postgres");

    const access2 = refreshBody.data.session.accessToken;
    const refresh2 = refreshBody.data.session.refreshToken as string;
    expect(refresh2).not.toBe(refresh1);

    const oldRefreshRes = await fetch(`${harness.baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "pg-refresh-old-401",
      },
      body: JSON.stringify({ refreshToken: refresh1 }),
    });
    expect(oldRefreshRes.status).toBe(401);

    const tampered = tamperToken(refresh2);
    const tamperedRes = await fetch(`${harness.baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "pg-refresh-tamper-401",
      },
      body: JSON.stringify({ refreshToken: tampered }),
    });
    expect(tamperedRes.status).toBe(401);
    const tamperedBody = (await tamperedRes.json()) as ErrorEnvelope;
    expect(tamperedBody.ok).toBe(false);
    expect(tamperedBody.error.code).toBe("UNAUTHORIZED");

    const logoutRes = await fetch(`${harness.baseUrl}/.netlify/functions/auth-logout`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "pg-logout-204",
        authorization: `Bearer ${access2}`,
      },
      body: JSON.stringify({ refreshToken: refresh2 }),
    });

    expect([200, 204]).toContain(logoutRes.status);

    const refreshAfterLogout = await fetch(`${harness.baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "pg-refresh-after-logout-401",
      },
      body: JSON.stringify({ refreshToken: refresh2 }),
    });

    expect(refreshAfterLogout.status).toBe(401);
  });
});
