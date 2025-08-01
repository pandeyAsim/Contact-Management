"use client";

import { FiMail, FiShield, FiUser, FiCalendar, FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { UserManagement } from "@/types/userManagement.type";

interface UserDetailsProps {
  user: UserManagement;
  onEditUser: (user: UserManagement) => void;
  onDeleteUser: (userId: number) => void;
}

export default function UserDetails({ user, onEditUser, onDeleteUser }: UserDetailsProps) {
  const getRoleIcon = (roleTitle: string) => {
    switch (roleTitle?.toLowerCase()) {
      case 'admin':
        return <FiShield className="w-5 h-5" />;
      default:
        return <FiUser className="w-5 h-5" />;
    }
  };

  const getRoleColor = (roleTitle: string) => {
    switch (roleTitle?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            User Details
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => onEditUser(user)}
              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Edit User"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteUser(user.id)}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Delete User"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* User Avatar and Basic Info */}
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-medium mx-auto mb-4">
            {user.fullName?.charAt(0) || 'U'}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {user.fullName}
          </h3>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role?.title)}`}>
              {getRoleIcon(user.role?.title)}
              {user.role?.title}
            </span>
          </div>
        </div>
      </div>

      {/* User Information */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Contact Information
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <FiMail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Email Address
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Account Status
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Email Verified
                </span>
                <div className="flex items-center gap-2">
                  {user.isEmailVerified ? (
                    <>
                      <FiCheck className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">
                        Verified
                      </span>
                    </>
                  ) : (
                    <>
                      <FiX className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-600">
                        Unverified
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          {user.contactsCount !== undefined && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Statistics
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Total Contacts
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.contactsCount}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Account Dates */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Account Information
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiCalendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Member Since
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiCalendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Last Updated
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(user.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* User ID */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              System Information
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  User ID
                </span>
                <span className="text-sm font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  #{user.id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Role ID
                </span>
                <span className="text-sm font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  #{user.role?.id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
        <button
          onClick={() => onEditUser(user)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiEdit2 className="w-4 h-4" />
          Edit User
        </button>
        <button
          onClick={() => onDeleteUser(user.id)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <FiTrash2 className="w-4 h-4" />
          Delete User
        </button>
      </div>
    </div>
  );
}
