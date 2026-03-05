import type { AuthSession, AuthUserProfile } from "../types/authTypes";

export type StoredAuth = {
  session?: AuthSession;
  user?: AuthUserProfile;
};

function k(sessionKey: string): string {
  return `auth.${sessionKey}`;
}

function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

function safeRemoveItem(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function loadAuth(sessionKey: string): StoredAuth {
  const raw = safeGetItem(k(sessionKey));
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as StoredAuth;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveAuth(sessionKey: string, v: StoredAuth) {
  safeSetItem(k(sessionKey), JSON.stringify(v));
}

export function clearAuth(sessionKey: string) {
  safeRemoveItem(k(sessionKey));
}
