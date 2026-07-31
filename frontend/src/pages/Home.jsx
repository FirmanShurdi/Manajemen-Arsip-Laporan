import React from 'react';
import ServiceCard, { defaultLayanan } from '../components/layanan/LayananCard';

const Home = () => {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">SI-CEKATAN</h1>
          <p className="hero-desc">
            SISTEM CLEARANCE KAPAL TRADISIONAL<br />
            KANTOR SYAHBANDAR DAN OTORITAS PELABUHAN KELAS IV KALIANGET
          </p>
          <a href="#layanan" className="layanan-btn">
            Layanan <i className="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </section>

      <div className="search-container-wrapper">
        <div className="search-container">
          <div className="dropdown-box">
            <span>Pilih Layanan</span>
            <i className="fa-solid fa-chevron-down"></i>
          </div>

          <div className="search-box">
            <input type="text" placeholder="Masukkan Keyword Pencarian" />
          </div>

          <button className="search-btn">
            <i className="fa-solid fa-magnifying-glass"></i> Cari
          </button>
        </div>
      </div>

      <section id="layanan" className="services-section">
        <div className="welcome-container">
          <h2 className="welcome-title">Selamat datang di ekosistem aplikasi maritim yang terintegrasi</h2>
          <p className="welcome-subtitle">
            Dengan sistem Single Sign-On (SSO) DJPL, Anda hanya perlu satu akun untuk mengakses seluruh aplikasi.
          </p>
        </div>

        <div className="services-container">
          <div className="services-grid">
            {defaultLayanan.map((item) => (
              <ServiceCard 
                key={item.kategori_layanan}
                kategori_layanan={item.kategori_layanan}
                nama_layanan={item.nama_layanan}
                deskripsi={item.deskripsi}
                foto_layanan={item.foto_layanan}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
