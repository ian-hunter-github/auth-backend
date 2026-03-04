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

const USER_USER_ID = "user_basic_002";
const USER_USERNAME = "user";
const USER_EMAIL = "user@example.com";
const USER_PASSWORD = "letmein";

const usersByEmail = new Map<string, FakeUser>();
const usersById = new Map<string, FakeUser>();

function seedDemo() {
  if (!usersById.has(DEMO_USER_ID)) {
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

  if (!usersById.has(USER_USER_ID)) {
    const u: FakeUser = {
      id: USER_USER_ID,
      username: USER_USERNAME,
      displayName: "Basic User",
      roles: ["user"],
      email: USER_EMAIL,
      password: USER_PASSWORD
    };

    usersByEmail.set(USER_EMAIL, u);
    usersById.set(USER_USER_ID, u);
  }
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

function parseAccessToken(token: string): string {
  const t = (token || "").trim();
  if (!t) throw new AppError("Missing token", { code: "UNAUTHORIZED", status: 401 });

  const prefix = "fake-access-token.";
  if (!t.startsWith(prefix)) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });

  const userId = t.slice(prefix.length);
  if (!userId) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });

  return userId;
}

function parseRefreshToken(token: string): { userId: string } {
  const t = (token || "").trim();
  if (!t) throw new AppError("Missing refresh token", { code: "UNAUTHORIZED", status: 401 });

  const prefix = "fake-refresh-token.";
  if (!t.startsWith(prefix)) throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });

  const rest = t.slice(prefix.length);
  const dot = rest.indexOf(".");
  if (dot <= 0) throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });

  const userId = rest.slice(0, dot);
  if (!userId) throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });

  return { userId };
}

function requireUserByEmail(email: string): FakeUser {
  const u = usersByEmail.get(email);
  if (!u) throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
  return u;
}

function requireUserById(userId: string): FakeUser {
  const u = usersById.get(userId);
  if (!u) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  return u;
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
    const u = requireUserByEmail(email);

    if (u.password !== password) {
      throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
    }

    const accessToken = accessTokenForUser(u.id);
    const { refreshToken, expiresAt } = await createSession(u.id);

    return {
      provider: "fake",
      session: {
        accessToken,
        tokenType: "bearer",
        refreshToken,
        expiresAt
      },
      user: {
        id: u.id,
        username: u.username,
        displayName: u.displayName,
        roles: u.roles
      }
    };
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

    const id = `user_${crypto.randomBytes(6).toString("hex")}`;

    const user: FakeUser = {
      id,
      username: email,
      displayName: displayName || email,
      roles: ["user"],
      email,
      password
    };

    usersByEmail.set(email, user);
    usersById.set(id, user);

    const accessToken = accessTokenForUser(id);
    const { refreshToken, expiresAt } = await createSession(id);

    return {
      provider: "fake",
      session: {
        accessToken,
        tokenType: "bearer",
        refreshToken,
        expiresAt
      },
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        roles: user.roles
      }
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

    const parsed = parseRefreshToken(rt);

    const store = await loadStore();
    const existing = store.sessionsByRefreshToken[rt];

    if (!existing) {
      throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });
    }

    if (existing.userId !== parsed.userId) {
      throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });
    }

    if (existing.revokedAt) {
      throw new AppError("Refresh token revoked", { code: "UNAUTHORIZED", status: 401 });
    }

    if (new Date(existing.expiresAt).getTime() <= Date.now()) {
      throw new AppError("Refresh token expired", { code: "UNAUTHORIZED", status: 401 });
    }

    // Rotate refresh token: revoke old + issue new
    existing.revokedAt = nowIso();
    store.sessionsByRefreshToken[rt] = existing;

    const { refreshToken, expiresAt } = await createSession(parsed.userId);

    await saveStore(store);

    return {
      provider: "fake",
      session: {
        accessToken: accessTokenForUser(parsed.userId),
        tokenType: "bearer",
        refreshToken,
        expiresAt
      }
    };
  },

  logout: async (accessToken: string, req?: AuthLogoutRequest): Promise<void> => {
    // Logout semantics:
    // - If refreshToken provided, revoke that session only
    // - Else, revoke all refresh sessions for this user
    const userId = parseAccessToken(accessToken);

    const rt = (req?.refreshToken || "").trim();

    const store = await loadStore();

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
  },

  listUsers: async (): Promise<AuthUserProfile[]> => {
    return Array.from(usersById.values()).map((u) => ({
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      roles: u.roles
    }));
  }
};
