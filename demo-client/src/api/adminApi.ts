import type { ApiClient } from "./apiClient";
import type { AdminCreateUserRequest, AdminUpdateUserRequest, AdminUserResponse, AdminUsersResponse } from "../types/adminUsersTypes";

export function makeAdminApi(api: ApiClient) {
  return {
    listUsers: async (): Promise<AdminUsersResponse> => {
      return api.get<AdminUsersResponse>("/admin-users", { headers: { "x-request-id": "demo-admin-users-list" } });
    },

    getUser: async (id: string): Promise<AdminUserResponse> => {
      return api.get<AdminUserResponse>(`/admin-users/${encodeURIComponent(id)}`, { headers: { "x-request-id": "demo-admin-users-get" } });
    },

    createUser: async (req: AdminCreateUserRequest): Promise<AdminUserResponse> => {
      return api.post<AdminUserResponse>("/admin-users", req, { headers: { "x-request-id": "demo-admin-users-create" } });
    },

    // Backend implements PATCH (even if the OpenAPI mentions PUT in some contexts).
    updateUser: async (id: string, req: AdminUpdateUserRequest): Promise<AdminUserResponse> => {
      return api.patch<AdminUserResponse>(`/admin-users/${encodeURIComponent(id)}`, req, { headers: { "x-request-id": "demo-admin-users-patch" } });
    },

    deleteUser: async (id: string): Promise<void> => {
      await api.del<unknown>(`/admin-users/${encodeURIComponent(id)}`, { headers: { "x-request-id": "demo-admin-users-delete" } });
    }
  };
}
