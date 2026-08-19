const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const kategoriArsip = db.define("kategori_arsip", {
    id_kategori: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama_kategori: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    deskripsi: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = kategoriArsip;
