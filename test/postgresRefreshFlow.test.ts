import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startNetlifyDev } from "./netlifyDevHarness.js";
import type { SuccessEnvelope, ErrorEnvelope } from "../src/lib/response.js";
import type { AuthLoginResponse, AuthRefreshResponse, AuthLogoutResponse } from "../src/contracts/auth.js";

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
        "x-request-id": "pg-login-200"
      },
      body: JSON.stringify({ username: "demo", password: "letmein" })
    });

    expect(loginRes.status).toBe(200);
    const loginBody = (await loginRes.json()) as SuccessEnvelope<AuthLoginResponse>;
    expect(loginBody.ok).toBe(true);
    expect(loginBody.data.provider).toBe("postgres");

    const access1 = loginBody.data.session.accessToken;
    const refresh1 = loginBody.data.session.refreshToken as string;
    const userId = loginBody.data.user.id;

    expect(typeof access1).toBe("string");
    expect(typeof refresh1).toBe("string");
    expect(typeof userId).toBe("string");

    const me1Res = await fetch(`${harness.baseUrl}/.netlify/functions/me`, {
      headers: {
        authorization: `Bearer ${access1}`,
        "x-request-id": "pg-me-1"
      }
    });

    expect(me1Res.status).toBe(200);
    const me1Body = (await me1Res.json()) as SuccessEnvelope<{ user: { id: string } }>;
    expect(me1Body.ok).toBe(true);
    expect(me1Body.data.user.id).toBe(userId);

    const refreshRes = await fetch(`${harness.baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "pg-refresh-200"
      },
      body: JSON.stringify({ refreshToken: refresh1 })
    });

    expect(refreshRes.status).toBe(200);
    const refreshBody = (await refreshRes.json()) as SuccessEnvelope<AuthRefreshResponse>;
    expect(refreshBody.ok).toBe(true);
    expect(refreshBody.data.provider).toBe("postgres");

    const access2 = refreshBody.data.session.accessToken;
    const refresh2 = refreshBody.data.session.refreshToken as string;

    expect(access2).not.toBe(access1);
    expect(refresh2).not.toBe(refresh1);

    const refreshOldRes = await fetch(`${harness.baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "pg-refresh-old-401"
      },
      body: JSON.stringify({ refreshToken: refresh1 })
    });

    expect(refreshOldRes.status).toBe(401);
    const refreshOldBody = (await refreshOldRes.json()) as ErrorEnvelope;
    expect(refreshOldBody.ok).toBe(false);
    expect(refreshOldBody.error.code).toBe("UNAUTHORIZED");

    const me2Res = await fetch(`${harness.baseUrl}/.netlify/functions/me`, {
      headers: {
        authorization: `Bearer ${access2}`,
        "x-request-id": "pg-me-2"
      }
    });

    expect(me2Res.status).toBe(200);
    const me2Body = (await me2Res.json()) as SuccessEnvelope<{ user: { id: string } }>;
    expect(me2Body.ok).toBe(true);
    expect(me2Body.data.user.id).toBe(userId);

    const meTamperedRes = await fetch(`${harness.baseUrl}/.netlify/functions/me`, {
      headers: {
        authorization: `Bearer ${tamperToken(access2)}`,
        "x-request-id": "pg-me-tampered-401"
      }
    });

    expect(meTamperedRes.status).toBe(401);
    const meTamperedBody = (await meTamperedRes.json()) as ErrorEnvelope;
    expect(meTamperedBody.ok).toBe(false);
    expect(meTamperedBody.error.code).toBe("UNAUTHORIZED");

    const logoutRes = await fetch(`${harness.baseUrl}/.netlify/functions/auth-logout`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "pg-logout-200"
      },
      body: JSON.stringify({ refreshToken: refresh2 })
    });

    expect(logoutRes.status).toBe(200);
    const logoutBody = (await logoutRes.json()) as SuccessEnvelope<AuthLogoutResponse>;
    expect(logoutBody.ok).toBe(true);
    expect(logoutBody.data.provider).toBe("postgres");
    expect(logoutBody.data.revoked).toBe(true);

    const refreshAfterLogoutRes = await fetch(`${harness.baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "pg-refresh-after-logout-401"
      },
      body: JSON.stringify({ refreshToken: refresh2 })
    });

    expect(refreshAfterLogoutRes.status).toBe(401);
    const refreshAfterLogoutBody = (await refreshAfterLogoutRes.json()) as ErrorEnvelope;
    expect(refreshAfterLogoutBody.ok).toBe(false);
    expect(refreshAfterLogoutBody.error.code).toBe("UNAUTHORIZED");
  });
});

