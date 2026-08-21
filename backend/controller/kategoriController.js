const { arsip, kategoriArsip, dokumen } = require('../model/association');
const { ensureFolderExists, renameFolderSync, removeFolderSync } = require('../helpers/otomasiFolder');

const getAllKategori = async (req, res) => {
  try {
    const rawDatas = await arsip.findAll({
      include: [
        {
          model: kategoriArsip,
          as: 'kategori_arsip',
          attributes: ['id_kategori', 'nama_kategori', 'deskripsi']
        }
      ],
      order: [['id_arsip', 'ASC']]
    });

    const datas = rawDatas.map(item => {
      const json = item.toJSON();
      const parentCatObj = json.kategori_arsip || {};
      const parentCatName = parentCatObj.nama_kategori || json.kategori_dokumen?.nama_kategori || 'Umum';
      const parentCatId = json.id_kategori || parentCatObj.id_kategori || 1;
      const catDesk = parentCatObj.deskripsi;
      return {
        ...json,
        id_arsip: json.id_arsip,
        id_kategori: parentCatId,
        nama_kategori: json.nama_arsip,
        deskripsi: json.deskripsi || catDesk || '-',
        kategori_arsip: parentCatName,
        kategori_arsip_obj: parentCatObj,
        kategori_dokumen: parentCatName
      };
    });

    res.status(200).json({ success: true, datas });
  } catch (error) {
    console.error('Error in getAllKategori:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getKategoriById = async (req, res) => {
  try {
    const rawData = await arsip.findByPk(req.params.id, {
      include: [
        {
          model: kategoriArsip,
          as: 'kategori_arsip',
          attributes: ['id_kategori', 'nama_kategori', 'deskripsi']
        }
      ]
    });

    if (!rawData) {
      return res.status(404).json({ success: false, message: 'Arsip / Kategori tidak ditemukan' });
    }

    const json = rawData.toJSON();
    const catName = json.kategori_arsip?.nama_kategori || json.kategori_dokumen?.nama_kategori || 'Umum';
    const catDesk = json.kategori_arsip?.deskripsi;
    const data = {
      ...json,
      id_kategori: json.id_arsip,
      nama_kategori: json.nama_arsip,
      deskripsi: json.deskripsi || catDesk || '-',
      kategori_arsip: catName,
      kategori_dokumen: catName
    };

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error in getKategoriById:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createKategori = async (req, res) => {
  try {
    const { id_kategori, nama_arsip, nama_kategori, deskripsi, warna } = req.body;
    const foto = req.file ? `/uploads/${req.file.filename}` : null;
    const id_users = req.user?.id || req.user?.id_user || 1;

    let finalDeskripsi = deskripsi;
    let parentCatName = 'Umum';
    if (id_kategori) {
      const parentCat = await kategoriArsip.findByPk(id_kategori);
      if (parentCat) {
        if (!finalDeskripsi && parentCat.deskripsi) finalDeskripsi = parentCat.deskripsi;
        if (parentCat.nama_kategori) parentCatName = parentCat.nama_kategori;
      }
    }

    const data = await arsip.create({
      id_kategori: id_kategori || 1,
      id_users,
      nama_arsip: nama_arsip || nama_kategori || 'Arsip Baru',
      warna: warna || '#3B82F6',
      deskripsi: finalDeskripsi,
      foto
    });

    // Otomatis buat folder sub-arsip di disk
    ensureFolderExists(parentCatName, data.nama_arsip);

    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error in createKategori:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateKategori = async (req, res) => {
  try {
    const { id_kategori, nama_arsip, nama_kategori, deskripsi, warna } = req.body;
    const data = await arsip.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: 'Arsip / Kategori tidak ditemukan' });
    }

    const oldArsipName = data.nama_arsip;
    const parentCat = await kategoriArsip.findByPk(data.id_kategori);
    const parentCatName = parentCat ? parentCat.nama_kategori : 'Umum';

    const updatedData = {
      id_kategori: id_kategori || data.id_kategori,
      nama_arsip: nama_arsip || nama_kategori || data.nama_arsip,
      warna: warna || data.warna || '#3B82F6',
      deskripsi: deskripsi !== undefined ? deskripsi : data.deskripsi
    };
    if (req.file) {
      updatedData.foto = `/uploads/${req.file.filename}`;
    }

    await data.update(updatedData);

    // Otomatis ubah nama sub-folder jika nama arsip berubah
    if (updatedData.nama_arsip && updatedData.nama_arsip !== oldArsipName) {
      renameFolderSync(parentCatName, oldArsipName, parentCatName, updatedData.nama_arsip);
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error in updateKategori:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteKategori = async (req, res) => {
  try {
    const data = await arsip.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: 'Arsip / Kategori tidak ditemukan' });
    }

    // Cek ringan & presisi: apakah ada dokumen yang sedang terhubung
    const hasDoc = await dokumen.findOne({ where: { id_arsip: req.params.id }, attributes: ['id_dokumen'] });
    if (hasDoc) {
      return res.status(400).json({
        success: false,
        message: 'Data tidak dapat dihapus karena terhubung dengan data lainnya'
      });
    }

    const parentCat = await kategoriArsip.findByPk(data.id_kategori);
    const parentCatName = parentCat ? parentCat.nama_kategori : 'Umum';
    const arsipName = data.nama_arsip;

    await data.destroy();

    // Otomatis bersihkan sub-folder dari disk
    removeFolderSync(parentCatName, arsipName);

    res.status(200).json({ success: true, message: 'Arsip / Kategori berhasil dihapus' });
  } catch (error) {
    console.error('Error in deleteKategori:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllKategoriInduk = async (req, res) => {
  try {
    const rawDatas = await kategoriArsip.findAll({
      include: [
        {
          model: arsip,
          attributes: ['deskripsi']
        }
      ],
      order: [['id_kategori', 'ASC']]
    });

    const datas = rawDatas.map(item => {
      const json = item.toJSON();
      const firstArsipDesk = json.arsips && json.arsips.length > 0 ? json.arsips.find(a => a.deskripsi)?.deskripsi : null;
      return {
        ...json,
        deskripsi: json.deskripsi || firstArsipDesk || '-'
      };
    });

    res.status(200).json({ success: true, datas });
  } catch (error) {
    console.error('Error in getAllKategoriInduk:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createKategoriInduk = async (req, res) => {
  try {
    const { nama_kategori, deskripsi } = req.body;
    const data = await kategoriArsip.create({
      nama_kategori,
      deskripsi
    });

    // Otomatis buat folder kategori induk di disk
    ensureFolderExists(nama_kategori, '');

    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error in createKategoriInduk:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateKategoriInduk = async (req, res) => {
  try {
    const { nama_kategori, deskripsi } = req.body;
    const data = await kategoriArsip.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: 'Kategori Induk tidak ditemukan' });
    }

    const oldName = data.nama_kategori;
    await data.update({
      nama_kategori: nama_kategori || data.nama_kategori,
      deskripsi: deskripsi !== undefined ? deskripsi : data.deskripsi
    });

    // Otomatis ubah nama folder kategori induk jika berubah
    if (nama_kategori && nama_kategori !== oldName) {
      renameFolderSync(oldName, '', nama_kategori, '');
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error in updateKategoriInduk:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteKategoriInduk = async (req, res) => {
  try {
    const data = await kategoriArsip.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: 'Kategori Induk tidak ditemukan' });
    }

    // Cek ringan & presisi: apakah ada sub-arsip yang terhubung
    const hasSubArsip = await arsip.findOne({ where: { id_kategori: req.params.id }, attributes: ['id_arsip'] });
    if (hasSubArsip) {
      return res.status(400).json({
        success: false,
        message: 'Data tidak dapat dihapus karena terhubung dengan data lainnya'
      });
    }

    const targetName = data.nama_kategori;
    await data.destroy();

    // Otomatis bersihkan folder kategori induk dari disk
    removeFolderSync(targetName, '');

    res.status(200).json({ success: true, message: 'Kategori Induk berhasil dihapus' });
  } catch (error) {
    console.error('Error in deleteKategoriInduk:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTotalKategori = async (req, res) => {
  try {
    const datas = await arsip.count();
    res.status(200).json({ success: true, datas });
  } catch (error) {
    console.error('Error in getTotalKategori:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllKategori,
  getKategoriById,
  createKategori,
  updateKategori,
  deleteKategori,
  getAllKategoriInduk,
  createKategoriInduk,
  updateKategoriInduk,
  deleteKategoriInduk,
  getTotalKategori
};
