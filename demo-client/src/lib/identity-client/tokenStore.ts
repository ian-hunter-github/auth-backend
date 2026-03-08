import type { IdentitySessionState, TokenStore } from "./types";

export function createMemoryTokenStore(initialValue?: IdentitySessionState | null): TokenStore {
  let current = initialValue ?? null;

  return {
    get(): IdentitySessionState | null {
      return current;
    },

    set(value: IdentitySessionState | null): void {
      current = value;
    }
  };
}

export function createBrowserTokenStore(key: string): TokenStore {
  function safeGetItem(): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeSetItem(value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // ignore storage failures
    }
  }

  function safeRemoveItem(): void {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore storage failures
    }
  }

  return {
    get(): IdentitySessionState | null {
      const raw = safeGetItem();
      if (!raw) return null;

      try {
        const parsed = JSON.parse(raw) as IdentitySessionState;
        if (!parsed || typeof parsed !== "object") return null;
        return parsed;
      } catch {
        return null;
      }
    },

    set(value: IdentitySessionState | null): void {
      if (!value) {
        safeRemoveItem();
        return;
      }

      safeSetItem(JSON.stringify(value));
    }
  };
}
