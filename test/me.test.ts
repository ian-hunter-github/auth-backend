import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startNetlifyDev } from "./netlifyDevHarness.js";
import type { SuccessEnvelope, ErrorEnvelope } from "../src/lib/response.js";
import type { MeResponse } from "../src/contracts/me.js";

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

describe("GET /.netlify/functions/me", () => {
  it("rejects missing auth header", async () => {
    if (!harness) throw new Error("Harness not started");

    const res = await fetch(`${harness.baseUrl}/.netlify/functions/me`, {
      headers: { "x-request-id": "test-me-401a" }
    });

    expect(res.status).toBe(401);
    const body = (await res.json()) as ErrorEnvelope;
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("returns profile for valid token", async () => {
    if (!harness) throw new Error("Harness not started");

    const res = await fetch(`${harness.baseUrl}/.netlify/functions/me`, {
      headers: {
        authorization: "Bearer fake-access-token.demo",
        "x-request-id": "test-me-200"
      }
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as SuccessEnvelope<MeResponse>;
    expect(body.ok).toBe(true);
    expect(body.data.user.username).toBe("demo");
  });
});
