import { useState, useEffect } from 'react';
import { User } from '@/types';
import { getLoggedInUser, logout as performLogout } from '@/utils/storageHelper';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = () => {
      try {
        const loggedInUser = getLoggedInUser();
        setUser(loggedInUser);
      } catch (error) {
        console.error('Error getting logged in user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const logout = async () => {
    try {
      await performLogout(); // This calls the full logout process including API call
      setUser(null);
      router.push('/login');
    } catch (error) {
      // Even if logout API fails, clean up local state
      console.error('Logout error:', error);
      setUser(null);
      router.push('/login');
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role?.title === 'admin';

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    logout,
  };
};
