import { useCallback } from "react";
import type { ApiError } from "../api/apiClient";
import { useAuth } from "../auth/useAuth";
import { useIdentityClient } from "./useIdentityClient";
import { toApiError } from "../lib/toApiError";

export function useIdentityFacade(): {
  auth: ReturnType<typeof useAuth>;
  client: ReturnType<typeof useIdentityClient>;
  toPanelError: (err: unknown) => ApiError;
} {
  const auth = useAuth();
  const client = useIdentityClient(auth.sessionKey);

  const toPanelError = useCallback((err: unknown): ApiError => toApiError(err), []);

  return { auth, client, toPanelError };
}
