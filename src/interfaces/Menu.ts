// User object
export interface Menu {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

// Filters
export interface MenuFilters {
  id?: string;
  name?: string;
}
