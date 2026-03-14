import { describe, it, expect, beforeAll } from "vitest";
import type { SuccessEnvelope, ErrorEnvelope } from "../src/lib/response.js";
import type { AuthLoginResponse, AuthRefreshResponse } from "../src/contracts/auth.js";
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

function uniqueEmail(tag: string): string {
  return `test+${tag}+${Date.now()}@example.com`;
}

async function login(username: string, password: string, rid: string) {
  const res = await fetch(`${baseUrl}/.netlify/functions/auth-login`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-request-id": rid },
    body: JSON.stringify({ username, password })
  });

  return res;
}

async function loginOk(username: string, password: string, rid: string) {
  const res = await login(username, password, rid);
  expect(res.status).toBe(200);
  const body = (await res.json()) as SuccessEnvelope<AuthLoginResponse>;
  expect(body.ok).toBe(true);
  return body.data;
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

  it("returns ok:false for method not allowed and missing id", async () => {
    const adminAccess = (await loginOk("demo", "letmein", "admin-users-login-demo-errs")).session.accessToken;

    const postIdRes = await fetch(`${baseUrl}/.netlify/functions/admin-users/00000000-0000-0000-0000-000000000000`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${adminAccess}`,
        "content-type": "application/json",
        "x-request-id": "admin-users-post-id-405"
      },
      body: JSON.stringify({ email: "x@example.com", password: "letmein" } satisfies AdminCreateUserRequest)
    });

    expect(postIdRes.status).toBe(405);
    const postIdBody = (await postIdRes.json()) as ErrorEnvelope;
    expect(postIdBody.ok).toBe(false);
    expect(postIdBody.error.code).toBe("BAD_REQUEST");

    const patchNoIdRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${adminAccess}`,
        "content-type": "application/json",
        "x-request-id": "admin-users-patch-noid-400"
      },
      body: JSON.stringify({ displayName: "x" } satisfies AdminUpdateUserRequest)
    });

    expect(patchNoIdRes.status).toBe(400);
    const patchNoIdBody = (await patchNoIdRes.json()) as ErrorEnvelope;
    expect(patchNoIdBody.ok).toBe(false);
    expect(patchNoIdBody.error.code).toBe("BAD_REQUEST");
  });

  it("admin can list users and get by id", async () => {
    const adminAccess = (await loginOk("demo", "letmein", "admin-users-login-demo")).session.accessToken;

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
    const adminAccess = (await loginOk("demo", "letmein", "admin-users-login-admin")).session.accessToken;
    const userAccess = (await loginOk("user@example.com", "letmein", "admin-users-login-user")).session.accessToken;

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

    const email = uniqueEmail("admin-create");

    const createRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${adminAccess}`,
        "content-type": "application/json",
        "x-request-id": "admin-users-create-201"
      },
      body: JSON.stringify({
        email,
        password: "letmein",
        displayName: "Created User",
        roles: ["user"],
        givenName: "Created",
        familyName: "User",
        bio: "A test user.",
        phoneNumber: "+1 555 000 9999",
        locale: "en-US",
        timezone: "America/Chicago"
      } satisfies AdminCreateUserRequest)
    });

    expect(createRes.status).toBe(201);
    const createBody = (await createRes.json()) as SuccessEnvelope<AdminUserResponse>;
    expect(createBody.ok).toBe(true);
    expect(createBody.data.user.username).toBe(email);
    expect(createBody.data.user.roles).toContain("user");
    expect(createBody.data.user.givenName).toBe("Created");
    expect(createBody.data.user.familyName).toBe("User");
    expect(createBody.data.user.bio).toBe("A test user.");
    expect(createBody.data.user.phoneNumber).toBe("+1 555 000 9999");
    expect(createBody.data.user.locale).toBe("en-US");
    expect(createBody.data.user.timezone).toBe("America/Chicago");

    const conflictRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${adminAccess}`,
        "content-type": "application/json",
        "x-request-id": "admin-users-create-409"
      },
      body: JSON.stringify({
        email,
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
        roles: ["admin", "user"],
        givenName: "Updated",
        bio: "Updated bio.",
        timezone: "Europe/Paris"
      } satisfies AdminUpdateUserRequest)
    });

    expect(patchRes.status).toBe(200);
    const patchBody = (await patchRes.json()) as SuccessEnvelope<AdminUserResponse>;
    expect(patchBody.ok).toBe(true);
    expect(patchBody.data.user.displayName).toBe("Updated Name");
    expect(patchBody.data.user.roles).toContain("admin");
    expect(patchBody.data.user.givenName).toBe("Updated");
    expect(patchBody.data.user.bio).toBe("Updated bio.");
    expect(patchBody.data.user.timezone).toBe("Europe/Paris");
    // unchanged from create
    expect(patchBody.data.user.familyName).toBe("User");
    expect(patchBody.data.user.locale).toBe("en-US");
  });

  it("admin can soft delete users; deleted user cannot login or refresh", async () => {
    const adminAccess = (await loginOk("demo", "letmein", "admin-users-login-admin-2")).session.accessToken;

    const email = uniqueEmail("to-delete");

    const createRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${adminAccess}`,
        "content-type": "application/json",
        "x-request-id": "admin-users-create-softdel-201"
      },
      body: JSON.stringify({
        email,
        password: "letmein",
        displayName: "To Delete",
        roles: ["user"]
      } satisfies AdminCreateUserRequest)
    });

    expect(createRes.status).toBe(201);
    const createBody = (await createRes.json()) as SuccessEnvelope<AdminUserResponse>;
    expect(createBody.ok).toBe(true);

    const loginBody = await loginOk(email, "letmein", "admin-users-login-todelete");
    const refreshToken = loginBody.session.refreshToken;

    const delRes = await fetch(`${baseUrl}/.netlify/functions/admin-users/${createBody.data.user.id}`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${adminAccess}`, "x-request-id": "admin-users-del-204" }
    });

    expect(delRes.status).toBe(204);

    const loginAfterRes = await login(email, "letmein", "admin-users-login-todelete-after");
    expect(loginAfterRes.status).toBe(401);

    const refreshAfterRes = await fetch(`${baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-request-id": "admin-users-refresh-after-del" },
      body: JSON.stringify({ refreshToken })
    });

    expect(refreshAfterRes.status).toBe(401);
    const refreshAfterBody = (await refreshAfterRes.json()) as ErrorEnvelope | SuccessEnvelope<AuthRefreshResponse>;
    expect(refreshAfterBody.ok).toBe(false);
  });

  it("admin can disable and enable a user", async () => {
    const adminAccess = (await loginOk("demo", "letmein", "admin-disable-login-admin")).session.accessToken;

    const email = uniqueEmail("disable-enable");

    const createRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${adminAccess}`,
        "content-type": "application/json",
        "x-request-id": "admin-disable-create-201"
      },
      body: JSON.stringify({ email, password: "letmein", displayName: "Disable Target" } satisfies AdminCreateUserRequest)
    });
    expect(createRes.status).toBe(201);
    const createBody = (await createRes.json()) as SuccessEnvelope<AdminUserResponse>;
    const userId = createBody.data.user.id;

    // User can log in before being disabled
    const loginBefore = await loginOk(email, "letmein", "admin-disable-user-login");
    const refreshToken = loginBefore.session.refreshToken!;

    // Non-admin cannot disable
    const userAccess = (await loginOk("user@example.com", "letmein", "admin-disable-nonadmin-login")).session.accessToken;
    const forbiddenRes = await fetch(`${baseUrl}/.netlify/functions/admin-users/${userId}/disable`, {
      method: "POST",
      headers: { authorization: `Bearer ${userAccess}`, "x-request-id": "admin-disable-403" }
    });
    expect(forbiddenRes.status).toBe(403);

    // Admin disables the user
    const disableRes = await fetch(`${baseUrl}/.netlify/functions/admin-users/${userId}/disable`, {
      method: "POST",
      headers: { authorization: `Bearer ${adminAccess}`, "x-request-id": "admin-disable-204" }
    });
    expect(disableRes.status).toBe(204);

    // Disabled flag appears in user listing
    const listRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      headers: { authorization: `Bearer ${adminAccess}`, "x-request-id": "admin-disable-list" }
    });
    expect(listRes.status).toBe(200);
    const listBody = (await listRes.json()) as SuccessEnvelope<AdminUsersResponse>;
    const disabledUser = listBody.data.users.find((u) => u.id === userId);
    expect(disabledUser?.disabled).toBe(true);

    // Disabled user cannot log in
    const loginAfterRes = await login(email, "letmein", "admin-disable-login-after");
    expect(loginAfterRes.status).toBe(403);

    // Disabled user's existing refresh token is revoked
    const refreshAfterRes = await fetch(`${baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-request-id": "admin-disable-refresh-after" },
      body: JSON.stringify({ refreshToken })
    });
    expect(refreshAfterRes.status).toBe(401);

    // Admin enables the user
    const enableRes = await fetch(`${baseUrl}/.netlify/functions/admin-users/${userId}/enable`, {
      method: "POST",
      headers: { authorization: `Bearer ${adminAccess}`, "x-request-id": "admin-enable-204" }
    });
    expect(enableRes.status).toBe(204);

    // User can log in again after being enabled
    const loginAfterEnableRes = await login(email, "letmein", "admin-enable-login-after");
    expect(loginAfterEnableRes.status).toBe(200);

    // Enabled flag is cleared in user listing
    const listAfterRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      headers: { authorization: `Bearer ${adminAccess}`, "x-request-id": "admin-enable-list" }
    });
    expect(listAfterRes.status).toBe(200);
    const listAfterBody = (await listAfterRes.json()) as SuccessEnvelope<AdminUsersResponse>;
    const enabledUser = listAfterBody.data.users.find((u) => u.id === userId);
    expect(enabledUser?.disabled).toBeFalsy();
  });

  it("admin can revoke all sessions for a user without deleting the account", async () => {
    const adminAccess = (await loginOk("demo", "letmein", "admin-revoke-login-admin")).session.accessToken;

    const email = uniqueEmail("revoke-sessions");

    const createRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${adminAccess}`,
        "content-type": "application/json",
        "x-request-id": "admin-revoke-create-201"
      },
      body: JSON.stringify({
        email,
        password: "letmein",
        displayName: "Revoke Target"
      } satisfies AdminCreateUserRequest)
    });
    expect(createRes.status).toBe(201);
    const createBody = (await createRes.json()) as SuccessEnvelope<AdminUserResponse>;
    const userId = createBody.data.user.id;

    // Login as the new user to get a session
    const userLogin = await loginOk(email, "letmein", "admin-revoke-user-login");
    const refreshToken = userLogin.session.refreshToken!;

    // Non-admin cannot revoke sessions
    const userAccess = (await loginOk("user@example.com", "letmein", "admin-revoke-nonadmin-login")).session.accessToken;
    const forbiddenRes = await fetch(`${baseUrl}/.netlify/functions/admin-users/${userId}/sessions`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${userAccess}`, "x-request-id": "admin-revoke-403" }
    });
    expect(forbiddenRes.status).toBe(403);

    // Admin revokes sessions
    const revokeRes = await fetch(`${baseUrl}/.netlify/functions/admin-users/${userId}/sessions`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${adminAccess}`, "x-request-id": "admin-revoke-204" }
    });
    expect(revokeRes.status).toBe(204);

    // Old refresh token is now invalid
    const refreshAfterRes = await fetch(`${baseUrl}/.netlify/functions/auth-refresh`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-request-id": "admin-revoke-refresh-401" },
      body: JSON.stringify({ refreshToken })
    });
    expect(refreshAfterRes.status).toBe(401);

    // But the account still exists — user can login fresh
    const reLoginRes = await login(email, "letmein", "admin-revoke-relogin");
    expect(reLoginRes.status).toBe(200);
  });
});
