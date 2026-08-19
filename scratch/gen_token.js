require('dotenv').config();
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { id: 1, id_role: 1, role: 'Super Admin', tipe_role: 'admin', username: 'admin' },
  process.env.JWT_SECRET || 'arsip_digital_secret_key_2026',
  { expiresIn: '1h' }
);

console.log('Generated Admin Token:', token);
