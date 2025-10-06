// Permission object
export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

// Permission filters
export interface PermissionFilters {
  id?: string;
  name?: string;
  guard_name?: string;
}
