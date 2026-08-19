# AI_BLUEPRINT.md - Arsitektur Blueprint Proyek Manajemen Arsip Digital (Clearance Standard)

**PERINTAH UTAMA UNTUK AI & PENGEMBANG:**
> "Ini adalah kitab suci arsitektur proyek Manajemen Arsip Digital. Pengorganisasian folder, penulisan kode, penamaan berkas, dan pemisahan komponen **WAJIB 100% mengikuti standar Proyek Clearance**. Kode harus ditulis **sangat ringan, murni menggunakan Tailwind CSS, dipecah menjadi komponen modular ringkas (~30–80 baris)**, serta **bebas dari duplikasi/redundansi penamaan berkas maupun kode (DRY - Don't Repeat Yourself)**."

---

## 1. PRINSIP UTAMA KINERJA & PENULISAN KODE (CLEARANCE STANDARD)

1. **Komponen Ringkas & Terfokus (Atomic & Modular)**:
   * Setiap file komponen UI tidak boleh terlalu panjang. Pecah komponen yang kompleks menjadi sub-komponen kecil yang reusable di folder yang tepat.
   * Panjang ideal file komponen UI adalah **~10–80 baris** agar super ringan, mudah dibaca, dirawat, dan diuji.

2. **Murni Tailwind CSS (Super Light & Fast)**:
   * Utamakan penggunaan *utility classes* Tailwind CSS murni (`rounded-xl`, `border-slate-300`, `shadow-2xs`, `focus:ring-2`, `transition-all`).
   * Hindari penulisan CSS kustom *ad-hoc* di file terpisah jika bisa ditangani dengan kelas Tailwind CSS.

3. **Single Source of Truth (Hindari Redundansi Komponen)**:
   * DILARANG KERAS membuat dua komponen berbeda untuk fungsi yang mirip (contoh: jangan buat `CustomSelect.jsx` jika `CategoryFilter.jsx` sudah ada). 
   * Gunakan *props* yang fleksibel (seperti `showIcon`, `placeholder`, `defaultLabel`) agar satu komponen dapat digunakan di banyak tempat (misal: Filter Tabel sekaligus Input Form Select).

4. **Pemisahan Halaman & Form Wrapper**:
   * Halaman Terpisah (`pages/docArsip/TambahDokumen.jsx`) dan Modal Pop-Up (`components/modal/TambahDokumen.jsx`) **WAJIB menggunakan satu komponen form utama yang sama** (`components/form/DokumenForm.jsx`).

5. **STANDAR PENAMAAN FILE BERDASARKAN FOLDER (TANPA REDUNDANSI NAMA FOLDER)**:
   * **ATURAN MUTLAK**: Ketika sebuah file diletakkan di dalam folder berkategori (seperti `modal/`, `format/`, `table/`, `form/`, `ui/`, `pages/`, dsb.), **DILARANG KERAS menambahkan nama folder tersebut sebagai akhiran (suffix) atau awalan (prefix) pada nama file!**
   * **Contoh Folder `modal/`**:
     * ❌ **SALAH**: `components/modal/FileViewerModal.jsx`, `components/modal/TambahDokumenModal.jsx` (Redundan!)
     * ✅ **BENAR**: `components/modal/FileViewer.jsx`, `components/modal/TambahDokumen.jsx`
   * **Contoh Folder `format/`**:
     * ❌ **SALAH**: `components/modal/format/ExcelViewer.jsx`, `components/modal/format/WordViewer.jsx`
     * ✅ **BENAR**: `components/modal/format/ExcelFormat.jsx`, `components/modal/format/WordFormat.jsx`, `components/modal/format/PdfFormat.jsx`
   * **Contoh Folder `table/`**:
     * ❌ **SALAH**: `components/table/DokumenTable.jsx` (Jika redundan dengan nama folder `table`)
     * ✅ **BENAR**: `components/table/DokumenTable.jsx` / `components/table/Dokumen.jsx`
   * **Tujuan**: Menghindari penulisan impor ganda yang canggung (seperti `import FileViewerModal from './modal/FileViewerModal'`), sehingga sintaks impor menjadi sangat bersih dan elegan (`import FileViewer from './modal/FileViewer'`).

6. **STANDAR GLOBAL NOTIFIKASI FLASH & PENCEGAHAN PERGESERAN LAYOUT**:
   * **Terpusat di Layout Utama**: Komponen `<Flash />` wajib di-render secara **GLOBAL** pada level pembungkus layout utama (`AppLayout.jsx` dan `EmployeeLayout.jsx`), bukan di dalam masing-masing halaman individual.
   * **DILARANG KERAS Menaruh `<Flash />` di Dalam Halaman Individual (`pages/*`)**: Memanggil `<Flash />` di dalam pembungkus halaman dengan Tailwind CSS `space-y-*` atau `gap-*` akan merusak indeks elemen anak dan menyebabkan pergeseran posisi elemen halaman (*layout shift*) saat notifikasi muncul atau hilang.
   * **Penggunaan Notifikasi di Halaman Baru**: Pada halaman baru, pengembang **CUKUP** memanggil fungsi `const { addToast } = useFlash()` atau `localStorage.setItem('_flash', ...)` tanpa perlu mengimpor atau merender ulang komponen `<Flash />`.
   * **Konsistensi Case Sensitivity**: File notifikasi bertempat di `src/components/flash/flash.jsx` (huruf **f** kecil). Selalu perhatikan *path casing* saat melakukan impor untuk mencegah error kompilasi pada Vite/Windows.

---

## 2. STRUKTUR & ALUR FRONTEND (VITE REACT)

Peta peletakan folder frontend disusun terstruktur mengikuti kategori dan fungsi fitur:

```text
frontend/src/
 ├── api/
 │    └── axiosInstance.js        <-- Konfigurasi terpusat Axios & JWT Interceptor
 ├── components/
 │    ├── auth/                   <-- Komponen Otorisasi & Guard (ProtectedRoute, RolePick)
 │    ├── dashboard/              <-- Widget Analytics & Chart Dashboard
 │    ├── flash/                  <-- Komponen Notifikasi Flash Toast
 │    ├── form/                   <-- Seluruh Komponen Form & Input Control (Standar Clearance)
 │    │    ├── FileUploadZone.jsx <-- Zona Drag & Drop Unggah Berkas
 │    │    └── DokumenForm.jsx    <-- Core Form Input Dokumen (Reusable)
 │    ├── layout/                 <-- Layout Utama & Navigasi (AppLayout, EmployeeLayout, Header, Sidebar)
 │    ├── modal/                  <-- Modal Pop-Up Containers (Bebas Redundansi Suffix Modal)
 │    │    ├── format/            <-- Engine Rendering Format Berkas (PdfFormat, WordFormat, ExcelFormat, ImageFormat, DefaultFormat)
 │    │    ├── FileViewer.jsx     <-- Universal File Viewer Container
 │    │    └── TambahDokumen.jsx  <-- Modal Form Upload Dokumen Baru
 │    ├── table/                  <-- Komponen Tabel Data (DokumenTable)
 │    └── ui/                     <-- Widget UI Reusable (CategoryFilter, SearchBar, Pagination, Button, RowsPerPageSelect, FileIcon)
 ├── hooks/
 │    └── useFlash.js             <-- Custom Hook Manajemen State Flash Toast
 └── pages/
      ├── docArsip/               <-- Modul Halaman Manajemen Dokumen Arsip
      │    ├── Dokumen.jsx        <-- Halaman Tabel Utama Dokumen
      │    └── TambahDokumen.jsx  <-- Halaman Dedikasi Tambah Dokumen
      ├── Auth.jsx                <-- Halaman Autentikasi / Login
      ├── Dashboard.jsx           <-- Halaman Utama Ringkasan Analytics
      └── Home.jsx                <-- Public Landing Page
```

### Rincian Fungsi Tiap Folder Frontend:
* **`src/components/ui/`**: Widget UI atomic terstandar yang sering digunakan di berbagai halaman (seperti `CategoryFilter`, `SearchBar`, `Button`, `Pagination`).
* **`src/components/form/`**: Seluruh elemen form dan pembungkus kontrol input data.
* **`src/components/modal/`**: Kontainer modal dialog tanpa imbuhan `Modal` di akhir nama berkas.
* **`src/components/modal/format/`**: Mesin rendering khusus format berkas fisik (PDF, Word, Excel, Image, Default).
* **`src/components/table/`**: Komponen khusus rendering tabel data yang efisien dan mendukung sorting.
* **`src/pages/docArsip/`**: Pengelompokan halaman domain dokumen arsip secara rapi agar struktur navigasi mudah ditemukan.

---

## 3. STRUKTUR & ALUR BACKEND (EXPRESS + SEQUELIZE M-C-R)

Backend menggunakan pola arsitektur **M-C-R (Model - Controller - Route)** yang terpisah secara ketat:

```text
backend/
 ├── config/            <-- Konfigurasi Koneksi Database MySQL & Environment
 ├── controller/        <-- Logika Bisnis Utama (dokumenController, authController, kategoriController)
 ├── middleware/        <-- Middleware Penjaga (jwt.js untuk Auth Token, upload.js untuk Multer)
 ├── models/            <-- Skema Tabel Sequelize ORM & Hubungan Relasi (kategoriDokumenModel, dokumenModel, userModel)
 ├── routes/            <-- Definisi Endpoint URL & Pemasangan Middleware (/kategori-dokumen, /dokumen)
 └── uploads/           <-- Folder Penyimpanan Fisik Berkas File (PDF, Excel, Gambar)
```

---

## 4. CONTOH KODE STRUKTUR RINGAN (CONTOH DARI PROYEK CLEARANCE)

Berikut adalah cetak biru pola penulisan kode ringkas yang **WAJIB dicontoh** untuk setiap pembuatan komponen baru:

### A. Pola InputField Ringan (`components/form/InputField.jsx`)
```jsx
import React from 'react';

const InputField = (props) => (
  <input
    {...props}
    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs md:text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 transition-all shadow-2xs"
  />
);

export default InputField;
```

### B. Pola Button Multi-Variant Ringan (`components/ui/Button.jsx`)
```jsx
import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white font-bold',
    secondary: 'border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white font-bold',
  };
  return (
    <button
      {...props}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm transition-all cursor-pointer disabled:opacity-50 ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
}
```

### C. Pola Unified Dropdown Select/Filter (`components/ui/CategoryFilter.jsx`)
```jsx
import React, { useState, useRef, useEffect } from 'react';
import SearchBar from './SearchBar';

export default function CategoryFilter({ selectedCategory, onChange, onClear, categoryOptions = [], placeholder, defaultLabel = "Semua Kategori Dokumen", showIcon = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeItem = categoryOptions.find(c => String(c.id_kategori || c.id_layanan) === String(selectedCategory));
  const activeLabel = activeItem ? (activeItem.nama_kategori || activeItem.nama_layanan) : (placeholder || defaultLabel);
  const filtered = categoryOptions.filter(item => (item.nama_kategori || item.nama_layanan || '').toLowerCase().includes(search.toLowerCase().trim()));

  return (
    <div ref={dropdownRef} className="relative w-full sm:w-auto min-w-[200px]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 h-11 rounded-xl border py-2 ${showIcon ? 'pl-9' : 'pl-4'} pr-9 text-xs md:text-sm font-semibold outline-none transition-all shadow-2xs select-none ${
          selectedCategory ? 'border-blue-500 bg-blue-50/40 text-blue-900 font-bold' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
        }`}
      >
        {showIcon && (
          <svg className="absolute left-3 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
        )}
        <span className="truncate">{activeLabel}</span>
        <div className="absolute right-2.5 flex items-center">
          {selectedCategory ? (
            <span onClick={(e) => { e.stopPropagation(); onClear && onClear(); setSearch(''); }} className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold cursor-pointer">×</span>
          ) : (
            <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl border border-slate-200 bg-white p-2 shadow-xl min-w-[240px]">
          <div className="mb-2">
            <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch('')} placeholder="Cari..." />
          </div>
          <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1">
            {filtered.length > 0 ? (
              filtered.map((item) => {
                const itemId = item.id_kategori || item.id_layanan;
                const itemLabel = item.nama_kategori || item.nama_layanan;
                return (
                  <button
                    key={itemId}
                    type="button"
                    onClick={() => { onChange && onChange({ target: { value: itemId } }); setIsOpen(false); setSearch(''); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs md:text-sm font-semibold flex items-center justify-between ${
                      String(itemId) === String(selectedCategory) ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{itemLabel}</span>
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-3 text-center text-xs text-slate-400">Tidak ditemukan</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 5. STANDAR PENYIMPANAN BERKAS & DATABASE

1. **Penyimpanan Berkas Fisik**: Berkas dokumen (PDF, Excel, Word, Image) diunggah menggunakan **Multer** dan disimpan di direktori fisik server `backend/uploads/`.
2. **Penyimpanan Database**: Database MySQL **HANYA menyimpan metadata** (`id_kategori`, nama file fisik, nama dokumen, tipe extension, ukuran file, ID User, dan tanggal terbit).
3. **Pengamanan Akses**: Folder `uploads/` dapat diakses via eksposur statis atau endpoint terlindungi token JWT untuk menjamin keamanan berkas arsip internal.

Catatan Penting!!: selesai backend/frontend kamu hidupkan jangan lupa matikan, lal uhidupkan di terminalku 