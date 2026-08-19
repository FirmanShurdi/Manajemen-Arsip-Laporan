import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import AksiPopup from './aksi/AksiPopup';

export default function RoleFormModal({ isOpen, onClose, currentItem, onSuccess, addToast }) {
  const [nama, setNama] = useState('');
  const [tipeRole, setTipeRole] = useState('pegawai');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (currentItem) {
      setNama(currentItem.nama || '');
      setTipeRole(currentItem.tipe_role || 'pegawai');
    } else {
      setNama('');
      setTipeRole('pegawai');
    }
    setErrorMsg('');
  }, [currentItem, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nama.trim()) {
      setErrorMsg('Nama role wajib diisi!');
      if (addToast) addToast('error', 'Nama role wajib diisi!');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      if (currentItem) {
        // Edit Mode
        const res = await api.put(`/role/${currentItem.id_role}`, {
          nama: nama.trim(),
          tipe_role: tipeRole
        });
        if (addToast) addToast('success', res.data.message || 'Role berhasil diperbarui!');
      } else {
        // Create Mode
        const res = await api.post('/role', {
          nama: nama.trim(),
          tipe_role: tipeRole
        });
        if (addToast) addToast('success', 'Role baru berhasil ditambahkan!');
      }
      onSuccess();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || 'Gagal menyimpan data role.';
      setErrorMsg(msg);
      if (addToast) addToast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  const isEditMode = Boolean(currentItem);

  return (
    <AksiPopup
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={isEditMode ? 'Ubah Data Role' : 'Tambah Role Baru'}
      subtitle={isEditMode ? 'Perbarui informasi & hak akses role.' : 'Daftarkan role & atur hak akses pengguna.'}
      loading={loading}
      submitText={isEditMode ? 'Simpan Perubahan' : 'Tambah Role'}
      isEditMode={isEditMode}
      errorMsg={errorMsg}
      maxWidth="max-w-md"
    >
      {/* Nama Role */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Nama Role <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Contoh: Kepala Subbagian, Auditor, Staff Pengolahan"
          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-2xs"
        />
      </div>

      {/* Tipe Role / Hak Akses */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Tipe Hak Akses <span className="text-rose-500">*</span>
        </label>
        <select
          value={tipeRole}
          onChange={(e) => setTipeRole(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-2xs cursor-pointer"
        >
          <option value="admin">Akses Full Dashboard, User & System Settings)</option>
          <option value="pegawai">Akses Pegawai (Kelola & Unggah Dokumen Arsip)</option>
        </select>
      </div>
    </AksiPopup>
  );
}
