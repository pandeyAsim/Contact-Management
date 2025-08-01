import { ContactFilters, ContactFormData } from "@/types";
import axiosInstance from "./apiService";

export const contactService = {
  // Get all contacts with filters
  getContacts: async (filters: ContactFilters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.categoryId) params.append('categoryId', filters.categoryId.toString());
    if (filters.isStarred !== undefined) params.append('isStared', filters.isStarred.toString()); // Backend expects isStared
    if (filters.isFrequent !== undefined) params.append('isFrequent', filters.isFrequent.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await axiosInstance.get(`/contacts?${params.toString()}`);
    return response.data;
  },

  // Get single contact
  getContact: async (id: number) => {
    const response = await axiosInstance.get(`/contacts/${id}`);
    return response.data;
  },

  // Create new contact
  createContact: async (data: ContactFormData) => {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'image' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await axiosInstance.post('/contacts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update contact
  updateContact: async (id: number, data: Partial<ContactFormData>) => {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'image' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await axiosInstance.put(`/contacts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete contact
  deleteContact: async (id: number) => {
    const response = await axiosInstance.delete(`/contacts/${id}`);
    return response.data;
  },

  // Toggle star status
  toggleStar: async (id: number) => {
    const response = await axiosInstance.patch(`/contacts/${id}/star`);
    return response.data;
  },
};

export const categoryService = {
  // Get all categories
  getCategories: async () => {
    const response = await axiosInstance.get('/categories');
    return response.data;
  },

  // Create new category
  createCategory: async (data: { title: string; description?: string }) => {
    const response = await axiosInstance.post('/categories', data);
    return response.data;
  },
};
