import { useMemo } from "react";
import { createApiClient } from "../api/apiClient";
import { useAuth } from "../auth/useAuth";
import { makeAdminApi } from "../api/adminApi";
import { makeUserApi } from "../api/userApi";
import { useDebug } from "../debug/DebugContext";

export function usePanelApis() {
  const auth = useAuth();
  const dbg = useDebug();

  const api = useMemo(
    () =>
      createApiClient(
        () => auth.session?.accessToken,
        dbg.enabled
          ? (e) =>
              dbg.log({
                method: e.method,
                path: e.path,
                url: e.url,
                status: e.status,
                ms: e.ms,
                ok: e.ok,
                requestBody: e.requestBody,
                responseBody: e.responseBody,
                errorMessage: e.errorMessage
              })
          : undefined
      ),
    [auth.session?.accessToken, dbg.enabled, dbg]
  );

  const userApi = useMemo(() => makeUserApi(api), [api]);
  const adminApi = useMemo(() => makeAdminApi(api), [api]);

  return { api, userApi, adminApi };
}
