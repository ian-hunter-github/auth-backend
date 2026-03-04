import { describe, it, expect, beforeAll } from "vitest";
import type { SuccessEnvelope, ErrorEnvelope } from "../src/lib/response.js";
import type { AuthLoginResponse } from "../src/contracts/auth.js";
import type {
  AdminCreateUserRequest,
  AdminUpdateUserRequest,
  AdminUserResponse,
  AdminUsersResponse
} from "../src/contracts/adminUsers.js";

let baseUrl = "";

beforeAll(() => {
  baseUrl = process.env.TEST_BASE_URL || "";
  if (!baseUrl) {
    throw new Error("Missing TEST_BASE_URL (global setup did not run?)");
  }
});

async function login(username: string, password: string, rid: string) {
  const res = await fetch(`${baseUrl}/.netlify/functions/auth-login`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-request-id": rid },
    body: JSON.stringify({ username, password })
  });

  expect(res.status).toBe(200);
  const body = (await res.json()) as SuccessEnvelope<AuthLoginResponse>;
  expect(body.ok).toBe(true);
  return body.data.session.accessToken;
}

describe("admin users (/.netlify/functions/admin-users)", () => {
  it("requires auth", async () => {
    const res = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      headers: { "x-request-id": "admin-users-401" }
    });

    expect(res.status).toBe(401);
    const body = (await res.json()) as ErrorEnvelope;
    expect(body.ok).toBe(false);
  });

  it("admin can list users and get by id", async () => {
    const adminAccess = await login("demo", "letmein", "admin-users-login-demo");

    const listRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      headers: { authorization: `Bearer ${adminAccess}`, "x-request-id": "admin-users-list-200" }
    });

    expect(listRes.status).toBe(200);
    const listBody = (await listRes.json()) as SuccessEnvelope<AdminUsersResponse>;
    expect(listBody.ok).toBe(true);
    expect(Array.isArray(listBody.data.users)).toBe(true);
    expect(listBody.data.users.length).toBeGreaterThan(0);

    const first = listBody.data.users[0]!;
    expect(typeof first.id).toBe("string");

    const getRes = await fetch(`${baseUrl}/.netlify/functions/admin-users/${first.id}`, {
      headers: { authorization: `Bearer ${adminAccess}`, "x-request-id": "admin-users-get-200" }
    });

    expect(getRes.status).toBe(200);
    const getBody = (await getRes.json()) as SuccessEnvelope<AdminUserResponse>;
    expect(getBody.ok).toBe(true);
    expect(getBody.data.user.id).toBe(first.id);
  });

  it("admin can create and patch users; non-admin forbidden", async () => {
    const adminAccess = await login("demo", "letmein", "admin-users-login-admin");
    const userAccess = await login("user@example.com", "letmein", "admin-users-login-user");

    const forbiddenRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${userAccess}`,
        "content-type": "application/json",
        "x-request-id": "admin-users-nonadmin-403"
      },
      body: JSON.stringify({ email: "x@example.com", password: "letmein" } satisfies AdminCreateUserRequest)
    });

    expect(forbiddenRes.status).toBe(403);
    const forbiddenBody = (await forbiddenRes.json()) as ErrorEnvelope;
    expect(forbiddenBody.ok).toBe(false);
    expect(forbiddenBody.error.code).toBe("FORBIDDEN");

    const badReqRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${adminAccess}`,
        "content-type": "application/json",
        "x-request-id": "admin-users-create-400"
      },
      body: JSON.stringify({ email: "", password: "" } satisfies AdminCreateUserRequest)
    });

    expect(badReqRes.status).toBe(400);

    const createRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${adminAccess}`,
        "content-type": "application/json",
        "x-request-id": "admin-users-create-201"
      },
      body: JSON.stringify({
        email: "new-admin-created@example.com",
        password: "letmein",
        displayName: "Created User",
        roles: ["user"]
      } satisfies AdminCreateUserRequest)
    });

    expect(createRes.status).toBe(201);
    const createBody = (await createRes.json()) as SuccessEnvelope<AdminUserResponse>;
    expect(createBody.ok).toBe(true);
    expect(createBody.data.user.username).toBe("new-admin-created@example.com");
    expect(createBody.data.user.roles).toContain("user");

    const conflictRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${adminAccess}`,
        "content-type": "application/json",
        "x-request-id": "admin-users-create-409"
      },
      body: JSON.stringify({
        email: "new-admin-created@example.com",
        password: "letmein"
      } satisfies AdminCreateUserRequest)
    });

    expect(conflictRes.status).toBe(409);

    const patchRes = await fetch(`${baseUrl}/.netlify/functions/admin-users/${createBody.data.user.id}`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${adminAccess}`,
        "content-type": "application/json",
        "x-request-id": "admin-users-patch-200"
      },
      body: JSON.stringify({
        displayName: "Updated Name",
        roles: ["admin", "user"]
      } satisfies AdminUpdateUserRequest)
    });

    expect(patchRes.status).toBe(200);
    const patchBody = (await patchRes.json()) as SuccessEnvelope<AdminUserResponse>;
    expect(patchBody.ok).toBe(true);
    expect(patchBody.data.user.displayName).toBe("Updated Name");
    expect(patchBody.data.user.roles).toContain("admin");
  });
});

