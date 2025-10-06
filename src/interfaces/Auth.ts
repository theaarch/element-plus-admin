// Login request payload
export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

// Login response data
export interface LoginResponse {
  token: string;
  token_type: string;
}
