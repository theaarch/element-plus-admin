import http from "@/utils/http";

const CONFIG_BASE_URL = "/api/v1/config";

const ConfigAPI = {
  /** 获取配置分页数据 */
  getPage(queryParams?: ConfigPageQuery): Promise<ApiResponse<PageResult<ConfigPageVO>>> {
    return http.get(`${CONFIG_BASE_URL}/page`, {
      params: queryParams,
    });
  },

  /** 获取配置表单数据 */
  getFormData(id: string): Promise<ApiResponse<ConfigForm>> {
    return http.get(`${CONFIG_BASE_URL}/${id}/form`);
  },

  /** 新增配置 */
  create(data: ConfigForm): Promise<ApiResponse<void>> {
    return http.post(`${CONFIG_BASE_URL}`, data);
  },

  /** 修改配置 */
  update(id: string, data: ConfigForm): Promise<ApiResponse<void>> {
    return http.put(`${CONFIG_BASE_URL}/${id}`, data);
  },

  /** 删除配置 */
  deleteById(id: string): Promise<ApiResponse<void>> {
    return http.delete(`${CONFIG_BASE_URL}/${id}`);
  },

  /** 刷新配置缓存 */
  refreshCache(): Promise<ApiResponse<void>> {
    return http.put(`${CONFIG_BASE_URL}/refresh`);
  },
};

export default ConfigAPI;

export interface ConfigPageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
}

export interface ConfigForm {
  /** 主键 */
  id?: string;
  /** 配置名称 */
  configName?: string;
  /** 配置键 */
  configKey?: string;
  /** 配置值 */
  configValue?: string;
  /** 描述、备注 */
  remark?: string;
}

export interface ConfigPageVO {
  /** 主键 */
  id?: string;
  /** 配置名称 */
  configName?: string;
  /** 配置键 */
  configKey?: string;
  /** 配置值 */
  configValue?: string;
  /** 描述、备注 */
  remark?: string;
}
