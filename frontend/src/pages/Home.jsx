import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axiosInstance';
import KategoriCard from '../components/ui/KategoriCard';
import Filsearch from '../components/ui/filsearch';

const Home = () => {
  const location = useLocation();
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter State
  const [selectedCategory, setSelectedCategory] = useState('');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetchKategori();
  }, []);

  // Smooth scroll ke section #kategori jika URL berisi hash #kategori
  useEffect(() => {
    if (!loading && (location.hash === '#kategori' || window.location.hash === '#kategori')) {
      setTimeout(() => {
        const element = document.getElementById('kategori');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  }, [location.hash, loading]);

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

  // Filter pencarian berdasarkan nama_kategori/nama_arsip, kategori_dokumen, dan deskripsi
  const filteredKategori = kategoriList.filter((item) => {
    const matchesCategory = !selectedCategory ||
      String(item.id_kategori) === String(selectedCategory) ||
      String(item.id_arsip) === String(selectedCategory) ||
      String(item.kategori_dokumen).toLowerCase() === String(selectedCategory).toLowerCase();

    const q = keyword ? keyword.toLowerCase().trim() : '';
    const matchesKeyword = !q ||
      (item.nama_kategori && item.nama_kategori.toLowerCase().includes(q)) ||
      (item.nama_arsip && item.nama_arsip.toLowerCase().includes(q)) ||
      (item.kategori_dokumen && item.kategori_dokumen.toLowerCase().includes(q)) ||
      (item.deskripsi && item.deskripsi.toLowerCase().includes(q));

    return matchesCategory && matchesKeyword;
  });

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

      <Filsearch
        selectedCategory={selectedCategory}
        onCategoryChange={(e) => setSelectedCategory(e.target.value)}
        onCategoryClear={() => setSelectedCategory('')}
        categoryOptions={kategoriList}
        keyword={keyword}
        onKeywordChange={(val) => setKeyword(val)}
        onKeywordClear={() => setKeyword('')}
      />

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
          {!loading && !error && filteredKategori.length === 0 && (
            <div className="services-empty">
              <p>Belum ada kategori dokumen yang tersedia atau cocok dengan pencarian.</p>
            </div>
          )}
          {!loading && !error && filteredKategori.length > 0 && (
            <div className="services-grid">
              {filteredKategori.map((item) => (
                <KategoriCard
                  key={item.id_arsip || item.id_kategori}
                  id_arsip={item.id_arsip}
                  id_kategori={item.id_kategori}
                  kategori_dokumen={item.kategori_dokumen}
                  nama_kategori={item.nama_kategori || item.nama_arsip}
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
