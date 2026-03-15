import { beforeEach, describe, expect, it } from "vitest";
import { signAccessToken, verifyAccessToken } from "../../src/lib/jwt.js";

describe("jwt", () => {
  beforeEach(() => {
    // Unit tests should be deterministic and not depend on developer/prod env.
    // The JWT module reads AUTH_JWT_SECRET from env.
    process.env.AUTH_JWT_SECRET = "test-secret-for-jwt-unit-tests";
    delete process.env.AUTH_JWT_ISSUER;
    delete process.env.AUTH_JWT_AUDIENCE;
    delete process.env.AUTH_JWT_MAX_TTL_SECONDS;
    delete process.env.AUTH_JWT_CLOCK_SKEW_SECONDS;
  });

  it("accepts a valid token before expiry", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    const { token } = signAccessToken("00000000-0000-0000-0000-000000000001", {
      ttlSeconds: 60,
      now
    });

    const verified = verifyAccessToken(token, { now });
    expect(verified.userId).toBe("00000000-0000-0000-0000-000000000001");
    expect(typeof verified.jti).toBe("string");
    expect(verified.jti.length).toBeGreaterThan(10);
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

  it("enforces issuer/audience when configured", () => {
    process.env.AUTH_JWT_ISSUER = "identity-backend";
    process.env.AUTH_JWT_AUDIENCE = "netlify-client";

    const now = new Date("2026-01-01T00:00:00.000Z");
    const { token } = signAccessToken("00000000-0000-0000-0000-000000000001", {
      ttlSeconds: 60,
      now
    });

    expect(() => verifyAccessToken(token, { now })).not.toThrow();

    process.env.AUTH_JWT_ISSUER = "different-issuer";
    expect(() => verifyAccessToken(token, { now })).toThrow();

    process.env.AUTH_JWT_ISSUER = "identity-backend";
    process.env.AUTH_JWT_AUDIENCE = "different-audience";
    expect(() => verifyAccessToken(token, { now })).toThrow();
  });

  it("rejects tokens issued in the future beyond clock skew", () => {
    process.env.AUTH_JWT_CLOCK_SKEW_SECONDS = "30";

    const base = new Date("2026-01-01T00:00:00.000Z");
    const future = new Date("2026-01-01T00:05:00.000Z");
    const { token } = signAccessToken("00000000-0000-0000-0000-000000000001", {
      ttlSeconds: 60,
      now: future
    });

    expect(() => verifyAccessToken(token, { now: base })).toThrow();
  });

  it("enforces max token ttl", () => {
    process.env.AUTH_JWT_MAX_TTL_SECONDS = "120";

    const now = new Date("2026-01-01T00:00:00.000Z");
    const { token } = signAccessToken("00000000-0000-0000-0000-000000000001", {
      ttlSeconds: 600,
      now
    });

    expect(() => verifyAccessToken(token, { now })).toThrow();
  });
});

