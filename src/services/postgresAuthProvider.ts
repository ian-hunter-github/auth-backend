import crypto from "node:crypto";
import pg from "pg";
import { AppError } from "../lib/errors.js";
import { getEnv, requireEnv } from "../lib/env.js";
import type { AuthProvider } from "./authProvider.js";
import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutResponse,
  AuthRefreshRequest,
  AuthRefreshResponse,
  AuthUserProfile
} from "../contracts/auth.js";

const { Pool } = pg;

type DbUserRow = {
  id: string;
  email: string;
  display_name: string;
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
  return {
    id: row.id,
    username: row.email,
    displayName: row.display_name,
    roles: ["user"]
  };
}

function sha256Hex(v: string): string {
  return crypto.createHash("sha256").update(v, "utf8").digest("hex");
}

function newRefreshToken(): string {
  // 32 bytes => 64 hex chars, deterministic length.
  return crypto.randomBytes(32).toString("hex");
}

function refreshExpiryIso(): string {
  const days = Number(getEnv("AUTH_REFRESH_TTL_DAYS") || "30");
  const ms = Number.isFinite(days) && days > 0 ? days * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + ms).toISOString();
}

async function createSession(userId: string): Promise<{ refreshToken: string; expiresAt: string }> {
  const p = getPool();
  const refreshToken = newRefreshToken();
  const refreshTokenHash = sha256Hex(refreshToken);
  const expiresAt = refreshExpiryIso();

  await p.query(
    "insert into identity.sessions (user_id, refresh_token_hash, expires_at) values ($1::uuid, $2, $3::timestamptz)",
    [userId, refreshTokenHash, expiresAt]
  );

  return { refreshToken, expiresAt };
}

async function revokeSessionByHash(refreshTokenHash: string): Promise<boolean> {
  const p = getPool();
  const { rowCount } = await p.query(
    "update identity.sessions set revoked_at = now() where refresh_token_hash = $1 and revoked_at is null",
    [refreshTokenHash]
  );
  return (rowCount || 0) > 0;
}

// Phase 2 minimal Postgres-backed provider:
// - Uses identity.users (seeded) to resolve user profile.
// - Deterministic dev mapping: demo/letmein -> demo@example.com (seeded user).
const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = "letmein";
const TOKEN_PREFIX = "pg-access-token.";

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

    // Deterministic demo-only behaviour for now.
    // Treat "demo" as shorthand for the seeded email.
    const email = username === "demo" ? DEMO_EMAIL : username;

    if (!(email === DEMO_EMAIL && password === DEMO_PASSWORD)) {
      throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
    }

    const p = getPool();
    const { rows } = await p.query<DbUserRow>(
      "select id, email, display_name from identity.users where email = $1 limit 1",
      [email]
    );

    const row = rows[0];
    if (!row) {
      throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
    }

    const accessToken = `${TOKEN_PREFIX}${row.id}`;
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

    // Rotate: revoke old, create new.
    await revokeSessionByHash(refreshTokenHash);
    const { refreshToken: nextRefreshToken, expiresAt } = await createSession(s.user_id);

    const { rows: userRows } = await p.query<DbUserRow>(
      "select id, email, display_name from identity.users where id = $1::uuid limit 1",
      [s.user_id]
    );

    const u = userRows[0];
    if (!u) {
      throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
    }

    const accessToken = `${TOKEN_PREFIX}${u.id}`;

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

  logout: async (req: AuthRefreshRequest): Promise<AuthLogoutResponse> => {
    const refreshToken = (req.refreshToken || "").trim();
    if (!refreshToken) {
      throw new AppError("refreshToken is required", {
        code: "BAD_REQUEST",
        status: 400,
        details: { fields: ["refreshToken"] }
      });
    }

    const refreshTokenHash = sha256Hex(refreshToken);
    const revoked = await revokeSessionByHash(refreshTokenHash);

    return {
      provider: "postgres",
      revoked
    };
  },

  getUserFromToken: async (token: string): Promise<AuthUserProfile> => {
    const t = (token || "").trim();
    if (!t) {
      throw new AppError("Missing token", { code: "UNAUTHORIZED", status: 401 });
    }

    if (!t.startsWith(TOKEN_PREFIX)) {
      throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
    }

    const userId = t.slice(TOKEN_PREFIX.length).trim();
    if (!userId) {
      throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
    }

    const p = getPool();
    const { rows } = await p.query<DbUserRow>(
      "select id, email, display_name from identity.users where id = $1::uuid limit 1",
      [userId]
    );

    const row = rows[0];
    if (!row) {
      throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
    }

    return toProfile(row);
  }
};

