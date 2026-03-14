import type { AuthUserProfile } from "./auth.js";

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
