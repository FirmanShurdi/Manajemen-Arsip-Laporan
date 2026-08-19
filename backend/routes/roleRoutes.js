const express = require('express');
const router = express.Router();
const { getAllRoles, createRole, updateRole, deleteRole } = require('../controller/roleController');
const verifyToken = require('../middleware/jwt');
const { semiAdminAuth } = require('../middleware/authorization');

router.use(verifyToken);

router.get('/', getAllRoles);
router.post('/', semiAdminAuth, createRole);
router.put('/:id', semiAdminAuth, updateRole);
router.delete('/:id', semiAdminAuth, deleteRole);

module.exports = router;
