import React, { createContext, useCallback, useMemo, useState } from "react";
import type { ApiError } from "../api/apiClient";
import { useIdentitySession } from "../hooks/useIdentitySession";
import type { AuthSession, AuthUserProfile } from "../types/authTypes";
import { toApiError } from "../lib/toApiError";

export type AuthState = {
  sessionKey: string;
  session?: AuthSession;
  user?: AuthUserProfile;
  isLoggedIn: boolean;

  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;

  clearLocal: () => void;

  lastError?: ApiError;
  busy: boolean;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider(props: { sessionKey: string; children: React.ReactNode }) {
  const { sessionKey } = props;
  const { client, session, user, reload } = useIdentitySession(sessionKey);

  const [busy, setBusy] = useState(false);
  const [lastError, setLastError] = useState<ApiError | undefined>(undefined);

  const clearLocal = useCallback(() => {
    client.clearSession();
    setLastError(undefined);
    reload();
  }, [client, reload]);

  const login = useCallback(
    async (username: string, password: string) => {
      setBusy(true);
      setLastError(undefined);
      try {
        await client.login({ username, password });
        reload();
      } catch (err) {
        const apiError = toApiError(err);
        setLastError(apiError);
        throw apiError;
      } finally {
        setBusy(false);
      }
    },
    [client, reload]
  );

  const logout = useCallback(async () => {
    setBusy(true);
    setLastError(undefined);
    try {
      await client.logout();
    } catch (err) {
      setLastError(toApiError(err));
    } finally {
      reload();
      setBusy(false);
    }
  }, [client, reload]);

  const refresh = useCallback(async () => {
    setBusy(true);
    setLastError(undefined);
    try {
      await client.refresh();
      reload();
    } catch (err) {
      const apiError = toApiError(err);
      setLastError(apiError);
      throw apiError;
    } finally {
      setBusy(false);
    }
  }, [client, reload]);

  const value: AuthState = useMemo(
    () => ({
      sessionKey,
      ...(session ? { session } : {}),
      ...(user ? { user } : {}),
      isLoggedIn: !!session?.accessToken,
      login,
      logout,
      refresh,
      clearLocal,
      ...(lastError ? { lastError } : {}),
      busy
    }),
    [sessionKey, session, user, login, logout, refresh, clearLocal, lastError, busy]
  );

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthState {
  const v = React.useContext(AuthContext);
  if (!v) throw new Error("useAuthContext must be used within AuthProvider");
  return v;
}
