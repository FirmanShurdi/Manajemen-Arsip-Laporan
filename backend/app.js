const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test DB Connection
db.authenticate()
  .then(() => console.log('Database connected successfully...'))
  .catch((err) => console.error('Database connection error:', err));

// Base Route Test
app.get('/', (req, res) => {
  res.json({ message: 'API Manajemen Arsip Digital Running Successfully' });
});

module.exports = app;
