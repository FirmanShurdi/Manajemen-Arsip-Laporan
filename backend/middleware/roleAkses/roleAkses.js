require('dotenv').config();
const { db } = require('../../config/db');

/**
 * Utility script & modul sinkronisasi kolom tipe_role pada tabel role
 * Memastikan skema database db_arsip_digital mendukung hak akses dinamis (admin vs pegawai)
 */
async function syncRoleAkses() {
  try {
    console.log('Menyinkronkan skema tabel role (kolom tipe_role)...');
    
    const [columns] = await db.query("SHOW COLUMNS FROM role LIKE 'tipe_role'");
    if (columns.length === 0) {
      await db.query("ALTER TABLE role ADD COLUMN tipe_role ENUM('admin', 'pegawai') NOT NULL DEFAULT 'pegawai' AFTER nama");
      console.log('Berhasil menambahkan kolom tipe_role pada tabel role.');
    } else {
      console.log('Kolom tipe_role sudah tersedia pada tabel role.');
    }

    await db.query("UPDATE role SET tipe_role = 'admin' WHERE id_role IN (1, 2)");
    await db.query("UPDATE role SET tipe_role = 'pegawai' WHERE id_role NOT IN (1, 2)");

    const [roles] = await db.query("SELECT * FROM role");
    console.log('Status Data Role Terkini:', roles);

    console.log('Sinkronisasi hak akses role berhasil diselesaikan.');
    return true;
  } catch (err) {
    console.error('Gagal menyinkronkan hak akses role:', err);
    return false;
  }
}

module.exports = syncRoleAkses;

// Jalankan langsung jika dipanggil dari CLI node: node backend/middleware/roleAkses/roleAkses.js
if (require.main === module) {
  syncRoleAkses()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
