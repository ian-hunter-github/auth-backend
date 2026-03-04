import { beforeAll, describe, expect, it } from "vitest";
import type { SuccessEnvelope } from "../src/lib/response.js";
import type { HealthResponse } from "../src/contracts/health.js";

let baseUrl = "";

beforeAll(() => {
  baseUrl = process.env.TEST_BASE_URL || "";
  if (!baseUrl) {
    throw new Error("Missing TEST_BASE_URL (global setup did not run?)");
  }
});

describe("GET /.netlify/functions/health", () => {
  it("returns ok envelope", async () => {
    const res = await fetch(`${baseUrl}/.netlify/functions/health`, {
      headers: { "x-request-id": "test-health-001" },
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("x-request-id")).toBe("test-health-001");

    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("x-frame-options")).toBe("DENY");

    const body = (await res.json()) as SuccessEnvelope<HealthResponse>;
    expect(body.ok).toBe(true);
    expect(body.requestId).toBe("test-health-001");
    expect(body.data.status).toBe("ok");
  });
});

