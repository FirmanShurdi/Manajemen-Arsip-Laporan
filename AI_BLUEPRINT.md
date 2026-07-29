# AI_BLUEPRINT.md - Arsitektur Website Manajemen Laporan & File

**PERINTAH UNTUK AI:**
"Ini adalah standar arsitektur (Kitab Suci) proyek kita. Gunakan teknologi Vite React (Frontend) dan Express + Sequelize (Backend). Baca baik-baik bagaimana alur (flow) antar folder diatur di bawah ini. Arsitektur ini dirancang secara Modular agar **fleksibel** menampung penambahan logika apapun di masa depan."

---

## 1. STRUKTUR & ALUR BACKEND (EXPRESS + SEQUELIZE)
Arsitektur Backend menggunakan pola **M-C-R (Model - Controller - Route)** yang dipecah secara ketat agar logika tidak menumpuk di satu tempat.

### A. Folder `routes/` (Sang Pelayan)
*   **Fungsi:** Hanya bertugas mendefinisikan *endpoint* URL (contoh: `POST /api/upload`) dan memasang *Middleware* (penjaga).
*   **Aturan Fleksibilitas:** DILARANG KERAS menaruh logika bisnis (seperti rumus matematika atau validasi IF/ELSE yang panjang) di sini. `routes` hanya meneruskan *request* ke `controller`.
*   **Contoh:** `router.post('/upload', authMiddleware, uploadMiddleware, laporanController.uploadFile)`

### B. Folder `controller/` (Sang Koki - Tempat Logika Fleksibel)
*   **Fungsi:** Ini adalah otak aplikasi. Semua penambahan logika yang rumit di masa depan **harus diletakkan di sini**.
*   **Tugas Utama:** 
    1. Menerima data dari *user* (lewat `req.body` atau `req.file`).
    2. Melakukan validasi (contoh: mengecek apakah file yang diupload ukurannya tidak kebesaran).
    3. Menggabungkan logika multi-tabel (contoh: mencari id user, lalu mencari id divisi, baru disimpan).
    4. Menyuruh `model` untuk mengeksekusi ke *database*.
    5. Mengirimkan *Response* (JSON) kembali ke Frontend.

### C. Folder `model/` (Sang Penjaga Database)
*   **Fungsi:** Mengatur skema tabel menggunakan Sequelize ORM.
*   **Aturan Fleksibilitas:** File di folder ini murni hanya berisi nama kolom tabel (String, Integer) dan hubungannya antar tabel (*Associations*). Tidak boleh ada kaitan dengan fungsi HTTP (req/res) di sini.
*   **Keuntungan:** Jika suatu saat kita ingin mengganti dari MySQL ke PostgreSQL, kita tidak perlu merombak *Controller*, cukup sesuaikan konfigurasi *Database* di Model.

### D. Folder `middleware/` (Sang Penjaga Gerbang)
*   **Fungsi:** Menahan *request* sebelum sampai ke *Controller*.
*   **Contoh Penambahan:** Saat ini kita menggunakan `auth.js` (Cek Token JWT) dan `upload.js` (Cek Multer File). Ke depan, jika butuh fitur "Hanya Admin yang bisa hapus file", kita cukup buat file `roleCheck.js` di sini secara fleksibel.

---

## 2. STRUKTUR & ALUR FRONTEND (VITE REACT)
Frontend menggunakan komponen yang bisa dipakai ulang (Reusable Components) agar ringan dan cepat saat di-render oleh *browser*.

### A. Folder `src/pages/`
*   **Fungsi:** Merakit halaman secara utuh. File di sini bertindak sebagai wadah (Container).
*   **Aturan:** Halaman di sini sebisa mungkin jangan diisi dengan kode HTML (JSX) tombol atau tabel yang terlalu panjang. Panggil *components* untuk mengisi halaman ini.

### B. Folder `src/components/`
*   **Fungsi:** Potongan-potongan UI kecil (seperti `TabelLaporan.jsx`, `TombolUpload.jsx`, `ModalKonfirmasi.jsx`).
*   **Keuntungan:** Jika nanti ada penambahan halaman baru yang butuh fitur Tabel, kita tinggal memanggil komponen tabel yang sudah ada, sehingga aplikasi tetap sangat ringan (*DRY - Don't Repeat Yourself*).

### C. Folder `src/context/` & `src/hooks/`
*   **Fungsi:** Mengurus logika khusus *Frontend* yang fleksibel.
*   **Context:** Mengurus data Global (contoh: `AuthContext.jsx` untuk menyimpan data Profil User agar tidak hilang saat pindah halaman).
*   **Hooks:** Jika nanti Anda butuh fitur "Filter Pencarian Canggih" untuk file Excel, buatlah file `useFilter.js` di sini agar logikanya tidak mengotori file tampilan (UI).

---

## 3. Aturan Main Fitur Upload File Laporan (WAJIB DIIKUTI AI)
Karena fitur utama web ini adalah manajemen file laporan karyawan, ini SOP yang harus dipatuhi:
1. **Penyimpanan Fisik:** Gunakan **Multer** di Backend. File Excel/PDF/Dokumen fisik harus disimpan ke folder lokal `/uploads/` di server Backend.
2. **Penyimpanan Database:** Yang masuk ke Database (MySQL via Model) BUKANLAH file aslinya, melainkan **HANYA NAMA FILE atau PATH-nya** beserta ID Karyawan yang mengunggah. Ini wajib dilakukan agar *database* tidak jebol dan tetap ringan.
3. **Pengamanan:** Pastikan folder `/uploads/` bisa diakses (statis) via Express, ATAU buatkan *route* khusus untuk *download* yang mewajibkan Token JWT agar file internal kantor tidak bisa di-download orang luar.
