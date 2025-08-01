export interface UserManagement {
  id: number;
  fullName: string;
  email: string;
  avatar?: string;
  isEmailVerified: boolean;
  role: {
    id: number;
    title: string;
  };
  createdAt: string;
  updatedAt: string;
  contactsCount?: number;
}

export interface CreateUserData {
  fullName: string;
  email: string;
  password: string;
  roleId: number;
}

export interface UpdateUserData {
  fullName?: string;
  email?: string;
  roleId?: number;
  isEmailVerified?: boolean;
}

export interface UserFilters {
  search?: string;
  roleId?: number;
  isEmailVerified?: boolean;
  page?: number;
  limit?: number;
}
