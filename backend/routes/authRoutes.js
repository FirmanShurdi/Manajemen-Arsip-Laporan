const express = require('express');
const router = express.Router();
const { login, verifyCode, register, getMe } = require('../controller/authController');
const verifyToken = require('../middleware/jwt');

router.post('/login', login);
router.post('/verify-code', verifyCode);
router.post('/register', register);
router.get('/me', verifyToken, getMe);

module.exports = router;
