import { PaginationParameters } from "@/interfaces/request";

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface RoleFilters extends PaginationParameters {
  id?: string;
  name?: string;
  guard_name?: string;
}
