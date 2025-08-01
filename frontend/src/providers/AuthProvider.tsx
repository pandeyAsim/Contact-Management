"use client";
import { User } from "@/types";
import {
  deleteLoggedInUser,
  getLoggedInUser,
  getAccessToken,
  getRefreshToken,
  deleteAccessToken,
  deleteRefreshToken,
} from "@/utils/storageHelper";
import { getUserAvatarUrl } from "@/utils/imageHelper";
import { useRouter, usePathname } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuthentication = () => {
      try {
        const accessToken = getAccessToken();
        const localUser = getLoggedInUser();
        console.log('[AuthProvider] accessToken:', accessToken);
        console.log('[AuthProvider] localUser:', localUser);

        if (accessToken && localUser) {
          const processedUser = {
            ...localUser,
            avatar: getUserAvatarUrl(localUser)
          };
          setUser(processedUser);

          // Only redirect to dashboard if on a public route
          const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
          const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
          if (isPublicRoute) {
            router.replace('/dashboard');
          }
        } else {
          setUser(null);
          // Only redirect to login if not on a public route
          const publicRoutes = [
            '/login', 
            '/register', 
            '/forgot-password', 
            '/reset-password',
            '/_next',
            '/favicon.ico',
            '/api',
            '/debug'
          ];
          const isPublicRoute = publicRoutes.some(route => 
            pathname === route || pathname.startsWith(route + '/')) || 
            pathname === '/' || 
            pathname.includes('_next') || 
            pathname.includes('.')
          if (!isPublicRoute) {
            router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
          }
        }
      } catch (error) {
        setUser(null);
        deleteLoggedInUser();
        deleteAccessToken();
        deleteRefreshToken();
        if (!pathname.startsWith('/login')) {
          router.replace('/login');
        }
      } finally {
        setLoading(false);
        setIsCheckingAuth(false);
      }
    };
    checkAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (loading || isCheckingAuth) {
    return (
      <div className="w-screen overflow-hidden flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
          <p className="text-sm text-gray-500 mt-2">Checking your session</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
