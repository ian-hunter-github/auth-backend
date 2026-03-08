import { beforeAll, describe, expect, it } from "vitest";
import type { ErrorEnvelope, SuccessEnvelope } from "../src/lib/response.js";
import type { AuthRegisterResponse } from "../src/contracts/auth.js";

let baseUrl = "";

beforeAll(() => {
  baseUrl = process.env.TEST_BASE_URL || "";
  if (!baseUrl) {
    throw new Error("Missing TEST_BASE_URL (global setup did not run?)");
  }
});

describe("rate limiting", () => {
  it("eventually 429s after too many auth-login attempts (ip+identifier) and returns retry-after", async () => {
    const email = `ratelimit_${Date.now()}@example.com`;
    const password = "secret123";

    const registerRes = await fetch(`${baseUrl}/.netlify/functions/auth-register`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-request-id": "rate-limit-register" },
      body: JSON.stringify({
        email,
        password,
        displayName: "Rate Limit User"
      })
    });

    expect(registerRes.status).toBe(201);
    const registerBody = (await registerRes.json()) as SuccessEnvelope<AuthRegisterResponse>;
    expect(registerBody.ok).toBe(true);

    let limited: Response | null = null;
    let limitedAttempt = -1;

    for (let i = 0; i < 25; i++) {
      const res = await fetch(`${baseUrl}/.netlify/functions/auth-login`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-request-id": `rate-limit-${i}`,
          "x-forwarded-for": "127.0.0.1"
        },
        body: JSON.stringify({
          username: email,
          password
        })
      });

      if (res.status === 429) {
        limited = res;
        limitedAttempt = i + 1;
        break;
      }

      expect(res.status).toBe(200);
    }

    expect(limited, "expected rate limiter to trip within 25 attempts").not.toBeNull();
    expect(limitedAttempt).toBeGreaterThan(0);
    expect(limitedAttempt).toBeLessThanOrEqual(25);

    const limitedRes = limited as Response;
    expect(limitedRes.status).toBe(429);

    const retryAfter = limitedRes.headers.get("retry-after");
    expect(retryAfter).toBeTruthy();
    expect(Number(retryAfter)).toBeGreaterThan(0);

    const limitedBody = (await limitedRes.json()) as ErrorEnvelope;
    expect(limitedBody.ok).toBe(false);
    expect(limitedBody.error.code).toBe("RATE_LIMITED");
  });
});
