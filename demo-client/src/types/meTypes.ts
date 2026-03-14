import type { AuthUserProfile } from "./authTypes";

export type MeResponse = {
  user: AuthUserProfile;
};

export type UpdateMeRequest = {
  displayName?: string;
  givenName?: string;
  familyName?: string;
  avatarUrl?: string;
  bio?: string;
  phoneNumber?: string;
  locale?: string;
  timezone?: string;
};
