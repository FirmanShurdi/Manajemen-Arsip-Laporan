-- ==============================================================================
-- SKRIP DATABASE MYSQL: MANAGEMENT ARSIP & LAPORAN DIGITAL
-- Sesuai Arsitektur 3-Tier (kategori_dokumen -> arsip -> dokumen)
-- Database Name: db_arsip_digital
-- Engine: InnoDB | Charset: utf8mb4
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `db_arsip_digital`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `db_arsip_digital`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `log_aktivitas`;
DROP TABLE IF EXISTS `dokumen`;
DROP TABLE IF EXISTS `arsip`;
DROP TABLE IF EXISTS `kategori_dokumen`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `role`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. TABEL: role
CREATE TABLE `role` (
  `id_role` INT AUTO_INCREMENT PRIMARY KEY,
  `nama` VARCHAR(50) NOT NULL UNIQUE,
  `tipe_role` ENUM('admin', 'pegawai') NOT NULL DEFAULT 'pegawai'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TABEL: users
CREATE TABLE `users` (
  `id_user` INT AUTO_INCREMENT PRIMARY KEY,
  `id_role` INT NOT NULL,
  `username` VARCHAR(100) NULL,
  `nama_lengkap` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `jabatan` VARCHAR(100) NULL,
  `wilayah_kerja` VARCHAR(100) NULL,
  `foto` VARCHAR(250) NULL,
  `nomor_telpon` VARCHAR(20) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_users_role` FOREIGN KEY (`id_role`) REFERENCES `role` (`id_role`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABEL: kategori_arsip (Master Induk Kategori)
CREATE TABLE `kategori_arsip` (
  `id_kategori` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_kategori` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TABEL: arsip (Master Jenis Arsip / Detail Sub-Kategori)
CREATE TABLE `arsip` (
  `id_arsip` INT AUTO_INCREMENT PRIMARY KEY,
  `id_kategori` INT NOT NULL,
  `id_users` INT NOT NULL,
  `nama_arsip` VARCHAR(150) NOT NULL,
  `deskripsi` TEXT NULL,
  `foto` VARCHAR(255) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_arsip_kategori_arsip` FOREIGN KEY (`id_kategori`) REFERENCES `kategori_arsip` (`id_kategori`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_arsip_users` FOREIGN KEY (`id_users`) REFERENCES `users` (`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TABEL: dokumen (Tabel Transaksi Berkas)
CREATE TABLE `dokumen` (
  `id_dokumen` INT AUTO_INCREMENT PRIMARY KEY,
  `id_arsip` INT NOT NULL,
  `id_users` INT NOT NULL,
  `nama_dokumen` VARCHAR(255) NOT NULL,
  `terbit` DATE NOT NULL,
  `tipe_file` VARCHAR(20) NOT NULL DEFAULT 'pdf',
  `ukuran_file` VARCHAR(50) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_dokumen_arsip` FOREIGN KEY (`id_arsip`) REFERENCES `arsip` (`id_arsip`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_dokumen_users` FOREIGN KEY (`id_users`) REFERENCES `users` (`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. TABEL: log_aktivitas
CREATE TABLE `log_aktivitas` (
  `id_log` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `id_users` INT NULL,
  `nama` VARCHAR(100) NULL,
  `role` VARCHAR(50) NULL,
  `aksi` VARCHAR(50) NOT NULL,
  `deskripsi` TEXT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_log_users` FOREIGN KEY (`id_users`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- SEED DATA REALISTIS
-- ==============================================================================

INSERT INTO `role` (`id_role`, `nama`, `tipe_role`) VALUES
(1, 'Super Admin', 'admin'),
(2, 'Koordinator', 'admin'),
(3, 'Pegawai', 'pegawai');

INSERT INTO `users` (`id_user`, `id_role`, `username`, `nama_lengkap`, `password`, `jabatan`, `wilayah_kerja`, `nomor_telpon`) VALUES
(1, 1, 'superadmin', 'Ahmad Ridwan, S.Kom.', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Kepala Subbagian IT', 'Kantor Pusat', '081234567890'),
(2, 2, 'admin', 'Siti Nurhaliza, A.Md.', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Administrator Arsip', 'Kalianget', '082198765432'),
(3, 3, 'budi', 'Budi Santoso', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Staf Pengadaan', 'Kalianget', '085712345678'),
(4, 3, 'dewi', 'Dewi Lestari', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Staf Keuangan', 'Kalianget', '087855554433');

INSERT INTO `kategori_arsip` (`id_kategori`, `nama_kategori`) VALUES
(1, 'Akuntabilitas Kinerja Instansi Pemerintah'),
(2, 'Pengendalian Intern Pemerintah'),
(3, 'Manajemen Risiko'),
(4, 'Keselamatan Berlayar, Penjagaan & Patroli'),
(5, 'Lalu Lintas Angkutan Laut & Kepelabuhanan');

INSERT INTO `arsip` (`id_arsip`, `id_kategori`, `id_users`, `nama_arsip`, `deskripsi`, `foto`) VALUES
(1, 1, 2, 'SAKIP', 'Dokumen perencanaan, pengukuran, dan pelaporan kinerja instansi.', 'sakip.jpg'),
(2, 2, 2, 'SPIP', 'Dokumen pengawasan dan pengendalian internal pemerintah.', 'spip.jpg'),
(3, 3, 2, 'Manajemen Risiko', 'Dokumen identifikasi, analisis, dan pemetaan risiko operasional.', 'manajemen_risiko.jpg'),
(4, 4, 2, 'Keselamatan Berlayar', 'Dokumen kelaiklautan kapal, penerbitan SPB, pengawasan tertib berlayar, serta laporan patroli.', 'keselamatan_berlayar.jpg'),
(5, 5, 2, 'Lalulintas & Kepelabuhanan', 'Dokumen warta kapal, lalu lintas barang/penumpang, bongkar muat, dan operasional pelabuhan.', 'lalulintas_kepelabuhanan.jpg');

INSERT INTO `dokumen` (`id_dokumen`, `id_arsip`, `id_users`, `nama_dokumen`, `terbit`, `tipe_file`, `ukuran_file`) VALUES
(1, 1, 3, 'Laporan Pengadaan Inventaris Komputer Q2 2026', '2026-07-01', 'pdf', '2.4 MB'),
(2, 3, 2, 'Surat Keputusan Pembagian Tugas Karyawan 2026', '2026-07-15', 'pdf', '1.8 MB'),
(3, 2, 4, 'LPJ Keuangan Operasional Juni 2026 v2', '2026-06-30', 'pdf', '3.1 MB');

INSERT INTO `log_aktivitas` (`id_log`, `id_users`, `nama`, `role`, `aksi`, `deskripsi`) VALUES
(1, 1, 'Ahmad Ridwan, S.Kom.', 'Super Admin', 'CREATE', 'Inisialisasi data master role sistem'),
(2, 3, 'Budi Santoso', 'Pegawai', 'UPLOAD', 'Mengunggah dokumen PDF baru Laporan Pengadaan Inventaris Komputer Q2 2026');
