const express = require('express');
const router = express.Router();
const { getAllLayanan, getLayananById, createLayanan, updateLayanan, deleteLayanan } = require('../controller/layananController');
const verifyToken = require('../middleware/jwt');
const { adminAuth } = require('../middleware/authorization');
const uploadPdf = require('../middleware/upload'); // Gunakan multer untuk upload foto/layanan jika ada

router.use(verifyToken);

router.get('/', getAllLayanan);
router.get('/:id', getLayananById);
router.post('/', adminAuth, uploadPdf.single('foto_layanan'), createLayanan);
router.put('/:id', adminAuth, uploadPdf.single('foto_layanan'), updateLayanan);
router.delete('/:id', adminAuth, deleteLayanan);

module.exports = router;
