"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import CategoryModal from "@/components/admin/CategoryModal";
import UserModal from "@/components/admin/UserModal";
import apiService from "@/services/apiService";
import {
  FiUsers,
  FiMail,
  FiBarChart,
  FiLoader,
  FiTag,
  FiCalendar,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";

interface User {
  id: number;
  fullName: string;
  email: string;
  isEmailVerified: boolean;
  role?: {
    id?: number;
    name: string;
    title?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface Contact {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  category?: {
    id: number;
    name: string;
  };
  user?: {
    fullName: string;
  };
}

interface Category {
  id: number;
  name: string;
  slug?: string;
  image?: string;
  user?: {
    fullName: string;
  };
}

interface Stats {
  totalUsers: number;
  totalContacts: number;
  totalCategories: number;
  recentContacts: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState<
    string | number | null
  >(null);
  const [categoryModal, setCategoryModal] = useState({
    isOpen: false,
    category: null as Category | null,
  });
  const [userModal, setUserModal] = useState({
    isOpen: false,
    user: null as User | null,
  });

  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalContacts: 0,
    totalCategories: 0,
    recentContacts: 0,
  });

  useEffect(() => {
    console.log("Current user:", user);
    console.log("User role:", user?.role);

    if (!user || user.role.title !== "admin") {
      console.log("User is not admin, redirecting...");
      router.push("/login");
      return;
    }

    console.log("User is admin, fetching dashboard data...");
    fetchDashboardData();
  }, [user, router]);

  // Filter contacts when category selection changes
  useEffect(() => {
    if (selectedCategory === null || selectedCategory === "") {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(
        (contact) => contact.category?.id === selectedCategory
      );
      setFilteredContacts(filtered);
    }
  }, [contacts, selectedCategory]);

  // Add contact counts to categories for sidebar
  const categoriesWithCounts = categories.map((category) => ({
    ...category,
    contactCount: contacts.filter((c) => c.category?.id === category.id).length,
  }));

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleCategorySelect = (categoryId: string | number | null) => {
    setSelectedCategory(categoryId === "" ? null : categoryId);
  };

  const handleOpenCategoryModal = (category: Category | null = null) => {
    setCategoryModal({ isOpen: true, category });
  };

  const handleCloseCategoryModal = () => {
    setCategoryModal({ isOpen: false, category: null });
  };

  const handleCategoryModalSuccess = () => {
    fetchDashboardData(); // Refresh data after category create/update
  };

  const handleOpenUserModal = (user: User | null = null) => {
    setUserModal({ isOpen: true, user });
  };

  const handleCloseUserModal = () => {
    setUserModal({ isOpen: false, user: null });
  };

  const handleUserModalSubmit = async (data: any) => {
    // Handle user role update
    if (userModal.user) {
      await handleUserRoleUpdate(
        userModal.user.id,
        data.roleId === 1 ? "admin" : "user"
      );
      setUserModal({ isOpen: false, user: null });
      fetchDashboardData(); // Refresh data after update
    }
  };

  const handleUserModalSuccess = () => {
    fetchDashboardData(); // Refresh data after user operations
  };

  const convertUserToUserManagement = (user: User | null): any => {
    if (!user) return null;

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      role: {
        id: user.role?.id || (user.role?.name === "Admin" ? 1 : 2),
        title: user.role?.title || user.role?.name || "User",
      },
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt || new Date().toISOString(),
    };
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log("Starting parallel fetch requests...");

      const [statsRes, usersRes, contactsRes, categoriesRes] =
        await Promise.all([
          apiService.get("/admin/dashboard/stats"),
          apiService.get("/admin/users"),
          apiService.get("/admin/contacts"),
          apiService.get("/categories"),
        ]);

      console.log("Response statuses:", {
        stats: statsRes.status,
        users: usersRes.status,
        contacts: contactsRes.status,
        categories: categoriesRes.status,
      });

      if (statsRes.status === 200 && statsRes.data) {
        console.log("Stats data received:", statsRes.data);
        setStats(statsRes.data.data || statsRes.data);
      }

      if (usersRes.status === 200 && usersRes.data) {
        console.log("Users data received:", usersRes.data);
        setUsers(
          Array.isArray(usersRes.data)
            ? usersRes.data
            : usersRes.data.data?.users || []
        );
      }

      if (contactsRes.status === 200 && contactsRes.data) {
        console.log("Contacts data received:", contactsRes.data);
        setContacts(
          Array.isArray(contactsRes.data)
            ? contactsRes.data
            : contactsRes.data.data?.contacts || []
        );
      }

      if (categoriesRes.status === 200 && categoriesRes.data) {
        console.log("Categories data received:", categoriesRes.data);
        // Handle the API response format: { status: 200, message: "...", data: { data: [...] } }
        const categoryList =
          categoriesRes.data.data?.data ||
          categoriesRes.data.data ||
          categoriesRes.data;
        setCategories(Array.isArray(categoryList) ? categoryList : []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      console.log("Loading finished");
    }
  };

  const handleUserRoleUpdate = async (userId: number, newRole: string) => {
    try {
      const response = await apiService.put(`/admin/users/${userId}/role`, {
        role: newRole,
      });

      if (response.status === 200) {
        setUsers(
          users.map((u) =>
            u.id === userId
              ? { ...u, role: { name: response.data.data.user.role.title } }
              : u
          )
        );
        alert("User role updated successfully");
      }
    } catch (error: any) {
      console.error("Error updating user role:", error);
      alert(error.response?.data?.message || "Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await apiService.delete(`/admin/users/${userId}`);

      if (response.status === 200) {
        setUsers(users.filter((u) => u.id !== userId));
        alert("User deleted successfully");
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handleDeleteContact = async (contactId: number) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      const response = await apiService.delete(`/admin/contacts/${contactId}`);

      if (response.status === 200) {
        setContacts(contacts.filter((c) => c.id !== contactId));
        setFilteredContacts(filteredContacts.filter((c) => c.id !== contactId));
        alert("Contact deleted successfully");
      }
    } catch (error: any) {
      console.error("Error deleting contact:", error);
      alert(error.response?.data?.message || "Failed to delete contact");
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await apiService.delete(`/categories/${categoryId}`);

      if (response.status === 200) {
        setCategories(categories.filter((c) => c.id !== categoryId));
        alert("Category deleted successfully");
        // Refresh data to get updated counts
        fetchDashboardData();
      }
    } catch (error: any) {
      console.error("Error deleting category:", error);
      alert(error.response?.data?.message || "Failed to delete category");
    }
  };

  if (!user || user.role.title !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FiLoader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0">
        <AdminSidebar
          categories={categoriesWithCounts}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Welcome Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {activeSection === "overview" && "Admin Dashboard"}
                  {activeSection === "users" && "User Management"}
                  {activeSection === "contacts" && "Contact Management"}
                  {activeSection === "categories" && "Category Management"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Welcome back, {user.fullName}.
                  {activeSection === "overview" &&
                    " Here's an overview of your system."}
                  {activeSection === "users" &&
                    " Manage user accounts and permissions."}
                  {activeSection === "contacts" &&
                    " View and manage all contacts."}
                  {activeSection === "categories" &&
                    " Organize contacts with categories."}
                </p>
              </div>
            </div>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <FiMail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total Contacts
                      </p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {loading ? (
                          <FiLoader className="animate-spin h-6 w-6 text-blue-600" />
                        ) : (
                          stats.totalContacts
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <FiUsers className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total Users
                      </p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {loading ? (
                          <FiLoader className="animate-spin h-6 w-6 text-green-600" />
                        ) : (
                          stats.totalUsers
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <FiTag className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Categories
                      </p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {loading ? (
                          <FiLoader className="animate-spin h-6 w-6 text-purple-600" />
                        ) : (
                          stats.totalCategories
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                      <FiCalendar className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Recent (7 days)
                      </p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {loading ? (
                          <FiLoader className="animate-spin h-6 w-6 text-yellow-600" />
                        ) : (
                          stats.recentContacts
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Users Section */}
          {(activeSection === "overview" || activeSection === "users") && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {activeSection === "users" ? "All Users" : "Recent Users"}
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {Array.isArray(users) &&
                      (activeSection === "users"
                        ? users
                        : users.slice(0, 5)
                      ).map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {user.fullName
                                      ? user.fullName.charAt(0).toUpperCase()
                                      : "U"}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {user.fullName || "Unknown User"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={user.role?.name || "user"}
                              onChange={(e) =>
                                handleUserRoleUpdate(user.id, e.target.value)
                              }
                              className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.isEmailVerified
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.isEmailVerified ? "Verified" : "Unverified"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    {(!Array.isArray(users) || users.length === 0) && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                        >
                          {loading ? "Loading users..." : "No users found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Contacts Section */}
          {(activeSection === "overview" || activeSection === "contacts") && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {activeSection === "contacts"
                      ? selectedCategory
                        ? `Contacts in Selected Category (${filteredContacts.length})`
                        : `All Contacts (${contacts.length})`
                      : "Recent Contacts"}
                  </h2>
                  {selectedCategory && (
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Owner
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {(() => {
                      const contactsToShow =
                        activeSection === "contacts"
                          ? selectedCategory
                            ? filteredContacts
                            : contacts
                          : contacts.slice(0, 5);

                      return (
                        Array.isArray(contactsToShow) &&
                        contactsToShow.map((contact) => (
                          <tr key={contact.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {contact.fullName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {contact.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {contact.category?.name || "Uncategorized"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {contact.user?.fullName || "Unknown"}
                            </td>
                          </tr>
                        ))
                      );
                    })()}
                    {(() => {
                      const contactsToShow =
                        activeSection === "contacts"
                          ? selectedCategory
                            ? filteredContacts
                            : contacts
                          : contacts.slice(0, 5);

                      return (
                        (!Array.isArray(contactsToShow) ||
                          contactsToShow.length === 0) && (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                            >
                              {loading
                                ? "Loading contacts..."
                                : selectedCategory
                                ? "No contacts found in this category"
                                : "No contacts found"}
                            </td>
                          </tr>
                        )
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Categories Management */}
          {(activeSection === "overview" || activeSection === "categories") && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {activeSection === "categories"
                      ? "All Categories"
                      : "Categories Management"}
                  </h2>
                  <button
                    onClick={() => handleOpenCategoryModal()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition-colors"
                  >
                    Add Category
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Slug
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Contacts Count
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {Array.isArray(categories) &&
                      categories.map((category) => (
                        <tr key={category.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {category.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {category.slug || "No slug"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {Array.isArray(contacts)
                              ? contacts.filter(
                                  (c) => c.category?.id === category.id
                                ).length
                              : 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() =>
                                  handleOpenCategoryModal(category)
                                }
                                className="inline-flex items-center px-2 py-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                              >
                                <FiEdit className="h-4 w-4 mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteCategory(category.id)
                                }
                                className="inline-flex items-center px-2 py-1 text-red-600 hover:text-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                              >
                                <FiTrash2 className="h-4 w-4 mr-1" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {(!Array.isArray(categories) ||
                      categories.length === 0) && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                        >
                          {loading
                            ? "Loading categories..."
                            : "No categories found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={categoryModal.isOpen}
        onClose={handleCloseCategoryModal}
        onSuccess={handleCategoryModalSuccess}
        category={categoryModal.category}
      />

      {/* User Modal */}
      <UserModal
        isOpen={userModal.isOpen}
        onClose={handleCloseUserModal}
        onSubmit={handleUserModalSubmit}
        user={convertUserToUserManagement(userModal.user)}
      />
    </div>
  );
}
