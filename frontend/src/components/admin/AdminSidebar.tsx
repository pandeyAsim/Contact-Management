"use client";

import { useState } from "react";
import {
  FiUsers,
  FiMail,
  FiTag,
  FiSettings,
  FiBarChart,
  FiGrid,
  FiPlus,
  FiChevronRight,
  FiChevronDown,
  FiShield,
} from "react-icons/fi";

interface AdminSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  categories?: any[];
  selectedCategory?: string | number | null;
  onCategorySelect?: (category: string | number | null) => void;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export default function AdminSidebar({
  isOpen = true,
  onToggle,
  categories = [],
  selectedCategory,
  onCategorySelect,
  activeSection = "overview",
  onSectionChange,
}: AdminSidebarProps) {
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: FiBarChart,
      description: "Dashboard stats and analytics",
    },
    {
      id: "users",
      label: "User Management",
      icon: FiUsers,
      description: "Manage system users and roles",
    },
    {
      id: "contacts",
      label: "Contact Management",
      icon: FiMail,
      description: "View and manage all contacts",
    },
    {
      id: "categories",
      label: "Categories",
      icon: FiTag,
      description: "Manage contact categories",
    },
  ];

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen overflow-y-auto">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <FiGrid className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Admin Panel
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              System Management
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange?.(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === item.id
                  ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <div className="flex-1">
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {item.description}
                </div>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Categories Section */}
      {(activeSection === "contacts" || activeSection === "overview") && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <button
            onClick={() => setCategoriesExpanded(!categoriesExpanded)}
            className="w-full flex items-center justify-between p-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <FiTag className="h-4 w-4" />
              <span>Filter by Category</span>
            </div>
            {categoriesExpanded ? (
              <FiChevronDown className="h-4 w-4" />
            ) : (
              <FiChevronRight className="h-4 w-4" />
            )}
          </button>

          {categoriesExpanded && (
            <div className="mt-2 space-y-1">
              <button
                onClick={() => onCategorySelect?.("")}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedCategory === ""
                    ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                All Categories
              </button>
              {categories.map((category: any) => (
                <button
                  key={category.id}
                  onClick={() => onCategorySelect?.(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedCategory === category.id
                      ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{category.name}</span>
                    <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                      {category.contactCount || 0}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Quick Stats
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Total Categories</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {categories.length}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Active Filters</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {selectedCategory ? 1 : 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
