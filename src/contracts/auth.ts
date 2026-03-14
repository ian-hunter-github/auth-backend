export type AuthLoginRequest = {
  username: string;
  password: string;
};

export type AuthRegisterRequest = {
  email: string;
  password: string;
  displayName?: string;
  givenName?: string;
  familyName?: string;
};

export type AuthRefreshRequest = {
  refreshToken: string;
};

export type AuthLogoutRequest = {
  refreshToken?: string;
};

export type AuthUserProfile = {
  id: string;
  username: string;
  displayName: string;
  roles: string[];
  givenName?: string;
  familyName?: string;
  avatarUrl?: string;
  bio?: string;
  phoneNumber?: string;
  locale: string;
  timezone: string;
};

export type AuthSession = {
  accessToken: string;
  tokenType: "bearer";
  expiresAt?: string;
  refreshToken?: string;
};

export type AuthProviderId = "fake" | "postgres" | "google" | "github";

export type AuthLoginResponse = {
  provider: AuthProviderId;
  session: AuthSession;
  user: AuthUserProfile;
};

export type AuthRegisterResponse = AuthLoginResponse;

export type AuthRefreshResponse = AuthLoginResponse;

