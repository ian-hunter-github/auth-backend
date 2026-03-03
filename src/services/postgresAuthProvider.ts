import pg from "pg";
import { createHash, timingSafeEqual } from "node:crypto";
import { AppError } from "../lib/errors.js";
import { getEnv, requireEnv } from "../lib/env.js";
import type { AuthProvider } from "./authProvider.js";
import type { AuthLoginRequest, AuthLoginResponse, AuthUserProfile } from "../contracts/auth.js";

const { Pool } = pg;

type DbUserAuthRow = {
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

function toProfile(row: { id: string; email: string; display_name: string }): AuthUserProfile {
  return {
    id: row.id,
    username: row.email,
    displayName: row.display_name,
    roles: ["user"]
  };
}

function sha256Hex(s: string): string {
  return createHash("sha256").update(s, "utf8").digest("hex");
}

function constantTimeEqHex(a: string, b: string): boolean {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  try {
    const ab = Buffer.from(a, "hex");
    const bb = Buffer.from(b, "hex");
    if (ab.length !== bb.length) return false;
    return timingSafeEqual(ab, bb);
  } catch {
    return false;
  }
}

const DEMO_EMAIL = "demo@example.com";
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

    // Convenience: allow "demo" as shorthand for the seeded email.
    const email = username === "demo" ? DEMO_EMAIL : username;

    const p = getPool();
    const { rows } = await p.query<DbUserAuthRow>(
      "select id, email, display_name, password_salt, password_hash from identity.users where email = $1 limit 1",
      [email]
    );

    const row = rows[0];
    if (!row) {
      throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
    }

    const expected = row.password_hash;
    const actual = sha256Hex(`${row.password_salt}${password}`);

    if (!constantTimeEqHex(expected, actual)) {
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

