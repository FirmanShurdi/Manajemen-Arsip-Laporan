import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  let user = null;
  try {
    const stored = localStorage.getItem('user');
    if (stored) user = JSON.parse(stored);
  } catch (_) {}

  const displayName = user?.nama_lengkap || user?.username || 'Pengguna';
  const displayRole = user?.jabatan || user?.role || 'Staff';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.setItem('_flash', JSON.stringify({ type: 'info', message: 'Anda telah keluar dari sistem.' }));
    navigate('/login');
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button 
        type="button"
        onClick={() => setIsOpen(prev => !prev)} 
        className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-800 shadow-sm hover:bg-gray-50 transition-colors"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-bold text-white text-sm">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="hidden text-left sm:block">
          <span className="block text-sm font-semibold leading-tight text-gray-800">
            {displayName.split(' ')[0]}
          </span>
          <span className="block text-xs text-gray-500 capitalize">{displayRole}</span>
        </div>
        <svg 
          className={`h-4 w-4 stroke-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 w-64 origin-top-right rounded-2xl border border-gray-200 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-100">
          <div className="border-b border-gray-100 p-4">
            <p className="font-semibold text-gray-800 text-sm">{displayName}</p>
            <p className="mt-0.5 text-xs text-gray-500">{user?.username ? `@${user.username}` : (user?.email || 'User')}</p>
            <span className="mt-2 inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600 capitalize">
              {displayRole}
            </span>
          </div>

          <ul className="p-2 text-sm text-gray-700">
            <li>
              <Link 
                to="/profile" 
                onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition-colors hover:bg-gray-100"
              >
                <svg className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                Profil Saya
              </Link>
            </li>
            <li>
              <Link 
                to="/settings" 
                onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition-colors hover:bg-gray-100"
              >
                <svg className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                Pengaturan
              </Link>
            </li>
          </ul>

          <div className="border-t border-gray-100 p-2">
            <button 
              type="button"
              onClick={handleLogout} 
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Keluar (Sign Out)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
