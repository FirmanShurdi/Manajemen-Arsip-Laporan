import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';

export default function AppSidebar() {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const subMenuRefs = useRef({});

  const [openSubmenus, setOpenSubmenus] = useState([]);
  const [subMenuHeight, setSubMenuHeight] = useState({});

  const navItems = useMemo(() => [
    { 
      id: 'dash', 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
        </svg>
      ) 
    },
    { 
      id: 'dokumen', 
      name: 'Dokumen Arsip', 
      path: '/dokumen', 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ) 
    },
    {
      id: 'master',
      name: 'Data Master',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      ),
      subItems: [
        { name: 'Kategori Dokumen', path: '/master/kategori' },
        { name: 'Role & Hak Akses', path: '/master/role' },
      ],
    },
    { 
      id: 'mgmt', 
      name: 'Manajemen User', 
      path: '/manajemen-user', 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ) 
    },
    { 
      id: 'log', 
      name: 'Log Aktivitas', 
      path: '/log-aktivitas', 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
      ) 
    },
    { 
      id: 'kembali', 
      name: 'Kembali ke Beranda', 
      path: '/', 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      ) 
    },
  ], []);

  const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

  const isSubMenuActive = useCallback((subItems) => {
    return subItems && subItems.some(item => isActive(item.path));
  }, [isActive]);

  useEffect(() => {
    const activeSubmenus = [];
    navItems.forEach((item) => {
      if (isSubMenuActive(item.subItems)) {
        activeSubmenus.push(item.id);
      }
    });
    setOpenSubmenus(activeSubmenus);
  }, [location.pathname, isSubMenuActive, navItems]);

  useEffect(() => {
    openSubmenus.forEach(id => {
      if (subMenuRefs.current[id]) {
        setSubMenuHeight(prev => ({ ...prev, [id]: subMenuRefs.current[id].scrollHeight }));
      }
    });
  }, [openSubmenus]);

  const handleSubmenuToggle = (id) => {
    setOpenSubmenus(prevOpen =>
      prevOpen.includes(id)
        ? prevOpen.filter(item => item !== id)
        : [...prevOpen, id]
    );
  };

  const isSidebarWide = isExpanded || isHovered || isMobileOpen;

  return (
    <aside
      className={`fixed top-0 left-0 z-50 flex h-screen flex-col border-r border-gray-200 bg-white px-5 transition-all duration-300 ease-in-out
        ${isExpanded || isMobileOpen ? 'w-[290px]' : isHovered ? 'w-[290px]' : 'w-[90px]'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sidebar Header / Brand Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200">
        <Link to="/" className="flex items-center gap-3">
          <img 
            src="/kementrianperhubungan.png" 
            alt="Logo Kemenhub" 
            className="h-9 w-9 object-contain"
          />
          {isSidebarWide && (
            <span className="text-xl font-bold text-gray-800 tracking-tight">
              SI-CEKATAN
            </span>
          )}
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex flex-col flex-grow py-6 overflow-y-auto no-scrollbar">
        <nav className="flex-grow">
          <h2 className={`mb-4 flex text-xs font-semibold uppercase tracking-wider text-gray-400
            ${!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'}
          `}>
            {isSidebarWide ? 'Menu Utama' : '•••'}
          </h2>

          <ul className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isParentActive = isSubMenuActive(item.subItems);
              const isOpen = openSubmenus.includes(item.id);
              const itemIsActive = isActive(item.path);

              return (
                <li key={item.id}>
                  {item.subItems ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSubmenuToggle(item.id)}
                        className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                          ${isParentActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}
                          ${!isExpanded && !isHovered ? 'lg:justify-center' : ''}
                        `}
                      >
                        <span className={`shrink-0 ${isParentActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`}>
                          {item.icon}
                        </span>
                        {isSidebarWide && (
                          <>
                            <span className="flex-grow text-left">{item.name}</span>
                            <svg 
                              className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            >
                              <path d="m6 9 6 6 6-6"/>
                            </svg>
                          </>
                        )}
                      </button>

                      {isSidebarWide && (
                        <div
                          ref={el => (subMenuRefs.current[item.id] = el)}
                          className="overflow-hidden transition-all duration-300"
                          style={{ height: isOpen ? `${subMenuHeight[item.id] || 0}px` : '0px' }}
                        >
                          <ul className="mt-1 ml-9 space-y-1">
                            {item.subItems.map(subItem => (
                              <li key={subItem.name}>
                                <Link 
                                  to={subItem.path} 
                                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                    isActive(subItem.path)
                                      ? 'text-blue-600 font-semibold bg-blue-50/60'
                                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                  }`}
                                >
                                  {subItem.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                        ${itemIsActive ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}
                        ${!isExpanded && !isHovered ? 'lg:justify-center' : ''}
                      `}
                    >
                      <span className={`shrink-0 ${itemIsActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`}>
                        {item.icon}
                      </span>
                      {isSidebarWide && (
                        <span>{item.name}</span>
                      )}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
