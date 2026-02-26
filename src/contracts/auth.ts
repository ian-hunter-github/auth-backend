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

export type AuthLoginResponse = {
  token: string;
  user: AuthUserProfile;
};
