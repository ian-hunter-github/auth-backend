import type { MeResponse } from "../contracts/me.js";
import { getUserFromToken } from "./authService.js";

export async function getMe(token: string): Promise<MeResponse> {
  const user = await getUserFromToken(token);
  return { user };
}
