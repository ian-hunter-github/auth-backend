import { AppError } from "../lib/errors.js";
import { getEnv, requireEnv } from "../lib/env.js";

type Provider = "fake" | "postgres";

type RuntimeConfig = {
  provider: Provider;
};

let validated = false;

function parseIntEnv(name: string, v: string): number {
  const n = Number.parseInt(v, 10);
  if (!Number.isFinite(n)) {
    throw new AppError(`Invalid integer env var: ${name}`, {
      code: "INTERNAL_ERROR",
      status: 500,
      details: { name, value: v }
    });
  }
  return n;
}

function optionalPositiveInt(name: string): number | undefined {
  const v = getEnv(name);
  if (!v) return undefined;
  const n = parseIntEnv(name, v);
  if (n <= 0) {
    throw new AppError(`Env var must be > 0: ${name}`, {
      code: "INTERNAL_ERROR",
      status: 500,
      details: { name, value: v }
    });
  }
  return n;
}

function determineProvider(): Provider {
  const explicit = getEnv("AUTH_PROVIDER");
  if (explicit) {
    const p = explicit.toLowerCase();
    if (p === "fake") return "fake";
    if (p === "postgres") return "postgres";
    throw new AppError("Invalid AUTH_PROVIDER", {
      code: "INTERNAL_ERROR",
      status: 500,
      details: { value: explicit }
    });
  }

  const isTest = (getEnv("NODE_ENV") || "").toLowerCase() === "test";
  if (isTest) return "fake";

  return "postgres";
}

export function validateAuthConfig(): void {
  if (validated) return;

  requireEnv("AUTH_JWT_SECRET");

  const ttl = optionalPositiveInt("AUTH_JWT_TTL_SECONDS");
  const maxTtl = optionalPositiveInt("AUTH_JWT_MAX_TTL_SECONDS");
  if (ttl !== undefined && maxTtl !== undefined && ttl > maxTtl) {
    throw new AppError("AUTH_JWT_TTL_SECONDS must be <= AUTH_JWT_MAX_TTL_SECONDS", {
      code: "INTERNAL_ERROR",
      status: 500,
      details: { AUTH_JWT_TTL_SECONDS: ttl, AUTH_JWT_MAX_TTL_SECONDS: maxTtl }
    });
  }

  const skew = optionalPositiveInt("AUTH_JWT_CLOCK_SKEW_SECONDS");
  if (skew !== undefined && skew > 300) {
    throw new AppError("AUTH_JWT_CLOCK_SKEW_SECONDS is unreasonably high", {
      code: "INTERNAL_ERROR",
      status: 500,
      details: { AUTH_JWT_CLOCK_SKEW_SECONDS: skew }
    });
  }

  const issuer = getEnv("AUTH_JWT_ISSUER");
  if (issuer !== undefined && issuer.trim().length === 0) {
    throw new AppError("AUTH_JWT_ISSUER must not be empty", {
      code: "INTERNAL_ERROR",
      status: 500
    });
  }

  const audience = getEnv("AUTH_JWT_AUDIENCE");
  if (audience !== undefined && audience.trim().length === 0) {
    throw new AppError("AUTH_JWT_AUDIENCE must not be empty", {
      code: "INTERNAL_ERROR",
      status: 500
    });
  }

  const provider = determineProvider();
  if (provider === "postgres") {
    requireEnv("PGHOST");
    requireEnv("PGDATABASE");
    requireEnv("PGUSER");
    requireEnv("PGPASSWORD");
    requireEnv("PGPORT");
  }

  validated = true;
}

export function requireRuntimeConfig(): RuntimeConfig {
  validateAuthConfig();
  return {
    provider: determineProvider()
  };
}
