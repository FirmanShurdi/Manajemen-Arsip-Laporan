const express = require('express');
const router = express.Router();
const { uploadDokumen, getAllDokumen, getDokumenById, deleteDokumen } = require('../controller/dokumenController');
const verifyToken = require('../middleware/jwt');
const { userAuth, adminAuth } = require('../middleware/authorization');
const uploadPdf = require('../middleware/upload');

router.use(verifyToken);

router.get('/', userAuth, getAllDokumen);
router.get('/:id', userAuth, getDokumenById);
router.post('/upload', userAuth, (req, res, next) => {
  uploadPdf.single('file_pdf')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ msg: 'Ukuran file terlalu besar! Maksimal ukuran file PDF adalah 200 KB.' });
      }
      return res.status(400).json({ msg: err.message });
    }
    next();
  });
}, uploadDokumen);
router.delete('/:id', adminAuth, deleteDokumen);

module.exports = router;
