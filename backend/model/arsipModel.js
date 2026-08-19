const { DataTypes } = require("sequelize");
const { db } = require("../config/db");
const kategoriArsip = require("./kategoriArsipModel");
const users = require("./userModel");

const arsip = db.define("arsip", {
    id_arsip: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_kategori: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: kategoriArsip,
            key: "id_kategori"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    },
    id_users: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: users,
            key: "id_user"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    },
    nama_arsip: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    deskripsi: DataTypes.TEXT,
    foto: DataTypes.STRING(255),
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = arsip;
