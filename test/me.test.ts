import { beforeAll, describe, expect, it } from "vitest";
import type { SuccessEnvelope, ErrorEnvelope } from "../src/lib/response.js";
import type { MeResponse } from "../src/contracts/me.js";
import type { AuthLoginResponse } from "../src/contracts/auth.js";

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
    headers: { "content-type": "application/json", "x-request-id": "test-me-login" },
    body: JSON.stringify({ username: "demo", password: "letmein" })
  });
  expect(res.status).toBe(200);
  const body = (await res.json()) as SuccessEnvelope<AuthLoginResponse>;
  expect(body.ok).toBe(true);
  return body.data;
}

describe("GET /.netlify/functions/me", () => {
  it("rejects missing auth header", async () => {
    const res = await fetch(`${baseUrl}/.netlify/functions/me`, {
      headers: { "x-request-id": "test-me-401a" }
    });

    expect(res.status).toBe(401);
    const body = (await res.json()) as ErrorEnvelope;
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("returns profile for valid token", async () => {
    const login = await loginDemo();

    const res = await fetch(`${baseUrl}/.netlify/functions/me`, {
      headers: {
        authorization: `Bearer ${login.session.accessToken}`,
        "x-request-id": "test-me-200"
      }
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as SuccessEnvelope<MeResponse>;
    expect(body.ok).toBe(true);
    expect(body.data.user.username).toBe(login.user.username);
  });

  it("accepts lowercase bearer scheme", async () => {
    const login = await loginDemo();

    const res = await fetch(`${baseUrl}/.netlify/functions/me`, {
      headers: {
        authorization: `bearer ${login.session.accessToken}`,
        "x-request-id": "test-me-200b"
      }
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as SuccessEnvelope<MeResponse>;
    expect(body.ok).toBe(true);
    expect(body.data.user.username).toBe(login.user.username);
  });
});

