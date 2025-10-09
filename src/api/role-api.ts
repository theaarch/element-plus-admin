import http from "@/utils/http";

const ROLE_BASE_URL = "/api/v1/roles";

const RoleAPI = {
  /** 获取角色分页数据 */
  getPage(queryParams?: RolePageQuery): Promise<ApiResponse<PageResult<RolePageVO>>> {
    return http.get(`${ROLE_BASE_URL}/page`, {
      params: queryParams,
    });
  },

  /** 获取角色下拉数据源 */
  getOptions(): Promise<ApiResponse<OptionType[]>> {
    return http.get(`${ROLE_BASE_URL}/options`);
  },

  /** 获取角色的菜单ID集合 */
  getRoleMenuIds(roleId: string): Promise<ApiResponse<string[]>> {
    return http.get(`${ROLE_BASE_URL}/${roleId}/menuIds`);
  },

  /** 分配菜单权限 */
  updateRoleMenus(roleId: string, data: number[]): Promise<ApiResponse<void>> {
    return http.put(`${ROLE_BASE_URL}/${roleId}/menus`, data);
  },

  /** 获取角色表单数据 */
  getFormData(id: string): Promise<ApiResponse<RoleForm>> {
    return http.get(`${ROLE_BASE_URL}/${id}/form`);
  },

  /** 新增角色 */
  create(data: RoleForm): Promise<ApiResponse<void>> {
    return http.post(`${ROLE_BASE_URL}`, data);
  },

  /** 更新角色 */
  update(id: string, data: RoleForm): Promise<ApiResponse<void>> {
    return http.put(`${ROLE_BASE_URL}/${id}`, data);
  },

  /** 批量删除角色，多个以英文逗号(,)分割 */
  deleteByIds(ids: string): Promise<ApiResponse<void>> {
    return http.delete(`${ROLE_BASE_URL}/${ids}`, {});
  },
};

export default RoleAPI;

export interface RolePageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
}

export interface RolePageVO {
  /** 角色ID */
  id?: string;
  /** 角色编码 */
  code?: string;
  /** 角色名称 */
  name?: string;
  /** 排序 */
  sort?: number;
  /** 角色状态 */
  status?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 修改时间 */
  updateTime?: Date;
}

export interface RoleForm {
  /** 角色ID */
  id?: string;
  /** 角色编码 */
  code?: string;
  /** 数据权限 */
  dataScope?: number;
  /** 角色名称 */
  name?: string;
  /** 排序 */
  sort?: number;
  /** 角色状态(1-正常；0-停用) */
  status?: number;
}
