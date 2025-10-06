// Generic response with wrapper
export interface ApiResponse<T> {
  data: T;
}

// Error response
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// Pagination response
export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginationMetaLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationMetaLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  links?: PaginationLinks;
  meta: PaginationMeta;
}
