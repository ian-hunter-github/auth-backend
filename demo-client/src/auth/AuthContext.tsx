import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { createApiClient } from "../api/apiClient";
import { makeAuthApi } from "../api/authApi";
import type { ApiError } from "../api/apiClient";
import type { AuthSession, AuthUserProfile } from "../types/authTypes";
import { clearAuth, loadAuth, saveAuth } from "./tokenStore";
import { useDebug } from "../debug/DebugContext";

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
  const dbg = useDebug();

  const [session, setSession] = useState<AuthSession | undefined>(undefined);
  const [user, setUser] = useState<AuthUserProfile | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [lastError, setLastError] = useState<ApiError | undefined>(undefined);

  useEffect(() => {
    const loaded = loadAuth(sessionKey);
    setSession(loaded.session);
    setUser(loaded.user);
  }, [sessionKey]);

  useEffect(() => {
    saveAuth(sessionKey, { ...(session ? { session } : {}), ...(user ? { user } : {}) });
  }, [sessionKey, session, user]);

  const api = useMemo(
    () =>
      createApiClient(
        () => session?.accessToken,
        dbg.enabled
          ? (e) =>
              dbg.log({
                method: e.method,
                path: e.path,
                url: e.url,
                status: e.status,
                ms: e.ms,
                ok: e.ok,
                requestBody: e.requestBody,
                responseBody: e.responseBody,
                errorMessage: e.errorMessage
              })
          : undefined
      ),
    [session?.accessToken, dbg.enabled, dbg]
  );

  const authApi = useMemo(() => makeAuthApi(api), [api]);

  const clearLocal = useCallback(() => {
    clearAuth(sessionKey);
    setSession(undefined);
    setUser(undefined);
    setLastError(undefined);
  }, [sessionKey]);

  const login = useCallback(
    async (username: string, password: string) => {
      setBusy(true);
      setLastError(undefined);
      try {
        const res = await authApi.login({ username, password });
        setSession(res.session);
        setUser(res.user);
      } catch (err) {
        setLastError(err as ApiError);
        throw err;
      } finally {
        setBusy(false);
      }
    },
    [authApi]
  );

  const logout = useCallback(async () => {
    setBusy(true);
    setLastError(undefined);
    try {
      const refreshToken = session?.refreshToken;
      await authApi.logout(refreshToken ? { refreshToken } : {});
    } catch (err) {
      // Logout failing shouldn't trap user; still clear locally.
      setLastError(err as ApiError);
    } finally {
      clearLocal();
      setBusy(false);
    }
  }, [authApi, clearLocal, session?.refreshToken]);

  const refresh = useCallback(async () => {
    setBusy(true);
    setLastError(undefined);
    try {
      const refreshToken = session?.refreshToken;
      if (!refreshToken) {
        throw {
          status: 0,
          code: "NO_REFRESH_TOKEN",
          message: "No refresh token present for this session"
        } satisfies ApiError;
      }
      const res = await authApi.refresh({ refreshToken });
      setSession(res.session);
      setUser(res.user);
    } catch (err) {
      setLastError(err as ApiError);
      throw err;
    } finally {
      setBusy(false);
    }
  }, [authApi, session?.refreshToken]);

  const value: AuthState = useMemo(
    () => ({
      sessionKey,
      session,
      user,
      isLoggedIn: !!session?.accessToken,
      login,
      logout,
      refresh,
      clearLocal,
      lastError,
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
