import { User } from "@/types";
import secureLocalStorage from "react-secure-storage";
import authService from "@/services/auth.service";

export const setSecureItem = (key: string, value: any): void => {
  secureLocalStorage.setItem(key, value);
};

export const getSecureItem = (key: string): any => {
  return secureLocalStorage.getItem(key);
};

export const removeSecureItem = (key: string): void => {
  secureLocalStorage.removeItem(key);
};

export const getAccessToken = (): string | null => {
  return getSecureItem("accessToken");
};

export const saveAccessToken = (accessToken: string): void => {
  setSecureItem("accessToken", accessToken);
};

export const deleteAccessToken = (): void => {
  removeSecureItem("accessToken");
};

export const getRefreshToken = (): string | null => {
  return getSecureItem("refreshToken");
};

export const saveRefreshToken = (accessToken: string): void => {
  setSecureItem("refreshToken", accessToken);
};

export const deleteRefreshToken = (): void => {
  removeSecureItem("refreshToken");
};

export const getLoggedInUser = (): User | null => {
  const user = getSecureItem("user");

  if (user && typeof user === "object") {
    return user as User;
  }

  return null;
};

export const saveLoggedInUser = (user: User): void => {
  setSecureItem("user", user);
};

export const deleteLoggedInUser = (): void => {
  removeSecureItem("user");
};

export const logout = async (): Promise<void> => {
  try {
    // Call backend logout API to invalidate refresh token
    await authService.logout();
  } catch (error) {
    console.error('Error during logout:', error);
    // Continue with local cleanup even if API call fails
  } finally {
    // Clean up local storage regardless of API call result
    deleteAccessToken();
    deleteRefreshToken();
    deleteLoggedInUser();
  }
};
