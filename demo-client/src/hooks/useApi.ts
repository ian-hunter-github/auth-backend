import { useMemo } from "react";
import { createApiClient } from "../api/apiClient";
import { useAuth } from "../auth/useAuth";
import { makeAdminApi } from "../api/adminApi";
import { makeUserApi } from "../api/userApi";

export function usePanelApis() {
  const auth = useAuth();

  const api = useMemo(() => createApiClient(() => auth.session?.accessToken), [auth.session?.accessToken]);

  const userApi = useMemo(() => makeUserApi(api), [api]);
  const adminApi = useMemo(() => makeAdminApi(api), [api]);

  return { api, userApi, adminApi };
}
