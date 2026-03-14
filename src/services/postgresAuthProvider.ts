import crypto from "node:crypto";
import pg from "pg";
import { AppError } from "../lib/errors.js";
import { getEnv, requireEnv } from "../lib/env.js";
import type { RequestContext } from "../security/requestContext.js";
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
  given_name?: string | null;
  family_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  phone_number?: string | null;
  locale?: string | null;
  timezone?: string | null;
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
    roles,
    ...(row.given_name ? { givenName: row.given_name } : {}),
    ...(row.family_name ? { familyName: row.family_name } : {}),
    ...(row.avatar_url ? { avatarUrl: row.avatar_url } : {}),
    ...(row.bio ? { bio: row.bio } : {}),
    ...(row.phone_number ? { phoneNumber: row.phone_number } : {}),
    locale: row.locale ?? "en",
    timezone: row.timezone ?? "UTC"
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

function accessTokenForUser(userId: string, sessionId: string): string {
  return `${TOKEN_PREFIX}${userId}.${sessionId}`;
}

function isUuid(v: string): boolean {
  const s = (v || "").trim();
  if (!s) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

function parseAccessToken(token: string): { userId: string; sessionId: string } {
  const t = (token || "").trim();
  if (!t) throw new AppError("Missing token", { code: "UNAUTHORIZED", status: 401 });
  if (!t.startsWith(TOKEN_PREFIX)) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  const rest = t.slice(TOKEN_PREFIX.length);
  if (!rest) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });

  const parts = rest.split(".");
  const userId = (parts[0] || "").trim();
  const sessionId = (parts[1] || "").trim();
  if (!userId || !sessionId) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  if (!isUuid(userId) || !isUuid(sessionId)) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  return { userId, sessionId };
}

async function createSession(userId: string): Promise<{ sessionId: string; refreshToken: string; expiresAt: string }> {
  const refreshToken = `pg-refresh-token.${randomHex(24)}`;
  const refreshTokenHash = sha256Hex(refreshToken);
  const expiresAt = addMinutesIso(60);

  const p = getPool();
  const { rows } = await p.query<{ id: string }>(
    `
    insert into identity.sessions (user_id, refresh_token_hash, expires_at)
    values ($1::uuid, $2, $3::timestamptz)
    returning id
    `,
    [userId, refreshTokenHash, expiresAt]
  );

  const sessionId = (rows[0]?.id || "").trim();
  if (!sessionId || !isUuid(sessionId)) {
    throw new AppError("Failed to create session", { code: "INTERNAL_ERROR", status: 500 });
  }

  return { sessionId, refreshToken, expiresAt };
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

async function requireActiveSession(sessionId: string, userId: string): Promise<void> {
  const p = getPool();
  const { rows } = await p.query<{ id: string }>(
    `
    select id
    from identity.sessions
    where id = $1::uuid
      and user_id = $2::uuid
      and revoked_at is null
      and expires_at > now()
    limit 1
    `,
    [sessionId, userId]
  );

  if (!rows[0]) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }
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
      "select id, email, display_name, roles, deleted_at, password_salt, password_hash, given_name, family_name, avatar_url, bio, phone_number, locale, timezone from identity.users where email = $1 limit 1",
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

    const { sessionId, refreshToken, expiresAt } = await createSession(row.id);
    const accessToken = accessTokenForUser(row.id, sessionId);

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
    const givenName = (req.givenName || "").trim() || null;
    const familyName = (req.familyName || "").trim() || null;

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
      insert into identity.users (email, display_name, roles, password_salt, password_hash, given_name, family_name)
      values ($1, $2, $3, $4, $5, $6, $7)
      returning id, email, display_name, roles, deleted_at, password_salt, password_hash, given_name, family_name, avatar_url, bio, phone_number, locale, timezone
      `,
      [email, displayName || email, roles, salt, hash, givenName, familyName]
    );

    const u = rows[0];
    if (!u) throw new AppError("Failed to create user", { code: "INTERNAL_ERROR", status: 500 });

    const { sessionId, refreshToken, expiresAt } = await createSession(u.id);
    const accessToken = accessTokenForUser(u.id, sessionId);

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
      throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });
    }

    if (s.revoked_at) {
      throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });
    }

    if (new Date(s.expires_at).getTime() <= Date.now()) {
      throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });
    }

    const { rows: users } = await p.query<DbUserRow>(
      "select id, email, display_name, roles, deleted_at, password_salt, password_hash, given_name, family_name, avatar_url, bio, phone_number, locale, timezone from identity.users where id = $1::uuid limit 1",
      [s.user_id]
    );

    const u = users[0];
    if (!u) {
      throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });
    }
    requireNotDeleted(u);

    await revokeSessionByHash(refreshTokenHash);

    const { sessionId, refreshToken: nextRefreshToken, expiresAt } = await createSession(s.user_id);

    const accessToken = accessTokenForUser(u.id, sessionId);

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

  logout: async (accessToken: string, req?: AuthLogoutRequest, _ctx?: RequestContext): Promise<void> => {
    const refreshToken = (req?.refreshToken || "").trim();

    if (refreshToken) {
      const refreshTokenHash = sha256Hex(refreshToken);
      await revokeSessionByHash(refreshTokenHash);
      return;
    }

    const { userId } = parseAccessToken(accessToken);
    await revokeSessionsByUserId(userId);
  },

  getUserFromToken: async (token: string): Promise<AuthUserProfile> => {
    const { userId, sessionId } = parseAccessToken(token);

    await requireActiveSession(sessionId, userId);

    const p = getPool();
    const { rows } = await p.query<DbUserRow>(
      "select id, email, display_name, roles, deleted_at, given_name, family_name, avatar_url, bio, phone_number, locale, timezone from identity.users where id = $1::uuid limit 1",
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
      "select id, email, display_name, roles, deleted_at, given_name, family_name, avatar_url, bio, phone_number, locale, timezone from identity.users where deleted_at is null order by created_at desc"
    );
    return rows.map(toProfile);
  },

  getUserById: async (id: string): Promise<AuthUserProfile> => {
    if (!isUuid(id)) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });

    const p = getPool();
    const { rows } = await p.query<DbUserRow>(
      "select id, email, display_name, roles, deleted_at, given_name, family_name, avatar_url, bio, phone_number, locale, timezone from identity.users where id = $1::uuid limit 1",
      [id]
    );
    const row = rows[0];
    if (!row || row.deleted_at) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });
    return toProfile(row);
  },

  createUser: async (input: CreateUserInput): Promise<AuthUserProfile> => {
    const email = (input.email || "").trim().toLowerCase();
    const password = input.password || "";
    const displayName = (input.displayName || "").trim();
    const roles = normalizeRoles(input.roles);
    const givenName = (input.givenName || "").trim() || null;
    const familyName = (input.familyName || "").trim() || null;
    const avatarUrl = (input.avatarUrl || "").trim() || null;
    const bio = (input.bio || "").trim() || null;
    const phoneNumber = (input.phoneNumber || "").trim() || null;
    const locale = (input.locale || "").trim() || "en";
    const timezone = (input.timezone || "").trim() || "UTC";

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
      insert into identity.users (email, display_name, roles, password_salt, password_hash, given_name, family_name, avatar_url, bio, phone_number, locale, timezone)
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      returning id, email, display_name, roles, deleted_at, given_name, family_name, avatar_url, bio, phone_number, locale, timezone
      `,
      [email, displayName || email, roles, salt, hash, givenName, familyName, avatarUrl, bio, phoneNumber, locale, timezone]
    );

    const u = rows[0];
    if (!u) throw new AppError("Failed to create user", { code: "INTERNAL_ERROR", status: 500 });
    return toProfile(u);
  },

  updateUser: async (id: string, input: UpdateUserInput): Promise<AuthUserProfile> => {
    if (!isUuid(id)) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });

    const displayName = input.displayName === undefined ? undefined : (input.displayName || "").trim();
    const roles = input.roles === undefined ? undefined : normalizeRoles(input.roles);

    const p = getPool();

    const { rows: existing } = await p.query<DbUserRow>(
      "select id, email, display_name, roles, deleted_at, given_name, family_name, avatar_url, bio, phone_number, locale, timezone from identity.users where id = $1::uuid limit 1",
      [id]
    );
    const current = existing[0];
    if (!current || current.deleted_at) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });

    const nextDisplayName = displayName === undefined ? current.display_name : displayName || current.email;
    const nextRoles = roles === undefined ? (Array.isArray(current.roles) ? current.roles : ["user"]) : roles;
    const nextGivenName = input.givenName === undefined ? (current.given_name ?? null) : (input.givenName || "").trim() || null;
    const nextFamilyName = input.familyName === undefined ? (current.family_name ?? null) : (input.familyName || "").trim() || null;
    const nextAvatarUrl = input.avatarUrl === undefined ? (current.avatar_url ?? null) : (input.avatarUrl || "").trim() || null;
    const nextBio = input.bio === undefined ? (current.bio ?? null) : (input.bio || "").trim() || null;
    const nextPhoneNumber = input.phoneNumber === undefined ? (current.phone_number ?? null) : (input.phoneNumber || "").trim() || null;
    const nextLocale = input.locale === undefined ? (current.locale ?? "en") : (input.locale || "").trim() || "en";
    const nextTimezone = input.timezone === undefined ? (current.timezone ?? "UTC") : (input.timezone || "").trim() || "UTC";

    const { rows } = await p.query<DbUserRow>(
      `
      update identity.users
      set display_name = $2,
          roles = $3,
          given_name = $4,
          family_name = $5,
          avatar_url = $6,
          bio = $7,
          phone_number = $8,
          locale = $9,
          timezone = $10,
          updated_at = now()
      where id = $1::uuid
      returning id, email, display_name, roles, deleted_at, given_name, family_name, avatar_url, bio, phone_number, locale, timezone
      `,
      [id, nextDisplayName, nextRoles, nextGivenName, nextFamilyName, nextAvatarUrl, nextBio, nextPhoneNumber, nextLocale, nextTimezone]
    );

    const updated = rows[0];
    if (!updated) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });

    return toProfile(updated);
  },

  deleteUser: async (id: string): Promise<void> => {
    if (!isUuid(id)) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });

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
      const { rows } = await p.query<{ id: string }>("select id from identity.users where id = $1::uuid limit 1", [id]);
      if (!rows[0]) {
        throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });
      }
    }
  },

  revokeUserSessions: async (userId: string): Promise<void> => {
    if (!isUuid(userId)) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });

    const p = getPool();
    const { rows } = await p.query<{ id: string }>(
      "select id from identity.users where id = $1::uuid and deleted_at is null limit 1",
      [userId]
    );
    if (!rows[0]) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });

    await revokeSessionsByUserId(userId);
  }
};
