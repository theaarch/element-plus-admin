import http from "@/utils/http";
import type { ApiResponse } from "@/interfaces/response";
import type { LoginRequest, LoginResponse } from "@/interfaces/auth";

const AuthAPI = {
  login: async (payload: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return await http.post("/api/auth/token", payload);
  },

  logout: async (): Promise<void> => {
    await http.delete(`/api/auth/token`);
  },
};

export default AuthAPI;
