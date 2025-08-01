"use client";

import { useState, useEffect } from "react";
import { Contact, ContactFilters, User } from "@/types";
import { contactService, categoryService } from "@/services/contactService";
import ContactSidebar from "@/components/dashboard/ContactSidebar";
import ContactList from "@/components/dashboard/ContactList";
import ContactDetails from "@/components/dashboard/ContactDetails";
import ContactModal from "@/components/dashboard/ContactModal";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "react-hot-toast";
import { getLoggedInUser } from "@/utils/storageHelper";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [categories, setCategories] = useState([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [filters, setFilters] = useState<ContactFilters>({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();

  // Check user role and redirect if admin
  useEffect(() => {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
      router.replace("/login");
      return;
    }
    
    setUser(loggedInUser);
    
    // Redirect admin users to admin dashboard
    if (loggedInUser.role.title === "admin") {
      router.replace("/admin/dashboard");
      return;
    }
  }, [router]);

  // Load contacts
  const loadContacts = async () => {
    try {
      setLoading(true);
      const response = await contactService.getContacts(filters);
      // Backend returns contacts in data.data structure
      setContacts(response.data.data || []);
    } catch (error) {
      toast.error("Failed to load contacts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      // Backend returns categories in data.data structure
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  useEffect(() => {
    if (user && user.role.title !== "admin") {
      loadContacts();
    }
  }, [filters, user]);

  useEffect(() => {
    if (user && user.role.title !== "admin") {
      loadCategories();
    }
  }, [user]);

  // Don't render anything for admin users (they'll be redirected)
  if (!user || user.role.title === "admin") {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-lg">Loading...</div>
    </div>;
  }

  const handleContactSelect = async (contact: Contact) => {
    try {
      setLoading(true);
      // Fetch full contact details from backend
      const response = await contactService.getContact(contact.id);
      setSelectedContact(response.data || contact);
    } catch (error) {
      console.error("Failed to load contact details:", error);
      // Fallback to basic contact info from list
      setSelectedContact(contact);
      toast.error("Failed to load contact details");
    } finally {
      setLoading(false);
    }
  };

  const handleContactEdit = (contact: Contact) => {
    setEditingContact(contact);
    setShowModal(true);
  };

  const handleContactDelete = async (contactId: number) => {
    try {
      await contactService.deleteContact(contactId);
      setContacts(contacts.filter(c => c.id !== contactId));
      if (selectedContact?.id === contactId) {
        setSelectedContact(null);
      }
      toast.success("Contact deleted successfully");
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact");
    }
  };

  const handleContactSave = async () => {
    await loadContacts();
    setShowModal(false);
    setEditingContact(null);
    toast.success(editingContact ? "Contact updated" : "Contact created");
  };

  const handleStarToggle = async (contactId: number) => {
    try {
      await contactService.toggleStar(contactId);
      await loadContacts();
      
      // Update selected contact if it's the one being starred
      if (selectedContact && selectedContact.id === contactId) {
        const response = await contactService.getContact(contactId);
        setSelectedContact(response.data);
      }
    } catch (error) {
      console.error("Error toggling star:", error);
      toast.error("Failed to update contact");
    }
  };

  return (
    <DashboardLayout 
      showSidebarToggle={true}
      onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
    >
      <div className="flex flex-1 h-full">
        {/* Sidebar */}
        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-64'}`}>
          <ContactSidebar
            categories={categories}
            filters={filters}
            onFiltersChange={setFilters}
            onAddContact={() => {
              setEditingContact(null);
              setShowModal(true);
            }}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex min-w-0">
          {/* Contact List */}
          <ContactList
            contacts={contacts}
            loading={loading}
            selectedContact={selectedContact}
            onContactSelect={handleContactSelect}
            onContactEdit={handleContactEdit}
            onContactDelete={handleContactDelete}
            onStarToggle={handleStarToggle}
            filters={filters}
            onFiltersChange={setFilters}
          />

          {/* Contact Details */}
          <ContactDetails
            contact={selectedContact}
            onEdit={handleContactEdit}
            onDelete={handleContactDelete}
            onStarToggle={handleStarToggle}
          />
        </div>

        {/* Contact Modal */}
        {showModal && (
          <ContactModal
            contact={editingContact}
            categories={categories}
            onSave={handleContactSave}
            onClose={() => {
              setShowModal(false);
              setEditingContact(null);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
