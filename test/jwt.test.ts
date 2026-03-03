import { beforeEach, describe, expect, it } from "vitest";
import { signAccessToken, verifyAccessToken } from "../src/lib/jwt.js";

describe("jwt", () => {
  beforeEach(() => {
    // Unit tests should be deterministic and not depend on developer/prod env.
    // The JWT module reads AUTH_JWT_SECRET from env.
    process.env.AUTH_JWT_SECRET = "test-secret-for-jwt-unit-tests";
  });

  it("accepts a valid token before expiry", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    const { token } = signAccessToken("00000000-0000-0000-0000-000000000001", {
      ttlSeconds: 60,
      now
    });

    const out = verifyAccessToken(token, { now: new Date("2026-01-01T00:00:30.000Z") });
    expect(out.userId).toBe("00000000-0000-0000-0000-000000000001");
  });

  it("rejects an expired token", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    const { token } = signAccessToken("00000000-0000-0000-0000-000000000001", {
      ttlSeconds: 1,
      now
    });

    // jwt verifier allows a small clock skew; move well past expiry to ensure rejection
    const tooLate = new Date("2026-01-01T00:00:40.000Z");

    expect(() => verifyAccessToken(token, { now: tooLate })).toThrow();
  });
});

