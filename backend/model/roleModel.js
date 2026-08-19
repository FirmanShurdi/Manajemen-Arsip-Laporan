const { DataTypes } = require("sequelize")
const { db } = require("../config/db")

const role = db.define("role", {
    id_role: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama: DataTypes.STRING(50),
    tipe_role: {
        type: DataTypes.ENUM('admin', 'pegawai'),
        defaultValue: 'pegawai'
    }
}, {
    freezeTableName: true,
    timestamps: false
})

module.exports = role
