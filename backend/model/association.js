const role = require("./roleModel");
const users = require("./userModel");
const kategoriArsip = require("./kategoriArsipModel");
const kategoriDokumen = require("./kategoriDokumenModel");
const arsip = require("./arsipModel");
const dokumen = require("./dokumenModel");
const logAktivitas = require("./logAktivitasModel");

// Relasi Role <-> Users
role.hasMany(users, { foreignKey: "id_role", onDelete: "SET NULL", onUpdate: "CASCADE" });
users.belongsTo(role, { foreignKey: "id_role", onDelete: "SET NULL", onUpdate: "CASCADE" });

// Relasi Kategori Arsip <-> Arsip
kategoriArsip.hasMany(arsip, { foreignKey: "id_kategori", onDelete: "CASCADE", onUpdate: "CASCADE" });
arsip.belongsTo(kategoriArsip, { foreignKey: "id_kategori", as: "kategori_arsip", onDelete: "CASCADE", onUpdate: "CASCADE" });
arsip.belongsTo(kategoriArsip, { foreignKey: "id_kategori", as: "kategori_dokumen", onDelete: "CASCADE", onUpdate: "CASCADE" });

// Relasi Users <-> Arsip
users.hasMany(arsip, { foreignKey: "id_users", onDelete: "CASCADE", onUpdate: "CASCADE" });
arsip.belongsTo(users, { foreignKey: "id_users", onDelete: "CASCADE", onUpdate: "CASCADE" });

// Relasi Arsip <-> Dokumen
arsip.hasMany(dokumen, { foreignKey: "id_arsip", onDelete: "CASCADE", onUpdate: "CASCADE" });
dokumen.belongsTo(arsip, { foreignKey: "id_arsip", as: "arsip", onDelete: "CASCADE", onUpdate: "CASCADE" });
dokumen.belongsTo(arsip, { foreignKey: "id_arsip", as: "kategori_dokumen", onDelete: "CASCADE", onUpdate: "CASCADE" }); // backward compatibility alias

// Relasi Users <-> Dokumen
users.hasMany(dokumen, { foreignKey: "id_users", onDelete: "CASCADE", onUpdate: "CASCADE" });
dokumen.belongsTo(users, { foreignKey: "id_users", onDelete: "CASCADE", onUpdate: "CASCADE" });

// Relasi Users <-> Log Aktivitas
users.hasMany(logAktivitas, { foreignKey: "id_users", onDelete: "SET NULL", onUpdate: "CASCADE" });
logAktivitas.belongsTo(users, { foreignKey: "id_users", onDelete: "SET NULL", onUpdate: "CASCADE" });

module.exports = {
    role,
    users,
    kategoriArsip,
    kategoriDokumen,
    arsip,
    dokumen,
    logAktivitas
};
