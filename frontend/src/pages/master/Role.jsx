import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../api/axiosInstance';
import { useFlash } from '../../hooks/useFlash';
import { useCrudModal } from '../../hooks/useCrudModal';
import MasterTable from '../../components/common/MasterTable';
import ConfirmDeleteModal from '../../components/modal/aksi/ConfirmDeleteModal';
import RoleFormModal from '../../components/modal/RoleFormModal';

export default function RoleMaster() {
  const [rolesData, setRolesData] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const { addToast } = useFlash();
  const {
    isModalOpen,
    editingItem,
    deleteItem,
    deleting,
    setDeleting,
    openAdd,
    openEdit,
    closeModal,
    promptDelete,
    cancelDelete
  } = useCrudModal();

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/role');
      const data = response?.data?.datas || [];
      setRolesData(data);
      setFilteredRoles(data);
    } catch (error) {
      addToast('error', 'Gagal memuat data role.');
      setRolesData([]);
      setFilteredRoles([]);
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Client-side search filtering maksimal
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRoles(rolesData);
    } else {
      const searchTokens = searchTerm.toLowerCase().trim().split(/\s+/);

      setFilteredRoles(
        rolesData.filter((r) => {
          const isProtected = [1, 2, 3].includes(Number(r.id_role)) ? 'system default' : '';
          const isAdmin = r.tipe_role === 'admin' || Number(r.id_role) === 1 || Number(r.id_role) === 2;
          const accessTypeLabel = isAdmin ? 'akses full admin' : 'akses pegawai staff';

          const searchableString = [
            r.nama || '',
            r.tipe_role || '',
            isProtected,
            accessTypeLabel
          ]
            .join(' ')
            .toLowerCase();

          return searchTokens.every((token) => searchableString.includes(token));
        })
      );
    }
  }, [searchTerm, rolesData]);

  const handleDeletePrompt = (item) => {
    if ([1, 2, 3].includes(Number(item.id_role))) {
      addToast('error', 'Role default sistem tidak dapat dihapus.');
      return;
    }
    promptDelete(item);
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/role/${deleteItem.id_role}`);
      addToast('success', res.data.message || 'Role berhasil dihapus!');
      cancelDelete();
      fetchRoles();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || 'Gagal menghapus role.';
      addToast('error', msg);
    } finally {
      setDeleting(false);
    }
  };

  const columns = useMemo(() => [
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
  ], []);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
            Data Role & Hak Akses
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Kelola tingkat aksesibilitas dan peran pengguna dalam sistem Manajemen Arsip Digital.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-lg shadow-xs transition-all whitespace-nowrap cursor-pointer"
        >
          + Tambah Data
        </button>
      </div>

      {/* Unified Master Table Component */}
      <MasterTable
        columns={columns}
        data={filteredRoles}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onSearchClear={() => setSearchTerm('')}
        searchPlaceholder="Cari nama role..."
        onEdit={openEdit}
        onDelete={handleDeletePrompt}
        disabledDelete={(item) => [1, 2, 3].includes(Number(item.id_role))}
        deleteTitle={(item) => [1, 2, 3].includes(Number(item.id_role)) ? 'Role default sistem tidak dapat dihapus' : ''}
        emptyMessage="Tidak ada data role yang ditemukan."
      />

      {/* Role Form Modal */}
      <RoleFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        currentItem={editingItem}
        onSuccess={fetchRoles}
        addToast={addToast}
      />

      {/* Reusable Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteItem)}
        title="Hapus Role?"
        itemName={deleteItem?.nama || ''}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        loading={deleting}
      />
    </div>
  );
}
