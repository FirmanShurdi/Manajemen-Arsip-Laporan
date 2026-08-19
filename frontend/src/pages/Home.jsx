import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import KategoriCard from '../components/kategori/KategoriCard';

const Home = () => {
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchKategori();
  }, []);

  const fetchKategori = async () => {
    try {
      const response = await api.get('/kategori-dokumen');
      const data = response.data?.datas ?? response.data;
      setKategoriList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Gagal mengambil data kategori dokumen:', err);
      setError('Gagal memuat data kategori dokumen. Pastikan backend berjalan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">SI-CEKATAN</h1>
          <p className="hero-desc">
            SISTEM ARSIP KAPAL TRADISIONAL<br />
            KANTOR SYAHBANDAR DAN OTORITAS PELABUHAN KELAS IV KALIANGET
          </p>
          <a href="#kategori" className="arsip-btn">
            Arsip <i className="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </section>

      <div className="search-container-wrapper">
        <div className="search-container">
          <div className="dropdown-box">
            <span>Pilih Kategori</span>
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

      <section id="kategori" className="services-section">
        <div className="welcome-container">
          <h2 className="welcome-title">Selamat datang di ekosistem aplikasi maritim yang terintegrasi</h2>
          <p className="welcome-subtitle">
            Dengan sistem Single Sign-On (SSO) DJPL, Anda hanya perlu satu akun untuk mengakses seluruh aplikasi.
          </p>
        </div>

        <div className="services-container">
          {loading && (
            <div className="services-loading">
              <p>Memuat kategori...</p>
            </div>
          )}
          {error && (
            <div className="services-error">
              <p>{error}</p>
            </div>
          )}
          {!loading && !error && kategoriList.length === 0 && (
            <div className="services-empty">
              <p>Belum ada kategori dokumen yang tersedia.</p>
            </div>
          )}
          {!loading && !error && kategoriList.length > 0 && (
            <div className="services-grid">
              {kategoriList.map((item) => (
                <KategoriCard
                  key={item.id_arsip || item.id_kategori}
                  id_kategori={item.id_kategori}
                  kategori_dokumen={item.kategori_dokumen}
                  nama_kategori={item.nama_kategori}
                  deskripsi={item.deskripsi}
                  foto={item.foto}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
