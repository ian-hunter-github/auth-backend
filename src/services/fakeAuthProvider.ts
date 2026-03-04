import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import { AppError } from "../lib/errors.js";
import type { AuthProvider, CreateUserInput, UpdateUserInput } from "./authProvider.js";
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
  deletedAt?: string;
};

type FakeSession = {
  userId: string;
  refreshToken: string;
  revokedAt?: string;
  expiresAt: string;
};

type FakeUserStore = {
  usersById: Record<string, FakeUser>;
};

type FakeSessionStore = {
  sessionsByRefreshToken: Record<string, FakeSession>;
};

const USERS_STORE_PATH = "/tmp/identity-backend-fake-users.json";
const SESSIONS_STORE_PATH = "/tmp/identity-backend-fake-sessions.json";

async function loadUserStore(): Promise<FakeUserStore> {
  try {
    const raw = await fs.readFile(USERS_STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as FakeUserStore;
    if (!parsed || typeof parsed !== "object") return { usersById: {} };
    if (!parsed.usersById || typeof parsed.usersById !== "object") return { usersById: {} };
    return parsed;
  } catch {
    return { usersById: {} };
  }
}

async function saveUserStore(store: FakeUserStore): Promise<void> {
  const tmp = `${USERS_STORE_PATH}.${crypto.randomBytes(6).toString("hex")}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(store), "utf8");
  await fs.rename(tmp, USERS_STORE_PATH);
}

async function ensureSeedUsers(): Promise<void> {
  const store = await loadUserStore();

  const DEMO_USER_ID = "user_demo_001";
  const USER_USER_ID = "user_basic_002";

  if (!store.usersById[DEMO_USER_ID]) {
    store.usersById[DEMO_USER_ID] = {
      id: DEMO_USER_ID,
      username: "demo",
      displayName: "Demo User",
      roles: ["user"],
      email: "demo@example.com",
      password: "letmein"
    };
  }

  if (!store.usersById[USER_USER_ID]) {
    store.usersById[USER_USER_ID] = {
      id: USER_USER_ID,
      username: "user",
      displayName: "Basic User",
      roles: ["user"],
      email: "user@example.com",
      password: "letmein"
    };
  }

  await saveUserStore(store);
}

async function loadSessionStore(): Promise<FakeSessionStore> {
  try {
    const raw = await fs.readFile(SESSIONS_STORE_PATH, "utf8");
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

async function saveSessionStore(store: FakeSessionStore): Promise<void> {
  const tmp = `${SESSIONS_STORE_PATH}.${crypto.randomBytes(6).toString("hex")}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(store), "utf8");
  await fs.rename(tmp, SESSIONS_STORE_PATH);
}

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

  const store = await loadSessionStore();
  store.sessionsByRefreshToken[refreshToken] = { userId, refreshToken, expiresAt };
  await saveSessionStore(store);

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

async function findUserByEmail(email: string): Promise<FakeUser | undefined> {
  await ensureSeedUsers();
  const store = await loadUserStore();
  const target = email.trim().toLowerCase();
  for (const u of Object.values(store.usersById)) {
    if (u.email.trim().toLowerCase() === target) return u;
  }
  return undefined;
}

async function requireActiveUserByEmail(email: string): Promise<FakeUser> {
  const u = await findUserByEmail(email);
  if (!u || u.deletedAt) throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
  return u;
}

async function requireUserById(id: string): Promise<FakeUser> {
  await ensureSeedUsers();
  const store = await loadUserStore();
  const u = store.usersById[id];
  if (!u) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });
  return u;
}

async function requireActiveUserById(id: string): Promise<FakeUser> {
  const u = await requireUserById(id);
  if (u.deletedAt) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  return u;
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

function normalizeRoles(roles: string[] | undefined): string[] {
  const r = Array.isArray(roles) ? roles.map((x) => (x || "").trim()).filter((x) => x.length > 0) : [];
  const unique = Array.from(new Set(r));
  return unique.length > 0 ? unique : ["user"];
}

async function revokeSessionsForUser(userId: string): Promise<void> {
  const store = await loadSessionStore();
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
    await saveSessionStore(store);
  }
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

    const email = username === "demo" ? "demo@example.com" : username;
    const u = await requireActiveUserByEmail(email);

    if (u.password !== password) {
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

    const existing = await findUserByEmail(email);
    if (existing && !existing.deletedAt) {
      throw new AppError("Email already exists", { code: "CONFLICT", status: 409 });
    }

    await ensureSeedUsers();
    const store = await loadUserStore();

    const id = `user_${crypto.randomBytes(6).toString("hex")}`;

    const user: FakeUser = {
      id,
      username: email,
      displayName: displayName || email,
      roles: ["user"],
      email,
      password
    };

    store.usersById[id] = user;
    await saveUserStore(store);

    const s = await createSession(id);
    return toAuthResponse(user, s);
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

    const parsed = parseRefreshToken(refreshToken);

    const store = await loadSessionStore();
    const existing = store.sessionsByRefreshToken[refreshToken];

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

    const u = await requireActiveUserById(parsed.userId);

    // Rotate refresh token: revoke old + issue new
    existing.revokedAt = nowIso();
    store.sessionsByRefreshToken[refreshToken] = existing;

    const next = await createSession(parsed.userId);
    await saveSessionStore(store);

    return {
      provider: "fake",
      session: {
        accessToken: accessTokenForUser(u.id),
        tokenType: "bearer",
        refreshToken: next.refreshToken,
        expiresAt: next.expiresAt
      },
      user: {
        id: u.id,
        username: u.username,
        displayName: u.displayName,
        roles: u.roles
      }
    };
  },

  logout: async (accessToken: string, req?: AuthLogoutRequest): Promise<void> => {
    const userId = parseAccessToken(accessToken);
    await requireUserById(userId);

    const store = await loadSessionStore();

    const rt = (req?.refreshToken || "").trim();
    if (rt) {
      const s = store.sessionsByRefreshToken[rt];
      if (s && s.userId === userId && !s.revokedAt) {
        s.revokedAt = nowIso();
        store.sessionsByRefreshToken[rt] = s;
        await saveSessionStore(store);
      }
      return;
    }

    await revokeSessionsForUser(userId);
  },

  getUserFromToken: async (token: string): Promise<AuthUserProfile> => {
    const userId = parseAccessToken(token);
    const u = await requireActiveUserById(userId);
    return {
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      roles: u.roles
    };
  },

  listUsers: async (): Promise<AuthUserProfile[]> => {
    await ensureSeedUsers();
    const store = await loadUserStore();
    return Object.values(store.usersById).map((u) => ({
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      roles: u.roles
    }));
  },

  getUserById: async (id: string): Promise<AuthUserProfile> => {
    const u = await requireUserById(id);
    return {
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      roles: u.roles
    };
  },

  createUser: async (input: CreateUserInput): Promise<AuthUserProfile> => {
    const email = (input.email || "").trim().toLowerCase();
    const password = input.password || "";
    const displayName = (input.displayName || "").trim();
    const roles = normalizeRoles(input.roles);

    if (!email || !password) {
      throw new AppError("email and password are required", {
        code: "BAD_REQUEST",
        status: 400,
        details: { fields: ["email", "password"] }
      });
    }

    const existing = await findUserByEmail(email);
    if (existing && !existing.deletedAt) {
      throw new AppError("Email already exists", { code: "CONFLICT", status: 409 });
    }

    await ensureSeedUsers();
    const store = await loadUserStore();

    const id = `user_${crypto.randomBytes(6).toString("hex")}`;

    const user: FakeUser = {
      id,
      username: email,
      displayName: displayName || email,
      roles,
      email,
      password
    };

    store.usersById[id] = user;
    await saveUserStore(store);

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      roles: user.roles
    };
  },

  updateUser: async (id: string, input: UpdateUserInput): Promise<AuthUserProfile> => {
    await ensureSeedUsers();
    const store = await loadUserStore();

    const u = store.usersById[id];
    if (!u) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });

    if (input.displayName !== undefined) {
      u.displayName = (input.displayName || "").trim();
    }
    if (input.roles !== undefined) {
      u.roles = normalizeRoles(input.roles);
    }

    store.usersById[id] = u;
    await saveUserStore(store);

    return {
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      roles: u.roles
    };
  },

  deleteUser: async (id: string): Promise<void> => {
    await ensureSeedUsers();
    const store = await loadUserStore();

    const u = store.usersById[id];
    if (!u) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });

    if (!u.deletedAt) {
      u.deletedAt = nowIso();
      store.usersById[id] = u;
      await saveUserStore(store);
      await revokeSessionsForUser(u.id);
    }
  }
};

