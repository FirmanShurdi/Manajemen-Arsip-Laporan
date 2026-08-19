import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [headerClass, setHeaderClass] = useState('');
  const [activeLink, setActiveLink] = useState('Beranda');
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      try {
        const stored = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (stored && token) {
          setUser(JSON.parse(stored));
        } else {
          setUser(null);
        }
      } catch (_) {
        setUser(null);
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('.hero');
      const kategoriSection = document.getElementById('kategori') || document.getElementById('arsip');
      const scrollY = window.scrollY;

      if (heroSection) {
        const heroBottom = heroSection.offsetHeight - 90;
        if (scrollY <= 10) {
          setHeaderClass('');
        } else if (scrollY > 10 && scrollY < heroBottom) {
          setHeaderClass('scrolled-blue');
        } else {
          setHeaderClass('scrolled-grey');
        }
      }

      if (kategoriSection) {
        if (scrollY >= kategoriSection.offsetTop - 150) {
          setActiveLink('Arsip');
        } else {
          setActiveLink('Beranda');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.setItem('_flash', JSON.stringify({ type: 'info', message: 'Anda telah keluar dari sistem.' }));
    setUser(null);
    setDropdownOpen(false);
    navigate('/login');
  };

  const roleId = Number(user?.id_role || 3);
  const tipeRole = user?.tipe_role || user?.role?.tipe_role || ([1, 2].includes(roleId) ? 'admin' : 'pegawai');
  const isStaffOrAdmin = tipeRole === 'admin';

  return (
    <header className={headerClass}>
      <Link to="/" className="logo-area">
        <img src="/kementrianperhubungan.png" alt="Logo Kemenhub" className="logo-img" />
        <div className="logo-text">
          <div className="logo-title">KSOP-K</div>
          <div className="logo-subtitle">
            SISTEM CLEARANCE KAPAL TRADISIONAL<br />
            <b>
              <font size="1">KEMENTERIAN PERHUBUNGAN</font>
            </b>
          </div>
        </div>
      </Link>

      <nav className="nav-pill">
        <Link to="/" className={`nav-link ${activeLink === 'Beranda' ? 'active' : ''}`}>Beranda</Link>
        <a href="#kategori" className={`nav-link ${activeLink === 'Arsip' ? 'active' : ''}`}>Arsip</a>
        <a href="#" className="nav-link">Visi Misi</a>
        <a href="#" className="nav-link">Q&A</a>
      </nav>

      {user ? (
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(prev => !prev)}
            className="login-btn flex items-center gap-2.5 px-4 py-2 text-white transition-all hover:bg-white/20"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-bold text-sm text-white uppercase shadow-md">
              {(user.nama_lengkap || user.username || 'U').charAt(0)}
            </div>
            <span className="font-semibold text-sm">
              {user.nama_lengkap ? user.nama_lengkap.split(' ')[0] : user.username}
            </span>
            <i 
              className={`fa-solid fa-chevron-down text-[11px] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            ></i>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-[125%] z-50 w-64 rounded-2xl border border-white/60 bg-white/90 p-3.5 text-slate-800 shadow-2xl backdrop-blur-xl transition-all border-slate-200/50 ring-1 ring-black/5">
              <div className="border-b border-slate-200/80 pb-3 mb-2">
                <p className="font-bold text-sm text-slate-900 truncate">
                  {user.nama_lengkap || user.username}
                </p>
                <p className="text-xs font-medium text-slate-500 mt-0.5 truncate">
                  @{user.username || 'user'}
                </p>
                <span className="inline-block mt-2 px-2.5 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-200 rounded-md capitalize shadow-xs">
                  {user.role || (roleId === 1 ? 'Super Admin' : roleId === 2 ? 'Koordinator' : 'Pegawai')}
                </span>
              </div>

              {isStaffOrAdmin && (
                <Link
                  to="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 text-xs font-semibold transition-all hover:bg-blue-50 hover:text-blue-600 mb-1"
                >
                  <i className="fa-solid fa-chart-line w-4 text-blue-600"></i>
                  Dashboard Admin
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 text-xs font-semibold transition-all hover:bg-red-50 text-left"
              >
                <i className="fa-solid fa-right-from-bracket w-4 text-red-500"></i>
                Keluar (Sign Out)
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link to="/login" className="login-btn">
          <i className="fa-solid fa-user"></i> Masuk
        </Link>
      )}
    </header>
  );
};

export default Navbar;
