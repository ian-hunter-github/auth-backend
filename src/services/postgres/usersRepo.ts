import type pg from "pg";
import { getPool } from "./pgPool.js";

export type DbUserRow = {
  id: string;
  email: string;
  display_name: string;
};

export async function getUserByEmail(email: string): Promise<DbUserRow | undefined> {
  const p = getPool();
  const { rows } = await p.query<DbUserRow>(
    "select id, email, display_name from identity.users where email = $1 limit 1",
    [email]
  );
  return rows[0];
}

export async function getUserById(userId: string): Promise<DbUserRow | undefined> {
  const p: pg.Pool = getPool();
  const { rows } = await p.query<DbUserRow>(
    "select id, email, display_name from identity.users where id = $1::uuid limit 1",
    [userId]
  );
  return rows[0];
}

