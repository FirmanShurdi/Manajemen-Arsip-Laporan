const fs = require('fs');
const path = require('path');

const UPLOADS_BASE = path.join(__dirname, '../uploads');

/**
 * Membersihkan nama folder dari karakter terlarang di Windows/Linux
 */
const sanitizeName = (name) => {
  if (!name) return 'Umum';
  return name.toString().trim().replace(/[\\/:*?"<>|]/g, '_');
};

/**
 * Memastikan folder kategori dan sub-arsip ada di backend/uploads/
 */
const ensureFolderExists = (parentCategory = 'Umum', subCategory = '') => {
  try {
    const parentSanitized = sanitizeName(parentCategory);
    const subSanitized = subCategory ? sanitizeName(subCategory) : '';
    const targetDir = path.join(UPLOADS_BASE, parentSanitized, subSanitized);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
  } catch (err) {
    console.error('[otomasiFolder] Gagal membuat folder:', err);
  }
};

/**
 * Mengubah nama folder di backend/uploads/ secara otomatis saat nama Kategori / Sub-Arsip diedit
 */
const renameFolderSync = (oldParent, oldSub = '', newParent, newSub = '') => {
  try {
    const oldP = sanitizeName(oldParent);
    const newP = sanitizeName(newParent);
    const oldS = oldSub ? sanitizeName(oldSub) : '';
    const newS = newSub ? sanitizeName(newSub) : '';

    if (oldS && newS && oldS !== newS) {
      // Rename sub-folder
      const oldSubPath = path.join(UPLOADS_BASE, oldP, oldS);
      const newSubPath = path.join(UPLOADS_BASE, oldP, newS);
      if (fs.existsSync(oldSubPath) && oldSubPath !== newSubPath) {
        fs.renameSync(oldSubPath, newSubPath);
      }
    } else if (oldP && newP && oldP !== newP && !oldS) {
      // Rename parent folder
      const oldParentPath = path.join(UPLOADS_BASE, oldP);
      const newParentPath = path.join(UPLOADS_BASE, newP);
      if (fs.existsSync(oldParentPath) && oldParentPath !== newParentPath) {
        fs.renameSync(oldParentPath, newParentPath);
      }
    }
  } catch (err) {
    console.error('[otomasiFolder] Gagal mengubah nama folder:', err);
  }
};

/**
 * Menghapus folder kosong dari backend/uploads/ saat Kategori / Sub-Arsip dihapus
 */
const removeFolderSync = (parentCategory = 'Umum', subCategory = '') => {
  try {
    const parentSanitized = sanitizeName(parentCategory);
    const subSanitized = subCategory ? sanitizeName(subCategory) : '';

    const targetDir = subSanitized
      ? path.join(UPLOADS_BASE, parentSanitized, subSanitized)
      : path.join(UPLOADS_BASE, parentSanitized);

    if (fs.existsSync(targetDir)) {
      const files = fs.readdirSync(targetDir);
      if (files.length === 0) {
        fs.rmdirSync(targetDir);
      }
    }
  } catch (err) {
    console.error('[otomasiFolder] Gagal menghapus folder:', err);
  }
};

/**
 * Menghapus berkas fisik dokumen dari backend/uploads/ saat dokumen dihapus dari sistem
 */
const deleteDocumentFile = (parentCategory = 'Umum', subCategory = 'Arsip', fileName = '') => {
  if (!fileName) return;
  try {
    const parentSanitized = sanitizeName(parentCategory);
    const subSanitized = sanitizeName(subCategory);
    const filePath = path.join(UPLOADS_BASE, parentSanitized, subSanitized, fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error('[otomasiFolder] Gagal menghapus berkas fisik dokumen:', err);
  }
};

module.exports = {
  sanitizeName,
  ensureFolderExists,
  renameFolderSync,
  removeFolderSync,
  deleteDocumentFile
};
