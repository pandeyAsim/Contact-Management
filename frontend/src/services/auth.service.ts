import axiosInstance from "@/services/apiService";
import { LoginRequest } from "@/types";

export const authService = {
  // Login
  login: async (loginRequest: LoginRequest) => {
    const response = await axiosInstance.post("/auth/login", loginRequest, {
      isAuthRoute: false,
    });
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token: string, password: string) => {
    const response = await axiosInstance.post('/auth/reset-password', { token, password });
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await axiosInstance.post("/auth/refresh");
    return response.data;
  },

  // Get profile
  getProfile: async () => {
    const response = await axiosInstance.get("/auth/profile");
    return response.data;
  },

  // Verify email
  verifyEmail: async (token: string) => {
    const response = await axiosInstance.get(`/auth/verify/${token}`);
    return response.data;
  },
};

export default authService;
