const { DataTypes } = require("sequelize")
const { db } = require("../config/db")
const users = require("./userModel")

const logAktivitas = db.define("log_aktivitas", {
    id_log: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    id_users: {
        type: DataTypes.INTEGER,
        references: {
            model: users,
            key: "id_user"
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    },
    nama: DataTypes.STRING(100),
    role: DataTypes.STRING(50),
    aksi: DataTypes.STRING(50),
    deskripsi: DataTypes.TEXT,
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    freezeTableName: true,
    timestamps: false
})

module.exports = logAktivitas
