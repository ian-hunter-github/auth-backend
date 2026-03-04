import crypto from "node:crypto";
import pg from "pg";
import type { RequestContext } from "../security/requestContext.js";
import { AppError } from "../lib/errors.js";
import { getEnv, requireEnv } from "../lib/env.js";
import type { AuthProvider, CreateUserInput, UpdateUserInput } from "./authProvider.js";
import { writeAuditLog } from "./auditLogService.js";
import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutRequest,
  AuthRefreshRequest,
  AuthRefreshResponse,
  AuthRegisterRequest,
  AuthRegisterResponse,
  AuthUserProfile
} from "../contracts/auth.js";

type DbUserRow = {
  id: string;
  email: string;
  display_name: string;
  roles: string[];
  deleted_at: string | null;
  password_salt?: string;
  password_hash?: string;
};

type DbSessionRow = {
  id: string;
  user_id: string;
  refresh_token_hash: string;
  expires_at: string;
  revoked_at: string | null;
  session_family_id: string | null;
};

const TOKEN_PREFIX = "pg-access-token.";

let pool: pg.Pool | undefined;

function getPool(): pg.Pool {
  if (pool) return pool;

  const host = requireEnv("PGHOST");
  const database = requireEnv("PGDATABASE");
  const user = requireEnv("PGUSER");
  const password = requireEnv("PGPASSWORD");
  const port = getEnv("PGPORT");
  const sslMode = (getEnv("PGSSLMODE") || "require").toLowerCase();

  const ssl = sslMode === "disable" ? undefined : { rejectUnauthorized: false };

  pool = new pg.Pool({
    host,
    database,
    user,
    password,
    ...(port ? { port: Number(port) } : {}),
    ...(ssl ? { ssl } : {})
  });

  return pool;
}

function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input, "utf8").digest("hex");
}

function randomHex(bytes: number): string {
  return crypto.randomBytes(bytes).toString("hex");
}

function nowIso() {
  return new Date().toISOString();
}

function addMinutesIso(minutes: number) {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

function accessTokenForUser(userId: string): string {
  return `${TOKEN_PREFIX}${userId}`;
}

function isUuid(v: string): boolean {
  const s = (v || "").trim();
  if (!s) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

function parseAccessToken(token: string): string {
  const t = (token || "").trim();
  if (!t) throw new AppError("Missing token", { code: "UNAUTHORIZED", status: 401 });
  if (!t.startsWith(TOKEN_PREFIX)) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  const userId = t.slice(TOKEN_PREFIX.length);
  if (!userId) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  if (!isUuid(userId)) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  return userId;
}

function toProfile(row: DbUserRow): AuthUserProfile {
  return {
    id: row.id,
    username: row.email,
    displayName: row.display_name,
    roles: Array.isArray(row.roles) ? row.roles : ["user"]
  };
}

function requireNotDeleted(row: DbUserRow): void {
  if (row.deleted_at) {
    throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
  }
}

async function createSession(
  userId: string,
  ctx?: RequestContext,
  opts?: { sessionFamilyId?: string; rotatedFromSessionId?: string }
): Promise<{ sessionId: string; refreshToken: string; expiresAt: string }> {
  const refreshToken = `pg-refresh-token.${randomHex(24)}`;
  const refreshTokenHash = sha256Hex(refreshToken);
  const expiresAt = addMinutesIso(60);

  const p = getPool();
  const c = await p.connect();
  try {
    await c.query("begin");

    const { rows } = await c.query<{ id: string }>(
      `
      insert into identity.sessions (
        user_id,
        refresh_token_hash,
        expires_at,
        rotated_from_session_id,
        created_ip,
        last_used_ip,
        user_agent,
        last_used_at
      )
      values ($1::uuid, $2, $3::timestamptz, $4::uuid, $5::text, $6::text, $7::text, $8::timestamptz)
      returning id
      `,
      [
        userId,
        refreshTokenHash,
        expiresAt,
        opts?.rotatedFromSessionId || null,
        ctx?.ip || null,
        ctx?.ip || null,
        ctx?.userAgent || null,
        nowIso()
      ]
    );

    const id = rows[0]?.id;
    if (!id) throw new AppError("Failed to create session", { code: "INTERNAL_ERROR", status: 500 });

    const family = opts?.sessionFamilyId || id;

    await c.query(
      `
      update identity.sessions
      set session_family_id = $2::uuid
      where id = $1::uuid
      `,
      [id, family]
    );

    await c.query("commit");

    return { sessionId: id, refreshToken, expiresAt };
  } catch (e) {
    await c.query("rollback");
    throw e;
  } finally {
    c.release();
  }
}

async function revokeSessionByHash(refreshTokenHash: string, ctx?: RequestContext): Promise<void> {
  const p = getPool();
  const now = nowIso();

  if (!ctx) {
    await p.query(
      `
    update identity.sessions
    set revoked_at = $2::timestamptz
    where refresh_token_hash = $1
      and revoked_at is null
    `,
      [refreshTokenHash, now]
    );
    return;
  }

  await p.query(
    `
    update identity.sessions
    set revoked_at = $2::timestamptz,
        last_used_at = $2::timestamptz,
        last_used_ip = $3::text,
        user_agent = $4::text
    where refresh_token_hash = $1
      and revoked_at is null
    `,
    [refreshTokenHash, now, ctx.ip, ctx.userAgent || null]
  );
}

async function revokeSessionsByUserId(userId: string): Promise<void> {
  const p = getPool();
  await p.query(
    `
    update identity.sessions
    set revoked_at = $2::timestamptz
    where user_id = $1::uuid
      and revoked_at is null
    `,
    [userId, nowIso()]
  );
}

async function revokeSessionsByFamilyId(sessionFamilyId: string): Promise<void> {
  const p = getPool();
  await p.query(
    `
    update identity.sessions
    set revoked_at = $2::timestamptz
    where session_family_id = $1::uuid
      and revoked_at is null
    `,
    [sessionFamilyId, nowIso()]
  );
}

function requirePasswordFields(row: DbUserRow): { salt: string; hash: string } {
  const salt = (row.password_salt || "").trim();
  const hash = (row.password_hash || "").trim();
  if (!salt || !hash) {
    throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
  }
  return { salt, hash };
}

function hashPassword(salt: string, password: string): string {
  return sha256Hex(`${salt}${password}`);
}

function normalizeRoles(roles: string[] | undefined): string[] {
  const r = Array.isArray(roles) ? roles.map((x) => (x || "").trim()).filter((x) => x.length > 0) : [];
  const unique = Array.from(new Set(r));
  return unique.length > 0 ? unique : ["user"];
}

export const postgresAuthProvider: AuthProvider = {
  login: async (req: AuthLoginRequest, ctx?: RequestContext): Promise<AuthLoginResponse> => {
    const username = (req.username || "").trim();
    const password = req.password || "";

    if (!username || !password) {
      throw new AppError("username and password are required", {
        code: "BAD_REQUEST",
        status: 400,
        details: { fields: ["username", "password"] }
      });
    }

    const email = username === "demo" ? "demo@example.com" : username;
    const p = getPool();
    const { rows } = await p.query<DbUserRow>(
      "select id, email, display_name, roles, deleted_at, password_salt, password_hash from identity.users where email = $1 limit 1",
      [email]
    );

    const row = rows[0];
    if (!row) {
      throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
    }

    requireNotDeleted(row);

    const { salt, hash } = requirePasswordFields(row);
    const expected = hashPassword(salt, password);
    if (expected !== hash) {
      throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
    }

    const accessToken = accessTokenForUser(row.id);
    const created = await createSession(row.id, ctx);

    return {
      provider: "postgres",
      session: {
        accessToken,
        tokenType: "bearer",
        refreshToken: created.refreshToken,
        expiresAt: created.expiresAt
      },
      user: toProfile(row)
    };
  },

  register: async (req: AuthRegisterRequest, ctx?: RequestContext): Promise<AuthRegisterResponse> => {
    const email = (req.email || "").trim().toLowerCase();
    const password = req.password || "";
    const displayName = (req.displayName || "").trim();

    if (!email || !password) {
      throw new AppError("email and password are required", {
        code: "BAD_REQUEST",
        status: 400,
        details: { fields: ["email", "password"] }
      });
    }

    const p = getPool();
    const { rows: existing } = await p.query<{ id: string }>(
      "select id from identity.users where email = $1 limit 1",
      [email]
    );
    if (existing[0]) {
      throw new AppError("Email already exists", { code: "CONFLICT", status: 409 });
    }

    const roles = ["user"];
    const salt = randomHex(16);
    const hash = hashPassword(salt, password);

    const { rows } = await p.query<DbUserRow>(
      `
      insert into identity.users (email, display_name, roles, password_salt, password_hash)
      values ($1, $2, $3, $4, $5)
      returning id, email, display_name, roles, deleted_at, password_salt, password_hash
      `,
      [email, displayName || email, roles, salt, hash]
    );

    const u = rows[0];
    if (!u) throw new AppError("Failed to create user", { code: "INTERNAL_ERROR", status: 500 });

    const accessToken = accessTokenForUser(u.id);
    const created = await createSession(u.id, ctx);

    return {
      provider: "postgres",
      session: {
        accessToken,
        tokenType: "bearer",
        refreshToken: created.refreshToken,
        expiresAt: created.expiresAt
      },
      user: toProfile(u)
    };
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

    const p = getPool();
    const { rows } = await p.query<DbSessionRow>(
      `
      select id, user_id, refresh_token_hash, expires_at, revoked_at, session_family_id
      from identity.sessions
      where refresh_token_hash = $1
      limit 1
      `,
      [refreshTokenHash]
    );

    const s = rows[0];
    if (!s) {
      throw new AppError("Invalid or expired refresh token", { code: "UNAUTHORIZED", status: 401 });
    }

    if (s.revoked_at) {
      const familyId = s.session_family_id || s.id;

      await writeAuditLog({
        action: "auth.refresh.reuse_detected",
        actorUserId: s.user_id,
        targetUserId: s.user_id,
        ...(ctx?.requestId ? { requestId: ctx.requestId } : {}),
        ...(ctx?.ip ? { ip: ctx.ip } : {}),
        ...(ctx?.userAgent ? { userAgent: ctx.userAgent } : {}),
        details: {
          sessionId: s.id,
          sessionFamilyId: s.session_family_id,
          revokedAt: s.revoked_at
        }
      });

      if (familyId) {
        await revokeSessionsByFamilyId(familyId);
      } else {
        await revokeSessionsByUserId(s.user_id);
      }

      throw new AppError("Invalid or expired refresh token", { code: "UNAUTHORIZED", status: 401 });
    }

    if (new Date(s.expires_at).getTime() <= Date.now()) {
      throw new AppError("Invalid or expired refresh token", { code: "UNAUTHORIZED", status: 401 });
    }

    const { rows: userRows } = await p.query<DbUserRow>(
      "select id, email, display_name, roles, deleted_at from identity.users where id = $1::uuid limit 1",
      [s.user_id]
    );

    const u = userRows[0];
    if (!u) {
      throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
    }

    requireNotDeleted(u);

    await revokeSessionByHash(refreshTokenHash, ctx);

    const familyId = s.session_family_id || s.id;
    const created = await createSession(s.user_id, ctx, {
      sessionFamilyId: familyId,
      rotatedFromSessionId: s.id
    });

    await writeAuditLog({
      action: "auth.refresh.rotated",
      actorUserId: s.user_id,
      targetUserId: s.user_id,
      ...(ctx?.requestId ? { requestId: ctx.requestId } : {}),
      ...(ctx?.ip ? { ip: ctx.ip } : {}),
      ...(ctx?.userAgent ? { userAgent: ctx.userAgent } : {}),
      details: {
        fromSessionId: s.id,
        toSessionId: created.sessionId,
        sessionFamilyId: familyId
      }
    });

    const accessToken = accessTokenForUser(u.id);

    return {
      provider: "postgres",
      session: {
        accessToken,
        tokenType: "bearer",
        refreshToken: created.refreshToken,
        expiresAt: created.expiresAt
      },
      user: toProfile(u)
    };
  },

  logout: async (accessToken: string, req?: AuthLogoutRequest, ctx?: RequestContext): Promise<void> => {
    const userId = parseAccessToken(accessToken);
    const rt = (req?.refreshToken || "").trim();

    if (rt) {
      await writeAuditLog({
        action: "auth.logout",
        actorUserId: userId,
        targetUserId: userId,
        ...(ctx?.requestId ? { requestId: ctx.requestId } : {}),
        ...(ctx?.ip ? { ip: ctx.ip } : {}),
        ...(ctx?.userAgent ? { userAgent: ctx.userAgent } : {}),
        details: { mode: "single" }
      });

      const refreshTokenHash = sha256Hex(rt);
      await revokeSessionByHash(refreshTokenHash, ctx);
      return;
    }

    await writeAuditLog({
      action: "auth.logout",
      actorUserId: userId,
      targetUserId: userId,
      ...(ctx?.requestId ? { requestId: ctx.requestId } : {}),
      ...(ctx?.ip ? { ip: ctx.ip } : {}),
      ...(ctx?.userAgent ? { userAgent: ctx.userAgent } : {}),
      details: { mode: "all" }
    });

    await revokeSessionsByUserId(userId);
  },

  getUserFromToken: async (token: string): Promise<AuthUserProfile> => {
    const userId = parseAccessToken(token);

    const p = getPool();
    const { rows } = await p.query<DbUserRow>(
      "select id, email, display_name, roles, deleted_at from identity.users where id = $1::uuid limit 1",
      [userId]
    );

    const row = rows[0];
    if (!row) {
      throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
    }

    requireNotDeleted(row);

    return toProfile(row);
  },

  listUsers: async (): Promise<AuthUserProfile[]> => {
    const p = getPool();
    const { rows } = await p.query<DbUserRow>(
      "select id, email, display_name, roles, deleted_at from identity.users order by email asc",
      []
    );

    return rows.map((r) => toProfile(r));
  },

  getUserById: async (id: string): Promise<AuthUserProfile> => {
    const p = getPool();
    const { rows } = await p.query<DbUserRow>(
      "select id, email, display_name, roles, deleted_at from identity.users where id = $1::uuid limit 1",
      [id]
    );

    const row = rows[0];
    if (!row) {
      throw new AppError("User not found", { code: "NOT_FOUND", status: 404 });
    }

    return toProfile(row);
  },

  createUser: async (input: CreateUserInput): Promise<AuthUserProfile> => {
    const email = (input.email || "").trim().toLowerCase();
    const password = input.password || "";
    const displayName = (input.displayName || "").trim();

    if (!email || !password) {
      throw new AppError("email and password are required", {
        code: "BAD_REQUEST",
        status: 400,
        details: { fields: ["email", "password"] }
      });
    }

    const p = getPool();
    const { rows: existing } = await p.query<{ id: string }>(
      "select id from identity.users where email = $1 limit 1",
      [email]
    );
    if (existing[0]) {
      throw new AppError("Email already exists", { code: "CONFLICT", status: 409 });
    }

    const roles = normalizeRoles(input.roles);
    const salt = randomHex(16);
    const hash = hashPassword(salt, password);

    const { rows } = await p.query<DbUserRow>(
      `
      insert into identity.users (email, display_name, roles, password_salt, password_hash)
      values ($1, $2, $3, $4, $5)
      returning id, email, display_name, roles, deleted_at, password_salt, password_hash
      `,
      [email, displayName || email, roles, salt, hash]
    );

    const u = rows[0];
    if (!u) throw new AppError("Failed to create user", { code: "INTERNAL_ERROR", status: 500 });

    return toProfile(u);
  },

  updateUser: async (id: string, input: UpdateUserInput): Promise<AuthUserProfile> => {
    const displayName = typeof input.displayName === "string" ? input.displayName.trim() : undefined;
    const roles = Array.isArray(input.roles) ? normalizeRoles(input.roles) : undefined;

    if (!displayName && !roles) {
      throw new AppError("No fields to update", { code: "BAD_REQUEST", status: 400 });
    }

    const p = getPool();
    const { rows } = await p.query<DbUserRow>(
      `
      update identity.users
      set
        display_name = coalesce($2::text, display_name),
        roles = coalesce($3::text[], roles)
      where id = $1::uuid
      returning id, email, display_name, roles, deleted_at
      `,
      [id, displayName || null, roles || null]
    );

    const row = rows[0];
    if (!row) {
      throw new AppError("User not found", { code: "NOT_FOUND", status: 404 });
    }

    return toProfile(row);
  },

  deleteUser: async (id: string): Promise<void> => {
    const p = getPool();

    const { rowCount } = await p.query(
      `
      update identity.users
      set deleted_at = now()
      where id = $1::uuid
        and deleted_at is null
      `,
      [id]
    );

    if (!rowCount) {
      throw new AppError("User not found", { code: "NOT_FOUND", status: 404 });
    }

    await revokeSessionsByUserId(id);
  }
};

