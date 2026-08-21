import React, { useState, useMemo } from 'react';
import MasterTable from '../common/MasterTable';

export default function RoleTable({
  roles = [],
  loading = false,
  searchTerm = '',
  onSearchChange,
  onSearchClear,
  onEdit,
  onDelete
}) {
  const [activeTab, setActiveTab] = useState('role'); // 'role' or 'tipe_akses'

  const tipeAksesList = useMemo(() => [
    {
      id: 1,
      tipe: 'admin',
      nama_tipe: 'Akses Full / Admin',
      keterangan: 'Memiliki akses penuh ke seluruh modul sistem (Dashboard, Dokumen Arsip, Kategori Dokumen, Manajemen User, Role & Hak Akses, serta Log Aktivitas).'
    },
    {
      id: 2,
      tipe: 'pegawai',
      nama_tipe: 'Akses Pegawai',
      keterangan: 'Memiliki akses ke Dashboard, Dokumen Arsip, dan Kategori Dokumen. Akses ke Manajemen User, Role & Hak Akses, serta Log Aktivitas dibatasi/ditolak.'
    }
  ], []);

  const columns = useMemo(() => {
    if (activeTab === 'tipe_akses') {
      return [
        {
          header: 'TIPE HAK AKSES',
          render: (item) => (
            <span className={`inline-flex items-center px-3 py-1 text-xs md:text-sm font-bold rounded-full ${
              item.tipe === 'admin' 
                ? 'bg-blue-100 text-blue-900 border border-blue-300' 
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
            }`}>
              {item.nama_tipe}
            </span>
          )
        },
        {
          header: 'KETERANGAN HAK AKSES',
          render: (item) => (
            <span className="text-xs md:text-sm text-slate-600 font-normal leading-relaxed">
              {item.keterangan}
            </span>
          )
        }
      ];
    }

    return [
      {
        header: 'NAMA ROLE',
        render: (item) => {
          const isProtected = [1, 2, 3].includes(Number(item.id_role));
          return (
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 uppercase tracking-wide">
                {item.nama}
              </span>
              {isProtected && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                  System Default
                </span>
              )}
            </div>
          );
        }
      },
      {
        header: 'TIPE HAK AKSES',
        render: (item) => {
          const isAdmin = item.tipe_role === 'admin';
          return isAdmin ? (
            <span className="inline-flex items-center px-3 py-1 text-xs md:text-sm font-bold rounded-full bg-blue-100 text-blue-900 border border-blue-300">
              Akses Full / Admin
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 text-xs md:text-sm font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              Akses Pegawai
            </span>
          );
        }
      }
    ];
  }, [activeTab]);

  const tabsComponent = (
    <div className="flex items-center gap-6">
      <button
        type="button"
        onClick={() => setActiveTab('role')}
        className={`py-3 text-xs md:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
          activeTab === 'role'
            ? 'border-indigo-600 text-indigo-600 font-bold'
            : 'border-transparent text-slate-500 hover:text-slate-700'
        }`}
      >
        Role
      </button>
      <button
        type="button"
        onClick={() => setActiveTab('tipe_akses')}
        className={`py-3 text-xs md:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
          activeTab === 'tipe_akses'
            ? 'border-indigo-600 text-indigo-600 font-bold'
            : 'border-transparent text-slate-500 hover:text-slate-700'
        }`}
      >
        Tipe Akses
      </button>
    </div>
  );

  return (
    <MasterTable
      tabsComponent={tabsComponent}
      columns={columns}
      data={activeTab === 'tipe_akses' ? tipeAksesList : roles}
      loading={activeTab === 'role' && loading}
      searchTerm={searchTerm}
      onSearchChange={activeTab === 'role' ? onSearchChange : null}
      onSearchClear={onSearchClear}
      searchPlaceholder="Cari nama role..."
      onEdit={activeTab === 'role' ? onEdit : null}
      onDelete={activeTab === 'role' ? onDelete : null}
      disabledDelete={(item) => [1, 2, 3].includes(Number(item.id_role))}
      deleteTitle={(item) => [1, 2, 3].includes(Number(item.id_role)) ? 'Role default sistem tidak dapat dihapus' : ''}
      emptyMessage="Tidak ada data yang ditemukan."
    />
  );
}
