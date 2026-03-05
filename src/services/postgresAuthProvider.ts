import crypto from "node:crypto";
import { sql } from "@vercel/postgres";
import type { AuthProvider } from "./authProvider.js";
import type {
  AdminCreateUserRequest,
  AdminUpdateUserRequest,
  AdminUserResponse,
  AdminUsersResponse,
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutRequest,
  AuthMeResponse,
  AuthRefreshRequest,
  AuthRefreshResponse,
  AuthRegisterRequest,
  AuthRegisterResponse,
  AuthUserProfile
} from "../contracts/auth.js";
import { AppError } from "../lib/errors.js";
import { sha256Hex } from "../lib/crypto.js";
import { hashPassword, verifyPassword } from "../lib/passwords.js";
import { isUuid } from "../lib/uuid.js";
import { recordAuditEvent } from "./auditLogService.js";
import type { RequestContext } from "../security/requestContext.js";
import { createAccessToken, verifyAccessTokenOrThrow } from "../security/jwt.js";

type DbUserRow = {
  id: string;
  email: string;
  display_name: string;
  roles: string[];
  password_salt: string;
  password_hash: string;
  deleted_at: string | null;
};

type DbSessionRow = {
  id: string;
  user_id: string;
  refresh_token_hash: string;
  expires_at: string;
  revoked_at: string | null;
  session_family_id: string | null;
  rotated_from_session_id: string | null;
};

function normalizeEmail(s: string): string {
  return (s || "").trim().toLowerCase();
}

function normalizeDisplayName(s: string | undefined): string | undefined {
  if (s === undefined) return undefined;
  const t = (s || "").trim();
  return t ? t : undefined;
}

function normalizeRoles(input: unknown): string[] {
  if (Array.isArray(input)) {
    const out = input.map((x) => String(x || "").trim().toLowerCase()).filter(Boolean);
    return out.length ? Array.from(new Set(out)) : ["user"];
  }
  if (typeof input === "string") {
    const out = input
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    return out.length ? Array.from(new Set(out)) : ["user"];
  }
  return ["user"];
}

function requireNotDeleted(u: DbUserRow) {
  if (u.deleted_at) {
    throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

function buildClaims(userId: string, sessionId: string, roles: string[]) {
  return {
    sub: userId,
    sid: sessionId,
    roles
  };
}

async function createSession(
  userId: string,
  ctx?: RequestContext,
  opts?: { sessionFamilyId?: string | null; rotatedFromSessionId?: string | null }
): Promise<{
  sessionId: string;
  refreshToken: string;
  refreshTokenHash: string;
  expiresAt: string;
  sessionFamilyId: string;
}> {
  const refreshToken = crypto.randomBytes(32).toString("hex");
  const refreshTokenHash = sha256Hex(refreshToken);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(); // 30 days

  const sessionFamilyId = opts?.sessionFamilyId ?? crypto.randomUUID();

  const inserted = await sql<{ id: string; session_family_id: string }>`
    insert into identity.sessions (
      user_id, refresh_token_hash, expires_at,
      session_family_id, rotated_from_session_id,
      created_ip, last_used_ip, user_agent, last_used_at
    )
    values (
      ${userId}::uuid, ${refreshTokenHash}, ${expiresAt}::timestamptz,
      ${sessionFamilyId}::uuid, ${opts?.rotatedFromSessionId ?? null}::uuid,
      ${ctx?.ip ?? null}, ${ctx?.ip ?? null}, ${ctx?.userAgent ?? null}, ${nowIso()}::timestamptz
    )
    returning id, session_family_id
  `;

  const row = inserted.rows[0];
  if (!row) throw new AppError("Failed to create session", { code: "INTERNAL_ERROR", status: 500 });

  return {
    sessionId: row.id,
    refreshToken,
    refreshTokenHash,
    expiresAt,
    sessionFamilyId: row.session_family_id
  };
}

async function revokeSessionByHash(refreshTokenHash: string): Promise<void> {
  await sql`
    update identity.sessions
    set revoked_at = ${nowIso()}::timestamptz
    where refresh_token_hash = ${refreshTokenHash}
      and revoked_at is null
  `;
}

async function revokeSessionsByUserId(userId: string): Promise<void> {
  await sql`
    update identity.sessions
    set revoked_at = ${nowIso()}::timestamptz
    where user_id = ${userId}::uuid
      and revoked_at is null
  `;
}

async function requireActiveSession(sessionId: string, userId: string): Promise<void> {
  const s = await sql<DbSessionRow>`
    select id, user_id, refresh_token_hash, expires_at, revoked_at,
           session_family_id, rotated_from_session_id
    from identity.sessions
    where id = ${sessionId}::uuid
      and user_id = ${userId}::uuid
    limit 1
  `;

  const row = s.rows[0];
  if (!row) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });

  if (row.revoked_at) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  if (new Date(row.expires_at).getTime() <= Date.now()) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });

  await sql`
    update identity.sessions
    set last_used_at = ${nowIso()}::timestamptz
    where id = ${sessionId}::uuid
  `;
}

async function getUserByEmail(email: string): Promise<DbUserRow | null> {
  const res = await sql<DbUserRow>`
    select id, email, display_name, roles, password_salt, password_hash, deleted_at
    from identity.users
    where email = ${email}
    limit 1
  `;
  return res.rows[0] ?? null;
}

async function getUserById(id: string): Promise<DbUserRow | null> {
  const res = await sql<DbUserRow>`
    select id, email, display_name, roles, password_salt, password_hash, deleted_at
    from identity.users
    where id = ${id}::uuid
    limit 1
  `;
  return res.rows[0] ?? null;
}

async function listUsers(): Promise<DbUserRow[]> {
  const res = await sql<DbUserRow>`
    select id, email, display_name, roles, password_salt, password_hash, deleted_at
    from identity.users
    where deleted_at is null
    order by created_at desc
  `;
  return res.rows;
}

async function createUser(input: { email: string; password: string; displayName?: string; roles?: unknown }): Promise<DbUserRow> {
  const email = normalizeEmail(input.email);
  const password = input.password || "";
  const displayName = normalizeDisplayName(input.displayName);
  const roles = normalizeRoles(input.roles);

  if (!email || !password) {
    throw new AppError("email and password are required", {
      code: "BAD_REQUEST",
      status: 400,
      details: { fields: ["email", "password"] }
    });
  }

  const existing = await getUserByEmail(email);
  if (existing) throw new AppError("Email already exists", { code: "CONFLICT", status: 409 });

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = hashPassword(salt, password);

  const inserted = await sql<DbUserRow>`
    insert into identity.users (email, display_name, roles, password_salt, password_hash)
    values (${email}, ${displayName || email}, ${roles}, ${salt}, ${hash})
    returning id, email, display_name, roles, password_salt, password_hash, deleted_at
  `;

  const u = inserted.rows[0];
  if (!u) throw new AppError("Failed to create user", { code: "INTERNAL_ERROR", status: 500 });
  return u;
}

async function updateUser(id: string, input: { displayName?: string; roles?: unknown }): Promise<DbUserRow> {
  if (!isUuid(id)) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });

  const displayName = input.displayName === undefined ? undefined : normalizeDisplayName(input.displayName);
  const roles = input.roles === undefined ? undefined : normalizeRoles(input.roles);

  const current = await getUserById(id);
  if (!current) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });
  requireNotDeleted(current);

  const nextDisplayName = displayName === undefined ? current.display_name : displayName || current.email;
  const nextRoles = roles === undefined ? current.roles : roles;

  const updated = await sql<DbUserRow>`
    update identity.users
    set display_name = ${nextDisplayName},
        roles = ${nextRoles}
    where id = ${id}::uuid
    returning id, email, display_name, roles, password_salt, password_hash, deleted_at
  `;

  const u = updated.rows[0];
  if (!u) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });
  return u;
}

async function deleteUser(id: string): Promise<void> {
  if (!isUuid(id)) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });

  const updated = await sql`
    update identity.users
    set deleted_at = ${nowIso()}::timestamptz
    where id = ${id}::uuid
      and deleted_at is null
  `;

  if (!updated.rowCount) {
    const u = await getUserById(id);
    if (!u) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });
  }
}

async function requireAdminUser(accessToken: string): Promise<{ user: DbUserRow; sessionId: string }> {
  const { claims } = verifyAccessTokenOrThrow(accessToken);
  const userId = claims.sub;
  const sessionId = claims.sid;

  if (!userId || !sessionId) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });

  await requireActiveSession(sessionId, userId);

  const u = await getUserById(userId);
  if (!u) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  requireNotDeleted(u);

  const roles = Array.isArray(u.roles) ? u.roles : [];
  if (!roles.includes("admin")) throw new AppError("Forbidden", { code: "FORBIDDEN", status: 403 });

  return { user: u, sessionId };
}

function toUserProfile(u: DbUserRow): AuthUserProfile {
  return {
    id: u.id,
    username: u.email,
    displayName: u.display_name,
    roles: u.roles
  };
}

export const postgresAuthProvider: AuthProvider = {
  register: async (req: AuthRegisterRequest, ctx?: RequestContext): Promise<AuthRegisterResponse> => {
    const email = normalizeEmail(req.email);
    const password = (req.password || "").trim();
    const displayName = normalizeDisplayName(req.displayName);

    const u = await createUser({ email, password, displayName, roles: ["user"] });

    const { sessionId, refreshToken, expiresAt } = await createSession(u.id, ctx);
    const accessToken = createAccessToken(buildClaims(u.id, sessionId, u.roles));

    await recordAuditEvent({
      action: "auth.register_success",
      actorUserId: u.id,
      targetUserId: u.id,
      requestId: ctx?.requestId || null,
      ip: ctx?.ip || null,
      userAgent: ctx?.userAgent || null,
      details: { email: u.email }
    });

    return {
      provider: "postgres",
      session: {
        accessToken,
        tokenType: "bearer",
        refreshToken,
        expiresAt
      },
      user: toUserProfile(u)
    };
  },

  login: async (req: AuthLoginRequest, ctx?: RequestContext): Promise<AuthLoginResponse> => {
    const email = normalizeEmail(req.username);
    const password = (req.password || "").trim();

    if (!email || !password) {
      throw new AppError("username and password are required", {
        code: "BAD_REQUEST",
        status: 400,
        details: { fields: ["username", "password"] }
      });
    }

    const u = await getUserByEmail(email);
    if (!u) {
      await recordAuditEvent({
        action: "auth.login_failed",
        actorUserId: null,
        targetUserId: null,
        requestId: ctx?.requestId || null,
        ip: ctx?.ip || null,
        userAgent: ctx?.userAgent || null,
        details: { identifier: email, reason: "not_found" }
      });
      throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
    }

    requireNotDeleted(u);

    const ok = verifyPassword(u.password_salt, u.password_hash, password);
    if (!ok) {
      await recordAuditEvent({
        action: "auth.login_failed",
        actorUserId: null,
        targetUserId: u.id,
        requestId: ctx?.requestId || null,
        ip: ctx?.ip || null,
        userAgent: ctx?.userAgent || null,
        details: { identifier: email, reason: "bad_password" }
      });
      throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
    }

    const { sessionId, refreshToken, expiresAt } = await createSession(u.id, ctx);
    const accessToken = createAccessToken(buildClaims(u.id, sessionId, u.roles));

    await recordAuditEvent({
      action: "auth.login_success",
      actorUserId: u.id,
      targetUserId: u.id,
      requestId: ctx?.requestId || null,
      ip: ctx?.ip || null,
      userAgent: ctx?.userAgent || null,
      details: { email: u.email }
    });

    return {
      provider: "postgres",
      session: {
        accessToken,
        tokenType: "bearer",
        refreshToken,
        expiresAt
      },
      user: toUserProfile(u)
    };
  },

  me: async (accessToken: string, ctx?: RequestContext): Promise<AuthMeResponse> => {
    const { claims } = verifyAccessTokenOrThrow(accessToken);
    const userId = claims.sub;
    const sessionId = claims.sid;

    if (!userId || !sessionId) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });

    await requireActiveSession(sessionId, userId);

    const u = await getUserById(userId);
    if (!u) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
    requireNotDeleted(u);

    await recordAuditEvent({
      action: "auth.me",
      actorUserId: u.id,
      targetUserId: u.id,
      requestId: ctx?.requestId || null,
      ip: ctx?.ip || null,
      userAgent: ctx?.userAgent || null,
      details: null
    });

    return { user: toUserProfile(u) };
  },

  refresh: async (req: AuthRefreshRequest, ctx?: RequestContext): Promise<AuthRefreshResponse> => {
    const refreshToken = (req.refreshToken || "").trim();
    if (!refreshToken) {
      throw new AppError("refreshToken is required", {
        code: "BAD_REQUEST",
        status: 400,
        details: { fields: ["refreshToken"] }
      });
    }

    const refreshTokenHash = sha256Hex(refreshToken);

    const s = await sql<DbSessionRow>`
      select id, user_id, refresh_token_hash, expires_at, revoked_at,
             session_family_id, rotated_from_session_id
      from identity.sessions
      where refresh_token_hash = ${refreshTokenHash}
      limit 1
    `;

    const row = s.rows[0];
    if (!row) throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });
    if (row.revoked_at) throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });
    if (new Date(row.expires_at).getTime() <= Date.now()) throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });

    const u = await getUserById(row.user_id);
    if (!u) throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });
    requireNotDeleted(u);

    await revokeSessionByHash(refreshTokenHash);

    const next = await createSession(row.user_id, ctx, {
      sessionFamilyId: row.session_family_id,
      rotatedFromSessionId: row.id
    });

    const accessToken = createAccessToken(buildClaims(u.id, next.sessionId, u.roles));

    await recordAuditEvent({
      action: "auth.refresh_success",
      actorUserId: u.id,
      targetUserId: u.id,
      requestId: ctx?.requestId || null,
      ip: ctx?.ip || null,
      userAgent: ctx?.userAgent || null,
      details: { sessionFamilyId: row.session_family_id, rotatedFromSessionId: row.id }
    });

    return {
      provider: "postgres",
      session: {
        accessToken,
        tokenType: "bearer",
        refreshToken: next.refreshToken,
        expiresAt: next.expiresAt
      },
      user: toUserProfile(u)
    };
  },

  logout: async (accessToken: string, req?: AuthLogoutRequest, ctx?: RequestContext): Promise<void> => {
    const refreshToken = (req?.refreshToken || "").trim();

    const { claims } = verifyAccessTokenOrThrow(accessToken);
    const userId = claims.sub;

    if (refreshToken) {
      const refreshTokenHash = sha256Hex(refreshToken);
      await revokeSessionByHash(refreshTokenHash);
    } else {
      await revokeSessionsByUserId(userId);
    }

    await recordAuditEvent({
      action: "auth.logout",
      actorUserId: userId,
      targetUserId: userId,
      requestId: ctx?.requestId || null,
      ip: ctx?.ip || null,
      userAgent: ctx?.userAgent || null,
      details: null
    });
  },

  listUsers: async (): Promise<AuthUserProfile[]> => {
    const rows = await listUsers();
    return rows.map(toUserProfile);
  },

  getUserById: async (id: string): Promise<AuthUserProfile> => {
    if (!isUuid(id)) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });
    const u = await getUserById(id);
    if (!u) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });
    requireNotDeleted(u);
    return toUserProfile(u);
  },

  createUser: async (input) => {
    const u = await createUser(input);
    return toUserProfile(u);
  },

  updateUser: async (id, input) => {
    const u = await updateUser(id, input);
    return toUserProfile(u);
  },

  deleteUser: async (id) => {
    await deleteUser(id);
  }
};

export async function adminCreateUser(
  adminToken: string,
  body: AdminCreateUserRequest,
  ctx?: RequestContext
): Promise<AdminUserResponse> {
  const { user: me } = await requireAdminUser(adminToken);

  const created = await createUser({
    email: body.email,
    password: body.password,
    displayName: body.displayName,
    roles: body.roles
  });

  await recordAuditEvent({
    action: "auth.admin.user_created",
    actorUserId: me.id,
    targetUserId: created.id,
    requestId: ctx?.requestId || null,
    ip: ctx?.ip || null,
    userAgent: ctx?.userAgent || null,
    details: { email: created.email, roles: created.roles }
  });

  return { user: toUserProfile(created) };
}

export async function adminListUsers(adminToken: string): Promise<AdminUsersResponse> {
  await requireAdminUser(adminToken);
  const users = await listUsers();
  return { users: users.map(toUserProfile) };
}

export async function adminGetUserById(adminToken: string, id: string): Promise<AdminUserResponse> {
  await requireAdminUser(adminToken);
  if (!isUuid(id)) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });
  const u = await getUserById(id);
  if (!u) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });
  requireNotDeleted(u);
  return { user: toUserProfile(u) };
}

export async function adminUpdateUser(
  adminToken: string,
  id: string,
  body: AdminUpdateUserRequest,
  ctx?: RequestContext
): Promise<AdminUserResponse> {
  const { user: me } = await requireAdminUser(adminToken);

  const updated = await updateUser(id, { displayName: body.displayName, roles: body.roles });

  await recordAuditEvent({
    action: "auth.admin.user_updated",
    actorUserId: me.id,
    targetUserId: updated.id,
    requestId: ctx?.requestId || null,
    ip: ctx?.ip || null,
    userAgent: ctx?.userAgent || null,
    details: { email: updated.email, roles: updated.roles }
  });

  return { user: toUserProfile(updated) };
}

export async function adminDeleteUser(
  adminToken: string,
  id: string,
  ctx?: RequestContext
): Promise<void> {
  const { user: me } = await requireAdminUser(adminToken);

  if (!isUuid(id)) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });
  const target = await getUserById(id);
  if (!target) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });
  requireNotDeleted(target);

  await deleteUser(id);
  await revokeSessionsByUserId(id);

  await recordAuditEvent({
    action: "auth.admin.user_deleted",
    actorUserId: me.id,
    targetUserId: target.id,
    requestId: ctx?.requestId || null,
    ip: ctx?.ip || null,
    userAgent: ctx?.userAgent || null,
    details: { email: target.email }
  });
}
