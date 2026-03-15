import { testBaseUrl } from "../helpers/testBaseUrl.js";
import { describe, it, expect, beforeAll } from "vitest";
import type { SuccessEnvelope, ErrorEnvelope } from "../../src/lib/response.js";
import type { AuthLoginResponse } from "../../src/contracts/auth.js";
import type {
  AdminCreateUserRequest,
  AdminUpdateUserRequest,
  AdminUserResponse,
  AdminUsersResponse,
} from "../../src/contracts/adminUsers.js";

let baseUrl = "";

beforeAll(() => {
  baseUrl = testBaseUrl();
  if (!baseUrl) {
    throw new Error("Missing TEST_BASE_URL (global setup did not run?)");
  }
});

function uniqueEmail(tag: string): string {
  return `test+${tag}+${Date.now()}@example.com`;
}

function loginIp(rid: string): string {
  switch (rid) {
    case "admin-users-login-demo-errs":
      return "127.0.40.1";
    case "admin-users-login-demo":
      return "127.0.40.2";
    case "admin-users-login-admin":
      return "127.0.40.3";
    case "admin-users-login-user":
      return "127.0.40.4";
    case "admin-users-login-user-2":
      return "127.0.40.5";
    case "admin-users-login-admin-disable":
      return "127.0.40.6";
    case "admin-users-login-user-disable":
      return "127.0.40.7";
    case "admin-users-login-admin-revoke":
      return "127.0.40.8";
    case "admin-users-login-user-revoke":
      return "127.0.40.9";
    case "admin-users-delete-login-created":
      return "127.0.40.10";
    case "admin-users-delete-login-401":
      return "127.0.40.11";
    case "admin-disable-login-401":
      return "127.0.40.12";
    case "admin-enable-login-200":
      return "127.0.40.13";
    case "admin-revoke-login-again-200":
      return "127.0.40.14";
    default:
      return "127.0.40.15";
  }
}

async function login(username: string, password: string, rid: string) {
  const res = await fetch(`${baseUrl}/.netlify/functions/auth-login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-request-id": rid,
      "x-forwarded-for": loginIp(rid),
    },
    body: JSON.stringify({ username, password }),
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
      headers: { "x-request-id": "admin-users-401" },
    });

    expect(res.status).toBe(401);
    const body = (await res.json()) as ErrorEnvelope;
    expect(body.ok).toBe(false);
  });

  it("returns ok:false for method not allowed and missing id", async () => {
    const adminAccess = (await loginOk("demo", "letmein", "admin-users-login-demo-errs")).session
      .accessToken;

    const postIdRes = await fetch(
      `${baseUrl}/.netlify/functions/admin-users/00000000-0000-0000-0000-000000000000`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${adminAccess}`,
          "content-type": "application/json",
          "x-request-id": "admin-users-post-id-405",
        },
        body: JSON.stringify({
          email: "x@example.com",
          password: "letmein",
        } satisfies AdminCreateUserRequest),
      },
    );

    expect(postIdRes.status).toBe(405);
    const postIdBody = (await postIdRes.json()) as ErrorEnvelope;
    expect(postIdBody.ok).toBe(false);
    expect(postIdBody.error.code).toBe("BAD_REQUEST");

    const patchNoIdRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${adminAccess}`,
        "content-type": "application/json",
        "x-request-id": "admin-users-patch-noid-400",
      },
      body: JSON.stringify({ displayName: "x" } satisfies AdminUpdateUserRequest),
    });

    expect(patchNoIdRes.status).toBe(400);
    const patchNoIdBody = (await patchNoIdRes.json()) as ErrorEnvelope;
    expect(patchNoIdBody.ok).toBe(false);
    expect(patchNoIdBody.error.code).toBe("BAD_REQUEST");
  });

  it("admin can list users and get by id", async () => {
    const adminAccess = (await loginOk("demo", "letmein", "admin-users-login-demo")).session
      .accessToken;

    const listRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      headers: { authorization: `Bearer ${adminAccess}`, "x-request-id": "admin-users-list-200" },
    });

    expect(listRes.status).toBe(200);
    const listBody = (await listRes.json()) as SuccessEnvelope<AdminUsersResponse>;
    expect(listBody.ok).toBe(true);
    expect(Array.isArray(listBody.data.users)).toBe(true);
    expect(listBody.data.users.length).toBeGreaterThan(0);

    const first = listBody.data.users[0]!;
    expect(typeof first.id).toBe("string");

    const getRes = await fetch(`${baseUrl}/.netlify/functions/admin-users/${first.id}`, {
      headers: { authorization: `Bearer ${adminAccess}`, "x-request-id": "admin-users-get-200" },
    });

    expect(getRes.status).toBe(200);
    const getBody = (await getRes.json()) as SuccessEnvelope<AdminUserResponse>;
    expect(getBody.ok).toBe(true);
    expect(getBody.data.user.id).toBe(first.id);
  });

  it("admin can create and patch users; non-admin forbidden", async () => {
    const adminAccess = (await loginOk("demo", "letmein", "admin-users-login-admin")).session
      .accessToken;
    const userAccess = (await loginOk("user@example.com", "letmein", "admin-users-login-user"))
      .session.accessToken;

    const forbiddenRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${userAccess}`,
        "content-type": "application/json",
        "x-request-id": "admin-users-nonadmin-403",
      },
      body: JSON.stringify({
        email: "x@example.com",
        password: "letmein",
      } satisfies AdminCreateUserRequest),
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
        "x-request-id": "admin-users-create-400",
      },
      body: JSON.stringify({ email: "", password: "" } satisfies AdminCreateUserRequest),
    });

    expect(badReqRes.status).toBe(400);

    const email = uniqueEmail("admin-create");

    const createRes = await fetch(`${baseUrl}/.netlify/functions/admin-users`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${adminAccess}`,
        "content-type": "application/json",
        "x-request-id": "admin-users-create-201",
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
        timezone: "America/Chicago",
      } satisfies AdminCreateUserRequest),
    });

    expect(createRes.status).toBe(201);
    const createBody = (await createRes.json()) as SuccessEnvelope<AdminUserResponse>;
    expect(createBody.ok).toBe(true);
    const created = createBody.data.user;
    expect(created.username).toBe(email);
    expect(created.displayName).toBe("Created User");
    expect(created.roles).toContain("user");
    expect(created.givenName).toBe("Created");
    expect(created.familyName).toBe("User");
    expect(created.bio).toBe("A test user.");
    expect(created.phoneNumber).toBe("+1 555 000 9999");
    expect(created.locale).toBe("en-US");
    expect(created.timezone).toBe("America/Chicago");
  });
});
