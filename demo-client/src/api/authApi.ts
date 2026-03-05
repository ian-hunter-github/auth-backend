import type { ApiClient } from "./apiClient";
import type { AuthLoginRequest, AuthLoginResponse, AuthRefreshRequest, AuthRefreshResponse, AuthLogoutRequest } from "../types/authTypes";

export function makeAuthApi(api: ApiClient) {
  return {
    login: async (req: AuthLoginRequest): Promise<AuthLoginResponse> => {
      return api.post<AuthLoginResponse>("/auth-login", req, { headers: { "x-request-id": "demo-auth-login" } });
    },

    refresh: async (req: AuthRefreshRequest): Promise<AuthRefreshResponse> => {
      return api.post<AuthRefreshResponse>("/auth-refresh", req, { headers: { "x-request-id": "demo-auth-refresh" } });
    },

    logout: async (req?: AuthLogoutRequest): Promise<void> => {
      await api.post<unknown>("/auth-logout", req || {}, { headers: { "x-request-id": "demo-auth-logout" } });
    }
  };
}
