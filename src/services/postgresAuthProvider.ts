import pg from "pg";
import crypto from "node:crypto";
import { AppError } from "../lib/errors.js";
import { getEnv, requireEnv } from "../lib/env.js";
import { signAccessToken, verifyAccessToken } from "../lib/jwt.js";
import type { AuthProvider } from "./authProvider.js";
import type { AuthLoginRequest, AuthLoginResponse, AuthUserProfile } from "../contracts/auth.js";

const { Pool } = pg;

type DbUserRow = {
  id: string;
  email: string;
  display_name: string;
  password_salt: string;
  password_hash: string;
};

type DbUserProfileRow = {
  id: string;
  email: string;
  display_name: string;
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

function toProfile(row: DbUserProfileRow): AuthUserProfile {
  return {
    id: row.id,
    username: row.email,
    displayName: row.display_name,
    roles: ["user"]
  };
}

function sha256Hex(s: string): string {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

// Convenience alias to keep dev UX identical:
// "demo" -> seeded email (demo@example.com).
const DEMO_EMAIL = "demo@example.com";

export const postgresAuthProvider: AuthProvider = {
  login: async (req: AuthLoginRequest): Promise<AuthLoginResponse> => {
    // Ensure JWT is properly configured when using the Postgres provider.
    requireEnv("AUTH_JWT_SECRET");

    const username = (req.username || "").trim();
    const password = req.password || "";

    if (!username || !password) {
      throw new AppError("username and password are required", {
        code: "BAD_REQUEST",
        status: 400,
        details: { fields: ["username", "password"] }
      });
    }

    const email = username === "demo" ? DEMO_EMAIL : username;

    const p = getPool();
    const { rows } = await p.query<DbUserRow>(
      "select id, email, display_name, password_salt, password_hash from identity.users where email = $1 limit 1",
      [email]
    );

    const row = rows[0];
    if (!row) {
      throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
    }

    const computed = sha256Hex(`${row.password_salt}${password}`);
    if (computed !== row.password_hash) {
      throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
    }

    const signed = signAccessToken(row.id);

    return {
      provider: "postgres",
      session: {
        accessToken: signed.token,
        tokenType: "bearer",
        expiresAt: signed.expiresAt
      },
      user: toProfile(row)
    };
  },

  getUserFromToken: async (token: string): Promise<AuthUserProfile> => {
    // Ensure JWT is properly configured when using the Postgres provider.
    requireEnv("AUTH_JWT_SECRET");

    const { userId } = verifyAccessToken(token);

    const p = getPool();
    const { rows } = await p.query<DbUserProfileRow>(
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

