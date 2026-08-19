const { role } = require('../model/association');

const getAllRoles = async (req, res) => {
  try {
    const datas = await role.findAll();
    res.status(200).json({ success: true, datas });
  } catch (error) {
    console.error('Error in getAllRoles:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createRole = async (req, res) => {
  try {
    const { nama, tipe_role } = req.body;
    if (!nama) {
      return res.status(400).json({ success: false, message: 'Nama role wajib diisi' });
    }
    const data = await role.create({ 
      nama, 
      tipe_role: (tipe_role === 'admin' ? 'admin' : 'pegawai') 
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error in createRole:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, tipe_role } = req.body;
    const targetRole = await role.findByPk(id);
    if (!targetRole) {
      return res.status(404).json({ success: false, message: 'Role tidak ditemukan' });
    }
    await targetRole.update({
      nama: nama !== undefined ? nama : targetRole.nama,
      tipe_role: tipe_role !== undefined ? tipe_role : targetRole.tipe_role
    });
    res.status(200).json({ success: true, message: 'Role berhasil diperbarui', data: targetRole });
  } catch (error) {
    console.error('Error in updateRole:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    if ([1, 2, 3].includes(Number(id))) {
      return res.status(400).json({ success: false, message: 'Role utama (Super Admin, Koordinator, Pegawai) tidak dapat dihapus.' });
    }
    const targetRole = await role.findByPk(id);
    if (!targetRole) {
      return res.status(404).json({ success: false, message: 'Role tidak ditemukan' });
    }
    await targetRole.destroy();
    res.status(200).json({ success: true, message: 'Role berhasil dihapus' });
  } catch (error) {
    console.error('Error in deleteRole:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllRoles, createRole, updateRole, deleteRole };
