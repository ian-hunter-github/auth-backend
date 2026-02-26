export type AuthLoginRequest = {
  username: string;
  password: string;
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

export type AuthProviderId = "fake" | "supabase" | "google" | "github";

export type AuthLoginResponse = {
  provider: AuthProviderId;
  session: AuthSession;
  user: AuthUserProfile;
};
