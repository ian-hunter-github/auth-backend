import { useCallback } from "react";
import type { ApiError } from "../api/apiClient";
import { useAuth } from "../auth/useAuth";
import { useIdentityClient } from "./useIdentityClient";
import { toApiError } from "../lib/toApiError";

export function usePanelIdentity(): {
  client: ReturnType<typeof useIdentityClient>;
  toPanelError: (err: unknown) => ApiError;
} {
  const auth = useAuth();
  const client = useIdentityClient(auth.sessionKey);

  const toPanelError = useCallback((err: unknown): ApiError => toApiError(err), []);

  return { client, toPanelError };
}
