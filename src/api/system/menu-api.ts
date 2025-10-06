import http from "@/utils/http";
import { ApiResponse } from "@/interfaces/response";
import type { Route, MenuQuery, MenuResponse, Menu } from "@/interfaces/menu";

const MenuAPI = {
  getRoutes: async () => {
    return await http.get(`/api/menu-routes`);
  },

  fetchRoutes: async (): Promise<ApiResponse<Route[]>> => {
    return await http.get(`/api/menu-routes`);
  },

  getList(queryParams: MenuQuery) {
    return http.get<MenuResponse[]>(`/api/menus`, {
      params: queryParams,
    });
  },

  getOptions(onlyParent?: boolean) {
    return http.get<OptionType[]>(`/api/menu-options`, {
      params: { onlyParent },
    });
  },

  getFormData(id: string) {
    return http.get<Menu>(`/api/menus/${id}`);
  },

  create(data: Menu) {
    return http.post(`/api/menus`, data);
  },

  update(id: string, data: Menu) {
    return http.put(`/api/menus/${id}`, data);
  },

  deleteById(id: string) {
    return http.delete(`/api/menus/${id}`);
  },
};

export default MenuAPI;
