const express = require('express');
const router = express.Router();
const { getAllLogs } = require('../controller/logController');
const verifyToken = require('../middleware/jwt');
const { superAdminAuth } = require('../middleware/authorization');

router.use(verifyToken);
router.use(superAdminAuth);

router.get('/', getAllLogs);

module.exports = router;
