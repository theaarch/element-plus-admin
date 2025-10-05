import http from "@/utils/http";
import type { PaginatedResponse } from "@/interfaces/Pagination";
import type { Role, RoleFilters } from "@/interfaces/Role";

export const fetchRoles = async (filters: RoleFilters = {}): Promise<PaginatedResponse<Role>> => {
  const response = await http.get<PaginatedResponse<Role>>("/roles", {
    params: filters,
  });
  return response.data;
};

export const getRole = async (id: number): Promise<Role> => {
  const response = await http.get<Role>(`/roles/${id}`);
  return response.data;
};

export const createRole = async (payload: Partial<Role>): Promise<Role> => {
  const response = await http.post<Role>("/roles", payload);
  return response.data;
};

export const updateRole = async (id: number, payload: Partial<Role>): Promise<Role> => {
  const response = await http.put<Role>(`/roles/${id}`, payload);
  return response.data;
};

export const deleteRole = async (id: number): Promise<void> => {
  await http.delete(`/roles/${id}`);
};

export const bulkDeleteRoles = async (ids: number[]): Promise<void> => {
  await http.delete("/roles", { data: { ids } });
};
