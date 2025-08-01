"use client";

import { useState } from "react";
import { Contact, ContactFilters } from "@/types";
import { FiSearch, FiStar, FiMoreHorizontal, FiEdit, FiTrash2, FiUsers, FiX } from "react-icons/fi";

interface ContactListProps {
  contacts: Contact[];
  loading: boolean;
  selectedContact: Contact | null;
  onContactSelect: (contact: Contact) => void;
  onContactEdit: (contact: Contact) => void;
  onContactDelete: (contactId: number) => void;
  onStarToggle: (contactId: number) => void;
  filters: ContactFilters;
  onFiltersChange: (filters: ContactFilters) => void;
}

export default function ContactList({
  contacts,
  loading,
  selectedContact,
  onContactSelect,
  onContactEdit,
  onContactDelete,
  onStarToggle,
  filters,
  onFiltersChange,
}: ContactListProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [showDropdown, setShowDropdown] = useState<number | null>(null);

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search: searchTerm || undefined });
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    onFiltersChange({ ...filters, search: undefined });
  };

  // ...existing code...

  const handleDropdownToggle = (contactId: number) => {
    setShowDropdown(showDropdown === contactId ? null : contactId);
  };

  const getInitials = (fullName: string) => {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Search Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <form
          className="relative"
          onSubmit={handleSearchSubmit}
          autoComplete="off"
        >
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={e => handleInputChange(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </form>
        {searchTerm && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Searching for "{searchTerm}"
          </p>
        )}
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-8">
            <FiUsers className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              No contacts found
            </h3>
            <p className="text-sm text-center max-w-xs">
              {filters.search 
                ? `No contacts match "${filters.search}"`
                : filters.categoryId 
                ? "No contacts in this category"
                : "You haven't added any contacts yet"
              }
            </p>
            {!filters.search && !filters.categoryId && (
              <button
                onClick={() => {
                  // This will be passed from parent component
                  const addButton = document.querySelector('[data-add-contact]') as HTMLButtonElement;
                  if (addButton) addButton.click();
                }}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
              >
                Add your first contact
              </button>
            )}
          </div>
        ) : (
          <div className="p-2">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => onContactSelect(contact)}
                className={`relative p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                  selectedContact?.id === contact.id
                    ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    {contact.avatar ? (
                      <img
                        src={contact.avatar}
                        alt={contact.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                        {getInitials(contact.fullName)}
                      </div>
                    )}
                    {contact.isFrequent && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {contact.fullName}
                      </h3>
                      {contact.isStared && (
                        <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {contact.email}
                    </p>
                    {contact.company && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                        {contact.company}
                      </p>
                    )}
                  </div>

                  {/* Action Menu */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDropdownToggle(contact.id);
                      }}
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <FiMoreHorizontal className="w-4 h-4 text-gray-500" />
                    </button>

                    {showDropdown === contact.id && (
                      <div className="absolute right-0 top-8 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStarToggle(contact.id);
                            setShowDropdown(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2"
                        >
                          <FiStar className="w-4 h-4" />
                          {contact.isStarred ? "Remove Star" : "Add Star"}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onContactEdit(contact);
                            setShowDropdown(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2"
                        >
                          <FiEdit className="w-4 h-4" />
                          Edit Contact
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onContactDelete(contact.id);
                            setShowDropdown(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          Delete Contact
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
