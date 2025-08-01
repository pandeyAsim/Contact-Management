"use client";

import { useState, useEffect } from "react";
import { ContactFilters, Category } from "@/types";
import { FiUsers, FiStar, FiClock, FiPlus, FiTag } from "react-icons/fi";

interface ContactSidebarProps {
  categories: Category[];
  filters: ContactFilters;
  onFiltersChange: (filters: ContactFilters) => void;
  onAddContact: () => void;
}

export default function ContactSidebar({
  categories,
  filters,
  onFiltersChange,
  onAddContact,
}: ContactSidebarProps) {
  // Determine active filter based on current filters
  const getActiveFilter = () => {
    if (filters.isStarred) return "starred";
    if (filters.isFrequent) return "frequent";
    if (filters.categoryId) return filters.categoryId.toString();
    return "all";
  };

  const [activeFilter, setActiveFilter] = useState(getActiveFilter());

  // Update active filter when filters prop changes
  useEffect(() => {
    setActiveFilter(getActiveFilter());
  }, [filters]);

  const handleFilterChange = (newFilter: string) => {
    setActiveFilter(newFilter);
    
    switch (newFilter) {
      case "all":
        onFiltersChange({});
        break;
      case "frequent":
        onFiltersChange({ isFrequent: true });
        break;
      case "starred":
        onFiltersChange({ isStarred: true });
        break;
      default:
        // Category filter
        const categoryId = parseInt(newFilter);
        onFiltersChange({ categoryId });
        break;
    }
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-sm">CM</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Contacts
          </h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your contacts
        </p>
      </div>

      {/* Add New Contact Button */}
      <div className="p-4">
        <button
          onClick={onAddContact}
          data-add-contact
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Add New Contact
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {/* All Contacts */}
          <button
            onClick={() => handleFilterChange("all")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeFilter === "all"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <FiUsers className="w-4 h-4" />
            <span>All Contacts</span>
          </button>

          {/* Frequent */}
          <button
            onClick={() => handleFilterChange("frequent")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeFilter === "frequent"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <FiClock className="w-4 h-4" />
            <span>Frequent</span>
          </button>

          {/* Starred */}
          <button
            onClick={() => handleFilterChange("starred")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeFilter === "starred"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <FiStar className="w-4 h-4" />
            <span>Starred</span>
          </button>
        </nav>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              Categories
            </h3>
            <nav className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleFilterChange(category.id.toString())}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeFilter === category.id.toString()
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <FiTag className="w-4 h-4" />
                  <span className="truncate">{category.name || category.title}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
