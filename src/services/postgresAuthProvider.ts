import crypto from "node:crypto";
import pg from "pg";
import { AppError } from "../lib/errors.js";
import { getEnv, requireEnv } from "../lib/env.js";
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
  return `${TOKEN_PREFIX}${userId}`;
}

function parseAccessToken(token: string): string {
  const t = (token || "").trim();
  if (!t) throw new AppError("Missing token", { code: "UNAUTHORIZED", status: 401 });
  if (!t.startsWith(TOKEN_PREFIX)) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  const userId = t.slice(TOKEN_PREFIX.length);
  if (!userId) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  return userId;
}

async function createSession(userId: string): Promise<{ refreshToken: string; expiresAt: string }> {
  const refreshToken = `pg-refresh-token.${randomHex(24)}`;
  const refreshTokenHash = sha256Hex(refreshToken);
  const expiresAt = addMinutesIso(60);

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
    if (!s) {
      throw new AppError("Invalid or expired refresh token", { code: "UNAUTHORIZED", status: 401 });
    }
    if (s.revoked_at) {
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

    await revokeSessionByHash(refreshTokenHash);
    const { refreshToken: nextRefreshToken, expiresAt } = await createSession(s.user_id);

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
    const userId = parseAccessToken(accessToken);
    const rt = (req?.refreshToken || "").trim();

    if (rt) {
      const refreshTokenHash = sha256Hex(rt);
      await revokeSessionByHash(refreshTokenHash);
      return;
    }

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
      throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });
    }

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
      returning id, email, display_name, roles, deleted_at
      `,
      [email, displayName || email, roles, salt, hash]
    );

    const row = rows[0];
    if (!row) throw new AppError("Failed to create user", { code: "INTERNAL_ERROR", status: 500 });
    return toProfile(row);
  },

  updateUser: async (id: string, input: UpdateUserInput): Promise<AuthUserProfile> => {
    const hasDisplayName = input.displayName !== undefined;
    const hasRoles = input.roles !== undefined;

    if (!hasDisplayName && !hasRoles) {
      throw new AppError("At least one field must be provided", { code: "BAD_REQUEST", status: 400 });
    }

    const displayName = hasDisplayName ? (input.displayName || "").trim() : undefined;
    const roles = hasRoles ? normalizeRoles(input.roles) : undefined;

    const p = getPool();
    const { rows } = await p.query<DbUserRow>(
      `
      update identity.users
      set
        display_name = case when $2::boolean then $3 else display_name end,
        roles = case when $4::boolean then $5::text[] else roles end
      where id = $1::uuid
      returning id, email, display_name, roles, deleted_at
      `,
      [id, hasDisplayName, displayName, hasRoles, roles]
    );

    const row = rows[0];
    if (!row) {
      throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });
    }

    return toProfile(row);
  },

  deleteUser: async (id: string): Promise<void> => {
    const p = getPool();
    const { rowCount } = await p.query(
      `
      update identity.users
      set deleted_at = $2::timestamptz
      where id = $1::uuid
        and deleted_at is null
      `,
      [id, nowIso()]
    );

    if (!rowCount) {
      // Either not found or already deleted. For admin delete, treat as NOT_FOUND.
      const { rows } = await p.query<{ id: string }>("select id from identity.users where id = $1::uuid limit 1", [id]);
      if (!rows[0]) {
        throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });
      }
      // already deleted -> no-op
    }

    await revokeSessionsByUserId(id);
  }
};

