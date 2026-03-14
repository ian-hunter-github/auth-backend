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
  disabledAt?: string;
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
      roles: ["user", "admin"],
      email: "demo@example.com",
      password: "letmein",
      givenName: "Demo",
      familyName: "User",
      bio: "Admin demo account for development and testing.",
      locale: "en",
      timezone: "UTC"
    };
  }

  if (!store.usersById[USER_USER_ID]) {
    store.usersById[USER_USER_ID] = {
      id: USER_USER_ID,
      username: "user",
      displayName: "Basic User",
      roles: ["user"],
      email: "user@example.com",
      password: "letmein",
      locale: "en",
      timezone: "UTC"
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
  store.sessionsByRefreshToken[refreshToken] = {
    userId,
    refreshToken,
    expiresAt
  };
  await saveSessionStore(store);

  return { refreshToken, expiresAt };
}

function isUuid(v: string): boolean {
  const s = (v || "").trim();
  if (!s) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

function parseAccessToken(token: string): string {
  const t = (token || "").trim();
  if (!t) throw new AppError("Missing token", { code: "UNAUTHORIZED", status: 401 });
  if (!t.startsWith("fake-access-token.")) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  const userId = t.slice("fake-access-token.".length);
  if (!userId) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  if (!userId.startsWith("user_") && !isUuid(userId)) throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
  return userId;
}

function parseRefreshToken(token: string): { userId: string } {
  const t = (token || "").trim();
  if (!t) throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });

  const parts = t.split(".");
  if (parts.length !== 3) throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });
  if (parts[0] !== "fake-refresh-token") throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });

  const userId = (parts[1] || "").trim();
  if (!userId) throw new AppError("Invalid refresh token", { code: "UNAUTHORIZED", status: 401 });

  return { userId };
}

async function findUserByEmail(email: string): Promise<FakeUser | undefined> {
  await ensureSeedUsers();
  const store = await loadUserStore();
  for (const u of Object.values(store.usersById)) {
    if (!u) continue;
    if ((u.email || "").toLowerCase() === email.toLowerCase()) return u;
  }
  return undefined;
}

async function requireActiveUserByEmail(email: string): Promise<FakeUser> {
  const u = await findUserByEmail(email);
  if (!u || u.deletedAt) throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
  if (u.disabledAt) throw new AppError("Account is disabled", { code: "FORBIDDEN", status: 403 });
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
  if (u.disabledAt) throw new AppError("Account is disabled", { code: "FORBIDDEN", status: 403 });
  return u;
}

function toProfile(user: FakeUser): AuthUserProfile {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    roles: user.roles,
    ...(user.givenName ? { givenName: user.givenName } : {}),
    ...(user.familyName ? { familyName: user.familyName } : {}),
    ...(user.avatarUrl ? { avatarUrl: user.avatarUrl } : {}),
    ...(user.bio ? { bio: user.bio } : {}),
    ...(user.phoneNumber ? { phoneNumber: user.phoneNumber } : {}),
    locale: user.locale ?? "en",
    timezone: user.timezone ?? "UTC",
    ...(user.disabledAt ? { disabled: true } : {})
  };
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
    user: toProfile(user)
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

    const givenName = (req.givenName || "").trim() || undefined;
    const familyName = (req.familyName || "").trim() || undefined;

    const user: FakeUser = {
      id,
      username: email,
      displayName: displayName || email,
      roles: ["user"],
      email,
      password,
      locale: "en",
      timezone: "UTC",
      ...(givenName ? { givenName } : {}),
      ...(familyName ? { familyName } : {})
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

    existing.revokedAt = nowIso();
    store.sessionsByRefreshToken[refreshToken] = existing;
    await saveSessionStore(store);

    const u = await requireActiveUserById(parsed.userId);

    const s = await createSession(u.id);
    return toAuthResponse(u, s);
  },

  logout: async (accessToken: string, req?: AuthLogoutRequest): Promise<void> => {
    const userId = parseAccessToken(accessToken);
    const rt = (req?.refreshToken || "").trim();

    if (rt) {
      const store = await loadSessionStore();
      const existing = store.sessionsByRefreshToken[rt];
      if (existing && existing.userId === userId && !existing.revokedAt) {
        existing.revokedAt = nowIso();
        store.sessionsByRefreshToken[rt] = existing;
        await saveSessionStore(store);
      }
      return;
    }

    await revokeSessionsForUser(userId);
  },

  getUserFromToken: async (token: string): Promise<AuthUserProfile> => {
    const userId = parseAccessToken(token);
    const u = await requireActiveUserById(userId);
    return toProfile(u);
  },

  listUsers: async (): Promise<AuthUserProfile[]> => {
    await ensureSeedUsers();
    const store = await loadUserStore();

    return Object.values(store.usersById)
      .filter((u): u is FakeUser => !!u)
      .map(toProfile);
  },

  getUserById: async (id: string): Promise<AuthUserProfile> => {
    const u = await requireUserById(id);
    return toProfile(u);
  },

  createUser: async (input: CreateUserInput): Promise<AuthUserProfile> => {
    const email = (input.email || "").trim().toLowerCase();
    const password = input.password || "";
    const displayName = (input.displayName || "").trim();

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
      roles: normalizeRoles(input.roles),
      email,
      password,
      locale: (input.locale || "").trim() || "en",
      timezone: (input.timezone || "").trim() || "UTC"
    };
    const gn = (input.givenName || "").trim(); if (gn) user.givenName = gn;
    const fn = (input.familyName || "").trim(); if (fn) user.familyName = fn;
    const au = (input.avatarUrl || "").trim(); if (au) user.avatarUrl = au;
    const bi = (input.bio || "").trim(); if (bi) user.bio = bi;
    const pn = (input.phoneNumber || "").trim(); if (pn) user.phoneNumber = pn;

    store.usersById[id] = user;
    await saveUserStore(store);

    return toProfile(user);
  },

  updateUser: async (id: string, input: UpdateUserInput): Promise<AuthUserProfile> => {
    await ensureSeedUsers();
    const store = await loadUserStore();

    const existing = store.usersById[id];
    if (!existing) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });

    const updated: FakeUser = { ...existing };
    if (typeof input.displayName === "string") updated.displayName = input.displayName;
    if (Array.isArray(input.roles)) updated.roles = normalizeRoles(input.roles);
    if (input.givenName !== undefined) { const v = input.givenName.trim(); if (v) updated.givenName = v; else delete updated.givenName; }
    if (input.familyName !== undefined) { const v = input.familyName.trim(); if (v) updated.familyName = v; else delete updated.familyName; }
    if (input.avatarUrl !== undefined) { const v = input.avatarUrl.trim(); if (v) updated.avatarUrl = v; else delete updated.avatarUrl; }
    if (input.bio !== undefined) { const v = input.bio.trim(); if (v) updated.bio = v; else delete updated.bio; }
    if (input.phoneNumber !== undefined) { const v = input.phoneNumber.trim(); if (v) updated.phoneNumber = v; else delete updated.phoneNumber; }
    if (input.locale !== undefined) updated.locale = input.locale.trim() || "en";
    if (input.timezone !== undefined) updated.timezone = input.timezone.trim() || "UTC";
    store.usersById[id] = updated;

    await saveUserStore(store);

    const u = store.usersById[id];
    if (!u) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });

    return toProfile(u);
  },

  deleteUser: async (id: string): Promise<void> => {
    await ensureSeedUsers();
    const store = await loadUserStore();

    const existing = store.usersById[id];
    if (!existing) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });

    store.usersById[id] = { ...existing, deletedAt: nowIso() };
    await saveUserStore(store);

    await revokeSessionsForUser(id);
  },

  revokeUserSessions: async (id: string): Promise<void> => {
    await ensureSeedUsers();
    const store = await loadUserStore();
    const existing = store.usersById[id];
    if (!existing || existing.deletedAt) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });
    await revokeSessionsForUser(id);
  },

  disableUser: async (id: string): Promise<void> => {
    await ensureSeedUsers();
    const store = await loadUserStore();
    const existing = store.usersById[id];
    if (!existing || existing.deletedAt) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });
    if (!existing.disabledAt) {
      store.usersById[id] = { ...existing, disabledAt: nowIso() };
      await saveUserStore(store);
    }
    await revokeSessionsForUser(id);
  },

  enableUser: async (id: string): Promise<void> => {
    await ensureSeedUsers();
    const store = await loadUserStore();
    const existing = store.usersById[id];
    if (!existing || existing.deletedAt) throw new AppError("Not found", { code: "NOT_FOUND", status: 404 });
    const updated: FakeUser = { ...existing };
    delete updated.disabledAt;
    store.usersById[id] = updated;
    await saveUserStore(store);
  }
};

