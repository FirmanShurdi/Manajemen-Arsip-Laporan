const { DataTypes } = require("sequelize");
const { db } = require("../config/db");
const arsip = require("./arsipModel");
const users = require("./userModel");

const dokumen = db.define("dokumen", {
    id_dokumen: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_arsip: {
        type: DataTypes.INTEGER,
        references: {
            model: arsip,
            key: "id_arsip"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
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
    nama_dokumen: DataTypes.STRING(255),
    terbit: DataTypes.DATEONLY,
    tipe_file: DataTypes.STRING(20),
    ukuran_file: DataTypes.STRING(50),
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = dokumen;
