import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutResponse,
  AuthRefreshRequest,
  AuthRefreshResponse,
  AuthUserProfile
} from "../contracts/auth.js";

export type AuthProvider = {
  login: (req: AuthLoginRequest) => Promise<AuthLoginResponse>;
  refresh: (req: AuthRefreshRequest) => Promise<AuthRefreshResponse>;
  logout: (req: AuthRefreshRequest) => Promise<AuthLogoutResponse>;
  getUserFromToken: (token: string) => Promise<AuthUserProfile>;
};

