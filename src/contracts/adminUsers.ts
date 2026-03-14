import type { AuthUserProfile } from "./auth.js";

export type AdminUsersResponse = {
  users: AuthUserProfile[];
};

export type AdminUserResponse = {
  user: AuthUserProfile;
};

export type AdminCreateUserRequest = {
  email: string;
  password: string;
  displayName?: string;
  roles?: string[];
  givenName?: string;
  familyName?: string;
  avatarUrl?: string;
  bio?: string;
  phoneNumber?: string;
  locale?: string;
  timezone?: string;
};

export type AdminUpdateUserRequest = {
  displayName?: string;
  roles?: string[];
  givenName?: string;
  familyName?: string;
  avatarUrl?: string;
  bio?: string;
  phoneNumber?: string;
  locale?: string;
  timezone?: string;
};

