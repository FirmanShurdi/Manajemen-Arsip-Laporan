import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-logo">
          <img src="/kementrianperhubungan.png" alt="Logo Kemenhub" />
          <div className="footer-logo-text">
            <strong>KSOP KELAS IV KALIANGET</strong>
            <span><b>KEMENTERIAN PERHUBUNGAN REPUBLIK INDONESIA</b></span>
          </div>
        </div>
        <div className="footer-contact">
          <p>Pelabuhan Kalianget, Kabupaten Sumenep<br />Jawa Timur, Indonesia</p>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; 2026 SI-CEKATAN - Sistem Manajemen Clearance Kapal Tradisional. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
