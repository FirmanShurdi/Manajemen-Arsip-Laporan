import React, { useState, useEffect, useMemo } from 'react';
import MasterTable from '../common/MasterTable';
import CustomSelect from '../common/CustomSelect';
import Pagination from '../common/Pagination';

/**
 * UserTable Component
 * Membungkus MasterTable khusus Manajemen User dengan:
 * 1. Algoritma Deep Multi-Field Search (Nama, @Username, Jabatan, Wilayah, Telpon, Role & Hak Akses)
 * 2. Dukungan Paginasi Terintegrasi (Pagination component)
 */
export default function UserTable({
  users = [],
  rolesList = [],
  loading = false,
  onEdit,
  onDelete
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter & Search Logic Tingkat Tinggi
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Filter Role Dropdown
    if (selectedRole) {
      result = result.filter(
        (u) =>
          String(u.id_role) === String(selectedRole) ||
          String(u.role?.id_role) === String(selectedRole)
      );
    }

    // Deep Search Algorithm
    if (searchTerm.trim()) {
      const rawTerm = searchTerm.toLowerCase().trim();
      const searchTokens = rawTerm.split(/\s+/).filter(Boolean);

      result = result.filter((u) => {
        const roleObj = u.role;
        const roleName = roleObj?.nama || 'Pegawai';
        const roleTipe = roleObj?.tipe_role || '';
        const username = u.username || '';
        const namaLengkap = u.nama_lengkap || '';
        const jabatan = u.jabatan || '';
        const wilayah = u.wilayah_kerja || '';
        const telpon = u.nomor_telpon || '';

        // Teks sekunder yang sering dicari pengguna
        const atUsername = `@${username}`;
        const cleanTelpon = telpon.replace(/[^0-9]/g, '');

        // Hak Akses Badge Text
        const isAdmin = roleTipe === 'admin' || u.id_role === 1 || u.id_role === 2;
        const accessBadgeText = isAdmin
          ? 'akses full / admin akses full admin superadmin koordinator'
          : 'akses pegawai pegawai staff';

        // Gabungkan seluruh medan data ke dalam satu teks pencarian super lengkap
        const fullSearchableText = [
          namaLengkap,
          username,
          atUsername,
          jabatan,
          wilayah,
          telpon,
          cleanTelpon,
          roleName,
          roleTipe,
          accessBadgeText
        ]
          .join(' ')
          .toLowerCase();

        // Pastikan setiap token pencarian cocok
        return searchTokens.every((token) => {
          const cleanToken = token.startsWith('@') ? token.substring(1) : token;
          return (
            fullSearchableText.includes(token) ||
            (cleanToken && fullSearchableText.includes(cleanToken))
          );
        });
      });
    }

    return result;
  }, [users, selectedRole, searchTerm]);

  // Reset ke halaman 1 saat filter atau pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole]);

  // Kalkulasi Paginasi
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentPaginatedUsers = useMemo(() => {
    return filteredUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredUsers, startIndex, rowsPerPage]);

  // Definisi Kolom Tabel
  const columns = useMemo(
    () => [
      {
        header: 'NAMA & USERNAME',
        render: (item) => (
          <div>
            <span className="font-bold text-slate-900 block text-xs md:text-sm">
              {item.nama_lengkap || item.username}
            </span>
            <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
              @{item.username}
            </span>
          </div>
        )
      },
      {
        header: 'ROLE / HAK AKSES',
        render: (item) => {
          const roleObj = item.role;
          const roleName = roleObj?.nama || 'Pegawai';
          const isAdmin = roleObj?.tipe_role === 'admin' || item.id_role === 1 || item.id_role === 2;

          return isAdmin ? (
            <span className="inline-flex items-center px-3 py-1 text-xs md:text-sm font-bold rounded-full bg-blue-100 text-blue-900 border border-blue-300">
              {roleName}
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 text-xs md:text-sm font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              {roleName}
            </span>
          );
        }
      },
      {
        header: 'JABATAN & WILAYAH',
        render: (item) => (
          <div>
            <span className="text-xs md:text-sm font-semibold text-slate-800 block">
              {item.jabatan || 'Pegawai'}
            </span>
            {item.wilayah_kerja && (
              <span className="text-[11px] text-slate-500 block mt-0.5">
                📍 {item.wilayah_kerja}
              </span>
            )}
          </div>
        )
      },
      {
        header: 'NO. TELEPON',
        render: (item) => (
          <span className="text-xs md:text-sm text-slate-700 font-medium">
            {item.nomor_telpon || '-'}
          </span>
        )
      }
    ],
    []
  );

  return (
    <MasterTable
      columns={columns}
      data={currentPaginatedUsers}
      loading={loading}
      searchTerm={searchTerm}
      onSearchChange={(e) => setSearchTerm(e.target.value)}
      onSearchClear={() => setSearchTerm('')}
      searchPlaceholder="Cari nama, @username, jabatan, telepon, role..."
      onEdit={onEdit}
      onDelete={onDelete}
      disabledDelete={(item) => Number(item.id_user) === 1}
      deleteTitle={(item) => (Number(item.id_user) === 1 ? 'Akun Superadmin utama tidak dapat dihapus' : '')}
      filterComponent={
        <CustomSelect
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          onClear={() => setSelectedRole('')}
          options={rolesList}
          getOptionId={(r) => r.id_role}
          getOptionLabel={(r) => r.nama}
          placeholder="Semua Role"
          defaultLabel="Semua Role"
          showIcon={true}
          showSearch={false}
        />
      }
      paginationComponent={
        totalItems > 0 && (
          <>
            <div className="text-xs text-slate-500 font-medium">
              Menampilkan <span className="font-bold text-slate-800">{Math.min(startIndex + 1, totalItems)}</span> -{' '}
              <span className="font-bold text-slate-800">{Math.min(startIndex + rowsPerPage, totalItems)}</span> dari{' '}
              <span className="font-bold text-slate-800">{totalItems}</span> user
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        )
      }
    />
  );
}
