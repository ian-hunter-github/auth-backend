import { beforeAll, describe, expect, it } from "vitest";
import type { ErrorEnvelope } from "../src/lib/response.js";

let baseUrl = "";

beforeAll(() => {
  baseUrl = process.env.TEST_BASE_URL || "";
  if (!baseUrl) {
    throw new Error("Missing TEST_BASE_URL (global setup did not run?)");
  }
});

describe("rate limiting", () => {
  it("429s after too many auth-login attempts (ip+identifier) and returns retry-after", async () => {
    // Use a unique identifier not used elsewhere in the suite so we don't accidentally
    // interact with other tests' login calls.
    const username = "ratelimit_user";
    const password = "bad-password";

    // First 10 attempts should not be rate-limited (they may be 401 invalid credentials).
    for (let i = 0; i < 10; i++) {
      const res = await fetch(`${baseUrl}/.netlify/functions/auth-login`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-request-id": `test-rl-login-${i}` },
        body: JSON.stringify({ username, password }),
      });
      expect([200, 401]).toContain(res.status);
    }

    const limited = await fetch(`${baseUrl}/.netlify/functions/auth-login`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-request-id": "test-rl-login-429" },
      body: JSON.stringify({ username, password }),
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
