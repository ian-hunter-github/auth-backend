import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startNetlifyDev } from "./netlifyDevHarness.js";

let harness: Awaited<ReturnType<typeof startNetlifyDev>> | undefined;

beforeAll(async () => {
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
    const body = await res.json();
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
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.data.user.username).toBe("demo");
  });
});
