import crypto from "node:crypto";
import { AppError } from "../errors/apiError.js";
import { requireEnv } from "../config/env.js";

type JwtHeader = {
  alg: "HS256";
  typ: "JWT";
};

type JwtPayload = {
  sub: string;
  iat: number;
  exp: number;
  jti: string;
  iss?: string;
  aud?: string;
};

function base64UrlEncode(buf: Buffer): string {
  return buf.toString("base64").replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlDecodeToBuffer(s: string): Buffer {
  const padLen = (4 - (s.length % 4)) % 4;
  const padded = s + "=".repeat(padLen);
  const b64 = padded.replaceAll("-", "+").replaceAll("_", "/");
  return Buffer.from(b64, "base64");
}

function timingSafeEqualStr(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function getSecret(): Buffer {
  // Accept either hex or utf8; prefer hex if it looks like hex.
  const raw = requireEnv("AUTH_JWT_SECRET");
  const isHex = /^[0-9a-fA-F]+$/.test(raw) && raw.length % 2 === 0;
  return isHex ? Buffer.from(raw, "hex") : Buffer.from(raw, "utf8");
}

function hmacSha256(secret: Buffer, msg: string): string {
  const sig = crypto.createHmac("sha256", secret).update(msg, "utf8").digest();
  return base64UrlEncode(sig);
}

function getOptionalEnv(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim().length > 0 ? v.trim() : undefined;
}

function parsePositiveInt(v: string | undefined): number | undefined {
  const s = (v || "").trim();
  if (!s) return undefined;
  const n = Number(s);
  if (!Number.isFinite(n)) return undefined;
  const i = Math.floor(n);
  return i > 0 ? i : undefined;
}

export function signAccessToken(
  userId: string,
  opts?: { ttlSeconds?: number; now?: Date },
): { token: string; expiresAt: string } {
  const now = opts?.now ?? new Date();
  const ttlSeconds = opts?.ttlSeconds ?? Number(process.env.AUTH_JWT_TTL_SECONDS || "900");
  const iat = Math.floor(now.getTime() / 1000);
  const exp = iat + (Number.isFinite(ttlSeconds) && ttlSeconds > 0 ? ttlSeconds : 900);

  const header: JwtHeader = { alg: "HS256", typ: "JWT" };

  const issuer = getOptionalEnv("AUTH_JWT_ISSUER");
  const audience = getOptionalEnv("AUTH_JWT_AUDIENCE");

  const payload: JwtPayload = {
    sub: userId,
    iat,
    exp,
    jti: crypto.randomUUID(),
    ...(issuer ? { iss: issuer } : {}),
    ...(audience ? { aud: audience } : {}),
  };

  const headerPart = base64UrlEncode(Buffer.from(JSON.stringify(header), "utf8"));
  const payloadPart = base64UrlEncode(Buffer.from(JSON.stringify(payload), "utf8"));

  const signingInput = `${headerPart}.${payloadPart}`;
  const secret = getSecret();
  const sigPart = hmacSha256(secret, signingInput);

  return {
    token: `${signingInput}.${sigPart}`,
    expiresAt: new Date(exp * 1000).toISOString(),
  };
}

export function verifyAccessToken(
  token: string,
  opts?: { now?: Date; clockSkewSeconds?: number },
): { userId: string; iat: number; exp: number; jti: string } {
  const t = (token || "").trim();
  if (!t) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  const parts = t.split(".");
  if (parts.length !== 3) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  const h = parts[0];
  const p = parts[1];
  const sig = parts[2];

  if (!h || !p || !sig) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  let header: JwtHeader;
  let payload: JwtPayload;

  try {
    header = JSON.parse(base64UrlDecodeToBuffer(h).toString("utf8")) as JwtHeader;
    payload = JSON.parse(base64UrlDecodeToBuffer(p).toString("utf8")) as JwtPayload;
  } catch {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  if (!header || header.alg !== "HS256" || header.typ !== "JWT") {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  const signingInput = `${h}.${p}`;
  const secret = getSecret();
  const expected = hmacSha256(secret, signingInput);

  if (!timingSafeEqualStr(expected, sig)) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  const now = opts?.now ?? new Date();
  const nowSec = Math.floor(now.getTime() / 1000);
  const skew =
    opts?.clockSkewSeconds ?? parsePositiveInt(getOptionalEnv("AUTH_JWT_CLOCK_SKEW_SECONDS")) ?? 30;

  const userId = (payload.sub || "").trim();
  if (!userId) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  const iat = payload.iat;
  const exp = payload.exp;

  if (!Number.isFinite(iat) || !Number.isFinite(exp)) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }
  if (exp <= iat) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  const jti = (payload.jti || "").trim();
  if (!jti) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  // issuer / audience enforcement (only when configured)
  const requiredIssuer = getOptionalEnv("AUTH_JWT_ISSUER");
  if (requiredIssuer && payload.iss !== requiredIssuer) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  const requiredAudience = getOptionalEnv("AUTH_JWT_AUDIENCE");
  if (requiredAudience && payload.aud !== requiredAudience) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  // issued-at must not be unreasonably in the future
  if (iat > nowSec + skew) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  // expiry check with clock skew
  if (exp <= nowSec - skew) {
    throw new AppError("Token expired", { code: "UNAUTHORIZED", status: 401 });
  }

  // max TTL enforcement (only when configured)
  const maxTtlSeconds = parsePositiveInt(getOptionalEnv("AUTH_JWT_MAX_TTL_SECONDS"));
  if (maxTtlSeconds !== undefined) {
    const ttl = exp - iat;
    if (ttl > maxTtlSeconds) {
      throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
    }
  }

  return { userId, iat, exp, jti };
}
