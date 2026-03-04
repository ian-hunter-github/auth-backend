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

export type AuthProvider = {
  login: (req: AuthLoginRequest) => Promise<AuthLoginResponse>;
  register: (req: AuthRegisterRequest) => Promise<AuthRegisterResponse>;
  refresh: (req: AuthRefreshRequest) => Promise<AuthRefreshResponse>;
  logout: (accessToken: string, req?: AuthLogoutRequest) => Promise<void>;
  getUserFromToken: (token: string) => Promise<AuthUserProfile>;
  listUsers: () => Promise<AuthUserProfile[]>;
};
