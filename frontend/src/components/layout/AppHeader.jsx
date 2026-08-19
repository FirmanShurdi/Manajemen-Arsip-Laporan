import React from 'react';
import { Link } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import UserDropdown from './UserDropdown';

export default function AppHeader() {
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center border-b border-gray-200 bg-white px-4 md:px-6 lg:px-8">
      <div className="flex w-full items-center justify-between">
        {/* Tombol Toggle diletakkan di paling kiri dekat dengan pembatas sidebar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 hover:text-slate-900 focus:outline-none transition-colors"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>

          <Link to="/" className="lg:hidden flex items-center gap-2 ml-2">
            <span className="text-lg font-bold text-gray-800">KSOP-K</span>
          </Link>
        </div>

        {/* Profil User Dropdown di kanan */}
        <div className="flex items-center gap-3">
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
