import http from "@/utils/http";
import { Role, RoleFilters } from "@/interfaces/role";
import { ApiWrappedResponse, PaginatedResponse } from "@/interfaces/response";

const ROLE_BASE_URL = "/api/v1/roles";

const RoleAPI = {
  fetchRoles(queryParams?: RoleFilters): Promise<PaginatedResponse<Role>> {
    return http.get(`/api/roles`, {
      params: queryParams,
    });
  },

  getRole(id: number | string): Promise<ApiWrappedResponse<Role>> {
    return http.get(`/api/roles/${id}`);
  },

  createRole(data: Partial<Role>): Promise<ApiWrappedResponse<Role>> {
    return http.post(`/api/roles`, data);
  },

  updateRole(id: number, data: Partial<Role>): Promise<ApiWrappedResponse<Role>> {
    return http.put(`/api/roles/${id}`, data);
  },

  deleteRole(id: number): Promise<void> {
    return http.delete(`/api/roles/${id}`);
  },

  bulkDeleteRoles(ids: number[]): Promise<void> {
    return http.delete("/api/roles", { data: { ids } });
  },

  getOptions(): Promise<ApiResponse<OptionType[]>> {
    return http.get(`${ROLE_BASE_URL}/options`);
  },

  getRoleMenuIds(roleId: string): Promise<ApiResponse<string[]>> {
    return http.get(`${ROLE_BASE_URL}/${roleId}/menuIds`);
  },

  updateRoleMenus(roleId: string, data: number[]): Promise<ApiResponse<void>> {
    return http.put(`${ROLE_BASE_URL}/${roleId}/menus`, data);
  },
};

export default RoleAPI;

export interface RolePageQuery extends PageQuery {
  // 搜索关键字
  keywords?: string;
}

export interface RolePageVO {
  // 角色ID
  id?: string;
  // 角色编码
  code?: string;
  // 角色名称
  name?: string;
  // 排序
  sort?: number;
  // 角色状态
  status?: number;
  // 创建时间
  createTime?: Date;
  // 修改时间
  updateTime?: Date;
}

export interface RoleForm {
  // 角色ID
  id?: string;
  // 角色编码
  code?: string;
  // 数据权限
  dataScope?: number;
  // 角色名称
  name?: string;
  // 排序
  sort?: number;
  // 角色状态(1-正常；0-停用)
  status?: number;
}
