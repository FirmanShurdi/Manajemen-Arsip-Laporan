import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, useSidebar } from '../../context/SidebarContext';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import Flash from '../flash/flash';
import { useFlash } from '../../hooks/useFlash';

const Backdrop = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();
  if (!isMobileOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden"
      onClick={toggleMobileSidebar}
    />
  );
};

const LayoutContent = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { toasts, removeToast } = useFlash();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col xl:flex-row">
      <Flash toasts={toasts} removeToast={removeToast} />
      
      {/* Sidebar & Backdrop */}
      <AppSidebar />
      <Backdrop />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]'
        } ${isMobileOpen ? 'ml-0' : ''}`}
      >
        <AppHeader />
        
        <main className="flex-1 pl-8 md:pl-12 lg:pl-16 pr-6 md:pr-8 py-6 md:py-8 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default function AppLayout() {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
}
