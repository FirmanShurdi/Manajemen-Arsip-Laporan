const express = require('express');
const router = express.Router();
const { getAllRoles, createRole } = require('../controller/roleController');
const verifyToken = require('../middleware/jwt');
const { superAdminAuth } = require('../middleware/authorization');

router.use(verifyToken);

router.get('/', getAllRoles);
router.post('/', superAdminAuth, createRole);

module.exports = router;
