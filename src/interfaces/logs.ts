import { PaginationParameters } from "./request";

export interface Log {
  id?: number;
  user_id?: number;
  user?: Array<any>;
  created_at?: string;
  updated_at?: string;
}

export interface LogFilters extends PaginationParameters {
  created_at?: [string, string];
}
