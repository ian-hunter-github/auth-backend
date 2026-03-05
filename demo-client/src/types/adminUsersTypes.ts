import type { AuthUserProfile } from "./authTypes";

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
};

export type AdminUpdateUserRequest = {
  displayName?: string;
  roles?: string[];
};
