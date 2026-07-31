import React from 'react';

// Data atribut statis sesuai dengan skema database ERD terbaru
export const defaultLayanan = [
  {
    kategori_layanan: 1,
    nama_layanan: 'MaritimHUB',
    deskripsi: 'Portal Single Sign-On (SSO) DJPL untuk mengakses seluruh aplikasi maritim secara terintegrasi dengan satu akun.',
    foto_layanan: '/kementrianperhubungan.png'
  },
  {
    kategori_layanan: 2,
    nama_layanan: 'SI-CEKATAN',
    deskripsi: 'Sistem Clearance Kapal Tradisional untuk mempermudah permohonan persetujuan berlayar secara digital.',
    foto_layanan: '/kementrianperhubungan.png'
  },
  {
    kategori_layanan: 3,
    nama_layanan: 'SIMlala',
    deskripsi: 'Pelayanan publik angkutan laut terintegrasi untuk perusahaan pelayaran, keagenan kapal, dan PBM.',
    foto_layanan: '/kementrianperhubungan.png'
  },
  {
    kategori_layanan: 4,
    nama_layanan: 'SITOLAUT',
    deskripsi: 'Sistem informasi logistik terintegrasi tol laut untuk memantau muatan dan menekan disparitas harga barang.',
    foto_layanan: '/kementrianperhubungan.png'
  },
  {
    kategori_layanan: 5,
    nama_layanan: 'SEHATI',
    deskripsi: 'Sistem Elektronik Sertifikat Pelaut Terintegrasi untuk mempermudah verifikasi keabsahan dokumen kepelautan.',
    foto_layanan: '/kementrianperhubungan.png'
  },
  {
    kategori_layanan: 6,
    nama_layanan: 'E-Licensing',
    deskripsi: 'Pelayanan perizinan online terpadu untuk efisiensi birokrasi dan transparansi layanan perhubungan laut.',
    foto_layanan: '/kementrianperhubungan.png'
  }
];

const getCategoryName = (id) => {
  const categories = {
    1: 'SEKRETARIAT DIREKTORAT JENDERAL PERHUBUNGAN LAUT',
    2: 'KSOP KELAS IV KALIANGET',
    3: 'DIREKTORAT LALU LINTAS DAN ANGKUTAN LAUT',
    4: 'DIREKTORAT LALU LINTAS DAN ANGKUTAN LAUT',
    5: 'DIREKTORAT PERKAPALAN DAN KEPELAUTAN',
    6: 'DIREKTORAT JENDERAL PERHUBUNGAN LAUT'
  };
  return categories[id] || `LAYANAN KATEGORI ${id}`;
};

const ServiceCard = ({ kategori_layanan, nama_layanan, deskripsi, foto_layanan }) => {
  return (
    <a href="#" className="service-card">
      <div className="service-logo-wrapper">
        <img 
          src={foto_layanan || "/kementrianperhubungan.png"} 
          alt={nama_layanan} 
          className="service-logo-img" 
        />
      </div>
      <div className="service-content">
        <h4 className="service-name">{nama_layanan}</h4>
        <span className="service-category">
          {getCategoryName(kategori_layanan)}
        </span>
        <p className="service-desc">{deskripsi}</p>
      </div>
    </a>
  );
};

export default ServiceCard;
