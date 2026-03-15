import { AppError } from "../../../lib/errors.js";
import type { MeResponse, UpdateMeRequest } from "../../../contracts/me.js";
import { getUserFromToken, updateUser } from "../../../services/authService.js";

export async function getMe(token: string): Promise<MeResponse> {
  const user = await getUserFromToken(token);
  return { user };
}

export async function updateMe(token: string, req: UpdateMeRequest): Promise<MeResponse> {
  const profileFields = ["displayName", "givenName", "familyName", "avatarUrl", "bio", "phoneNumber", "locale", "timezone"] as const;
  const hasField = profileFields.some((f) => req[f] !== undefined);
  if (!hasField) {
    throw new AppError("At least one field must be provided", {
      code: "BAD_REQUEST",
      status: 400,
      details: { fields: profileFields }
    });
  }

  const current = await getUserFromToken(token);

  const updated = await updateUser(current.id, {
    ...(req.displayName !== undefined ? { displayName: req.displayName } : {}),
    ...(req.givenName !== undefined ? { givenName: req.givenName } : {}),
    ...(req.familyName !== undefined ? { familyName: req.familyName } : {}),
    ...(req.avatarUrl !== undefined ? { avatarUrl: req.avatarUrl } : {}),
    ...(req.bio !== undefined ? { bio: req.bio } : {}),
    ...(req.phoneNumber !== undefined ? { phoneNumber: req.phoneNumber } : {}),
    ...(req.locale !== undefined ? { locale: req.locale } : {}),
    ...(req.timezone !== undefined ? { timezone: req.timezone } : {})
  });

  return { user: updated };
}

