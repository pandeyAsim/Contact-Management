export interface Contact {
  id: number;
  fullName: string;
  firstName?: string; // For backward compatibility
  lastName?: string; // For backward compatibility
  email: string;
  phoneNumber: string;
  phone?: string; // For backward compatibility
  address?: string;
  company?: string;
  department?: string;
  notes?: string;
  avatar?: string;
  image?: string; // For backward compatibility
  isStared: boolean; // Backend uses isStared (note the typo)
  isStarred?: boolean; // For backward compatibility
  isFrequent?: boolean;
  viewsCount?: number;
  categoryId?: number;
  category?: Category;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string; // Backend uses name
  title?: string; // For backward compatibility
  slug: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFilters {
  search?: string;
  categoryId?: number;
  isStarred?: boolean;
  isFrequent?: boolean;
  page?: number;
  limit?: number;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  company?: string;
  department?: string;
  notes?: string;
  categoryId?: number;
  image?: File;
}
