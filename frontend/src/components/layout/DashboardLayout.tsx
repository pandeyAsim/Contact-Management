'use client';

import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface DashboardLayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  showSidebarToggle?: boolean;
  onSidebarToggle?: () => void;
}

export default function DashboardLayout({ 
  children, 
  showNavbar = true, 
  showFooter = true,
  showSidebarToggle = false,
  onSidebarToggle
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {showNavbar && (
        <Navbar 
          showSidebarToggle={showSidebarToggle}
          onSidebarToggle={onSidebarToggle}
        />
      )}
      
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
}
