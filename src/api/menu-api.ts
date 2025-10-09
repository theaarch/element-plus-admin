import http from "@/utils/http";

const MENU_BASE_URL = "/api/v1/menus";

const MenuAPI = {
  /** 获取当前用户的路由列表 */
  getRoutes(): Promise<ApiResponse<RouteVO[]>> {
    return http.get(`${MENU_BASE_URL}/routes`);
  },

  /** 获取菜单树形列表 */
  getList(queryParams: MenuQuery): Promise<ApiResponse<MenuVO[]>> {
    return http.get(`${MENU_BASE_URL}`, { params: queryParams });
  },

  /** 获取菜单下拉数据源 */
  getOptions(onlyParent?: boolean): Promise<ApiResponse<OptionType[]>> {
    return http.get(`${MENU_BASE_URL}/options`, {
      params: { onlyParent },
    });
  },

  /** 获取菜单表单数据 */
  getFormData(id: string): Promise<ApiResponse<MenuForm>> {
    return http.get(`${MENU_BASE_URL}/${id}/form`);
  },

  /** 新增菜单 */
  create(data: MenuForm): Promise<ApiResponse<void>> {
    return http.post(`${MENU_BASE_URL}`, data);
  },

  /** 修改菜单 */
  update(id: string, data: MenuForm): Promise<ApiResponse<void>> {
    return http.put(`${MENU_BASE_URL}/${id}`, data);
  },

  /** 删除菜单 */
  deleteById(id: string): Promise<ApiResponse<void>> {
    return http.delete(`${MENU_BASE_URL}/${id}`);
  },
};

export default MenuAPI;

export interface MenuQuery {
  /** 搜索关键字 */
  keywords?: string;
}

import type { MenuTypeEnum } from "@/enums/system/menu-enum";

export interface MenuVO {
  /** 子菜单 */
  children?: MenuVO[];
  /** 组件路径 */
  component?: string;
  /** ICON */
  icon?: string;
  /** 菜单ID */
  id?: string;
  /** 菜单名称 */
  name?: string;
  /** 父菜单ID */
  parentId?: string;
  /** 按钮权限标识 */
  perm?: string;
  /** 跳转路径 */
  redirect?: string;
  /** 路由名称 */
  routeName?: string;
  /** 路由相对路径 */
  routePath?: string;
  /** 菜单排序(数字越小排名越靠前) */
  sort?: number;
  /** 菜单类型 */
  type?: MenuTypeEnum;
  /** 是否可见(1:显示;0:隐藏) */
  visible?: number;
}

export interface MenuForm {
  /** 菜单ID */
  id?: string;
  /** 父菜单ID */
  parentId?: string;
  /** 菜单名称 */
  name?: string;
  /** 是否可见(1-是 0-否) */
  visible: number;
  /** ICON */
  icon?: string;
  /** 排序 */
  sort?: number;
  /** 路由名称 */
  routeName?: string;
  /** 路由路径 */
  routePath?: string;
  /** 组件路径 */
  component?: string;
  /** 跳转路由路径 */
  redirect?: string;
  /** 菜单类型 */
  type?: MenuTypeEnum;
  /** 权限标识 */
  perm?: string;
  /** 【菜单】是否开启页面缓存 */
  keepAlive?: number;
  /** 【目录】只有一个子路由是否始终显示 */
  alwaysShow?: number;
  /** 其他参数 */
  params?: KeyValue[];
}

interface KeyValue {
  key: string;
  value: string;
}

export interface RouteVO {
  /** 子路由列表 */
  children: RouteVO[];
  /** 组件路径 */
  component?: string;
  /** 路由属性 */
  meta?: Meta;
  /** 路由名称 */
  name?: string;
  /** 路由路径 */
  path?: string;
  /** 跳转链接 */
  redirect?: string;
}

export interface Meta {
  /** 【目录】只有一个子路由是否始终显示 */
  alwaysShow?: boolean;
  /** 是否隐藏(true-是 false-否) */
  hidden?: boolean;
  /** ICON */
  icon?: string;
  /** 【菜单】是否开启页面缓存 */
  keepAlive?: boolean;
  /** 路由title */
  title?: string;
}
