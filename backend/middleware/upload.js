const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { arsip, kategoriArsip } = require('../model/association');

// Konfigurasi Penyimpanan File Multer berdasar Struktur 2-Tingkat [Kategori Induk]/[Nama Arsip]
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const targetId = String(req.body?.id_arsip || req.body?.id_kategori || '1');

      // Query nama arsip dan kategori induk dari database MySQL
      const targetArsip = await arsip.findByPk(targetId, {
        include: [{ model: kategoriArsip, as: 'kategori_arsip' }]
      });

      const parentCategoryName = targetArsip?.kategori_arsip?.nama_kategori || 'Umum';
      const subfolderName = targetArsip ? targetArsip.nama_arsip : 'Kategori Dokumen';

      // Path fisik target di frontend/public/File/[Kategori Induk]/[Nama Arsip]
      const frontendDir = path.join(__dirname, '../../frontend/public/File', parentCategoryName, subfolderName);
      if (!fs.existsSync(frontendDir)) {
        fs.mkdirSync(frontendDir, { recursive: true });
      }

      // Backup path di backend/uploads/[Kategori Induk]/[Nama Arsip]
      const backendDir = path.join(__dirname, '../uploads', parentCategoryName, subfolderName);
      if (!fs.existsSync(backendDir)) {
        fs.mkdirSync(backendDir, { recursive: true });
      }

      cb(null, frontendDir);
    } catch (err) {
      console.error('Error menentukan folder penyimpanan:', err);
      const fallbackDir = path.join(__dirname, '../../frontend/public/File');
      if (!fs.existsSync(fallbackDir)) {
        fs.mkdirSync(fallbackDir, { recursive: true });
      }
      cb(null, fallbackDir);
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    let inputName = req.body?.nama_dokumen ? req.body.nama_dokumen.trim() : path.basename(file.originalname, ext);
    let cleanName = inputName.replace(/[\/\\:\*\?"<>\|]/g, '_');

    if (!cleanName.toLowerCase().endsWith(ext.toLowerCase())) {
      cleanName = `${cleanName}${ext}`;
    }

    cb(null, cleanName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.xlsx', '.xls', '.xlsm', '.csv', '.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung! Hanya diperbolehkan Excel (.xlsx/.xlsm), PDF, Word, dan Gambar.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

module.exports = upload;
