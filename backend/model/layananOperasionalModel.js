const { DataTypes } = require("sequelize")
const { db } = require("../config/db")
const users = require("./userModel")

const layananOperasional = db.define("layanan_operasional", {
    id_layanan: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_users: {
        type: DataTypes.INTEGER,
        references: {
            model: users,
            key: "id_user"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    },
    nama_layanan: DataTypes.STRING(150),
    deskripsi: DataTypes.TEXT,
    foto_layanan: DataTypes.STRING(255),
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    freezeTableName: true,
    timestamps: false
})

module.exports = layananOperasional
