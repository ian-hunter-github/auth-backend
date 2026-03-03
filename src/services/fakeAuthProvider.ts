import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { AppError } from "../lib/errors.js";
import type { AuthProvider } from "./authProvider.js";
import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutResponse,
  AuthRefreshRequest,
  AuthRefreshResponse,
  AuthUserProfile
} from "../contracts/auth.js";

const DEMO_USER: AuthUserProfile = {
  id: "user_demo_001",
  username: "demo",
  displayName: "Demo User",
  roles: ["user"]
};

const FAKE_ACCESS_TOKEN = "fake-access-token.demo";

// IMPORTANT:
// Netlify dev (and even tests that call netlify dev) may execute functions in
// separate processes/isolates. In-memory state is not reliable.
// Use a tiny file-backed state in OS temp to keep refresh rotation/revocation
// deterministic and testable without external services.
type FakeState = {
  counter: number;
  revoked: Record<string, true>;
};

const STATE_PATH = path.join(os.tmpdir(), "identity-backend-fake-refresh-state.json");

function readState(): FakeState {
  try {
    const raw = fs.readFileSync(STATE_PATH, "utf8");
    const j = JSON.parse(raw) as Partial<FakeState>;
    const counter = typeof j.counter === "number" ? j.counter : 0;
    const revoked = (j.revoked && typeof j.revoked === "object" ? j.revoked : {}) as Record<string, true>;
    return { counter, revoked };
  } catch {
    return { counter: 0, revoked: {} };
  }
}

function writeState(s: FakeState) {
  const tmp = `${STATE_PATH}.${process.pid}.${crypto.randomBytes(4).toString("hex")}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(s), "utf8");
  fs.renameSync(tmp, STATE_PATH);
}

function issueRefreshToken(): string {
  const s = readState();
  const next = s.counter + 1;
  s.counter = next;
  writeState(s);
  return `fake-refresh-token.demo.${next}`;
}

function revokeRefreshToken(rt: string) {
  const s = readState();
  s.revoked[rt] = true;
  writeState(s);
}

function isRevoked(rt: string): boolean {
  const s = readState();
  return s.revoked[rt] === true;
}

export const fakeAuthProvider: AuthProvider = {
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

    if (!(username === "demo" && password === "letmein")) {
      throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
    }

    const refreshToken = issueRefreshToken();

    return {
      provider: "fake",
      session: {
        accessToken: FAKE_ACCESS_TOKEN,
        tokenType: "bearer",
        refreshToken
      },
      user: DEMO_USER
    };
  },

  refresh: async (req: AuthRefreshRequest): Promise<AuthRefreshResponse> => {
    const rt = (req.refreshToken || "").trim();
    if (!rt) {
      throw new AppError("refreshToken is required", {
        code: "BAD_REQUEST",
        status: 400,
        details: { fields: ["refreshToken"] }
      });
    }

    if (!rt.startsWith("fake-refresh-token.demo.")) {
      throw new AppError("Invalid or expired refresh token", { code: "UNAUTHORIZED", status: 401 });
    }

    if (isRevoked(rt)) {
      throw new AppError("Invalid or expired refresh token", { code: "UNAUTHORIZED", status: 401 });
    }

    // Rotate refresh token on refresh.
    revokeRefreshToken(rt);
    const nextRefreshToken = issueRefreshToken();

    return {
      provider: "fake",
      session: {
        accessToken: FAKE_ACCESS_TOKEN,
        tokenType: "bearer",
        refreshToken: nextRefreshToken
      },
      user: DEMO_USER
    };
  },

  logout: async (req: AuthRefreshRequest): Promise<AuthLogoutResponse> => {
    const rt = (req.refreshToken || "").trim();
    if (!rt) {
      throw new AppError("refreshToken is required", {
        code: "BAD_REQUEST",
        status: 400,
        details: { fields: ["refreshToken"] }
      });
    }

    // idempotent revoke
    revokeRefreshToken(rt);

    return {
      provider: "fake",
      revoked: true
    };
  },

  getUserFromToken: async (token: string): Promise<AuthUserProfile> => {
    const t = (token || "").trim();
    if (!t) {
      throw new AppError("Missing token", { code: "UNAUTHORIZED", status: 401 });
    }
    if (t !== FAKE_ACCESS_TOKEN) {
      throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
    }
    return DEMO_USER;
  }
};

