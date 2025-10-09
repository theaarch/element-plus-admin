import http from "@/utils/http";

const AUTH_BASE_URL = "/api/v1/auth";

const AuthAPI = {
  /** 登录接口 */
  login(data: LoginFormData): Promise<ApiResponse<LoginResult>> {
    const formData = new FormData();

    formData.append("username", data.username);
    formData.append("password", data.password);
    formData.append("captchaKey", data.captchaKey);
    formData.append("captchaCode", data.captchaCode);

    return http.post(`${AUTH_BASE_URL}/login`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /** 刷新 token 接口 */
  refreshToken(refreshToken: string): Promise<ApiResponse<LoginResult>> {
    return http.post(
      `${AUTH_BASE_URL}/refresh-token`,
      {},
      {
        params: { refreshToken },
        headers: {
          Authorization: "no-auth",
        },
      }
    );
  },

  /** 退出登录接口 */
  logout(): Promise<ApiResponse<void>> {
    return http.delete(`${AUTH_BASE_URL}/logout`);
  },

  /** 获取验证码接口 */
  getCaptcha(): Promise<ApiResponse<CaptchaInfo>> {
    return http.get(`${AUTH_BASE_URL}/captcha`);
  },
};

export default AuthAPI;

/** 登录表单数据 */
export interface LoginFormData {
  // 用户名
  username: string;
  // 密码
  password: string;
  // 验证码缓存key
  captchaKey: string;
  // 验证码
  captchaCode: string;
  // 记住我
  rememberMe: boolean;
}

/** 登录响应 */
export interface LoginResult {
  // 访问令牌
  accessToken: string;
  // 刷新令牌
  refreshToken: string;
  // 令牌类型
  tokenType: string;
  // 过期时间(秒)
  expiresIn: number;
}

/** 验证码信息 */
export interface CaptchaInfo {
  // 验证码缓存key
  captchaKey: string;
  // 验证码图片Base64字符串
  captchaBase64: string;
}
