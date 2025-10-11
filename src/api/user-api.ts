import http from "@/utils/http";
import { AxiosResponse } from "axios";
import { ApiWrappedResponse, PaginatedResponse } from "@/interfaces/response";

const USER_BASE_URL = "/api/v1/users";

const UserAPI = {
  /** 获取当前登录用户信息 */
  getInfo(): Promise<ApiWrappedResponse<UserInfo>> {
    return http.get(`/api/user`);
  },

  /** 获取用户分页列表 */
  getPage(queryParams: UserPageQuery): Promise<PaginatedResponse<UserPageVO>> {
    return http.get(`/api/users`, {
      params: queryParams,
    });
  },

  /** 获取用户表单详情 */
  getFormData(userId: string): Promise<ApiWrappedResponse<UserForm>> {
    return http.get(`/api/users/${userId}`);
  },

  /** 添加用户 */
  create(data: UserForm): Promise<ApiWrappedResponse<void>> {
    return http.post(`/api/users`, data);
  },

  /**  修改用户 */
  update(id: string, data: UserForm): Promise<ApiWrappedResponse<void>> {
    return http.put(`/api/users/${id}`, data);
  },

  /** 修改用户密码 */
  resetPassword(id: string, password: string): Promise<ApiWrappedResponse<void>> {
    return http.put(
      `/api/users/${id}/password/reset`,
      {},
      {
        params: { password },
      }
    );
  },

  /** 批量删除用户，多个以英文逗号(,)分割 */
  deleteByIds(ids: string): Promise<ApiWrappedResponse<void>> {
    return http.delete(`/api/users/${ids}`);
  },

  /** 下载用户导入模板 */
  downloadTemplate(): Promise<AxiosResponse<Blob>> {
    return http.get(`${USER_BASE_URL}/template`, {
      responseType: "blob",
    });
  },

  /** 导出用户  */
  export(queryParams: UserPageQuery): Promise<AxiosResponse<Blob>> {
    return http.get(`${USER_BASE_URL}/export`, {
      params: queryParams,
      responseType: "blob",
    });
  },

  /** 导入用户 */
  import(deptId: string, file: File): Promise<ApiWrappedResponse<ExcelResult>> {
    const formData = new FormData();

    formData.append("file", file);

    return http.post(`${USER_BASE_URL}/import`, formData, {
      params: { deptId },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /** 获取个人中心用户信息 */
  getProfile(): Promise<ApiWrappedResponse<UserProfileVO>> {
    return http.get(`${USER_BASE_URL}/profile`);
  },

  /** 修改个人中心用户信息 */
  updateProfile(data: UserProfileForm): Promise<ApiWrappedResponse<void>> {
    return http.put(`${USER_BASE_URL}/profile`, data);
  },

  /** 修改个人中心用户密码 */
  changePassword(data: PasswordChangeForm): Promise<ApiWrappedResponse<void>> {
    return http.put(`${USER_BASE_URL}/password`, data);
  },

  /** 发送短信验证码（绑定或更换手机号）*/
  sendMobileCode(mobile: string): Promise<ApiWrappedResponse<void>> {
    return http.post(
      `${USER_BASE_URL}/mobile/code`,
      {},
      {
        params: { mobile },
      }
    );
  },

  /** 绑定或更换手机号 */
  bindOrChangeMobile(data: MobileUpdateForm): Promise<ApiWrappedResponse<void>> {
    return http.put(`${USER_BASE_URL}/mobile`, data);
  },

  /** 发送邮箱验证码（绑定或更换邮箱）*/
  sendEmailCode(email: string): Promise<ApiWrappedResponse<void>> {
    return http.post(
      `${USER_BASE_URL}/email/code`,
      {},
      {
        params: { email },
      }
    );
  },

  /** 绑定或更换邮箱 */
  bindOrChangeEmail(data: EmailUpdateForm): Promise<ApiWrappedResponse<void>> {
    return http.put(`${USER_BASE_URL}/email`, data);
  },

  /**
   *  获取用户下拉列表
   */
  getOptions(): Promise<ApiWrappedResponse<OptionType[]>> {
    return http.get(`${USER_BASE_URL}/options`, {});
  },
};

export default UserAPI;

export interface UserInfo {
  // 用户ID
  userId?: string;

  // 用户名
  username?: string;

  // 昵称
  nickname?: string;

  // 头像URL
  avatar?: string;

  // 角色
  roles: string[];

  // 权限
  perms: string[];

  id?: number | string;
  name?: string;
  email?: string;
  role_names?: string[];
  permission_names?: string[];
}

export interface UserPageQuery extends PageQuery {
  // 搜索关键字
  keywords?: string;

  // 用户状态
  status?: number;

  // 部门ID
  deptId?: string;

  // 开始时间
  createTime?: [string, string];

  created_at?: [string, string];
}

export interface UserPageVO {
  // 用户ID
  id: string;
  // 用户头像URL
  avatar?: string;
  // 创建时间
  createTime?: Date;
  // 部门名称
  deptName?: string;
  // 用户邮箱
  email?: string;
  // 性别
  gender?: number;
  // 手机号
  mobile?: string;
  // 用户昵称
  nickname?: string;
  // 角色名称，多个使用英文逗号(,)分割
  roleNames?: string;
  // 用户状态(1:启用;0:禁用)
  status?: number;
  // 用户名
  username?: string;
}

export interface UserForm {
  // 用户ID
  id?: string;
  // 用户头像
  avatar?: string;
  // 部门ID
  deptId?: string;
  // 邮箱
  email?: string;
  // 性别
  gender?: number;
  // 手机号
  mobile?: string;
  // 昵称
  nickname?: string;
  // 角色ID集合
  roleIds?: number[];
  // 用户状态(1:正常;0:禁用)
  status?: number;
  // 用户名
  username?: string;
}

export interface UserProfileVO {
  // 用户ID
  id?: string;

  // 用户名
  username?: string;

  // 昵称
  nickname?: string;

  // 头像URL
  avatar?: string;

  // 性别
  gender?: number;

  // 手机号
  mobile?: string;

  // 邮箱
  email?: string;

  // 部门名称
  deptName?: string;

  // 角色名称，多个使用英文逗号(,)分割
  roleNames?: string;

  // 创建时间
  createTime?: Date;
}

export interface UserProfileForm {
  // 用户ID
  id?: string;

  // 用户名
  username?: string;

  // 昵称
  nickname?: string;

  // 头像URL
  avatar?: string;

  // 性别
  gender?: number;

  // 手机号
  mobile?: string;

  // 邮箱
  email?: string;
}

export interface PasswordChangeForm {
  // 原密码
  oldPassword?: string;
  // 新密码
  newPassword?: string;
  // 确认新密码
  confirmPassword?: string;
}

export interface MobileUpdateForm {
  // 手机号
  mobile?: string;
  // 验证码
  code?: string;
}

export interface EmailUpdateForm {
  // 邮箱
  email?: string;
  // 验证码
  code?: string;
}
