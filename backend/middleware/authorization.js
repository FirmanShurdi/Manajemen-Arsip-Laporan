const { Op } = require("sequelize")
const users = require("../model/userModel")
const role = require("../model/roleModel")

// Hanya superuser yang boleh akses
const adminAuth = async (req, res, next) => {
    try {
        let id = req.user.id
        let data = await users.findOne({
            where: { id_user: id },
            include: [{
                model: role,
                where: { nama: "superuser" },
                required: true
            }]
        })

        if (!data) return res.status(401).json({ msg: "Anda tidak memiliki akses" })

        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "terjadi kesalahan pada middleware" })
    }
}

// Koordinator atau superuser yang boleh akses
const semiAdminAuth = async (req, res, next) => {
    try {
        let id = req.user.id
        let data = await users.findOne({
            where: { id_user: id },
            include: [{
                model: role,
                where: {
                    nama: { [Op.in]: ["koordinator", "superuser"] }
                },
                required: true
            }]
        })

        if (!data) return res.status(401).json({ msg: "Anda tidak memiliki akses" })

        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "terjadi kesalahan pada middleware" })
    }
}

// User hanya bisa akses datanya sendiri, kecuali superuser
const userAuth = async (req, res, next) => {
    try {
        let id = req.params.id
        let data = await users.findOne({
            where: { id_user: req.user.id },
            include: [{ model: role }]
        })

        if (!data) return res.status(401).json({ msg: "User tidak ditemukan" })

        const namaRole = data.role?.nama || ""

        if (data.id_user != id && namaRole !== "superuser") {
            return res.status(401).json({ msg: "Anda tidak memiliki akses" })
        }

        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "terjadi kesalahan pada middleware" })
    }
}

module.exports = { adminAuth, semiAdminAuth, userAuth }