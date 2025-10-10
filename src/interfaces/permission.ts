import { PaginationParameters } from "./request";

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface PermissionFilters extends PaginationParameters {
  id?: string;
  name?: string;
  guard_name?: string;
}
