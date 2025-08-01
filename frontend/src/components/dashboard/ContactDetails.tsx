"use client";

import { Contact } from "@/types";
import { FiMail, FiPhone, FiMapPin, FiBriefcase, FiUser, FiEdit, FiTrash2, FiStar } from "react-icons/fi";

interface ContactDetailsProps {
  contact: Contact | null;
  onEdit: (contact: Contact) => void;
  onDelete: (contactId: number) => void;
  onStarToggle: (contactId: number) => void;
}

export default function ContactDetails({
  contact,
  onEdit,
  onDelete,
  onStarToggle,
}: ContactDetailsProps) {
  if (!contact) {
    return (
      <div className="flex-1 bg-white dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiUser className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Select a Contact
          </h3>
          <p className="text-base leading-relaxed">
            Choose a contact from the list to view their details, information, and manage their profile.
          </p>
        </div>
      </div>
    );
  }

  const getInitials = (fullName: string) => {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex-1 bg-white dark:bg-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Contact Details
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onStarToggle(contact.id)}
              className={`p-2 rounded-lg transition-colors ${
                contact.isStared
                  ? "text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                  : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <FiStar className={`w-5 h-5 ${contact.isStared ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={() => onEdit(contact)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FiEdit className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(contact.id)}
              className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors"
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Profile Section */}
        <div className="text-center mb-8">
          {contact.avatar ? (
            <img
              src={contact.avatar}
              alt={contact.fullName}
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-medium mx-auto mb-4">
              {getInitials(contact.fullName)}
            </div>
          )}
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {contact.fullName}
          </h1>
          
          {contact.company && (
            <p className="text-gray-600 dark:text-gray-400 mb-1">
              {contact.department ? `${contact.department}, ` : ""}{contact.company}
            </p>
          )}
          
          <div className="flex items-center justify-center gap-4 mt-4">
            {contact.isStared && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 text-xs font-medium rounded-full">
                <FiStar className="w-3 h-3 fill-current" />
                Starred
              </span>
            )}
            {contact.isFrequent && (
              <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                Frequent
              </span>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone Number */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FiPhone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Phone Number
                </h3>
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white ml-11">
                {contact.phoneNumber}
              </p>
            </div>

            {/* Email Address */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FiMail className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Email Address
                </h3>
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white ml-11 break-words">
                {contact.email}
              </p>
            </div>
          </div>

          {/* Address - Full Width */}
          {contact.address && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FiMapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Address
                </h3>
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white ml-11">
                {contact.address}
              </p>
            </div>
          )}

          {/* Company & Department - Grid */}
          {contact.company && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <FiBriefcase className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Work Information
                </h3>
              </div>
              <div className="ml-11 space-y-2">
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {contact.company}
                </p>
                {contact.department && (
                  <p className="text-base text-gray-600 dark:text-gray-400">
                    Department: {contact.department}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Category */}
          {contact.category && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <FiUser className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Category
                </h3>
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white ml-11">
                {contact.category.name || contact.category.title}
              </p>
            </div>
          )}

          {/* Notes - Full Width with Better Typography */}
          {contact.notes && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-200 dark:bg-gray-600 rounded-lg">
                  <FiUser className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Notes
                </h3>
              </div>
              <div className="ml-11">
                <p className="text-base leading-relaxed text-gray-900 dark:text-white whitespace-pre-wrap">
                  {contact.notes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
