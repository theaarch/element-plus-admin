import http from "@/services/http";
import type { PaginatedResponse } from "@/interfaces/Pagination";
import type { Permission, PermissionFilters } from "@/interfaces/Permission";

export const fetchPermissions = async (
  filters: PermissionFilters = {}
): Promise<PaginatedResponse<Permission>> => {
  const response = await http.get<PaginatedResponse<Permission>>("/permissions", {
    params: filters,
  });
  return response.data;
};

export const getPermission = async (id: number): Promise<Permission> => {
  const response = await http.get<Permission>(`/permissions/${id}`);
  return response.data;
};

export const createPermission = async (payload: Partial<Permission>): Promise<Permission> => {
  const response = await http.post<Permission>("/permissions", payload);
  return response.data;
};

export const updatePermission = async (
  id: number,
  payload: Partial<Permission>
): Promise<Permission> => {
  const response = await http.put<Permission>(`/permissions/${id}`, payload);
  return response.data;
};

export const deletePermission = async (id: number): Promise<void> => {
  await http.delete(`/permissions/${id}`);
};

export const bulkDeletePermissions = async (ids: number[]): Promise<void> => {
  await http.delete("/permissions", { data: { ids } });
};
