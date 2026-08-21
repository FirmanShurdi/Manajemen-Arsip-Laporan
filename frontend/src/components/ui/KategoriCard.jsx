import React from 'react';
import { Link } from 'react-router-dom';
import { backendURL } from '../../api/axiosInstance';

const getLogoUrl = (foto) => {
  if (!foto) return '/kategori/default.png';
  if (foto.startsWith('http')) return foto;
  return `${backendURL}/${foto.replace(/^\//, '')}`;
};

const KategoriCard = ({ id_arsip, id_kategori, kategori_dokumen, nama_kategori, deskripsi, foto }) => {
  let rawName = nama_kategori || 'Kategori Dokumen';
  let linkUrl = `/dokumen?id_arsip=${id_arsip}`;
  if (id_kategori) {
    linkUrl += `&id_kategori=${id_kategori}`;
  }

  // Format title: Tambahkan kata "Arsip " di depannya jika belum ada
  const displayName = rawName.toLowerCase().startsWith('arsip ')
    ? rawName
    : `Arsip ${rawName}`;

  const displayCategoryTag = kategori_dokumen;
  const displayFoto = foto;

  return (
    <Link to={linkUrl} className="service-card">
      <div className="service-logo-wrapper">
        <img
          src={getLogoUrl(displayFoto)}
          alt={displayName}
          className="service-logo-img"
          onError={(e) => {
            e.target.onerror = null; // Mencegah infinite loop kedip-kedip saat image 404
            e.target.src = '/kategori/default.png';
          }}
        />
      </div>
      <div className="service-content">
        <h4 className="service-name">{displayName}</h4>
        {displayCategoryTag && <span className="service-category">{displayCategoryTag.toUpperCase()}</span>}
        <p className="service-desc">{deskripsi}</p>
      </div>
    </Link>
  );
};

export default KategoriCard;
