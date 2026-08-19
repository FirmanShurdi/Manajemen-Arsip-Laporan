import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import AksiPopup from './aksi/AksiPopup';

/**
 * UserModal Component
 * Modal form untuk Tambah & Edit Data User / Pengguna
 * Menggunakan wadah terstandar AksiPopup
 */
export default function UserModal({ isOpen, onClose, onSuccess, editingUser = null, rolesList = [] }) {
  const [username, setUsername] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [password, setPassword] = useState('');
  const [idRole, setIdRole] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [wilayahKerja, setWilayahKerja] = useState('');
  const [nomorTelpon, setNomorTelpon] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = Boolean(editingUser);

  useEffect(() => {
    if (editingUser) {
      setUsername(editingUser.username || '');
      setNamaLengkap(editingUser.nama_lengkap || '');
      setPassword(''); // Password dikosongkan pada mode edit jika tidak diubah
      setIdRole(editingUser.id_role ? String(editingUser.id_role) : '');
      setJabatan(editingUser.jabatan || '');
      setWilayahKerja(editingUser.wilayah_kerja || '');
      setNomorTelpon(editingUser.nomor_telpon || '');
    } else {
      setUsername('');
      setNamaLengkap('');
      setPassword('');
      setIdRole(rolesList.length > 0 ? String(rolesList[0].id_role) : '');
      setJabatan('');
      setWilayahKerja('');
      setNomorTelpon('');
    }
    setErrorMsg('');
  }, [editingUser, isOpen, rolesList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim()) {
      setErrorMsg('Username wajib diisi.');
      return;
    }

    if (!namaLengkap.trim()) {
      setErrorMsg('Nama Lengkap wajib diisi.');
      return;
    }

    if (!isEditMode && !password.trim()) {
      setErrorMsg('Password wajib diisi untuk user baru.');
      return;
    }

    if (!idRole) {
      setErrorMsg('Pilih Role & Hak Akses.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        username: username.trim(),
        nama_lengkap: namaLengkap.trim(),
        id_role: Number(idRole),
        jabatan: jabatan.trim() || 'Pegawai',
        wilayah_kerja: wilayahKerja.trim() || null,
        nomor_telpon: nomorTelpon.trim() || null,
      };

      if (password.trim()) {
        payload.password = password.trim();
      }

      if (isEditMode) {
        await api.put(`/users/${editingUser.id_user}`, payload);
      } else {
        await api.post('/users', payload);
      }

      if (onSuccess) {
        onSuccess(isEditMode ? 'User berhasil diperbarui' : 'User baru berhasil ditambahkan');
      }
      onClose();
    } catch (err) {
      console.error('Error submitting user:', err);
      const msg = err.response?.data?.message || 'Gagal menyimpan data user. Periksa kembali inputan Anda.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const modalTitle = isEditMode ? 'Edit Data User' : 'Tambah User Baru';
  const modalSubtitle = isEditMode
    ? 'Perbarui informasi profil akun dan hak akses pengguna.'
    : 'Lengkapi formulir untuk mendaftarkan akun pengguna baru.';

  return (
    <AksiPopup
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={modalTitle}
      subtitle={modalSubtitle}
      loading={submitting}
      isEditMode={isEditMode}
      errorMsg={errorMsg}
      maxWidth="max-w-lg"
    >
      {/* Nama Lengkap & Username (Grid 2 Kolom di Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Nama Lengkap <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={namaLengkap}
            onChange={(e) => setNamaLengkap(e.target.value)}
            placeholder="Contoh: Andi Wijaya"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Username <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Contoh: andi_wijaya"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Password & Role */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Password {!isEditMode && <span className="text-rose-500">*</span>}
          </label>
          <input
            type="password"
            required={!isEditMode}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isEditMode ? 'Kosongkan jika tidak diubah' : 'Minimal 6 karakter'}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Role / Hak Akses <span className="text-rose-500">*</span>
          </label>
          <select
            value={idRole}
            onChange={(e) => setIdRole(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
          >
            <option value="">-- Pilih Role --</option>
            {rolesList.map((r) => (
              <option key={r.id_role} value={r.id_role}>
                {r.nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Jabatan & Nomor Telepon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Jabatan (Opsional)
          </label>
          <input
            type="text"
            value={jabatan}
            onChange={(e) => setJabatan(e.target.value)}
            placeholder="Contoh: Staff Pengolahan Data"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            No. Telepon / WA (Opsional)
          </label>
          <input
            type="text"
            value={nomorTelpon}
            onChange={(e) => setNomorTelpon(e.target.value)}
            placeholder="Contoh: 081234567890"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Wilayah Kerja */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Wilayah Kerja (Opsional)
        </label>
        <input
          type="text"
          value={wilayahKerja}
          onChange={(e) => setWilayahKerja(e.target.value)}
          placeholder="Contoh: Kantor Utama / Seksi Keselamatan Berlayar"
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
        />
      </div>
    </AksiPopup>
  );
}
