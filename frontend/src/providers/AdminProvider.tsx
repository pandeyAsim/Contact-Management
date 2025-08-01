"use client";
import React, { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface AdminProviderProps {
  children: ReactNode;
  allowedRoles?: string[]; // Optional, defaults to ["admin"]
  redirectTo?: string; // Optional, defaults to "/unauthorized"
}

export default function AdminProvider({
  children,
  allowedRoles = ["admin"],
  redirectTo = "/unauthorized",
}: AdminProviderProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (
        !isAuthenticated ||
        !user ||
        !allowedRoles.includes(user.role.title)
      ) {
        router.replace(redirectTo);
      }
    }
  }, [loading, isAuthenticated, user, router, allowedRoles, redirectTo]);

  if (loading || !user || !allowedRoles.includes(user.role.title)) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        Checking admin permissions...
      </div>
    );
  }

  return <>{children}</>;
}
