import http from "@/utils/http";
import type { PaginatedResponse, ApiWrappedResponse } from "@/interfaces/response";
import type { Permission, PermissionFilters } from "@/interfaces/permission";

const permissionsApi = {
  fetchPermissions(filters: PermissionFilters): Promise<PaginatedResponse<Permission>> {
    return http.get("/api/permissions", {
      params: filters,
    });
  },

  getPermission(id: number): Promise<ApiWrappedResponse<Permission>> {
    return http.get(`/api/permissions/${id}`);
  },

  createPermission(payload: Partial<Permission>): Promise<ApiWrappedResponse<Permission>> {
    return http.post("/api/permissions", payload);
  },

  updatePermission(
    id: number,
    payload: Partial<Permission>
  ): Promise<ApiWrappedResponse<Permission>> {
    return http.put(`/api/permissions/${id}`, payload);
  },

  deletePermission(id: number): Promise<void> {
    return http.delete(`/api/permissions/${id}`);
  },

  bulkDeletePermissions(ids: number[]): Promise<void> {
    return http.delete("/api/permissions", { data: { ids } });
  },
};

export default permissionsApi;
