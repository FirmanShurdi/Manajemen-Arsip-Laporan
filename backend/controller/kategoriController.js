const { arsip, kategoriArsip } = require('../model/association');

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
      const catName = json.kategori_arsip?.nama_kategori || json.kategori_dokumen?.nama_kategori || 'Umum';
      const catDesk = json.kategori_arsip?.deskripsi;
      return {
        ...json,
        id_kategori: json.id_arsip,
        nama_kategori: json.nama_arsip,
        deskripsi: json.deskripsi || catDesk || '-',
        kategori_arsip: catName,
        kategori_dokumen: catName
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
    const { id_kategori, nama_arsip, nama_kategori, deskripsi } = req.body;
    const foto = req.file ? `/uploads/${req.file.filename}` : null;
    const id_users = req.user?.id || req.user?.id_user || 1;

    // If deskripsi not provided, try to fetch from selected kategoriArsip
    let finalDeskripsi = deskripsi;
    if (!finalDeskripsi && id_kategori) {
      const parentCat = await kategoriArsip.findByPk(id_kategori);
      if (parentCat && parentCat.deskripsi) {
        finalDeskripsi = parentCat.deskripsi;
      }
    }

    const data = await arsip.create({
      id_kategori: id_kategori || 1,
      id_users,
      nama_arsip: nama_arsip || nama_kategori || 'Arsip Baru',
      deskripsi: finalDeskripsi,
      foto
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error in createKategori:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateKategori = async (req, res) => {
  try {
    const { id_kategori, nama_arsip, nama_kategori, deskripsi } = req.body;
    const data = await arsip.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: 'Arsip / Kategori tidak ditemukan' });
    }

    const updatedData = {
      id_kategori: id_kategori || data.id_kategori,
      nama_arsip: nama_arsip || nama_kategori || data.nama_arsip,
      deskripsi: deskripsi !== undefined ? deskripsi : data.deskripsi
    };
    if (req.file) {
      updatedData.foto = `/uploads/${req.file.filename}`;
    }

    await data.update(updatedData);
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
    await data.destroy();
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
    await data.update({
      nama_kategori: nama_kategori || data.nama_kategori,
      deskripsi: deskripsi !== undefined ? deskripsi : data.deskripsi
    });
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
    await data.destroy();
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
