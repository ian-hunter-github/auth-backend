import { useCallback, useMemo, useState } from "react";
import type { AuthSession, AuthUserProfile } from "../types/authTypes";
import { useIdentityClient } from "./useIdentityClient";

export function useIdentitySession(sessionKey: string): {
  client: ReturnType<typeof useIdentityClient>;
  session?: AuthSession;
  user?: AuthUserProfile;
  reload: () => void;
} {
  const client = useIdentityClient(sessionKey);
  const [revision, setRevision] = useState(0);

  const reload = useCallback(() => {
    setRevision((v) => v + 1);
  }, []);

  const snapshot = useMemo(() => {
    void revision;
    return client.getSession();
  }, [client, revision]);

  return {
    client,
    ...(snapshot?.session ? { session: snapshot.session } : {}),
    ...(snapshot?.user ? { user: snapshot.user } : {}),
    reload
  };
}
