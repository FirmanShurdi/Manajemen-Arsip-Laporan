const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ success: false, message: "Sesi Login tidak ditemukan! Silakan login terlebih dahulu.", msg: "tidak ada akses" });

    jwt.verify(token, process.env.JWT_SECRET || 'arsip_digital_secret_key_2026', (err, decoded) => {
      if (err) return res.status(401).json({ success: false, message: "Sesi Login telah berakhir. Silakan login kembali!", msg: "Sesi Login sudah berakhir!" });
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Error pada verifyToken:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan sistem pada verifikasi autentikasi.", msg: "Terjadi kesalahan pada fungsi jwt" });
  }
};

module.exports = verifyToken;