import { testBaseUrl } from "./helpers/testBaseUrl.js";
import { beforeAll, describe, expect, it } from "vitest";
import type { ErrorEnvelope, SuccessEnvelope } from "../src/lib/response.js";
import type { AuthRegisterResponse } from "../src/contracts/auth.js";

let baseUrl = "";

beforeAll(() => {
  baseUrl = testBaseUrl();
  if (!baseUrl) {
    throw new Error("Missing TEST_BASE_URL (global setup did not run?)");
  }
});

describe("login lockout", () => {
  it("locks after repeated invalid credentials and returns retry-after", async () => {
    const email = `lockout_${Date.now()}@example.com`;
    const password = "letmein";

    const reg = await fetch(`${baseUrl}/.netlify/functions/auth-register`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-request-id": "test-lockout-register" },
      body: JSON.stringify({ email, password, displayName: "Lockout User" }),
    });
    expect(reg.status).toBe(201);
    const regBody = (await reg.json()) as SuccessEnvelope<AuthRegisterResponse>;
    expect(regBody.ok).toBe(true);

    // Lockout policy is enforced server-side; we just drive enough 401s to trigger it.
    for (let i = 0; i < 8; i++) {
      const res = await fetch(`${baseUrl}/.netlify/functions/auth-login`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-request-id": `test-lockout-bad-${i}` },
        body: JSON.stringify({ username: email, password: "wrong" }),
      });
      expect(res.status).toBe(401);
      const body = (await res.json()) as ErrorEnvelope;
      expect(body.ok).toBe(false);
      expect(body.error.code).toBe("UNAUTHORIZED");
    }

    // Next attempt should be locked.
    const locked = await fetch(`${baseUrl}/.netlify/functions/auth-login`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-request-id": "test-lockout-429" },
      body: JSON.stringify({ username: email, password: "wrong" }),
    });

    expect(locked.status).toBe(429);

    const retryAfter = locked.headers.get("retry-after");
    expect(typeof retryAfter).toBe("string");
    expect((retryAfter || "").trim().length).toBeGreaterThan(0);

    const lockedBody = (await locked.json()) as ErrorEnvelope;
    expect(lockedBody.ok).toBe(false);
    expect(lockedBody.error.code).toBe("RATE_LIMITED");

    // Another identifier should not be impacted (still returns 401, not 429).
    const other = await fetch(`${baseUrl}/.netlify/functions/auth-login`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-request-id": "test-lockout-other-401" },
      body: JSON.stringify({ username: `other_${Date.now()}@example.com`, password: "wrong" }),
    });

    expect(other.status).toBe(401);
  });
});
