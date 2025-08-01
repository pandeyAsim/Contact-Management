"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiUsers, FiLogOut, FiUser, FiSettings } from "react-icons/fi";
import { getLoggedInUser, logout } from "@/utils/storageHelper";
import Dropdown from "./Dropdown";
import Image from "next/image";
import ThemeToggler from "./ThemeToggler";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const router = useRouter();
  const user = getLoggedInUser();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
          <FiUsers className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-semibold text-gray-800 dark:text-white">
            Contact Manager
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <ThemeToggler />
          
          {user ? (
            // User is logged in - show user dropdown
            <Dropdown
              trigger={
                <div className="flex items-center space-x-2 hover:opacity-80 cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold uppercase relative overflow-hidden">
                    {user?.avatar ? (
                      <Image
                        src={user.avatar}
                        alt="User Avatar"
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm">
                        {user?.fullName ? user.fullName.charAt(0) : "U"}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    {user?.fullName}
                  </span>
                </div>
              }
            >
              <div className="py-2 text-sm text-gray-700 dark:text-gray-200 min-w-48">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  <p className="font-medium">{user?.fullName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {user?.role?.title}
                  </p>
                </div>
                
                <Link
                  href="/dashboard"
                  className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiUser className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                
                <Link
                  href="/profile"
                  className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiUser className="w-4 h-4 mr-2" />
                  My Profile
                </Link>
                
                {user?.role?.title === 'Admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiSettings className="w-4 h-4 mr-2" />
                    Admin Panel
                  </Link>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-red-600 dark:text-red-400"
                >
                  <FiLogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </Dropdown>
          ) : (
            // User is not logged in - show login/register buttons
            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
