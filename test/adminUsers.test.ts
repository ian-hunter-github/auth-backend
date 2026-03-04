import { describe, it, expect, beforeAll } from "vitest";
import type { SuccessEnvelope, ErrorEnvelope } from "../src/lib/response.js";
import type { AuthLoginResponse } from "../src/contracts/auth.js";
import type { AdminUsersResponse } from "../src/contracts/adminUsers.js";

let baseUrl = "";

beforeAll(() => {
  baseUrl = process.env.TEST_BASE_URL || "";
  if (!baseUrl) {
    throw new Error("Missing TEST_BASE_URL (global setup did not run?)");
  }
});

describe("admin users (GET /admin/users)", () => {
  it("requires auth", async () => {
    const res = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      headers: { "x-request-id": "admin-users-401" }
    });

    expect(res.status).toBe(401);
    const body = (await res.json()) as ErrorEnvelope;
    expect(body.ok).toBe(false);
  });

  it("allows admin allowlist and forbids non-admin", async () => {
    // demo is allowlisted as admin via test/globalSetup.ts (ADMIN_USER_EMAILS=demo)
    const loginRes = await fetch(`${baseUrl}/.netlify/functions/auth-login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "admin-users-login-demo"
      },
      body: JSON.stringify({ username: "demo", password: "letmein" })
    });

    expect(loginRes.status).toBe(200);
    const loginBody = (await loginRes.json()) as SuccessEnvelope<AuthLoginResponse>;
    expect(loginBody.ok).toBe(true);

    const demoAccess = loginBody.data.session.accessToken;

    const okRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      headers: {
        authorization: `Bearer ${demoAccess}`,
        "x-request-id": "admin-users-200"
      }
    });

    expect(okRes.status).toBe(200);
    const okBody = (await okRes.json()) as SuccessEnvelope<AdminUsersResponse>;
    expect(okBody.ok).toBe(true);
    expect(Array.isArray(okBody.data.users)).toBe(true);
    expect(okBody.data.users.length).toBeGreaterThan(0);

    // Login as a seeded non-admin user. (Avoid registering a user, since fake provider
    // user storage is in-memory and Netlify dev may reload modules between requests.)
    const otherLoginRes = await fetch(`${baseUrl}/.netlify/functions/auth-login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "admin-users-login-other"
      },
      body: JSON.stringify({ username: "user@example.com", password: "letmein" })
    });

    expect(otherLoginRes.status).toBe(200);
    const otherLoginBody = (await otherLoginRes.json()) as SuccessEnvelope<AuthLoginResponse>;
    expect(otherLoginBody.ok).toBe(true);

    const otherAccess = otherLoginBody.data.session.accessToken;

    const otherRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      headers: {
        authorization: `Bearer ${otherAccess}`,
        "x-request-id": "admin-users-other-403"
      }
    });

    expect(otherRes.status).toBe(403);
    const otherBody = (await otherRes.json()) as ErrorEnvelope;
    expect(otherBody.ok).toBe(false);
    expect(otherBody.error.code).toBe("FORBIDDEN");
  });
});
