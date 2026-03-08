export type AuthSession = {
  accessToken: string;
  tokenType: "bearer";
  expiresAt?: string;
  refreshToken?: string;
};

export type AuthUserProfile = {
  id: string;
  username: string;
  displayName: string;
  roles: string[];
};

export type AuthProviderId = "fake" | "postgres" | "google" | "github";

export type AuthLoginResponse = {
  provider: AuthProviderId;
  session: AuthSession;
  user: AuthUserProfile;
};

export type AuthRegisterResponse = AuthLoginResponse;

export type AuthRefreshResponse = AuthLoginResponse;

export type AuthLoginRequest = {
  username: string;
  password: string;
};

export type AuthRefreshRequest = {
  refreshToken: string;
};

export type AuthLogoutRequest = {
  refreshToken?: string;
};
