const bcrypt = require('bcrypt');
const { users, role } = require('../model/association');
const salt = 10;

const getAllUsers = async (req, res) => {
  try {
    const datas = await users.findAll({
      attributes: { exclude: ['password'] },
      include: [{ model: role, attributes: ['id_role', 'nama', 'tipe_role'] }]
    });
    res.status(200).json({ success: true, datas });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, nama_lengkap, password, jabatan, wilayah_kerja, nomor_telpon, id_role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan password wajib diisi' });
    }

    const hashedPassword = await bcrypt.hash(password, salt);
    const data = await users.create({
      username,
      nama_lengkap: nama_lengkap || username,
      password: hashedPassword,
      jabatan: jabatan || 'Pegawai',
      wilayah_kerja: wilayah_kerja || null,
      nomor_telpon: nomor_telpon || null,
      id_role: id_role || 3
    });

    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error in createUser:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, nama_lengkap, jabatan, wilayah_kerja, nomor_telpon, id_role, password } = req.body;
    const user = await users.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    const payload = {
      username: username || user.username,
      nama_lengkap: nama_lengkap || user.nama_lengkap,
      jabatan: jabatan || user.jabatan,
      wilayah_kerja: wilayah_kerja || user.wilayah_kerja,
      nomor_telpon: nomor_telpon || user.nomor_telpon,
      id_role: id_role || user.id_role
    };

    if (password) {
      payload.password = await bcrypt.hash(password, salt);
    }

    await user.update(payload);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error in updateUser:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await users.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }
    await user.destroy();
    res.status(200).json({ success: true, message: 'User berhasil dihapus' });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllUsers, createUser, updateUser, deleteUser };
