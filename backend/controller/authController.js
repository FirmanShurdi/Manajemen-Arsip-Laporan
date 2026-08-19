const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifySync } = require('otplib');
const { users, role } = require('../model/association');

const salt = 10;
const getSecret = () => process.env.AUTHENTICATOR_SECRET || 'JBSWY3DPEHPK3PXPNZAC2Z3FAAAA2345';

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ msg: 'Username dan password wajib diisi' });
    }

    const user = await users.findOne({
      where: {
        [Op.or]: [
          { username: username },
          { nama_lengkap: username }
        ]
      },
      include: [{ model: role, attributes: ['id_role', 'nama', 'tipe_role'] }]
    });

    if (!user) {
      return res.status(401).json({ msg: 'Akun / Username tidak ditemukan' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ msg: 'Password tidak sesuai' });
    }

    const roleId = user.id_role || user.role?.id_role || 3;
    const roleName = user.role?.nama || (roleId === 1 ? 'Super Admin' : roleId === 2 ? 'Koordinator' : 'Pegawai');
    const tipeRole = user.role?.tipe_role || (roleId === 1 || roleId === 2 ? 'admin' : 'pegawai');

    const token = jwt.sign(
      {
        id: user.id_user,
        id_role: roleId,
        role: roleName,
        tipe_role: tipeRole,
        username: user.username,
        nama_lengkap: user.nama_lengkap,
        jabatan: user.jabatan,
        wilayah_kerja: user.wilayah_kerja
      },
      process.env.JWT_SECRET || 'arsip_digital_secret_key_2026',
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      msg: 'Berhasil login',
      token,
      user: {
        id_user: user.id_user,
        id_role: roleId,
        role: roleName,
        tipe_role: tipeRole,
        username: user.username,
        nama_lengkap: user.nama_lengkap,
        jabatan: user.jabatan,
        wilayah_kerja: user.wilayah_kerja,
        foto: user.foto,
        nomor_telpon: user.nomor_telpon
      }
    });
  } catch (error) {
    console.error('Error on login:', error);
    return res.status(500).json({ msg: 'Terjadi kesalahan server pada fungsi login: ' + error.message });
  }
};

// POST /api/auth/verify-code (Verifikasi 6-Digit Code sebelum Pilihan Role)
const verifyCode = async (req, res) => {
  try {
    const { auth_code } = req.body;
    const cleanAuthCode = String(auth_code || '').trim();

    if (!/^\d{6}$/.test(cleanAuthCode)) {
      return res.status(400).json({ 
        success: false,
        msg: 'Kode Verifikasi Authenticator wajib berupa 6 angka (0-9).' 
      });
    }

    let isTotpValid = false;
    const currentSecret = getSecret();

    try {
      const result = verifySync({ 
        token: cleanAuthCode, 
        secret: currentSecret,
        window: [2, 2]
      });
      isTotpValid = !!result?.valid;
    } catch (err) {
      console.error('Error pada verifikasi TOTP Google Authenticator:', err);
      isTotpValid = false;
    }

    if (!isTotpValid) {
      return res.status(400).json({ 
        success: false,
        msg: 'Kode Verifikasi Google Authenticator tidak valid atau telah kadaluarsa. Pastikan memasukkan 6-digit kode terbaru dari aplikasi Google Authenticator Anda.' 
      });
    }

    return res.status(200).json({
      success: true,
      msg: 'Kode Verifikasi berhasil diverifikasi! Silakan pilih Role Akun Anda.'
    });
  } catch (error) {
    console.error('Error on verifyCode:', error);
    return res.status(500).json({ success: false, msg: 'Terjadi kesalahan server: ' + error.message });
  }
};

// POST /api/auth/register (Strict Security & Google Authenticator TOTP with Role Assignment)
const register = async (req, res) => {
  try {
    const { username, nama_lengkap, jabatan, wilayah_kerja, nomor_telpon, password, id_role, auth_code } = req.body;

    if (!username || !password) {
      return res.status(400).json({ msg: 'Username dan password wajib diisi' });
    }

    const cleanAuthCode = String(auth_code || '').trim();

    if (!/^\d{6}$/.test(cleanAuthCode)) {
      return res.status(400).json({ 
        msg: 'Kode Verifikasi Authenticator wajib berupa 6 angka (0-9) dari aplikasi Google Authenticator.' 
      });
    }

    let isTotpValid = false;
    const currentSecret = getSecret();

    try {
      const result = verifySync({ 
        token: cleanAuthCode, 
        secret: currentSecret,
        window: [2, 2]
      });
      isTotpValid = !!result?.valid;
    } catch (err) {
      console.error('Error pada verifikasi TOTP Google Authenticator:', err);
      isTotpValid = false;
    }

    if (!isTotpValid) {
      return res.status(400).json({ 
        msg: 'Kode Verifikasi Google Authenticator tidak valid atau telah kadaluarsa.' 
      });
    }

    const existing = await users.findOne({
      where: {
        [Op.or]: [
          { username: username },
          { nama_lengkap: username }
        ]
      }
    });
    if (existing) {
      return res.status(400).json({ msg: 'Username / Nama sudah digunakan' });
    }

    const hashedPassword = await bcrypt.hash(password, salt);
    const assignedRoleId = Number(id_role || 3); // default pegawai (id3)

    const newUser = await users.create({
      username: username,
      nama_lengkap: nama_lengkap || username,
      jabatan: jabatan || 'Pegawai',
      wilayah_kerja: wilayah_kerja || null,
      nomor_telpon: nomor_telpon || null,
      password: hashedPassword,
      id_role: assignedRoleId,
      created_at: new Date()
    });

    return res.status(201).json({
      msg: 'Registrasi berhasil. Silakan login.',
      user: {
        id_user: newUser.id_user,
        username: newUser.username,
        nama_lengkap: newUser.nama_lengkap,
        id_role: newUser.id_role
      }
    });
  } catch (error) {
    console.error('Error on register:', error);
    return res.status(500).json({ msg: 'Terjadi kesalahan server pada fungsi register: ' + error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await users.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: role, attributes: ['id_role', 'nama', 'tipe_role'] }]
    });

    if (!user) {
      return res.status(404).json({ msg: 'User tidak ditemukan' });
    }

    return res.status(200).json({ msg: 'Berhasil mengambil data user', user });
  } catch (error) {
    console.error('Error on getMe:', error);
    return res.status(500).json({ msg: 'Terjadi kesalahan server: ' + error.message });
  }
};

module.exports = { login, verifyCode, register, getMe };
