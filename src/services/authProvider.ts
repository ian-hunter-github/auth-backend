import type { AuthLoginRequest, AuthLoginResponse, AuthUserProfile } from "../contracts/auth.js";

export type AuthProvider = {
  login: (req: AuthLoginRequest) => Promise<AuthLoginResponse>;
  getUserFromToken: (token: string) => Promise<AuthUserProfile>;
};
