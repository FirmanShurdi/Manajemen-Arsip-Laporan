import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';

export default function RolePick({ regRole, setRegRole }) {
  const [roles, setRoles] = useState([
    { id_role: 3, nama: 'Pegawai', tipe_role: 'pegawai' },
    { id_role: 2, nama: 'Koordinator', tipe_role: 'admin' },
    { id_role: 1, nama: 'Super Admin', tipe_role: 'admin' }
  ]);

  useEffect(() => {
    let isMounted = true;
    api.get('/role')
      .then(res => {
        if (isMounted && res.data?.datas && Array.isArray(res.data.datas)) {
          setRoles(res.data.datas);
        }
      })
      .catch(err => {
        console.error('Gagal memuat daftar role dari server:', err);
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="relative mt-3.2 mb-1 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
      <select
        id="rrole"
        name="id_role"
        required
        value={regRole}
        onChange={e => setRegRole(Number(e.target.value))}
        className="peer w-full rounded-xl border border-blue-500 bg-white py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 cursor-pointer shadow-sm appearance-none"
      >
        {roles.map(r => (
          <option key={r.id_role} value={r.id_role}>
            {r.nama} ({r.tipe_role === 'admin' ? 'Akses Full / Admin' : 'Akses Pegawai'})
          </option>
        ))}
      </select>

      <label
        htmlFor="rrole"
        className="absolute left-3 -top-2.5 bg-white px-1.5 text-[11px] font-bold text-blue-600 rounded"
      >
        Pilih Role Akses Pengguna
      </label>

      <svg
        className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 stroke-blue-600 transition-colors"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.5"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>

      <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-600 text-xs">
        <i className="fa-solid fa-chevron-down"></i>
      </div>
    </div>
  );
}
