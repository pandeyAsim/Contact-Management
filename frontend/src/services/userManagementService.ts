import { CreateUserData, UpdateUserData, UserFilters } from "@/types";
import axiosInstance from "./apiService";

export const userManagementService = {
  // Get all users (admin only)
  getUsers: async (filters: UserFilters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.roleId) params.append('roleId', filters.roleId.toString());
    if (filters.isEmailVerified !== undefined) params.append('isEmailVerified', filters.isEmailVerified.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await axiosInstance.get(`/admin/users?${params.toString()}`);
    return response.data;
  },

  // Get single user (admin only)
  getUser: async (id: number) => {
    const response = await axiosInstance.get(`/admin/users/${id}`);
    return response.data;
  },

  // Create new user (admin only)
  createUser: async (data: CreateUserData) => {
    const response = await axiosInstance.post('/admin/users', data);
    return response.data;
  },

  // Update user (admin only)
  updateUser: async (id: number, data: UpdateUserData) => {
    const response = await axiosInstance.put(`/admin/users/${id}`, data);
    return response.data;
  },

  // Delete user (admin only)
  deleteUser: async (id: number) => {
    const response = await axiosInstance.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Get roles
  getRoles: async () => {
    const response = await axiosInstance.get('/admin/roles');
    return response.data;
  },

  // Get dashboard stats (admin only)
  getDashboardStats: async () => {
    const response = await axiosInstance.get('/admin/dashboard/stats');
    return response.data;
  },
};
