import http from "@/utils/http";

const DEPT_BASE_URL = "/api/v1/dept";

const DeptAPI = {
  /** 获取部门树形列表 */
  getList(queryParams?: DeptQuery): Promise<ApiResponse<DeptVO[]>> {
    return http.get(`${DEPT_BASE_URL}`, { params: queryParams });
  },

  /** 获取部门下拉数据源 */
  getOptions(): Promise<ApiResponse<OptionType[]>> {
    return http.get(`${DEPT_BASE_URL}/options`);
  },

  /** 获取部门表单数据 */
  getFormData(id: string): Promise<ApiResponse<DeptForm>> {
    return http.get(`${DEPT_BASE_URL}/${id}/form`);
  },

  /** 新增部门 */
  create(data: DeptForm): Promise<ApiResponse<void>> {
    return http.post(`${DEPT_BASE_URL}`, data);
  },

  /** 修改部门 */
  update(id: string, data: DeptForm): Promise<ApiResponse<void>> {
    return http.put(`${DEPT_BASE_URL}/${id}`, data);
  },

  /** 批量删除部门，多个以英文逗号(,)分割 */
  deleteByIds(ids: string): Promise<ApiResponse<void>> {
    return http.delete(`${DEPT_BASE_URL}/${ids}`);
  },
};

export default DeptAPI;

export interface DeptQuery {
  /** 搜索关键字 */
  keywords?: string;
  /** 状态 */
  status?: number;
}

export interface DeptVO {
  /** 子部门 */
  children?: DeptVO[];
  /** 创建时间 */
  createTime?: Date;
  /** 部门ID */
  id?: string;
  /** 部门名称 */
  name?: string;
  /** 部门编号 */
  code?: string;
  /** 父部门ID */
  parentId?: string;
  /** 排序 */
  sort?: number;
  /** 状态(1:启用；0:禁用) */
  status?: number;
  /** 修改时间 */
  updateTime?: Date;
}

export interface DeptForm {
  /** 部门ID(新增不填) */
  id?: string;
  /** 部门名称 */
  name?: string;
  /** 部门编号 */
  code?: string;
  /** 父部门ID */
  parentId: string;
  /** 排序 */
  sort?: number;
  /** 状态(1:启用；0：禁用) */
  status?: number;
}
