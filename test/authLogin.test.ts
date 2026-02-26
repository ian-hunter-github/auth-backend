import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startNetlifyDev } from "./netlifyDevHarness.js";
import type { SuccessEnvelope, ErrorEnvelope } from "../src/lib/response.js";
import type { AuthLoginResponse } from "../src/contracts/auth.js";

let harness: Awaited<ReturnType<typeof startNetlifyDev>> | undefined;

beforeAll(async () => {
  process.env.AUTH_PROVIDER = "fake";
  process.env.SUPABASE_URL = process.env.SUPABASE_URL || "http://127.0.0.1:54321";
  process.env.SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "test_anon_key";
  harness = await startNetlifyDev();
});

afterAll(async () => {
  await harness?.stop();
});

describe("POST /.netlify/functions/auth-login", () => {
  it("rejects invalid credentials", async () => {
    if (!harness) throw new Error("Harness not started");

    const res = await fetch(`${harness.baseUrl}/.netlify/functions/auth-login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "test-auth-401"
      },
      body: JSON.stringify({ username: "demo", password: "bad" })
    });

    expect(res.status).toBe(401);
    const body = (await res.json()) as ErrorEnvelope;
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("accepts demo/letmein", async () => {
    if (!harness) throw new Error("Harness not started");

    const res = await fetch(`${harness.baseUrl}/.netlify/functions/auth-login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "test-auth-200"
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
  });
});
