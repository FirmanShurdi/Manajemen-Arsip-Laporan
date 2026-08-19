import React, { useState, useEffect } from 'react';
import CategoryFilter from '../ui/CategoryFilter';
import AksiPopup from './aksi/AksiPopup';

export default function ArsipModal({
  isOpen,
  onClose,
  onSubmit,
  editingItem,
  kategoriIndukList = [],
  mode = 'arsip' // 'arsip' or 'kategori'
}) {
  const [idKategori, setIdKategori] = useState('');
  const [namaArsip, setNamaArsip] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingItem) {
      if (mode === 'kategori') {
        setNamaArsip(editingItem.nama_kategori || '');
        setDeskripsi(editingItem.deskripsi || '');
      } else {
        const catId = editingItem.id_kategori || (editingItem.kategori_arsip?.id_kategori) || '';
        setIdKategori(catId);
        setNamaArsip(editingItem.nama_arsip || editingItem.nama_kategori || '');
        setDeskripsi(editingItem.deskripsi || '');
      }
    } else {
      setIdKategori('');
      setNamaArsip('');
      setDeskripsi('');
    }
    setErrorMsg('');
  }, [editingItem, isOpen, mode]);

  const handleCategoryChange = (valOrEvent) => {
    const selectedId = valOrEvent && valOrEvent.target ? valOrEvent.target.value : valOrEvent;
    setIdKategori(selectedId);

    // Auto-fill deskripsi from selected category if present
    if (selectedId && kategoriIndukList.length > 0) {
      const foundCat = kategoriIndukList.find(
        (cat) =>
          String(cat.id_kategori) === String(selectedId) ||
          String(cat.id_arsip) === String(selectedId) ||
          String(cat.id) === String(selectedId)
      );
      if (foundCat && foundCat.deskripsi && foundCat.deskripsi !== '-') {
        setDeskripsi(foundCat.deskripsi);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'arsip' && !idKategori) {
      setErrorMsg('Kategori Arsip wajib dipilih.');
      return;
    }
    if (!namaArsip.trim()) {
      setErrorMsg(mode === 'kategori' ? 'Nama Kategori Arsip wajib diisi.' : 'Nama Arsip wajib diisi.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      if (mode === 'kategori') {
        await onSubmit({
          nama_kategori: namaArsip.trim(),
          deskripsi: deskripsi.trim()
        });
      } else {
        await onSubmit({
          id_kategori: idKategori,
          nama_arsip: namaArsip.trim(),
          deskripsi: deskripsi.trim()
        });
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Gagal menyimpan data.');
    } finally {
      setSubmitting(false);
    }
  };

  const isKategoriMode = mode === 'kategori';
  const isEditMode = Boolean(editingItem);

  const modalTitle = isKategoriMode
    ? (isEditMode ? 'Edit Kategori Arsip' : 'Tambah Kategori Arsip Baru')
    : (isEditMode ? 'Edit Arsip' : 'Tambah Arsip Dokumen');

  const modalSubtitle = isKategoriMode
    ? (isEditMode ? 'Perbarui nama dan deskripsi kategori.' : 'Isi form untuk menambahkan kategori utama baru.')
    : (isEditMode ? 'Perbarui informasi data arsip.' : 'Isi form untuk menambahkan jenis arsip baru.');

  const submitText = isEditMode
    ? 'Simpan Perubahan'
    : (isKategoriMode ? 'Tambah Kategori' : 'Tambah Arsip');

  return (
    <AksiPopup
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={modalTitle}
      subtitle={modalSubtitle}
      loading={submitting}
      submitText={submitText}
      isEditMode={isEditMode}
      errorMsg={errorMsg}
    >
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {isKategoriMode ? 'Nama Kategori Arsip' : 'Nama Arsip'} <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={namaArsip}
          onChange={(e) => setNamaArsip(e.target.value)}
          placeholder={isKategoriMode ? 'Contoh: Akuntabilitas Kinerja' : 'Contoh: SAKIP, SPIP, LPJ Keuangan'}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
        />
      </div>

      {!isKategoriMode && (
        <div className="relative z-30">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Kategori Arsip <span className="text-rose-500">*</span>
          </label>
          <CategoryFilter
            selectedCategory={idKategori}
            onChange={handleCategoryChange}
            onClear={() => {
              setIdKategori('');
              setDeskripsi('');
            }}
            categoryOptions={kategoriIndukList}
            placeholder="Pilih Kategori Arsip"
            defaultLabel="Pilih Kategori Arsip"
            showIcon={false}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Deskripsi (Otomatis Bila Ada)
        </label>
        <textarea
          rows={3}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          placeholder="Keterangan singkat mengenai jenis/kategori arsip..."
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
        />
      </div>
    </AksiPopup>
  );
}
