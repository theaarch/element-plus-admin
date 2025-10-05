// Role object
export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    model_type: string;
    model_id: number;
    role_id: number;
  };
}

// Permission object
export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

// User object
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  email_verified_at: string | null;
  two_factor_secret: string | null;
  two_factor_recovery_codes: string | null;
  two_factor_confirmed_at: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  roles: Role[];
  permissions: Permission[];
  profile_photo_url: string;
  role_names: string[];
  permission_names: string[];
}

// Filters
export interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
}
