import { beforeAll, describe, expect, it } from "vitest";
import type { SuccessEnvelope, ErrorEnvelope } from "../src/lib/response.js";
import type { MeResponse, UpdateMeRequest } from "../src/contracts/me.js";
import type { AuthRegisterResponse } from "../src/contracts/auth.js";

let baseUrl = "";
let testUserToken = "";
let testUserUsername = "";
let testUserRoles: string[] = [];

beforeAll(async () => {
  baseUrl = process.env.TEST_BASE_URL || "";
  if (!baseUrl) {
    throw new Error("Missing TEST_BASE_URL (global setup did not run?)");
  }

  // Register a fresh user so these tests don't contend with the "demo" rate limit bucket
  const email = `me-update-test+${Date.now()}@example.com`;
  const res = await fetch(`${baseUrl}/.netlify/functions/auth-register`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-request-id": "me-update-setup-register" },
    body: JSON.stringify({ email, password: "letmein-test", displayName: "Me Update Test" })
  });
  if (!res.ok) throw new Error(`Setup: register failed with ${res.status}`);
  const body = (await res.json()) as SuccessEnvelope<AuthRegisterResponse>;
  testUserToken = body.data.session.accessToken;
  testUserUsername = body.data.user.username;
  testUserRoles = body.data.user.roles;
});

describe("PATCH /.netlify/functions/me", () => {
  it("rejects missing auth header", async () => {
    const res = await fetch(`${baseUrl}/.netlify/functions/me`, {
      method: "PATCH",
      headers: { "content-type": "application/json", "x-request-id": "me-patch-401" },
      body: JSON.stringify({ displayName: "X" } satisfies UpdateMeRequest)
    });
    expect(res.status).toBe(401);
    const body = (await res.json()) as ErrorEnvelope;
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("rejects empty body (no fields)", async () => {
    const res = await fetch(`${baseUrl}/.netlify/functions/me`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${testUserToken}`,
        "content-type": "application/json",
        "x-request-id": "me-patch-400"
      },
      body: JSON.stringify({} satisfies UpdateMeRequest)
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as ErrorEnvelope;
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("BAD_REQUEST");
  });

  it("user can update their own profile fields", async () => {
    const patchRes = await fetch(`${baseUrl}/.netlify/functions/me`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${testUserToken}`,
        "content-type": "application/json",
        "x-request-id": "me-patch-200"
      },
      body: JSON.stringify({
        givenName: "Patched",
        bio: "Updated via PATCH /me.",
        timezone: "Europe/Berlin"
      } satisfies UpdateMeRequest)
    });

    expect(patchRes.status).toBe(200);
    const patchBody = (await patchRes.json()) as SuccessEnvelope<MeResponse>;
    expect(patchBody.ok).toBe(true);
    expect(patchBody.data.user.givenName).toBe("Patched");
    expect(patchBody.data.user.bio).toBe("Updated via PATCH /me.");
    expect(patchBody.data.user.timezone).toBe("Europe/Berlin");
    expect(patchBody.data.user.username).toBe(testUserUsername);
  });

  it("profile update does not change roles", async () => {
    const patchRes = await fetch(`${baseUrl}/.netlify/functions/me`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${testUserToken}`,
        "content-type": "application/json",
        "x-request-id": "me-patch-roles-200"
      },
      body: JSON.stringify({ displayName: "Role Test" } satisfies UpdateMeRequest)
    });

    expect(patchRes.status).toBe(200);
    const body = (await patchRes.json()) as SuccessEnvelope<MeResponse>;
    expect(body.ok).toBe(true);
    expect(body.data.user.roles).toEqual(testUserRoles);
  });
});
