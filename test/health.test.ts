import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startNetlifyDev } from "./netlifyDevHarness.js";
import type { SuccessEnvelope } from "../src/lib/response.js";
import type { HealthResponse } from "../src/contracts/health.js";

let harness: Awaited<ReturnType<typeof startNetlifyDev>> | undefined;

beforeAll(async () => {
  harness = await startNetlifyDev();
});

afterAll(async () => {
  await harness?.stop();
});

describe("GET /.netlify/functions/health", () => {
  it("returns ok envelope", async () => {
    if (!harness) throw new Error("Harness not started");

    const res = await fetch(`${harness.baseUrl}/.netlify/functions/health`, {
      headers: { "x-request-id": "test-health-001" }
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("x-request-id")).toBe("test-health-001");

    const body = (await res.json()) as SuccessEnvelope<HealthResponse>;
    expect(body.ok).toBe(true);
    expect(body.requestId).toBe("test-health-001");
    expect(body.data.status).toBe("ok");
  });
});
