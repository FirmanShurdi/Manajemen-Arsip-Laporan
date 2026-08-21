const { Op, Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
const { dokumen, arsip, kategoriArsip, users } = require('../model/association');
const { deleteDocumentFile } = require('../helpers/otomasiFolder');

// Helper: Standard Include untuk query Sequelize
const defaultInclude = [
  {
    model: arsip,
    as: 'arsip',
    attributes: ['id_arsip', 'nama_arsip', 'id_kategori'],
    include: [{ model: kategoriArsip, as: 'kategori_arsip', attributes: ['id_kategori', 'nama_kategori'] }]
  },
  { model: users, attributes: ['id_user', 'username', 'nama_lengkap'] }
];

// Helper: Format payload data dokumen agar konsisten di seluruh controller
const formatDokumenPayload = (item) => {
  if (!item) return null;
  const plain = typeof item.get === 'function' ? item.get({ plain: true }) : { ...item };
  plain.file_url = resolveFileUrl(plain);
  plain.id_kategori = plain.id_arsip;
  plain.kategori_arsip = plain.arsip ? {
    id_kategori: plain.arsip.id_arsip,
    nama_kategori: plain.arsip.nama_arsip,
    sub_kategori: plain.arsip.kategori_arsip?.nama_kategori
  } : null;
  plain.kategori_dokumen = plain.kategori_arsip;
  return plain;
};

// Helper: Salin file terunggah ke folder uploads backend
const copyFileToFolders = (file, parentCategory = 'Umum', subfolder = 'Arsip') => {
  if (!file) return;
  const targetDir = path.join(__dirname, '../uploads', parentCategory, subfolder);
  try {
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
    fs.copyFileSync(file.path, path.join(targetDir, file.filename));
  } catch (err) {
    console.error(`Error copying file to ${targetDir}:`, err);
  }
};

// Helper: Mencari URL file dokumen yang presisi di direktori uploads
const resolveFileUrl = (doc) => {
  const parentCat = doc.arsip?.kategori_arsip?.nama_kategori || doc.kategori_arsip?.nama_kategori || doc.kategori_dokumen?.nama_kategori || 'Umum';
  const subCat = doc.arsip?.nama_arsip || doc.kategori_arsip?.nama_arsip || doc.nama_arsip || 'Arsip';
  const ext = (doc.tipe_file || 'pdf').toLowerCase().replace('.', '');
  const baseName = (doc.nama_dokumen || 'dokumen').trim();
  const fileNameWithExt = baseName.toLowerCase().endsWith(`.${ext}`) ? baseName : `${baseName}.${ext}`;

  const checkDirs = [
    { dir: path.join(__dirname, '../uploads', parentCat, subCat), prefix: `/uploads/${encodeURIComponent(parentCat)}/${encodeURIComponent(subCat)}` },
    { dir: path.join(__dirname, '../../frontend/public/File', parentCat, subCat), prefix: `/File/${encodeURIComponent(parentCat)}/${encodeURIComponent(subCat)}` }
  ];

  for (const { dir, prefix } of checkDirs) {
    if (fs.existsSync(dir)) {
      const match = fs.readdirSync(dir).find(f => 
        f.toLowerCase() === fileNameWithExt.toLowerCase() || 
        f.toLowerCase().includes(baseName.toLowerCase()) ||
        f.toLowerCase().endsWith('.' + ext)
      );
      if (match) return `${prefix}/${encodeURIComponent(match)}`;
    }
  }

  return `/uploads/${encodeURIComponent(parentCat)}/${encodeURIComponent(subCat)}/${encodeURIComponent(fileNameWithExt)}`;
};

// --- CONTROLLERS --- //

// 1. Get All Dokumen (dengan Filter, Search, Sort & Pagination)
const getAllDokumen = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const rawLimit = req.query.limit;
    const limit = (rawLimit === '0' || rawLimit === 0) ? 0 : (parseInt(rawLimit, 10) || 5);
    const searchTerm = req.query.searchTerm || req.query.search || '';
    const idArsipParam = req.query.id_arsip || '';
    const idKategoriParam = req.query.id_kategori || '';
    const sortDirection = (req.query.sort || 'DESC').toUpperCase();
    const sortField = req.query.data_name || 'created_at';

    const andConditions = [];

    if (idArsipParam) {
      andConditions.push({ id_arsip: idArsipParam });
    }
    if (idKategoriParam) {
      andConditions.push({ '$arsip.id_kategori$': idKategoriParam });
    }

    if (searchTerm) {
      andConditions.push({
        [Op.or]: [
          { nama_dokumen: { [Op.like]: `%${searchTerm}%` } },
          { tipe_file: { [Op.like]: `%${searchTerm}%` } },
          { '$arsip.nama_arsip$': { [Op.like]: `%${searchTerm}%` } },
          { '$arsip.kategori_arsip.nama_kategori$': { [Op.like]: `%${searchTerm}%` } }
        ]
      });
    }

    const dateType = req.query.date_type || req.query.dateType || 'created_at';
    const startDate = req.query.start_date || req.query.startDate;
    const endDate = req.query.end_date || req.query.endDate;

    if (startDate || endDate) {
      const field = (dateType === 'terbit' || dateType === 'tanggal_terbit') ? 'terbit' : 'created_at';
      const dateCond = {};

      if (field === 'terbit') {
        if (startDate && endDate) {
          dateCond[startDate === endDate ? Op.eq : Op.between] = startDate === endDate ? startDate : [startDate, endDate];
        } else if (startDate) dateCond[Op.gte] = startDate;
        else if (endDate) dateCond[Op.lte] = endDate;
      } else {
        const startStr = startDate ? `${startDate} 00:00:00` : null;
        const endStr = endDate ? `${endDate} 23:59:59` : null;
        if (startStr && endStr) dateCond[Op.between] = [startStr, endStr];
        else if (startStr) dateCond[Op.gte] = startStr;
        else if (endStr) dateCond[Op.lte] = endStr;
      }

      andConditions.push({ [field]: dateCond });
    }

    const whereClause = andConditions.length > 0 ? { [Op.and]: andConditions } : {};

    const orderConfig = [];
    if (sortField === 'nama_kategori' || sortField === 'nama_arsip') {
      orderConfig.push([{ model: arsip, as: 'arsip' }, 'nama_arsip', sortDirection]);
    } else if (sortField === 'uploader') {
      orderConfig.push([{ model: users }, 'nama_lengkap', sortDirection]);
    } else {
      orderConfig.push([sortField, sortDirection]);
    }

    const queryOptions = {
      where: whereClause,
      include: defaultInclude,
      order: orderConfig,
      distinct: true
    };

    if (limit > 0) {
      queryOptions.limit = limit;
      queryOptions.offset = (page - 1) * limit;
    }

    const { count: totalData, rows } = await dokumen.findAndCountAll(queryOptions);
    const datas = rows.map(formatDokumenPayload);
    const totalPages = limit > 0 ? Math.ceil(totalData / limit) : 1;

    res.status(200).json({ success: true, datas, totalData, totalPages, currentPage: page, limit });
  } catch (error) {
    console.error('Error in getAllDokumen:', error);
    res.status(500).json({ success: false, message: error.message, msg: error.message });
  }
};

// 2. Get Dokumen By ID
const getDokumenById = async (req, res) => {
  try {
    const raw = await dokumen.findByPk(req.params.id, { include: defaultInclude });
    if (!raw) return res.status(404).json({ success: false, message: 'Dokumen tidak ditemukan', msg: 'Dokumen tidak ditemukan' });

    const data = formatDokumenPayload(raw);
    res.status(200).json({ success: true, data, datas: data });
  } catch (error) {
    console.error('Error in getDokumenById:', error);
    res.status(500).json({ success: false, message: error.message, msg: error.message });
  }
};

// 3. Upload Dokumen Baru
const uploadDokumen = async (req, res) => {
  try {
    const { id_arsip, id_kategori, nama_dokumen, terbit } = req.body;
    const targetArsipId = parseInt(id_arsip || id_kategori, 10) || 1;
    const userId = req.user?.id || req.user?.id_user || 1;

    if (!req.file) return res.status(400).json({ success: false, message: 'File dokumen wajib diunggah!', msg: 'File dokumen wajib diunggah!' });

    const targetArsip = await arsip.findByPk(targetArsipId, { include: [{ model: kategoriArsip, as: 'kategori_arsip' }] });
    copyFileToFolders(req.file, targetArsip?.kategori_arsip?.nama_kategori || 'Umum', targetArsip ? targetArsip.nama_arsip : 'Arsip');

    const sizeInMB = (req.file.size / (1024 * 1024)).toFixed(2) + ' MB';
    const ext = req.file.originalname.split('.').pop() || 'pdf';

    const newDoc = await dokumen.create({
      id_arsip: targetArsipId,
      id_users: parseInt(userId, 10) || 1,
      nama_dokumen: nama_dokumen || req.file.originalname,
      terbit: terbit || new Date(),
      tipe_file: ext.toLowerCase(),
      ukuran_file: sizeInMB
    });

    const data = formatDokumenPayload(await dokumen.findByPk(newDoc.id_dokumen, { include: defaultInclude }));
    res.status(201).json({ success: true, message: 'Dokumen baru berhasil diunggah!', msg: 'Dokumen baru berhasil diunggah!', data });
  } catch (error) {
    console.error('Error in uploadDokumen:', error);
    res.status(500).json({ success: false, message: error.message || 'Gagal mengunggah dokumen.', msg: error.message });
  }
};

// 4. Update Data Dokumen
const updateDokumen = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_arsip, id_kategori, nama_dokumen, terbit } = req.body;

    const docItem = await dokumen.findByPk(id);
    if (!docItem) return res.status(404).json({ success: false, message: 'Dokumen tidak ditemukan', msg: 'Dokumen tidak ditemukan' });

    const targetArsipId = parseInt(id_arsip || id_kategori || docItem.id_arsip, 10);
    const targetArsip = await arsip.findByPk(targetArsipId, { include: [{ model: kategoriArsip, as: 'kategori_arsip' }] });

    const updatePayload = {};
    if (nama_dokumen) updatePayload.nama_dokumen = nama_dokumen;
    if (terbit) updatePayload.terbit = terbit;
    if (targetArsipId) updatePayload.id_arsip = targetArsipId;

    if (req.file) {
      copyFileToFolders(req.file, targetArsip?.kategori_arsip?.nama_kategori || 'Umum', targetArsip ? targetArsip.nama_arsip : 'Arsip');
      updatePayload.ukuran_file = (req.file.size / (1024 * 1024)).toFixed(2) + ' MB';
      updatePayload.tipe_file = (req.file.originalname.split('.').pop() || 'pdf').toLowerCase();
    }

    await docItem.update(updatePayload);

    const updatedRaw = await dokumen.findByPk(id, { include: defaultInclude });
    const data = formatDokumenPayload(updatedRaw);

    res.status(200).json({ success: true, message: 'Dokumen berhasil diperbarui!', msg: 'Dokumen berhasil diperbarui!', data, datas: data });
  } catch (error) {
    console.error('Error in updateDokumen:', error);
    res.status(500).json({ success: false, message: error.message || 'Gagal memperbarui dokumen.', msg: error.message });
  }
};

// 5. Hapus Dokumen
const deleteDokumen = async (req, res) => {
  try {
    const data = await dokumen.findByPk(req.params.id, {
      include: [
        {
          model: arsip,
          as: 'arsip',
          include: [{ model: kategoriArsip, as: 'kategori_arsip' }]
        }
      ]
    });
    if (!data) return res.status(404).json({ success: false, message: 'Dokumen tidak ditemukan', msg: 'Dokumen tidak ditemukan' });

    const parentCat = data.arsip?.kategori_arsip?.nama_kategori || 'Umum';
    const subCat = data.arsip?.nama_arsip || 'Arsip';
    const ext = (data.tipe_file || 'pdf').toLowerCase().replace('.', '');
    const baseName = (data.nama_dokumen || 'dokumen').trim();
    const fileNameWithExt = baseName.toLowerCase().endsWith(`.${ext}`) ? baseName : `${baseName}.${ext}`;

    await data.destroy();

    // Otomatis hapus berkas fisik dari disk
    deleteDocumentFile(parentCat, subCat, fileNameWithExt);

    res.status(200).json({ success: true, message: 'Dokumen berhasil dihapus', msg: 'Dokumen berhasil dihapus' });
  } catch (error) {
    console.error('Error in deleteDokumen:', error);
    res.status(500).json({ success: false, message: error.message, msg: error.message });
  }
};

// 6. Dashboard Stats: Total Dokumen
const getTotalDokumen = async (req, res) => {
  try {
    const datas = await dokumen.count();
    res.status(200).json({ success: true, datas });
  } catch (error) {
    console.error("Error in getTotalDokumen:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Dashboard Stats: Upload Hari Ini
const getTotalDokumenToday = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const datas = await dokumen.count({ where: { created_at: { [Op.gte]: startOfDay } } });
    res.status(200).json({ success: true, datas });
  } catch (error) {
    console.error("Error in getTotalDokumenToday:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 8. Dashboard Stats: Tren Bulanan (Tahun Ini)
const getDokumenPerBulan = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const monthlyCounts = new Array(12).fill(0);
    const monthlyDetails = Array.from({ length: 12 }, () => ({}));

    const allDocs = await dokumen.findAll({
      attributes: ['created_at', 'id_arsip'],
      include: [
        {
          model: arsip,
          as: 'arsip',
          attributes: ['nama_arsip', 'warna']
        }
      ],
      where: { created_at: { [Op.gte]: new Date(`${currentYear}-01-01T00:00:00.000Z`) } }
    });

    allDocs.forEach(docItem => {
      const doc = docItem.get({ plain: true });
      if (doc.created_at) {
        const d = new Date(doc.created_at);
        if (d.getFullYear() === currentYear) {
          const m = d.getMonth();
          if (m >= 0 && m < 12) {
            monthlyCounts[m] += 1;
            const namaArsip = doc.arsip?.nama_arsip || 'Arsip Lainnya';
            const warnaArsip = doc.arsip?.warna || '#3B82F6';
            if (!monthlyDetails[m][namaArsip]) {
              monthlyDetails[m][namaArsip] = { count: 0, warna: warnaArsip };
            }
            monthlyDetails[m][namaArsip].count += 1;
          }
        }
      }
    });

    const defaultData = months.map((month, idx) => ({
      month,
      count: monthlyCounts[idx],
      details: monthlyDetails[idx]
    }));
    res.status(200).json({ success: true, defaultData });
  } catch (error) {
    console.error("Error in getDokumenPerBulan:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 9. Dashboard Stats: Distribusi Per Kategori (Jumlah Sub-Arsip per Kategori Induk)
const getDokumenTotalKategori = async (req, res) => {
  try {
    const list = await kategoriArsip.findAll({
      attributes: ['id_kategori', 'nama_kategori'],
      include: [
        {
          model: arsip,
          attributes: ['id_arsip']
        }
      ],
      order: [['id_kategori', 'ASC']]
    });

    const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1'];

    const defaultDatas = list.map((item, idx) => {
      const plain = item.get({ plain: true });
      const subArsipCount = Array.isArray(plain.arsips) ? plain.arsips.length : 0;
      return {
        id_kategori: plain.id_kategori,
        kategori_arsip: plain.nama_kategori,
        nama_kategori: plain.nama_kategori,
        label: plain.nama_kategori,
        name: plain.nama_kategori,
        value: subArsipCount,
        count: subArsipCount,
        warna: colors[idx % colors.length]
      };
    });

    res.status(200).json({ success: true, defaultDatas });
  } catch (error) {
    console.error("Error in getDokumenTotalKategori:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllDokumen,
  getDokumenById,
  uploadDokumen,
  updateDokumen,
  deleteDokumen,
  getTotalDokumen,
  getTotalDokumenToday,
  getDokumenPerBulan,
  getDokumenTotalKategori
};
