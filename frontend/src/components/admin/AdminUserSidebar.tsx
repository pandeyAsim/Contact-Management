"use client";

import { FiUsers, FiBarChart, FiPlus, FiHome, FiLogOut } from "react-icons/fi";
import { getLoggedInUser, logout } from "@/utils/storageHelper";
import { useRouter } from "next/navigation";

interface AdminSidebarProps {
  currentView: 'dashboard' | 'users';
  onViewChange: (view: 'dashboard' | 'users') => void;
  onAddUser: () => void;
}

export default function AdminSidebar({
  currentView,
  onViewChange,
  onAddUser,
}: AdminSidebarProps) {
  const router = useRouter();
  const user = getLoggedInUser();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <FiBarChart className="w-5 h-5" />,
      active: currentView === 'dashboard',
    },
    {
      id: 'users',
      label: 'User Management',
      icon: <FiUsers className="w-5 h-5" />,
      active: currentView === 'users',
    },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Admin Panel
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user?.fullName}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as 'dashboard' | 'users')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                item.active
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Quick Actions */}
        {currentView === 'users' && (
          <div className="mt-8">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Quick Actions
            </h3>
            <button
              onClick={onAddUser}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              Add New User
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button
          onClick={() => router.push('/dashboard')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <FiHome className="w-5 h-5" />
          User Dashboard
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <FiLogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
