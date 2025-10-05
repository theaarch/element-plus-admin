// User object
export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

// Filters
export interface RoleFilters {
  id?: string;
  name?: string;
  guard_name?: string;
}
