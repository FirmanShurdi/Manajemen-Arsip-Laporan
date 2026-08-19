const { users, role } = require("../model/association");

const adminAuth = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.id_user;
    if (!userId) return res.status(401).json({ success: false, message: "Sesi tidak valid! Silakan login ulang.", msg: "Sesi tidak valid" });

    const user = await users.findByPk(userId, {
      include: [{ model: role, attributes: ['id_role', 'nama', 'tipe_role'] }]
    });

    const isSuperAdmin = Number(user?.id_role || req.user.id_role) === 1;

    if (!user || !isSuperAdmin) {
      return res.status(403).json({ success: false, message: "Akses ditolak: Akses ini khusus untuk Superadmin.", msg: "Akses ditolak: Hanya untuk Superadmin" });
    }

    next();
  } catch (error) {
    console.error("Error pada adminAuth middleware:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada middleware otorisasi", msg: "Terjadi kesalahan pada middleware otorisasi" });
  }
};

const semiAdminAuth = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.id_user;
    if (!userId) return res.status(401).json({ success: false, message: "Sesi tidak valid! Silakan login ulang.", msg: "Sesi tidak valid" });

    const user = await users.findByPk(userId, {
      include: [{ model: role, attributes: ['id_role', 'nama', 'tipe_role'] }]
    });

    const roleId = user?.id_role || req.user.id_role;
    const tipeRole = user?.role?.tipe_role || req.user?.tipe_role;

    // Boleh diakses jika tipe_role === 'admin' ATAU id_role 1 & 2 (Superadmin & Koordinator)
    const hasAdminAccess = tipeRole === 'admin' || [1, 2].includes(Number(roleId));

    if (!user || !hasAdminAccess) {
      return res.status(403).json({ success: false, message: "Akses ditolak: Membutuhkan akses Admin / Koordinator.", msg: "Akses ditolak: Membutuhkan akses Admin / Koordinator" });
    }

    next();
  } catch (error) {
    console.error("Error pada semiAdminAuth middleware:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada middleware otorisasi", msg: "Terjadi kesalahan pada middleware otorisasi" });
  }
};

const userAuth = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.id_user;
    if (!userId) return res.status(401).json({ success: false, message: "Sesi tidak valid! Silakan login kembali.", msg: "Sesi tidak valid" });

    next();
  } catch (error) {
    console.error("Error pada userAuth middleware:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada middleware otorisasi", msg: "Terjadi kesalahan pada middleware otorisasi" });
  }
};

module.exports = { 
  adminAuth, 
  superAdminAuth: adminAuth, 
  semiAdminAuth, 
  userAuth 
};