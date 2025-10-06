import http from "@/utils/http";
import type { ApiResponse } from "@/interfaces/response";

const UserAPI = {
  getInfo: async (): Promise<ApiResponse<UserInfo>> => {
    return await http.get("/api/user");
  },

  getPage(queryParams: UserPageQuery) {
    return http.get(`/api/users`, {
      params: queryParams,
    });
  },

  getFormData(id: string) {
    return http.get(`/api/users/${id}`);
  },

  create(data: UserForm) {
    return http.post(`/api/users`, data);
  },

  update(id: string, data: UserForm) {
    return http.put(`/api/users/${id}`, data);
  },

  resetPassword(id: string, data: any) {
    return http.put(`/api/users/${id}/password`, data);
  },

  updatePassword(id: string, data: any) {
    return http.put(`/api/users/${id}/password`, data);
  },

  /** 批量删除用户，多个以英文逗号(,)分割 */
  deleteByIds(ids: string) {
    return http.delete(`/api/users/${ids}`);
  },

  /** 下载用户导入模板 */
  downloadTemplate() {
    return http.get(`/api/users/template`, {
      responseType: "blob",
    });
  },

  /** 导出用户 */
  export(queryParams: UserPageQuery) {
    return http.get(`/api/users/export`, {
      params: queryParams,
      responseType: "blob",
    });
  },

  /** 导入用户 */
  import(deptId: string, file: File) {
    const formData = new FormData();

    formData.append("file", file);

    return http.post<ExcelResult>(`/api/users/import`, formData, {
      params: { deptId },
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /** 获取个人中心用户信息 */
  getProfile() {
    return http.get<UserProfileVO>(`/api/profile`);
  },

  /** 修改个人中心用户信息 */
  updateProfile(data: UserProfileForm) {
    return http.put(`/api/profile`, data);
  },

  /** 修改个人中心用户密码 */
  changePassword(data: PasswordChangeForm) {
    return http.put(`/api/password`, data);
  },

  /** 发送短信验证码（绑定或更换手机号）*/
  sendMobileCode(mobile: string) {
    return http.post(`/api/mobile/code`, undefined, {
      params: { mobile },
    });
  },

  /** 绑定或更换手机号 */
  bindOrChangeMobile(data: MobileUpdateForm) {
    return http.put(`/api/mobile`, data);
  },

  /** 发送邮箱验证码（绑定或更换邮箱）*/
  sendEmailCode(email: string) {
    return http.post(`/api/email/code`, undefined, {
      params: { email },
    });
  },

  /** 绑定或更换邮箱 */
  bindOrChangeEmail(data: EmailUpdateForm) {
    return http.put(`/api/email`, data);
  },

  /** 获取用户下拉列表 */
  getOptions() {
    return http.get<OptionType[]>(`/api/users/options`);
  },
};

export default UserAPI;

/** 登录用户信息 */
export interface UserInfo {
  userId?: string;
  username?: string;
  nickname?: string;
  avatar?: string;
  role_names: string[];
  permission_names: string[];
}

/**
 * 用户分页查询对象
 */
export interface UserPageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;

  /** 用户状态 */
  status?: number;

  /** 部门ID */
  deptId?: string;

  /** 开始时间 */
  createTime?: [string, string];
}

/** 用户分页对象 */
export interface UserPageVO {
  /** 用户ID */
  id: string;
  /** 用户头像URL */
  avatar?: string;
  /** 创建时间 */
  createTime?: Date;
  /** 部门名称 */
  deptName?: string;
  /** 用户邮箱 */
  email?: string;
  /** 性别 */
  gender?: number;
  /** 手机号 */
  mobile?: string;
  /** 用户昵称 */
  nickname?: string;
  /** 角色名称，多个使用英文逗号(,)分割 */
  roleNames?: string;
  /** 用户状态(1:启用;0:禁用) */
  status?: number;
  /** 用户名 */
  username?: string;
}

/** 用户表单类型 */
export interface UserForm {
  /** 用户ID */
  id?: string;
  /** 用户头像 */
  avatar?: string;
  /** 部门ID */
  deptId?: string;
  /** 邮箱 */
  email?: string;
  /** 性别 */
  gender?: number;
  /** 手机号 */
  mobile?: string;
  /** 昵称 */
  nickname?: string;
  /** 角色ID集合 */
  roleIds?: number[];
  /** 用户状态(1:正常;0:禁用) */
  status?: number;
  /** 用户名 */
  username?: string;
}

/** 个人中心用户信息 */
export interface UserProfileVO {
  /** 用户ID */
  id?: string;

  /** 用户名 */
  username?: string;

  /** 昵称 */
  nickname?: string;

  /** 头像URL */
  avatar?: string;

  /** 性别 */
  gender?: number;

  /** 手机号 */
  mobile?: string;

  /** 邮箱 */
  email?: string;

  /** 部门名称 */
  deptName?: string;

  /** 角色名称，多个使用英文逗号(,)分割 */
  roleNames?: string;

  /** 创建时间 */
  createTime?: Date;
}

/** 个人中心用户信息表单 */
export interface UserProfileForm {
  /** 用户ID */
  id?: string;

  /** 用户名 */
  username?: string;

  /** 昵称 */
  nickname?: string;

  /** 头像URL */
  avatar?: string;

  /** 性别 */
  gender?: number;

  /** 手机号 */
  mobile?: string;

  /** 邮箱 */
  email?: string;
}

/** 修改密码表单 */
export interface PasswordChangeForm {
  /** 原密码 */
  oldPassword?: string;
  /** 新密码 */
  newPassword?: string;
  /** 确认新密码 */
  confirmPassword?: string;
}

/** 修改手机表单 */
export interface MobileUpdateForm {
  /** 手机号 */
  mobile?: string;
  /** 验证码 */
  code?: string;
}

/** 修改邮箱表单 */
export interface EmailUpdateForm {
  /** 邮箱 */
  email?: string;
  /** 验证码 */
  code?: string;
}
