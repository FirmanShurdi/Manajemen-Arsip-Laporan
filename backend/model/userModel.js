const { DataTypes } = require("sequelize");
const { db } = require("../config/db");
const role = require("./roleModel");

const users = db.define("users", {
    id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_role: {
        type: DataTypes.INTEGER,
        references: {
            model: role,
            key: "id_role"
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
    },
    username: DataTypes.STRING(100),
    nama_lengkap: DataTypes.STRING(100),
    password: DataTypes.STRING(255),
    jabatan: DataTypes.STRING(100),
    wilayah_kerja: DataTypes.STRING(100),
    foto: DataTypes.STRING(250),
    nomor_telpon: DataTypes.STRING(20),
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = users;
