import crypto from "node:crypto";
import pg from "pg";
import { AppError } from "../lib/errors.js";
import { getEnv, requireEnv } from "../lib/env.js";
import { signAccessToken, verifyAccessToken } from "../lib/jwt.js";
import type { AuthProvider, CreateUserInput, UpdateUserInput } from "./authProvider.js";
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

const { Pool } = pg;

type DbUserRow = {
  id: string;
  email: string;
  display_name: string;
  roles?: string[] | null;
  deleted_at?: string | null;
  password_salt?: string | null;
  password_hash?: string | null;
};

type DbSessionRow = {
  id: string;
  user_id: string;
  refresh_token_hash: string;
  expires_at: string;
  revoked_at: string | null;
};

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

  pool = new Pool({
    host,
    database,
    user,
    password,
    ...(port ? { port: Number(port) } : {}),
    ...(ssl ? { ssl } : {})
  });

  return pool;
}

function toProfile(row: DbUserRow): AuthUserProfile {
  const roles = Array.isArray(row.roles) && row.roles.length > 0 ? row.roles : ["user"];
  return {
    id: row.id,
    username: row.email,
    displayName: row.display_name,
    roles
  };
}

function requireNotDeleted(row: DbUserRow): void {
  if (row.deleted_at) {
    throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
  }
}

const TOKEN_PREFIX = "pg-access-token.";

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
  return signAccessToken(userId).token;
}

function isUuid(v: string): boolean {
  const s = (v || "").trim();
  if (!s) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

function parseAccessToken(token: string): string {
  const t = (token || "").trim();
  if (!t) throw new AppError("Missing token", { code: "UNAUTHORIZED", status: 401 });

  // Backward compatible legacy token format.
  if (t.startsWith(TOKEN_PREFIX)) {
    const userId = t.slice(TOKEN_PREFIX.length);
    if (!userId) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
    if (!isUuid(userId)) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
    return userId;
  }

  const verified = verifyAccessToken(t);
  if (!isUuid(verified.userId)) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  return verified.userId;
}

async function createSession(userId: string): Promise<{ refreshToken: string; expiresAt: string }> {
  const refreshToken = `pg-refresh-token.${randomHex(24)}`;
  const refreshTokenHash = sha256Hex(refreshToken);
  const expiresAt = addMinutesIso(60 * 24 * 7);

  const p = getPool();
  await p.query(
    `
    insert into identity.sessions (user_id, refresh_token_hash, expires_at)
    values ($1::uuid, $2, $3::timestamptz)
    `,
    [userId, refreshTokenHash, expiresAt]
  );

  return { refreshToken, expiresAt };
}

async function revokeSessionByHash(refreshTokenHash: string): Promise<void> {
  const p = getPool();
  await p.query(
    `
    update identity.sessions
    set revoked_at = $2::timestamptz
    where refresh_token_hash = $1
      and revoked_at is null
    `,
    [refreshTokenHash, nowIso()]
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

function requirePasswordFields(row: DbUserRow): { salt: string; hash: string } {
  const salt = (row.password_salt || "").trim();
  const hash = (row.password_hash || "").trim();
  if (!salt || !hash) {
    throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
  }
  return { salt, hash };
}

function hashPassword(salt: string, password: string): string {
  // Must match DB seeding formula:
  // encode(digest(convert_to(password_salt || password_plain,'utf8'),'sha256'),'hex')
  return sha256Hex(`${salt}${password}`);
}

function normalizeRoles(roles: string[] | undefined): string[] {
  const r = Array.isArray(roles) ? roles.map((x) => (x || "").trim()).filter((x) => x.length > 0) : [];
  const unique = Array.from(new Set(r));
  return unique.length > 0 ? unique : ["user"];
}

export const postgresAuthProvider: AuthProvider = {
  login: async (req: AuthLoginRequest): Promise<AuthLoginResponse> => {
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
    const { refreshToken, expiresAt } = await createSession(row.id);

    return {
      provider: "postgres",
      session: {
        accessToken,
        tokenType: "bearer",
        refreshToken,
        expiresAt
      },
      user: toProfile(row)
    };
  },

  register: async (req: AuthRegisterRequest): Promise<AuthRegisterResponse> => {
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
    const { refreshToken, expiresAt } = await createSession(u.id);

    return {
      provider: "postgres",
      session: {
        accessToken,
        tokenType: "bearer",
        refreshToken,
        expiresAt
      },
      user: toProfile(u)
    };
  },

  refresh: async (req: AuthRefreshRequest): Promise<AuthRefreshResponse> => {
    const refreshToken = (req.refreshToken || "").trim();
    if (!refreshToken) {
      throw new AppError("refreshToken is required", {
        code: "BAD_REQUEST",
        status: 400,
        details: { fields: ["refreshToken"] }
      });
    }

    if (!refreshToken.startsWith("pg-refresh-token.")) {
      throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });
    }

    const refreshTokenHash = sha256Hex(refreshToken);
    const p = getPool();
    const { rows } = await p.query<DbSessionRow>(
      `
      select id, user_id, refresh_token_hash, expires_at, revoked_at
      from identity.sessions
      where refresh_token_hash = $1
      limit 1
      `,
      [refreshTokenHash]
    );

    const s = rows[0];
    if (!s) throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });
    if (s.revoked_at) throw new AppError("Refresh token revoked", { code: "UNAUTHORIZED", status: 401 });

    const now = new Date();
    const exp = new Date(s.expires_at);
    if (Number.isNaN(exp.getTime()) || now.getTime() > exp.getTime()) {
      throw new AppError("Refresh token expired", { code: "UNAUTHORIZED", status: 401 });
    }

    await revokeSessionByHash(refreshTokenHash);

    const { refreshToken: nextRefreshToken, expiresAt } = await createSession(s.user_id);

    const { rows: urows } = await p.query<DbUserRow>(
      "select id, email, display_name, roles, deleted_at, password_salt, password_hash from identity.users where id = $1::uuid limit 1",
      [s.user_id]
    );

    const u = urows[0];
    if (!u) throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });
    requireNotDeleted(u);

    const accessToken = accessTokenForUser(u.id);

    return {
      provider: "postgres",
      session: {
        accessToken,
        tokenType: "bearer",
        refreshToken: nextRefreshToken,
        expiresAt
      },
      user: toProfile(u)
    };
  },

  logout: async (accessToken: string, req?: AuthLogoutRequest): Promise<void> => {
    const tokenUserId = parseAccessToken(accessToken);

    const refreshToken = (req?.refreshToken || "").trim();
    if (refreshToken) {
      await revokeSessionByHash(sha256Hex(refreshToken));
      return;
    }

    await revokeSessionsByUserId(tokenUserId);
  },

  getUserFromToken: async (token: string): Promise<AuthUserProfile> => {
    const userId = parseAccessToken(token);

    const p = getPool();
    const { rows } = await p.query<DbUserRow>(
      "select id, email, display_name, roles, deleted_at from identity.users where id = $1::uuid limit 1",
      [userId]
    );

    const row = rows[0];
    if (!row) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });

    requireNotDeleted(row);
    return toProfile(row);
  },

  listUsers: async (): Promise<AuthUserProfile[]> => {
    const p = getPool();
    const { rows } = await p.query<DbUserRow>(
      "select id, email, display_name, roles, deleted_at from identity.users where deleted_at is null order by email asc"
    );
    return rows.map(toProfile);
  },

  getUserById: async (id: string): Promise<AuthUserProfile> => {
    const userId = (id || "").trim();
    if (!isUuid(userId)) throw new AppError("Invalid id", { code: "BAD_REQUEST", status: 400 });

    const p = getPool();
    const { rows } = await p.query<DbUserRow>(
      "select id, email, display_name, roles, deleted_at from identity.users where id = $1::uuid limit 1",
      [userId]
    );

    const row = rows[0];
    if (!row) throw new AppError("User not found", { code: "NOT_FOUND", status: 404 });

    requireNotDeleted(row);
    return toProfile(row);
  },

  createUser: async (input: CreateUserInput): Promise<AuthUserProfile> => {
    const email = (input.email || "").trim().toLowerCase();
    const password = input.password || "";
    const displayName = (input.displayName || "").trim();
    const roles = normalizeRoles(input.roles);

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
    const userId = (id || "").trim();
    if (!isUuid(userId)) throw new AppError("Invalid id", { code: "BAD_REQUEST", status: 400 });

    const displayName = (input.displayName || "").trim();
    const roles = input.roles === undefined ? undefined : normalizeRoles(input.roles);

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
      [userId, displayName ? displayName : null, roles ? roles : null]
    );

    const row = rows[0];
    if (!row) throw new AppError("User not found", { code: "NOT_FOUND", status: 404 });

    requireNotDeleted(row);
    return toProfile(row);
  },

  deleteUser: async (id: string): Promise<void> => {
    const userId = (id || "").trim();
    if (!isUuid(userId)) throw new AppError("Invalid id", { code: "BAD_REQUEST", status: 400 });

    const p = getPool();
    const { rows } = await p.query<DbUserRow>(
      `
      update identity.users
      set deleted_at = $2::timestamptz
      where id = $1::uuid
      returning id, email, display_name, roles, deleted_at
      `,
      [userId, nowIso()]
    );

    const row = rows[0];
    if (!row) throw new AppError("User not found", { code: "NOT_FOUND", status: 404 });

    await revokeSessionsByUserId(userId);
  }
};
