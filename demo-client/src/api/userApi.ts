import type { ApiClient } from "./apiClient";
import type { MeResponse } from "../types/meTypes";

export function makeUserApi(api: ApiClient) {
  return {
    me: async (): Promise<MeResponse> => {
      return api.get<MeResponse>("/me", { headers: { "x-request-id": "demo-me" } });
    }
  };
}
