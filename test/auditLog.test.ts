import { afterAll, beforeAll, describe, expect, it } from "vitest";
import pg from "pg";
import { closeAuditPool, writeAuditLog } from "../src/services/auditLogService.js";
import { ensurePgEnvLoaded } from "./loadPgEnv.js";

const RUN_PG_TESTS = (process.env.RUN_PG_TESTS || "").trim() === "1";

function makePgClient(): pg.Client {
  const host = process.env.PGHOST || "";
  const database = process.env.PGDATABASE || "";
  const user = process.env.PGUSER || "";
  const password = process.env.PGPASSWORD || "";
  const port = Number(process.env.PGPORT || "5432");
  const sslmode = (process.env.PGSSLMODE || "").toLowerCase();

  const ssl =
    sslmode === "require" || sslmode === "verify-ca" || sslmode === "verify-full"
      ? { rejectUnauthorized: false }
      : undefined;

  return new pg.Client({ host, database, user, password, port, ssl });
}

describe("audit log (RUN_PG_TESTS=1)", () => {
  beforeAll(() => {
    ensurePgEnvLoaded();
  });

  afterAll(async () => {
    await closeAuditPool();
  });

  it.skipIf(!RUN_PG_TESTS)("can write and read back an audit event", async () => {
    const auditId = await writeAuditLog({
      action: "test.audit.write",
      actorUserId: "00000000-0000-0000-0000-000000000001",
      targetUserId: "00000000-0000-0000-0000-000000000001",
      requestId: "test-audit-req-001",
      ip: "127.0.0.1",
      userAgent: "vitest",
      details: { hello: "world" }
    });

    expect(typeof auditId).toBe("string");

    const client = makePgClient();
    await client.connect();
    try {
      const { rows } = await client.query(
        `
          select id, action, request_id
          from identity.audit_log
          where id = $1::uuid
          limit 1
        `,
        [auditId]
      );

      expect(rows.length).toBe(1);
      expect(rows[0].action).toBe("test.audit.write");
      expect(rows[0].request_id).toBe("test-audit-req-001");
    } finally {
      await client.end();
    }
  });
});

