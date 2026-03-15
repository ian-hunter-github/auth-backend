import { testBaseUrl } from "../helpers/testBaseUrl.js";
import { beforeAll, describe, expect, it } from "vitest";
import type { SuccessEnvelope, ErrorEnvelope } from "../../src/lib/response.js";
import type { AuthLoginResponse } from "../../src/contracts/auth.js";

let baseUrl = "";

beforeAll(() => {
  baseUrl = testBaseUrl();
  if (!baseUrl) {
    throw new Error("Missing TEST_BASE_URL (global setup did not run?)");
  }
});

describe("POST /.netlify/functions/auth-login", () => {
  it("rejects invalid credentials", async () => {
    const res = await fetch(`${baseUrl}/.netlify/functions/auth-login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "test-auth-401",
        "x-forwarded-for": "127.0.10.1"
      },
      body: JSON.stringify({ username: "demo", password: "bad" })
    });

    expect(res.status).toBe(401);
    const body = (await res.json()) as ErrorEnvelope;
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("accepts demo/letmein", async () => {
    const res = await fetch(`${baseUrl}/.netlify/functions/auth-login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "test-auth-200",
        "x-forwarded-for": "127.0.10.2"
      },
      body: JSON.stringify({ username: "demo", password: "letmein" })
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as SuccessEnvelope<AuthLoginResponse>;
    expect(body.ok).toBe(true);

    expect(body.data.provider).toBe("fake");
    expect(body.data.user.username).toBe("demo");
    expect(typeof body.data.session.accessToken).toBe("string");
    expect(body.data.session.tokenType).toBe("bearer");
    expect(typeof body.data.session.refreshToken).toBe("string");
  });
});

