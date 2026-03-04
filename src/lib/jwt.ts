import crypto from "node:crypto";
import { AppError } from "./errors.js";
import { requireEnv } from "./env.js";

type JwtHeader = {
  alg: "HS256";
  typ: "JWT";
};

type JwtPayload = {
  sub: string;
  iat: number;
  exp: number;
  iss?: string;
  aud?: string;
  jti: string;
};

function base64UrlEncode(buf: Buffer): string {
  return buf
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
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

function getIssuer(): string | undefined {
  const v = (process.env.AUTH_JWT_ISSUER || "").trim();
  return v.length > 0 ? v : undefined;
}

function getAudience(): string | undefined {
  const v = (process.env.AUTH_JWT_AUDIENCE || "").trim();
  return v.length > 0 ? v : undefined;
}

function getClockSkewSeconds(): number {
  const raw = Number(process.env.AUTH_JWT_CLOCK_SKEW_SECONDS || "30");
  return Number.isFinite(raw) && raw >= 0 ? raw : 30;
}

function getMaxTtlSeconds(): number {
  const raw = Number(process.env.AUTH_JWT_MAX_TTL_SECONDS || "86400");
  return Number.isFinite(raw) && raw > 0 ? raw : 86400;
}

export function signAccessToken(
  userId: string,
  opts?: { ttlSeconds?: number; now?: Date }
): { token: string; expiresAt: string } {
  const now = opts?.now ?? new Date();
  const ttlSeconds = opts?.ttlSeconds ?? Number(process.env.AUTH_JWT_TTL_SECONDS || "900");
  const iat = Math.floor(now.getTime() / 1000);
  const exp = iat + (Number.isFinite(ttlSeconds) && ttlSeconds > 0 ? ttlSeconds : 900);

  const header: JwtHeader = { alg: "HS256", typ: "JWT" };

  const issuer = getIssuer();
  const audience = getAudience();

  const payload: JwtPayload = {
    sub: userId,
    iat,
    exp,
    jti: crypto.randomUUID(),
    ...(issuer ? { iss: issuer } : {}),
    ...(audience ? { aud: audience } : {})
  };

  const headerPart = base64UrlEncode(Buffer.from(JSON.stringify(header), "utf8"));
  const payloadPart = base64UrlEncode(Buffer.from(JSON.stringify(payload), "utf8"));

  const signingInput = `${headerPart}.${payloadPart}`;
  const secret = getSecret();
  const sigPart = hmacSha256(secret, signingInput);

  return {
    token: `${signingInput}.${sigPart}`,
    expiresAt: new Date(exp * 1000).toISOString()
  };
}

export function verifyAccessToken(
  token: string,
  opts?: { now?: Date; clockSkewSeconds?: number }
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

  if (
    !payload ||
    typeof payload.sub !== "string" ||
    typeof payload.iat !== "number" ||
    typeof payload.exp !== "number" ||
    typeof payload.jti !== "string"
  ) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  const signingInput = `${h}.${p}`;
  const expectedSig = hmacSha256(getSecret(), signingInput);

  if (!timingSafeEqualStr(expectedSig, sig)) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  const now = opts?.now ?? new Date();
  const skew = opts?.clockSkewSeconds ?? getClockSkewSeconds();
  const nowSec = Math.floor(now.getTime() / 1000);

  // exp must be strictly after iat
  if (!(payload.exp > payload.iat)) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  // Reject tokens issued "in the future" beyond allowed clock skew.
  if (payload.iat > nowSec + skew) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  // Enforce max TTL to reduce blast radius if secrets leak and to limit long-lived tokens.
  const maxTtl = getMaxTtlSeconds();
  if (payload.exp - payload.iat > maxTtl) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  const issuer = getIssuer();
  const audience = getAudience();

  if (issuer && payload.iss !== issuer) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  if (audience && payload.aud !== audience) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  if (nowSec > payload.exp + skew) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  return { userId: payload.sub, iat: payload.iat, exp: payload.exp, jti: payload.jti };
}

