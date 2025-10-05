import http from "@/utils/http";

const USER_BASE_URL = "/api/v1/users";

const UserAPI = {
  /** 获取当前登录用户信息 */
  getInfo() {
    return http.get<UserInfo>(`${USER_BASE_URL}/me`);
  },

  /** 获取用户分页列表 */
  getPage(queryParams: UserPageQuery) {
    return http.get<PageResult<UserPageVO[]>>(`${USER_BASE_URL}/page`, {
      params: queryParams,
    });
  },

  /** 获取用户表单详情 */
  getFormData(userId: string) {
    return http.get<any, UserForm>(`${USER_BASE_URL}/${userId}/form`);
  },

  /** 添加用户 */
  create(data: UserForm) {
    return http.post(`${USER_BASE_URL}`, data);
  },

  /** 修改用户 */
  update(id: string, data: UserForm) {
    return http.put(`${USER_BASE_URL}/${id}`, data);
  },

  /** 修改用户密码  */
  resetPassword(id: string, password: string) {
    return http.put(`${USER_BASE_URL}/${id}/password/reset`, undefined, {
      params: { password },
    });
  },

  /** 批量删除用户，多个以英文逗号(,)分割 */
  deleteByIds(ids: string) {
    return http.delete(`${USER_BASE_URL}/${ids}`);
  },

  /** 下载用户导入模板 */
  downloadTemplate() {
    return http.get(`${USER_BASE_URL}/template`, {
      responseType: "blob",
    });
  },

  /** 导出用户 */
  export(queryParams: UserPageQuery) {
    return http.get(`${USER_BASE_URL}/export`, {
      params: queryParams,
      responseType: "blob",
    });
  },

  /** 导入用户 */
  import(deptId: string, file: File) {
    const formData = new FormData();

    formData.append("file", file);

    return http.post<ExcelResult>(`${USER_BASE_URL}/import`, formData, {
      params: { deptId },
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /** 获取个人中心用户信息 */
  getProfile() {
    return http.get<UserProfileVO>(`${USER_BASE_URL}/profile`);
  },

  /** 修改个人中心用户信息 */
  updateProfile(data: UserProfileForm) {
    return http.put(`${USER_BASE_URL}/profile`, data);
  },

  /** 修改个人中心用户密码 */
  changePassword(data: PasswordChangeForm) {
    return http.put(`${USER_BASE_URL}/password`, data);
  },

  /** 发送短信验证码（绑定或更换手机号）*/
  sendMobileCode(mobile: string) {
    return http.post(`${USER_BASE_URL}/mobile/code`, undefined, {
      params: { mobile },
    });
  },

  /** 绑定或更换手机号 */
  bindOrChangeMobile(data: MobileUpdateForm) {
    return http.put(`${USER_BASE_URL}/mobile`, data);
  },

  /** 发送邮箱验证码（绑定或更换邮箱）*/
  sendEmailCode(email: string) {
    return http.post(`${USER_BASE_URL}/email/code`, undefined, {
      params: { email },
    });
  },

  /** 绑定或更换邮箱 */
  bindOrChangeEmail(data: EmailUpdateForm) {
    return http.put(`${USER_BASE_URL}/email`, data);
  },

  /**
   *  获取用户下拉列表
   */
  getOptions() {
    return http.get<OptionType[]>(`${USER_BASE_URL}/options`);
  },
};

export default UserAPI;

/** 登录用户信息 */
export interface UserInfo {
  /** 用户ID */
  userId?: string;

  /** 用户名 */
  username?: string;

  /** 昵称 */
  nickname?: string;

  /** 头像URL */
  avatar?: string;

  /** 角色 */
  roles: string[];

  /** 权限 */
  perms: string[];
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
