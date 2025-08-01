import { PaginatedGetRequest } from "@/types";
import axiosInstance from "./apiService";

export const getcategoriesByAdmin = async (params: PaginatedGetRequest) => {
  const response = await axiosInstance.get(`/categories/by-admin`, {
    params,
  });
  return response.data;
};

export const getcategories = async (params: PaginatedGetRequest) => {
  const response = await axiosInstance.get(`/categories`, {
    params,
  });
  return response.data;
};
