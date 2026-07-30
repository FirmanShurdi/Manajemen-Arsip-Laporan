const role = require("./roleModel");
const users = require("./userModel");
const layananOperasional = require("./layananOperasionalModel");
const dokumen = require("./dokumenModel");
const logAktivitas = require("./logAktivitasModel");

// Relasi Role <-> Users
role.hasMany(users, { foreignKey: "id_role", onDelete: "SET NULL", onUpdate: "CASCADE" });
users.belongsTo(role, { foreignKey: "id_role", onDelete: "SET NULL", onUpdate: "CASCADE" });

// Relasi Users <-> Layanan Operasional
users.hasMany(layananOperasional, { foreignKey: "id_users", onDelete: "CASCADE", onUpdate: "CASCADE" });
layananOperasional.belongsTo(users, { foreignKey: "id_users", onDelete: "CASCADE", onUpdate: "CASCADE" });

// Relasi Layanan Operasional <-> Dokumen
layananOperasional.hasMany(dokumen, { foreignKey: "id_layanan", onDelete: "CASCADE", onUpdate: "CASCADE" });
dokumen.belongsTo(layananOperasional, { foreignKey: "id_layanan", onDelete: "CASCADE", onUpdate: "CASCADE" });

// Relasi Users <-> Dokumen
users.hasMany(dokumen, { foreignKey: "id_users", onDelete: "CASCADE", onUpdate: "CASCADE" });
dokumen.belongsTo(users, { foreignKey: "id_users", onDelete: "CASCADE", onUpdate: "CASCADE" });

// Relasi Users <-> Log Aktivitas
users.hasMany(logAktivitas, { foreignKey: "id_users", onDelete: "SET NULL", onUpdate: "CASCADE" });
logAktivitas.belongsTo(users, { foreignKey: "id_users", onDelete: "SET NULL", onUpdate: "CASCADE" });

module.exports = {
    role,
    users,
    layananOperasional,
    dokumen,
    logAktivitas
};
