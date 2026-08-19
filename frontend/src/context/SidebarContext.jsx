import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isExpanded, setExpanded] = useState(true);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleSidebar = () => {
    setExpanded(prev => !prev);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(prev => !prev);
  };

  const value = {
    isExpanded,
    isMobileOpen,
    isHovered,
    toggleSidebar,
    toggleMobileSidebar,
    setIsHovered,
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
