import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startNetlifyDev } from "./netlifyDevHarness.js";
import type { SuccessEnvelope, ErrorEnvelope } from "../src/lib/response.js";
import type { AuthLoginResponse, AuthRefreshResponse, AuthLogoutResponse } from "../src/contracts/auth.js";

let harness: Awaited<ReturnType<typeof startNetlifyDev>> | undefined;

beforeAll(async () => {
  process.env.AUTH_PROVIDER = "fake";
  harness = await startNetlifyDev();
});

afterAll(async () => {
  await harness?.stop();
});

describe("POST /.netlify/functions/auth-refresh + auth-logout", () => {
  it("rejects invalid refresh token", async () => {
    if (!harness) throw new Error("Harness not started");

    const res = await fetch(`${harness.baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "test-refresh-401"
      },
      body: JSON.stringify({ refreshToken: "bogus" })
    });

    expect(res.status).toBe(401);
    const body = (await res.json()) as ErrorEnvelope;
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("refresh rotates refresh token, and logout revokes it", async () => {
    if (!harness) throw new Error("Harness not started");

    const loginRes = await fetch(`${harness.baseUrl}/.netlify/functions/auth-login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "test-login-200"
      },
      body: JSON.stringify({ username: "demo", password: "letmein" })
    });

    expect(loginRes.status).toBe(200);
    const loginBody = (await loginRes.json()) as SuccessEnvelope<AuthLoginResponse>;
    expect(loginBody.ok).toBe(true);
    expect(loginBody.data.provider).toBe("fake");
    expect(typeof loginBody.data.session.refreshToken).toBe("string");

    const rt1 = loginBody.data.session.refreshToken as string;

    const refreshRes = await fetch(`${harness.baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "test-refresh-200"
      },
      body: JSON.stringify({ refreshToken: rt1 })
    });

    expect(refreshRes.status).toBe(200);
    const refreshBody = (await refreshRes.json()) as SuccessEnvelope<AuthRefreshResponse>;
    expect(refreshBody.ok).toBe(true);
    expect(refreshBody.data.provider).toBe("fake");
    expect(typeof refreshBody.data.session.accessToken).toBe("string");
    expect(typeof refreshBody.data.session.refreshToken).toBe("string");

    const rt2 = refreshBody.data.session.refreshToken as string;
    expect(rt2).not.toBe(rt1);

    const logoutRes = await fetch(`${harness.baseUrl}/.netlify/functions/auth-logout`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "test-logout-200"
      },
      body: JSON.stringify({ refreshToken: rt2 })
    });

    expect(logoutRes.status).toBe(200);
    const logoutBody = (await logoutRes.json()) as SuccessEnvelope<AuthLogoutResponse>;
    expect(logoutBody.ok).toBe(true);
    expect(logoutBody.data.provider).toBe("fake");
    expect(logoutBody.data.revoked).toBe(true);

    const refreshAfterLogout = await fetch(`${harness.baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "test-refresh-401b"
      },
      body: JSON.stringify({ refreshToken: rt2 })
    });

    expect(refreshAfterLogout.status).toBe(401);
    const body401 = (await refreshAfterLogout.json()) as ErrorEnvelope;
    expect(body401.ok).toBe(false);
    expect(body401.error.code).toBe("UNAUTHORIZED");
  });
});

