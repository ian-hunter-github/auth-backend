import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import { AppError } from "../lib/errors.js";
import type { AuthProvider } from "./authProvider.js";
import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutRequest,
  AuthRefreshRequest,
  AuthRefreshResponse,
  AuthRegisterRequest,
  AuthRegisterResponse,
  AuthUserProfile
} from "../contracts/auth.js";

type FakeUser = AuthUserProfile & {
  email: string;
  password: string;
};

type FakeSession = {
  userId: string;
  refreshToken: string;
  revokedAt?: string;
  expiresAt: string;
};

type FakeSessionStore = {
  sessionsByRefreshToken: Record<string, FakeSession>;
};

const STORE_PATH = "/tmp/identity-backend-fake-sessions.json";

async function loadStore(): Promise<FakeSessionStore> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as FakeSessionStore;
    if (!parsed || typeof parsed !== "object") return { sessionsByRefreshToken: {} };
    if (!parsed.sessionsByRefreshToken || typeof parsed.sessionsByRefreshToken !== "object") {
      return { sessionsByRefreshToken: {} };
    }
    return parsed;
  } catch {
    return { sessionsByRefreshToken: {} };
  }
}

async function saveStore(store: FakeSessionStore): Promise<void> {
  const tmp = `${STORE_PATH}.${crypto.randomBytes(6).toString("hex")}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(store), "utf8");
  await fs.rename(tmp, STORE_PATH);
}

const DEMO_USER_ID = "user_demo_001";
const DEMO_USERNAME = "demo";
const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = "letmein";

const usersByEmail = new Map<string, FakeUser>();
const usersById = new Map<string, FakeUser>();

function seedDemo() {
  if (usersById.has(DEMO_USER_ID)) return;

  const u: FakeUser = {
    id: DEMO_USER_ID,
    username: DEMO_USERNAME,
    displayName: "Demo User",
    roles: ["user"],
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD
  };

  usersByEmail.set(DEMO_EMAIL, u);
  usersById.set(DEMO_USER_ID, u);
}
seedDemo();

function nowIso() {
  return new Date().toISOString();
}

function addMinutesIso(minutes: number) {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

function accessTokenForUser(userId: string): string {
  return `fake-access-token.${userId}`;
}

function newRefreshToken(userId: string): string {
  const nonce = crypto.randomBytes(12).toString("hex");
  return `fake-refresh-token.${userId}.${nonce}`;
}

async function createSession(userId: string): Promise<{ refreshToken: string; expiresAt: string }> {
  const refreshToken = newRefreshToken(userId);
  const expiresAt = addMinutesIso(60);

  const store = await loadStore();
  store.sessionsByRefreshToken[refreshToken] = { userId, refreshToken, expiresAt };
  await saveStore(store);

  return { refreshToken, expiresAt };
}

function requireUserById(userId: string): FakeUser {
  const u = usersById.get(userId);
  if (!u) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }
  return u;
}

function parseAccessToken(token: string): string {
  const t = (token || "").trim();
  if (!t) {
    throw new AppError("Missing token", { code: "UNAUTHORIZED", status: 401 });
  }
  const prefix = "fake-access-token.";
  if (!t.startsWith(prefix)) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }
  const userId = t.slice(prefix.length);
  if (!userId) {
    throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  }
  return userId;
}

function toAuthResponse(user: FakeUser, session: { refreshToken: string; expiresAt: string }): AuthLoginResponse {
  return {
    provider: "fake",
    session: {
      accessToken: accessTokenForUser(user.id),
      tokenType: "bearer",
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt
    },
    user: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      roles: user.roles
    }
  };
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

    const email = username === "demo" ? DEMO_EMAIL : username;
    const u = usersByEmail.get(email);
    if (!u || u.password !== password) {
      throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
    }

    const s = await createSession(u.id);
    return toAuthResponse(u, s);
  },

  register: async (req: AuthRegisterRequest): Promise<AuthRegisterResponse> => {
    const email = (req.email || "").trim().toLowerCase();
    const password = req.password || "";
    const displayName = (req.displayName || "").trim();

    if (!email || !password) {
      throw new AppError("email and password are required", {
        code: "BAD_REQUEST",
        status: 400,
        details: { fields: ["email", "password"] }
      });
    }

    if (usersByEmail.has(email)) {
      throw new AppError("Email already exists", { code: "CONFLICT", status: 409 });
    }

    const id = `user_${crypto.randomBytes(8).toString("hex")}`;
    const u: FakeUser = {
      id,
      username: email,
      displayName: displayName || email,
      roles: ["user"],
      email,
      password
    };

    usersByEmail.set(email, u);
    usersById.set(id, u);

    const s = await createSession(u.id);
    return toAuthResponse(u, s);
  },

  refresh: async (req: AuthRefreshRequest): Promise<AuthRefreshResponse> => {
    const refreshToken = (req.refreshToken || "").trim();
    if (!refreshToken) {
      throw new AppError("refreshToken is required", {
        code: "BAD_REQUEST",
        status: 400,
        details: { fields: ["refreshToken"] }
      });
    }

    const store = await loadStore();
    const s = store.sessionsByRefreshToken[refreshToken];

    if (!s) {
      throw new AppError("Invalid or expired refresh token", { code: "UNAUTHORIZED", status: 401 });
    }
    if (s.revokedAt) {
      throw new AppError("Invalid or expired refresh token", { code: "UNAUTHORIZED", status: 401 });
    }
    if (new Date(s.expiresAt).getTime() <= Date.now()) {
      throw new AppError("Invalid or expired refresh token", { code: "UNAUTHORIZED", status: 401 });
    }

    s.revokedAt = nowIso();
    store.sessionsByRefreshToken[refreshToken] = s;

    const next = await createSession(s.userId);
    await saveStore(store);

    const u = requireUserById(s.userId);
    return toAuthResponse(u, next);
  },

  logout: async (accessToken: string, req?: AuthLogoutRequest): Promise<void> => {
    const userId = parseAccessToken(accessToken);
    requireUserById(userId);

    const store = await loadStore();

    const rt = (req?.refreshToken || "").trim();
    if (rt) {
      const s = store.sessionsByRefreshToken[rt];
      if (s && s.userId === userId && !s.revokedAt) {
        s.revokedAt = nowIso();
        store.sessionsByRefreshToken[rt] = s;
        await saveStore(store);
      }
      return;
    }

    let changed = false;
    for (const k of Object.keys(store.sessionsByRefreshToken)) {
      const v = store.sessionsByRefreshToken[k];
      if (!v) continue;

      if (v.userId !== userId) continue;
      if (v.revokedAt) continue;

      v.revokedAt = nowIso();
      store.sessionsByRefreshToken[k] = v;
      changed = true;
    }

    if (changed) {
      await saveStore(store);
    }
  },

  getUserFromToken: async (token: string): Promise<AuthUserProfile> => {
    const userId = parseAccessToken(token);
    const u = requireUserById(userId);
    return {
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      roles: u.roles
    };
  }
};

