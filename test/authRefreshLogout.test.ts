import { beforeAll, describe, expect, it } from "vitest";
import type { SuccessEnvelope, ErrorEnvelope } from "../src/lib/response.js";
import type { AuthLoginResponse, AuthRefreshResponse } from "../src/contracts/auth.js";

let baseUrl = "";

beforeAll(() => {
  baseUrl = process.env.TEST_BASE_URL || "";
  if (!baseUrl) {
    throw new Error("Missing TEST_BASE_URL (global setup did not run?)");
  }
});

async function loginDemo(): Promise<AuthLoginResponse> {
  const res = await fetch(`${baseUrl}/.netlify/functions/auth-login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-request-id": "test-refresh-login",
      "x-forwarded-for": "127.0.20.1"
    },
    body: JSON.stringify({ username: "demo", password: "letmein" })
  });

  expect(res.status).toBe(200);
  const body = (await res.json()) as SuccessEnvelope<AuthLoginResponse>;
  expect(body.ok).toBe(true);
  return body.data;
}

describe("POST /.netlify/functions/auth-refresh + auth-logout", () => {
  it("rejects invalid refresh token", async () => {
    const res = await fetch(`${baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-request-id": "test-refresh-401" },
      body: JSON.stringify({ refreshToken: "bogus" })
    });

    expect(res.status).toBe(401);
    const body = (await res.json()) as ErrorEnvelope;
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("refresh rotates refresh token, and logout revokes it", async () => {
    const login = await loginDemo();

    const rt1 = login.session.refreshToken as string;
    expect(typeof rt1).toBe("string");

    const refreshRes = await fetch(`${baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-request-id": "test-refresh-200" },
      body: JSON.stringify({ refreshToken: rt1 })
    });

    expect(refreshRes.status).toBe(200);
    const refreshBody = (await refreshRes.json()) as SuccessEnvelope<AuthRefreshResponse>;
    expect(refreshBody.ok).toBe(true);

    const rt2 = refreshBody.data.session.refreshToken as string;
    expect(typeof rt2).toBe("string");
    expect(rt2).not.toBe(rt1);

    const refreshOld = await fetch(`${baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-request-id": "test-refresh-old-401" },
      body: JSON.stringify({ refreshToken: rt1 })
    });

    expect(refreshOld.status).toBe(401);

    const logoutRes = await fetch(`${baseUrl}/.netlify/functions/auth-logout`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "test-logout-204",
        authorization: `Bearer ${refreshBody.data.session.accessToken}`
      },
      body: JSON.stringify({ refreshToken: rt2 })
    });

    expect(logoutRes.status).toBe(204);

    const refreshAfterLogout = await fetch(`${baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-request-id": "test-refresh-after-logout-401" },
      body: JSON.stringify({ refreshToken: rt2 })
    });

    expect(refreshAfterLogout.status).toBe(401);
  });
});

