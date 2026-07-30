const { DataTypes } = require("sequelize")
const { db } = require("../config/db")
const role = require("./roleModel")

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
    nama_lengkap: DataTypes.STRING(100),
    email: DataTypes.STRING(100),
    password: DataTypes.STRING(255),
    jabatan: DataTypes.STRING(100),
    nomor_telpon: DataTypes.STRING(20),
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    freezeTableName: true,
    timestamps: false
})

module.exports = users
