import pg from "pg";
import { AppError } from "../lib/errors.js";
import { getEnv, requireEnv } from "../lib/env.js";
import type { AuthProvider } from "./authProvider.js";
import type { AuthLoginRequest, AuthLoginResponse, AuthUserProfile } from "../contracts/auth.js";

const { Pool } = pg;

type DbUserRow = {
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

function toProfile(row: DbUserRow): AuthUserProfile {
  return {
    id: row.id,
    username: row.email,
    displayName: row.display_name,
    roles: ["user"]
  };
}

// Phase 2 minimal Postgres-backed provider:
// - Uses identity.users (seeded) to resolve user profile.
// - Does NOT implement a full password system yet.
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

    return {
      provider: "postgres",
      session: {
        accessToken,
        tokenType: "bearer"
      },
      user: toProfile(row)
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

