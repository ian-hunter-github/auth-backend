import crypto from "node:crypto";
import { AppError } from "./errors.js";
import { requireEnv } from "./env.js";

type JwtHeader = {
  alg: "HS256";
  typ: "JWT";
};

type JwtPayload = {
  iss: string;
  aud: string;
  sub: string;
  iat: number;
  exp: number;
};

const ISSUER = "identity-backend-service";
const AUDIENCE = "api";
const DEFAULT_TTL_SECONDS = 15 * 60;
const CLOCK_SKEW_SECONDS = 30;

let cachedSecret: string | undefined;

function getSecret(): string {
  if (cachedSecret) return cachedSecret;
  cachedSecret = requireEnv("AUTH_JWT_SECRET");
  return cachedSecret;
}

function base64UrlEncode(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlEncodeJson(obj: unknown): string {
  return base64UrlEncode(Buffer.from(JSON.stringify(obj), "utf8"));
}

function base64UrlDecodeToBuffer(s: string): Buffer {
  const v = s.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (v.length % 4)) % 4;
  const padded = v + "=".repeat(padLen);
  return Buffer.from(padded, "base64");
}

function timingSafeEqualStr(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function signHs256(input: string, secret: string): string {
  const sig = crypto.createHmac("sha256", secret).update(input, "utf8").digest();
  return base64UrlEncode(sig);
}

export function signAccessToken(
  userId: string,
  opts?: { ttlSeconds?: number; now?: Date }
): { token: string; expiresAt: string } {
  const ttlSeconds = opts?.ttlSeconds ?? DEFAULT_TTL_SECONDS;
  const now = opts?.now ?? new Date();

  const iat = Math.floor(now.getTime() / 1000);
  const exp = iat + ttlSeconds;

  const header: JwtHeader = { alg: "HS256", typ: "JWT" };
  const payload: JwtPayload = {
    iss: ISSUER,
    aud: AUDIENCE,
    sub: userId,
    iat,
    exp
  };

  const h = base64UrlEncodeJson(header);
  const p = base64UrlEncodeJson(payload);
  const unsigned = `${h}.${p}`;
  const sig = signHs256(unsigned, getSecret());

  const token = `${unsigned}.${sig}`;
  const expiresAt = new Date(exp * 1000).toISOString();

  return { token, expiresAt };
}

export function verifyAccessToken(token: string, opts?: { now?: Date }): { userId: string } {
  const t = (token || "").trim();
  if (!t) {
    throw new AppError("Missing token", { code: "UNAUTHORIZED", status: 401 });
  }

  const parts = t.split(".");
  if (parts.length !== 3) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  const [h, p, sig] = parts;

  let header: JwtHeader | undefined;
  let payload: JwtPayload | undefined;

  try {
    header = JSON.parse(base64UrlDecodeToBuffer(h).toString("utf8")) as JwtHeader;
    payload = JSON.parse(base64UrlDecodeToBuffer(p).toString("utf8")) as JwtPayload;
  } catch {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  if (!header || header.alg !== "HS256" || header.typ !== "JWT") {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  const unsigned = `${h}.${p}`;
  const expectedSig = signHs256(unsigned, getSecret());

  if (!timingSafeEqualStr(expectedSig, sig)) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  if (!payload || payload.iss !== ISSUER || payload.aud !== AUDIENCE || !payload.sub) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  const now = opts?.now ?? new Date();
  const nowSec = Math.floor(now.getTime() / 1000);

  if (typeof payload.exp !== "number" || nowSec > payload.exp + CLOCK_SKEW_SECONDS) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }

  return { userId: payload.sub };
}

