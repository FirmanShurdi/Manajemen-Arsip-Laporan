import React, { useState } from 'react';

// Pemetaan ekstensi file ke gambar ikon di /public/icons/ (Mendukung .svg dan .png)
const iconMap = {
  pdf: '/icons/pdf.svg',
  xlsx: '/icons/xlsx.svg',
  xls: '/icons/xls.svg',
  xlsm: '/icons/xlsm.svg',
  docx: '/icons/docx.svg',
  doc: '/icons/word.svg',
  csv: '/icons/csv.svg',
  word: '/icons/word.svg',
  jpg: '/icons/jpg.svg',
  jpeg: '/icons/jpeg.svg',
  png: '/icons/png.svg',
};

export default function FileIcon({ tipeFile, namaDokumen, className = "h-10 w-10 shrink-0" }) {
  const [usePngFallback, setUsePngFallback] = useState(false);
  const [imgError, setImgError] = useState(false);

  let ext = (tipeFile || '').toLowerCase().replace('.', '').trim();
  
  if (!ext && namaDokumen) {
    const parts = namaDokumen.split('.');
    if (parts.length > 1) {
      ext = parts.pop().toLowerCase();
    }
  }

  // Tentukan path gambar ikon: coba .svg terlebih dahulu, jika error coba .png
  const svgPath = iconMap[ext] || `/icons/${ext}.svg`;
  const pngPath = (iconMap[ext] || `/icons/${ext}.png`).replace(/\.svg$/, '.png');
  const iconSrc = usePngFallback ? pngPath : svgPath;

  // Fallback SVG inline jika berkas ikon tidak ditemukan sama sekali
  if (imgError || !ext) {
    return (
      <div className={`flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0 border border-blue-100/80 shadow-xs ${className}`}>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center rounded-xl bg-slate-50 p-1 shrink-0 border border-slate-200/70 shadow-2xs group-hover:scale-105 transition-transform ${className}`}>
      <img
        src={iconSrc}
        alt={ext}
        onError={() => {
          if (!usePngFallback) {
            setUsePngFallback(true);
          } else {
            setImgError(true);
          }
        }}
        className="w-full h-full object-contain drop-shadow-xs"
      />
    </div>
  );
}
