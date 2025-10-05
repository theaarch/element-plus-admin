import http from "@/services/http";
import type { PaginatedResponse } from "@/interfaces/Pagination";
import type { Menu, MenuFilters } from "@/interfaces/Menu";

export const fetchMenus = async (filters: MenuFilters = {}): Promise<PaginatedResponse<Menu>> => {
  const response = await http.get<PaginatedResponse<Menu>>("/menus", {
    params: filters,
  });
  return response.data;
};

export const getMenu = async (id: number): Promise<Menu> => {
  const response = await http.get<Menu>(`/menus/${id}`);
  return response.data;
};

export const createMenu = async (payload: Partial<Menu>): Promise<Menu> => {
  const response = await http.post<Menu>("/menus", payload);
  return response.data;
};

export const updateMenu = async (id: number, payload: Partial<Menu>): Promise<Menu> => {
  const response = await http.put<Menu>(`/menus/${id}`, payload);
  return response.data;
};

export const deleteMenu = async (id: number): Promise<void> => {
  await http.delete(`/menus/${id}`);
};

export const bulkDeleteMenus = async (ids: number[]): Promise<void> => {
  await http.delete("/menus", { data: { ids } });
};
