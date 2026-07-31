const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controller/authController');
const verifyToken = require('../middleware/jwt');

router.post('/login', login);
router.get('/me', verifyToken, getMe);

module.exports = router;
