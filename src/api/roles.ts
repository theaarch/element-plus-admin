import http from "@/utils/http";
import { PaginatedResponse } from "@/interfaces/response";
import { Role, RoleFilters } from "@/interfaces/role";

const RoleAPI = {
  fetchRoles(params?: RoleFilters): Promise<PaginatedResponse<Role>> {
    return http.get(`/api/roles`, { params });
  },

  getRole(id: number | string): Promise<ApiResponse<Role>> {
    return http.get(`/api/roles/${id}`);
  },

  createRole(data: Partial<Role>): Promise<ApiResponse<Role>> {
    return http.post(`/api/roles`, data);
  },

  updateRole(id: number, data: Partial<Role>): Promise<ApiResponse<Role>> {
    return http.put(`/api/roles/${id}`, data);
  },

  deleteRole(id: number): Promise<void> {
    return http.delete(`/api/roles/${id}`);
  },
};

export default RoleAPI;
