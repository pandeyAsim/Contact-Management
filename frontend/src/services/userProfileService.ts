import axiosInstance from "./apiService";

export interface UserProfileData {
  id: number;
  email: string;
  fullName: string;
  avatar?: string;
  isEmailVerified: boolean;
  role: {
    id: number;
    title: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  fullName?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export const userProfileService = {
  // Get current user profile
  getProfile: async () => {
    const response = await axiosInstance.get('/auth/profile');
    return response.data;
  },

  // Update profile image
  updateProfileImage: async (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axiosInstance.put('/users/me', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update profile data (this would need a backend endpoint)
  updateProfile: async (data: UpdateProfileData) => {
    const response = await axiosInstance.put('/users/profile', data);
    return response.data;
  },
};

export default userProfileService;
