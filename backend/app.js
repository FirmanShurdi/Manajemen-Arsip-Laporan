const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { db, configDb } = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');
const dokumenRoutes = require('./routes/dokumenRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const logRoutes = require('./routes/logRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Uploads (Backend Uploads & Frontend Public File Direct Compatibility)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/File', express.static(path.join(__dirname, '../frontend/public/File')));

// Mount routes (Direct & /api compatibility matching Clearance style)
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);

app.use('/kategori-dokumen', kategoriRoutes);
app.use('/api/kategori-dokumen', kategoriRoutes);

app.use('/kategori', kategoriRoutes);
app.use('/api/kategori', kategoriRoutes);

app.use('/kategori-arsip', kategoriRoutes);
app.use('/api/kategori-arsip', kategoriRoutes);

app.use('/dokumen', dokumenRoutes);
app.use('/api/dokumen', dokumenRoutes);

app.use('/users', userRoutes);
app.use('/api/users', userRoutes);

app.use('/role', roleRoutes);
app.use('/api/role', roleRoutes);

app.use('/log-aktivitas', logRoutes);
app.use('/api/log-aktivitas', logRoutes);

// Test DB Connection
configDb();

// Base Route Test
app.get('/', (req, res) => {
  res.json({ message: 'API Manajemen Arsip Digital Running Successfully' });
});

module.exports = app;
