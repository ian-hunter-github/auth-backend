import type { AuthSession, AuthUserProfile } from "../types/authTypes";

export type StoredAuth = {
  session?: AuthSession;
  user?: AuthUserProfile;
};

function key(sessionKey: string, part: string): string {
  return `auth.${sessionKey}.${part}`;
}

export function loadAuth(sessionKey: string): StoredAuth {
  const rawSession = localStorage.getItem(key(sessionKey, "session"));
  const rawUser = localStorage.getItem(key(sessionKey, "user"));

  let session: AuthSession | undefined;
  let user: AuthUserProfile | undefined;

  if (rawSession) {
    try {
      session = JSON.parse(rawSession) as AuthSession;
    } catch {
      session = undefined;
    }
  }

  if (rawUser) {
    try {
      user = JSON.parse(rawUser) as AuthUserProfile;
    } catch {
      user = undefined;
    }
  }

  return { ...(session ? { session } : {}), ...(user ? { user } : {}) };
}

export function saveAuth(sessionKey: string, v: StoredAuth): void {
  if (v.session) {
    localStorage.setItem(key(sessionKey, "session"), JSON.stringify(v.session));
  } else {
    localStorage.removeItem(key(sessionKey, "session"));
  }

  if (v.user) {
    localStorage.setItem(key(sessionKey, "user"), JSON.stringify(v.user));
  } else {
    localStorage.removeItem(key(sessionKey, "user"));
  }
}

export function clearAuth(sessionKey: string): void {
  localStorage.removeItem(key(sessionKey, "session"));
  localStorage.removeItem(key(sessionKey, "user"));
}
