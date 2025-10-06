import http from '@/utils/http'

const AuthAPI = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await http.post<LoginResponse>(`/api/auth/token`, data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await http.delete(`/api/auth/token`);
  },
};

export default AuthAPI;

export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface LoginResponse {
  token: string;
  token_type: string;
}
