import { testBaseUrl } from "./helpers/testBaseUrl.js";
import { beforeAll, describe, expect, it } from "vitest";
import type { SuccessEnvelope } from "../src/lib/response.js";
import type { HealthResponse } from "../src/contracts/health.js";

let baseUrl = "";

beforeAll(() => {
  baseUrl = testBaseUrl();
  if (!baseUrl) {
    throw new Error("Missing TEST_BASE_URL (global setup did not run?)");
  }
});

describe("GET /.netlify/functions/health", () => {
  it("returns ok envelope", async () => {
    const res = await fetch(`${baseUrl}/.netlify/functions/health`, {
      headers: { "x-request-id": "test-health-001" }
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

    expect(typeof body.data.version).toBe("string");
    expect(body.data.version.length).toBeGreaterThan(0);

    expect(typeof body.data.timestamp).toBe("string");
    expect(body.data.timestamp.length).toBeGreaterThan(0);

    expect(body.data.build.version).toBe(body.data.version);
    expect(typeof body.data.build.buildTime).toBe("string");
    expect(body.data.build.buildTime.length).toBeGreaterThan(0);
    expect(typeof body.data.build.node).toBe("string");
    expect(body.data.build.node.length).toBeGreaterThan(0);

    if (body.data.build.sha !== undefined) {
      expect(typeof body.data.build.sha).toBe("string");
      expect(body.data.build.sha.length).toBeGreaterThan(0);
    }

    if (body.data.build.shortSha !== undefined) {
      expect(typeof body.data.build.shortSha).toBe("string");
      expect(body.data.build.shortSha.length).toBeGreaterThan(0);
    }

    if (body.data.build.branch !== undefined) {
      expect(typeof body.data.build.branch).toBe("string");
      expect(body.data.build.branch.length).toBeGreaterThan(0);
    }

    if (body.data.project.workPackage !== undefined) {
      expect(typeof body.data.project.workPackage).toBe("string");
      expect(body.data.project.workPackage.length).toBeGreaterThan(0);
    }

    if (body.data.project.phase !== undefined) {
      expect(["number", "string"]).toContain(typeof body.data.project.phase);
      if (typeof body.data.project.phase === "string") {
        expect(body.data.project.phase.length).toBeGreaterThan(0);
      }
    }

    if (body.data.project.step !== undefined) {
      expect(typeof body.data.project.step).toBe("string");
      expect(body.data.project.step.length).toBeGreaterThan(0);
    }

    if (body.data.project.description !== undefined) {
      expect(typeof body.data.project.description).toBe("string");
      expect(body.data.project.description.length).toBeGreaterThan(0);
    }
  });
});
