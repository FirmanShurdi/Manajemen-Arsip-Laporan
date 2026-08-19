const express = require('express');
const router = express.Router();
const kategoriController = require('../controller/kategoriController');
const verifyToken = require('../middleware/jwt');

router.get('/induk', kategoriController.getAllKategoriInduk);
router.post('/induk', verifyToken, kategoriController.createKategoriInduk);
router.put('/induk/:id', verifyToken, kategoriController.updateKategoriInduk);
router.delete('/induk/:id', verifyToken, kategoriController.deleteKategoriInduk);

router.get('/total', kategoriController.getTotalKategori);
router.get('/', kategoriController.getAllKategori);
router.get('/:id', kategoriController.getKategoriById);
router.post('/', verifyToken, kategoriController.createKategori);
router.put('/:id', verifyToken, kategoriController.updateKategori);
router.delete('/:id', verifyToken, kategoriController.deleteKategori);

module.exports = router;
