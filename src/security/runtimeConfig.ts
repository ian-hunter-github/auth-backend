import { AppError } from "../lib/errors.js";
import { getEnv } from "../lib/env.js";

export type RuntimeAuthProviderId = "fake" | "postgres";

export type RuntimeConfigIssue = {
  code: "MISSING_ENV" | "INVALID_ENV";
  message: string;
  env?: string;
};

export type RuntimeConfigReport = {
  ok: boolean;
  provider: RuntimeAuthProviderId;
  issues: RuntimeConfigIssue[];
};

export type RuntimeConfig = {
  provider: RuntimeAuthProviderId;
  jwt: {
    issuer?: string;
    audience?: string;
  };
};

function isTrue(v: string | undefined): boolean {
  return (v || "").toLowerCase() === "true";
}

export function selectRuntimeAuthProvider(): RuntimeAuthProviderId {
  const explicit = getEnv("AUTH_PROVIDER");
  if (explicit) {
    const p = explicit.toLowerCase();
    if (p === "fake") return "fake";
    if (p === "postgres") return "postgres";
  }

  // Deterministic default:
  // - In local Netlify Dev / test harness runs, default to FAKE unless explicitly overridden.
  // - In deployed environments, default to postgres.
  const isNetlifyDev = isTrue(getEnv("NETLIFY_DEV"));
  const isTest = (getEnv("NODE_ENV") || "").toLowerCase() === "test";

  if (isNetlifyDev || isTest) return "fake";
  return "postgres";
}

function hasEnv(name: string): boolean {
  return !!getEnv(name);
}

function requireNonEmpty(report: RuntimeConfigReport, name: string) {
  if (!hasEnv(name)) {
    report.issues.push({
      code: "MISSING_ENV",
      env: name,
      message: `Missing required environment variable: ${name}`
    });
  }
}

function parsePositiveInt(report: RuntimeConfigReport, name: string) {
  const raw = getEnv(name);
  if (!raw) return;

  const n = Number(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) {
    report.issues.push({
      code: "INVALID_ENV",
      env: name,
      message: `Environment variable ${name} must be a positive integer`
    });
  }
}

export function validateRuntimeConfig(): RuntimeConfigReport {
  const provider = selectRuntimeAuthProvider();

  const report: RuntimeConfigReport = {
    ok: true,
    provider,
    issues: []
  };

  // Always require JWT secret for issued access tokens and unit tests.
  requireNonEmpty(report, "AUTH_JWT_SECRET");

  // Optional hardening knobs; validate if provided.
  parsePositiveInt(report, "AUTH_JWT_MAX_TTL_SECONDS");
  parsePositiveInt(report, "AUTH_JWT_CLOCK_SKEW_SECONDS");

  if (provider === "postgres") {
    // Either a full DATABASE_URL, or the standard PG* env vars.
    const hasConn = hasEnv("DATABASE_URL") || hasEnv("PG_CONNECTION_STRING");
    const hasParts =
      hasEnv("PGHOST") &&
      hasEnv("PGDATABASE") &&
      hasEnv("PGUSER") &&
      hasEnv("PGPASSWORD");

    if (!hasConn && !hasParts) {
      report.issues.push({
        code: "MISSING_ENV",
        message:
          "Missing postgres connection env: set DATABASE_URL (or PG_CONNECTION_STRING) or set PGHOST/PGDATABASE/PGUSER/PGPASSWORD"
      });
    }
  }

  report.ok = report.issues.length === 0;
  return report;
}

let _cached: RuntimeConfig | undefined;

export function requireRuntimeConfig(): RuntimeConfig {
  if (_cached) return _cached;

  const report = validateRuntimeConfig();
  if (!report.ok) {
    throw new AppError("Invalid runtime configuration", {
      code: "INTERNAL_ERROR",
      status: 500,
      details: {
        provider: report.provider,
        issues: report.issues
      }
    });
  }

  const issuer = getEnv("AUTH_JWT_ISSUER") || undefined;
  const audience = getEnv("AUTH_JWT_AUDIENCE") || undefined;

  _cached = {
    provider: report.provider,
    jwt: {
      ...(issuer ? { issuer } : {}),
      ...(audience ? { audience } : {})
    }
  };

  return _cached;
}

