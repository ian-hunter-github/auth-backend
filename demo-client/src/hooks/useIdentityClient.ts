import { useMemo } from "react";
import { useDebug } from "../debug/DebugContext";
import {
  createBrowserTokenStore,
  createIdentityClient
} from "../lib/identity-client";

export function useIdentityClient(sessionKey: string) {
  const dbg = useDebug();

  return useMemo(
    () =>
      createIdentityClient({
        tokenStore: createBrowserTokenStore(`auth.${sessionKey}`),
        ...(dbg.enabled
          ? {
              logger: (e) =>
                dbg.log({
                  method: e.method,
                  path: e.path,
                  url: e.url,
                  status: e.status,
                  ms: e.ms,
                  ok: e.ok,
                  ...(e.requestBody !== undefined ? { requestBody: e.requestBody } : {}),
                  ...(e.responseBody !== undefined ? { responseBody: e.responseBody } : {}),
                  ...(e.errorMessage !== undefined ? { errorMessage: e.errorMessage } : {})
                })
            }
          : {})
      }),
    [sessionKey, dbg.enabled, dbg]
  );
}
