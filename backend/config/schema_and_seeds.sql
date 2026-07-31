-- ==============================================================================
-- SKRIP DATABASE MYSQL: MANAGEMENT ARSIP & LAPORAN DIGITAL
-- Sesuai ERD Diagram MySQL Workbench (Kolom `terbit` di tabel `dokumen`)
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
DROP TABLE IF EXISTS `layanan_operasional`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `role`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. TABEL: role
CREATE TABLE `role` (
  `id_role` INT AUTO_INCREMENT PRIMARY KEY,
  `nama` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TABEL: users
CREATE TABLE `users` (
  `id_user` INT AUTO_INCREMENT PRIMARY KEY,
  `id_role` INT NOT NULL,
  `nama_lengkap` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `jabatan` VARCHAR(100) NULL,
  `nomor_telpon` VARCHAR(20) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_users_role` FOREIGN KEY (`id_role`) REFERENCES `role` (`id_role`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABEL: layanan_operasional
CREATE TABLE `layanan_operasional` (
  `id_layanan` INT AUTO_INCREMENT PRIMARY KEY,
  `id_users` INT NOT NULL,
  `nama_layanan` VARCHAR(150) NOT NULL,
  `deskripsi` TEXT NULL,
  `foto_layanan` VARCHAR(255) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_layanan_users` FOREIGN KEY (`id_users`) REFERENCES `users` (`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TABEL: dokumen (Kolom `terbit` sesuai ERD Screenshot)
CREATE TABLE `dokumen` (
  `id_dokumen` INT AUTO_INCREMENT PRIMARY KEY,
  `id_layanan` INT NOT NULL,
  `id_users` INT NOT NULL,
  `nama_dokumen` VARCHAR(255) NOT NULL,
  `terbit` DATE NOT NULL,
  `tipe_file` VARCHAR(20) NOT NULL DEFAULT 'pdf',
  `ukuran_file` VARCHAR(50) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_dokumen_layanan` FOREIGN KEY (`id_layanan`) REFERENCES `layanan_operasional` (`id_layanan`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_dokumen_users` FOREIGN KEY (`id_users`) REFERENCES `users` (`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TABEL: log_aktivitas
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

INSERT INTO `role` (`id_role`, `nama`) VALUES
(1, 'Super Admin'),
(2, 'Admin'),
(3, 'Pegawai');

INSERT INTO `users` (`id_user`, `id_role`, `nama_lengkap`, `email`, `password`, `jabatan`, `nomor_telpon`) VALUES
(1, 1, 'Ahmad Ridwan, S.Kom.', 'superadmin@arsip.go.id', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Kepala Subbagian IT', '081234567890'),
(2, 2, 'Siti Nurhaliza, A.Md.', 'admin@arsip.go.id', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Administrator Arsip', '082198765432'),
(3, 3, 'Budi Santoso', 'budi.santoso@arsip.go.id', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Staf Layanan Pengadaan', '085712345678'),
(4, 3, 'Dewi Lestari', 'dewi.lestari@arsip.go.id', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Staf Keuangan', '087855554433');

INSERT INTO `layanan_operasional` (`id_layanan`, `id_users`, `nama_layanan`, `deskripsi`, `foto_layanan`) VALUES
(1, 2, 'Layanan Pengadaan Barang & Jasa', 'Pelayanan pengelolaan dokumen tender dan serah terima pengadaan', 'layanan_pengadaan.jpg'),
(2, 2, 'Layanan Keuangan & Anggaran', 'Pengelolaan dokumen LPJ, kwitansi, dan dana operasional', 'layanan_keuangan.jpg'),
(3, 2, 'Layanan SDM & Kepegawaian', 'Pengelolaan SK, kenaikan pangkat, dan dokumen rekap kepegawaian', 'layanan_sdm.jpg'),
(4, 2, 'Layanan Perizinan & Operasional', 'Penerbitan surat izin operasional dan sertifikat pengujian', 'layanan_perizinan.jpg'),
(5, 2, 'Layanan Pengawasan & Audit Internal', 'Dokumentasi hasil audit internal dan berita acara pengawasan', 'layanan_audit.jpg');

INSERT INTO `dokumen` (`id_dokumen`, `id_layanan`, `id_users`, `nama_dokumen`, `terbit`, `tipe_file`, `ukuran_file`) VALUES
(1, 1, 3, 'Laporan Pengadaan Inventaris Komputer Q2 2026', '2026-07-01', 'pdf', '2.4 MB'),
(2, 3, 2, 'Surat Keputusan Pembagian Tugas Karyawan 2026', '2026-07-15', 'pdf', '1.8 MB'),
(3, 2, 4, 'LPJ Keuangan Operasional Juni 2026 v2', '2026-06-30', 'pdf', '3.1 MB');

INSERT INTO `log_aktivitas` (`id_log`, `id_users`, `nama`, `role`, `aksi`, `deskripsi`) VALUES
(1, 1, 'Ahmad Ridwan, S.Kom.', 'Super Admin', 'CREATE', 'Inisialisasi data master role sistem'),
(2, 3, 'Budi Santoso', 'Pegawai', 'UPLOAD', 'Mengunggah dokumen PDF baru Laporan Pengadaan Inventaris Komputer Q2 2026');
