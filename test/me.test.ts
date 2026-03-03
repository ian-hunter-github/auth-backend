import { beforeAll, describe, expect, it } from "vitest";
import type { SuccessEnvelope, ErrorEnvelope } from "../src/lib/response.js";
import type { MeResponse } from "../src/contracts/me.js";

let baseUrl = "";

beforeAll(() => {
  baseUrl = process.env.TEST_BASE_URL || "";
  if (!baseUrl) {
    throw new Error("Missing TEST_BASE_URL (global setup did not run?)");
  }
});

describe("GET /.netlify/functions/me", () => {
  it("rejects missing auth header", async () => {
    const res = await fetch(`${baseUrl}/.netlify/functions/me`, {
      headers: { "x-request-id": "test-me-401a" },
    });

    expect(res.status).toBe(401);
    const body = (await res.json()) as ErrorEnvelope;
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("returns profile for valid token", async () => {
    const res = await fetch(`${baseUrl}/.netlify/functions/me`, {
      headers: {
        authorization: "Bearer fake-access-token.demo",
        "x-request-id": "test-me-200",
      },
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as SuccessEnvelope<MeResponse>;
    expect(body.ok).toBe(true);
    expect(body.data.user.username).toBe("demo");
  });

  it("accepts lowercase bearer scheme", async () => {
    const res = await fetch(`${baseUrl}/.netlify/functions/me`, {
      headers: {
        authorization: "bearer fake-access-token.demo",
        "x-request-id": "test-me-200b",
      },
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as SuccessEnvelope<MeResponse>;
    expect(body.ok).toBe(true);
    expect(body.data.user.username).toBe("demo");
  });
});

