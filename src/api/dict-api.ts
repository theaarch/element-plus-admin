import http from "@/utils/http";

const DICT_BASE_URL = "/api/v1/dicts";

const DictAPI = {
  /** 字典分页列表 */
  getPage(queryParams: DictPageQuery): Promise<ApiResponse<PageResult<DictPageVO>>> {
    return http.get(`${DICT_BASE_URL}/page`, {
      params: queryParams,
    });
  },

  /** 字典列表 */
  getList(): Promise<ApiResponse<OptionType[]>> {
    return http.get(`${DICT_BASE_URL}`);
  },

  /** 字典表单数据 */
  getFormData(id: string): Promise<ApiResponse<DictForm>> {
    return http.get(`${DICT_BASE_URL}/${id}/form`);
  },

  /** 新增字典 */
  create(data: DictForm): Promise<ApiResponse<void>> {
    return http.post(`${DICT_BASE_URL}`, data);
  },

  /** 修改字典 */
  update(id: string, data: DictForm): Promise<ApiResponse<void>> {
    return http.put(`${DICT_BASE_URL}/${id}`, data);
  },

  /** 删除字典 */
  deleteByIds(ids: string): Promise<ApiResponse<void>> {
    return http.delete(`${DICT_BASE_URL}/${ids}`);
  },

  /** 获取字典项分页列表 */
  getDictItemPage(
    dictCode: string,
    queryParams: DictItemPageQuery
  ): Promise<ApiResponse<PageResult<DictItemPageVO>>> {
    return http.get(`${DICT_BASE_URL}/${dictCode}/items/page`, {
      params: queryParams,
    });
  },

  /** 获取字典项列表 */
  getDictItems(dictCode: string): Promise<ApiResponse<DictItemOption[]>> {
    return http.get(`${DICT_BASE_URL}/${dictCode}/items`);
  },

  /** 新增字典项 */
  createDictItem(dictCode: string, data: DictItemForm): Promise<ApiResponse<void>> {
    return http.post(`${DICT_BASE_URL}/${dictCode}/items`, data);
  },

  /** 获取字典项表单数据 */
  getDictItemFormData(dictCode: string, id: string): Promise<ApiResponse<DictItemForm>> {
    return http.get(`${DICT_BASE_URL}/${dictCode}/items/${id}/form`);
  },

  /** 修改字典项 */
  updateDictItem(dictCode: string, id: string, data: DictItemForm): Promise<ApiResponse<void>> {
    return http.put(`${DICT_BASE_URL}/${dictCode}/items/${id}`, data);
  },

  /** 删除字典项 */
  deleteDictItems(dictCode: string, ids: string): Promise<ApiResponse<void>> {
    return http.delete(`${DICT_BASE_URL}/${dictCode}/items/${ids}`);
  },
};

export default DictAPI;

export interface DictPageQuery extends PageQuery {
  // 搜索关键字
  keywords?: string;
  // 状态(1:启用;0:禁用)
  status?: number;
}

export interface DictPageVO {
  // 字典ID
  id: string;
  // 字典名称
  name: string;
  // 字典编码
  dictCode: string;
  // 状态(1:启用;0:禁用)
  status: number;
}

export interface DictForm {
  // 字典ID(新增不填)
  id?: string;
  // 字典名称
  name?: string;
  // 字典编码
  dictCode?: string;
  // 状态(1:启用;0:禁用)
  status?: number;
  // 备注
  remark?: string;
}

export interface DictItemPageQuery extends PageQuery {
  // 搜索关键字
  keywords?: string;
  // 字典编码
  dictCode?: string;
}

export interface DictItemPageVO {
  // 字典项ID
  id: string;
  // 字典编码
  dictCode: string;
  // 字典项值
  value: string;
  // 字典项标签
  label: string;
  // 状态(1:启用;0:禁用)
  status: number;
  // 排序
  sort?: number;
}

export interface DictItemForm {
  // 字典项ID(新增不填)
  id?: string;
  // 字典编码
  dictCode?: string;
  // 字典项值
  value?: string;
  // 字典项标签
  label?: string;
  // 状态(1:启用;0:禁用)
  status?: number;
  // 排序
  sort?: number;
  // 标签类型
  tagType?: "success" | "warning" | "info" | "primary" | "danger" | "";
}

export interface DictItemOption {
  // 值
  value: number | string;
  // 标签
  label: string;
  // 标签类型
  tagType?: "" | "success" | "info" | "warning" | "danger";
  [key: string]: any;
}
