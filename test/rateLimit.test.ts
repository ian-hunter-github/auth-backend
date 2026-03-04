import { beforeAll, describe, expect, it } from "vitest";
import type { ErrorEnvelope, SuccessEnvelope } from "../src/lib/response.js";
import type { AuthLoginResponse, AuthRegisterResponse } from "../src/contracts/auth.js";

let baseUrl = "";

beforeAll(() => {
  baseUrl = process.env.TEST_BASE_URL || "";
  if (!baseUrl) {
    throw new Error("Missing TEST_BASE_URL (global setup did not run?)");
  }
});

describe("rate limiting", () => {
  it("429s after too many auth-login attempts (ip+identifier) and returns retry-after", async () => {
    const email = `ratelimit_${Date.now()}@example.com`;
    const password = "letmein";

    const reg = await fetch(`${baseUrl}/.netlify/functions/auth-register`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-request-id": "test-rl-register" },
      body: JSON.stringify({ email, password, displayName: "Rate Limit User" }),
    });
    expect(reg.status).toBe(201);
    const regBody = (await reg.json()) as SuccessEnvelope<AuthRegisterResponse>;
    expect(regBody.ok).toBe(true);

    // First 10 attempts should not be rate-limited (they should succeed).
    for (let i = 0; i < 10; i++) {
      const res = await fetch(`${baseUrl}/.netlify/functions/auth-login`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-request-id": `test-rl-login-${i}` },
        body: JSON.stringify({ username: email, password }),
      });
      expect(res.status).toBe(200);
      const body = (await res.json()) as SuccessEnvelope<AuthLoginResponse>;
      expect(body.ok).toBe(true);
    }

    const limited = await fetch(`${baseUrl}/.netlify/functions/auth-login`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-request-id": "test-rl-login-429" },
      body: JSON.stringify({ username: email, password }),
    });

    expect(limited.status).toBe(429);

    const retryAfter = limited.headers.get("retry-after");
    expect(typeof retryAfter).toBe("string");
    expect((retryAfter || "").trim().length).toBeGreaterThan(0);

    const body = (await limited.json()) as ErrorEnvelope;
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("RATE_LIMITED");
  });
});
