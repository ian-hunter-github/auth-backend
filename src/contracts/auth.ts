export type AuthLoginRequest = {
  username: string;
  password: string;
};

export type AuthRefreshRequest = {
  refreshToken: string;
};

export type AuthLogoutRequest = {
  refreshToken: string;
};

export type AuthUserProfile = {
  id: string;
  username: string;
  displayName: string;
  roles: string[];
};

export type AuthSession = {
  accessToken: string;
  tokenType: "bearer";
  expiresAt?: string;
  refreshToken?: string;
};

export type AuthProviderId = "fake" | "postgres" | "google" | "github";

export type AuthResult = {
  provider: AuthProviderId;
  session: AuthSession;
  user: AuthUserProfile;
};

export type AuthLoginResponse = AuthResult;
export type AuthRefreshResponse = AuthResult;

export type AuthLogoutResponse = {
  provider: AuthProviderId;
  revoked: boolean;
};

