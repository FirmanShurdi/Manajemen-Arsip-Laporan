const { logAktivitas, users } = require('../model/association');

const getAllLogs = async (req, res) => {
  try {
    const datas = await logAktivitas.findAll({
      include: [{ model: users, attributes: ['id_user', 'username', 'nama_lengkap'] }],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json({ success: true, datas });
  } catch (error) {
    console.error('Error in getAllLogs:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllLogs };
