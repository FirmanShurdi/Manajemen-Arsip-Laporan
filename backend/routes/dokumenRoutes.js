const express = require('express');
const router = express.Router();
const { 
  uploadDokumen, 
  getAllDokumen, 
  getDokumenById, 
  updateDokumen, 
  deleteDokumen,
  getTotalDokumen,
  getTotalDokumenToday,
  getDokumenPerBulan,
  getDokumenTotalKategori 
} = require('../controller/dokumenController');
const verifyToken = require('../middleware/jwt');
const { userAuth, adminAuth } = require('../middleware/authorization');
const upload = require('../middleware/upload');

router.use(verifyToken);

router.get('/total', userAuth, getTotalDokumen);
router.get('/total-today', userAuth, getTotalDokumenToday);
router.get('/total-month', userAuth, getDokumenPerBulan);
router.get('/total-kategori', userAuth, getDokumenTotalKategori);

router.get('/', userAuth, getAllDokumen);
router.get('/:id', userAuth, getDokumenById);

const handleFileUpload = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'Ukuran file terlalu besar! Maksimal 20 MB.', msg: 'Ukuran file terlalu besar! Maksimal 20 MB.' });
      }
      return res.status(400).json({ success: false, message: err.message, msg: err.message });
    }
    if (req.files && req.files.length > 0) {
      req.file = req.files[0];
    }
    next();
  });
};

router.post('/upload', userAuth, handleFileUpload, uploadDokumen);
router.post('/', userAuth, handleFileUpload, uploadDokumen);
router.put('/:id', userAuth, handleFileUpload, updateDokumen);
router.post('/:id', userAuth, handleFileUpload, updateDokumen);

router.delete('/:id', adminAuth, deleteDokumen);

module.exports = router;
