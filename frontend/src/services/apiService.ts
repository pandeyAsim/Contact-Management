import axios, { AxiosError, AxiosInstance } from "axios";
import {
  logout,
  getAccessToken,
  saveAccessToken,
  getRefreshToken,
} from "@/utils/storageHelper";

declare module "axios" {
  interface AxiosRequestConfig {
    isAuthRoute?: boolean;
  }
}

console.log(
  "Axios instance created with base URL:",
  process.env.NEXT_PUBLIC_API_URL
);

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // cookies
  timeout: 10000, // 10 seconds
  isAuthRoute: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * @description Axios interceptor to add content type to the request
 * @param {AxiosRequestConfig} config
 * @returns {AxiosRequestConfig}
 */
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = getAccessToken();

    if (config.isAuthRoute && accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * @description Axios interceptor to refresh auth token
 * @param {AxiosError} error
 * @returns {Promise<AxiosError>}
 */
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    try {
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry &&
        originalRequest.isAuthRoute
      ) {
        originalRequest._retry = true;

        // refresh token
        const token = await refreshAuthToken();

        originalRequest.headers["Authorization"] = `Bearer ${token}`;

        return axiosInstance(originalRequest);
      }

      throw error;
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.status === 401 &&
        originalRequest.isAuthRoute
      ) {
        await logout();
        window.location.href = `/login`;
      }

      return Promise.reject(error);
    }
  }
);

/**
 * @description Refresh auth token
 * @returns {Promise<string>}
 * @example
 * const token = await refreshAuthToken();
 * console.log(token);
 * @throws {Error}
 * @throws {AxiosError}
 */
const refreshAuthToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();
  const response = await axiosInstance.post(
    "/auth/refresh",
    {},
    {
      isAuthRoute: false,
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );

  const token = response.data.data.accessToken;

  saveAccessToken(token);

  return token;
};

export default axiosInstance;
