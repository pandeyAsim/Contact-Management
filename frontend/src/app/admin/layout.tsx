"use client";
import AdminFooter from "@/components/admin/AdminFooter";
import AdminNavBar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminProvider from "@/providers/AdminProvider";
import AuthProvider from "@/providers/AuthProvider";
import { useState } from "react";

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <AuthProvider>
      <AdminProvider allowedRoles={["admin"]}>
        <div className="flex min-h-screen relative max-h-screen overflow-y-hidden">
          <div className="flex-1 flex flex-col overflow-auto">
            <AdminNavBar onToggle={toggleSidebar} />
            <main className="flex-1">{children}</main>
            <AdminFooter />
          </div>
        </div>
      </AdminProvider>
    </AuthProvider>
  );
};

export default AdminLayout;
