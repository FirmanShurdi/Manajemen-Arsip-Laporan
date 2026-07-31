import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [headerClass, setHeaderClass] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('.hero');
      const scrollY = window.scrollY;
      
      if (!heroSection) return;

      const heroBottom = heroSection.offsetHeight - 90;

      if (scrollY <= 10) {
        setHeaderClass('');
      } else if (scrollY > 10 && scrollY < heroBottom) {
        setHeaderClass('scrolled-blue');
      } else {
        setHeaderClass('scrolled-grey');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={headerClass}>
      <a href="#" className="logo-area">
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
      </a>

      <nav className="nav-pill">
        <a href="#" className="nav-link active">Beranda</a>
        <a href="#" className="nav-link">Layanan</a>
        <a href="#" className="nav-link">Visi Misi</a>
        <a href="#" className="nav-link">Q&A</a>
      </nav>

      <a href="/login" className="login-btn">
        <i className="fa-solid fa-user"></i> Masuk
      </a>
    </header>
  );
};

export default Navbar;
