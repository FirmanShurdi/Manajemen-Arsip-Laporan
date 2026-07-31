const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, updateUser, deleteUser } = require('../controller/userController');
const verifyToken = require('../middleware/jwt');
const { superAdminAuth } = require('../middleware/authorization');

router.use(verifyToken);
router.use(superAdminAuth);

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
