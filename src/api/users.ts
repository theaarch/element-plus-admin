import http from "@/utils/http";
import type { PaginatedResponse } from "@/interfaces/response";
import type { User, UserFilters } from "@/interfaces/user";

export const fetchUsers = async (filters: UserFilters = {}): Promise<PaginatedResponse<User>> => {
  const response = await http.get<PaginatedResponse<User>>("/users", {
    params: filters,
  });
  return response.data;
};

export const getUser = async (id: number): Promise<User> => {
  const response = await http.get<User>(`/users/${id}`);
  return response.data;
};

export const createUser = async (payload: Partial<User>): Promise<User> => {
  const response = await http.post<User>("/users", payload);
  return response.data;
};

export const updateUser = async (id: number, payload: Partial<User>): Promise<User> => {
  const response = await http.put<User>(`/users/${id}`, payload);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await http.delete(`/users/${id}`);
};

export const bulkDeleteUsers = async (ids: number[]): Promise<void> => {
  await http.delete("/users", { data: { ids } });
};
