import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axiosInstance';
import { useFlash } from '../../hooks/useFlash';
import { useCrudModal } from '../../hooks/useCrudModal';
import RoleTable from '../../components/table/RoleTable';
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

  // Client-side search filtering
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRoles(rolesData);
    } else {
      const term = searchTerm.toLowerCase().trim();
      setFilteredRoles(
        rolesData.filter((r) =>
          (r.nama || '').toLowerCase().includes(term) ||
          (r.tipe_role || '').toLowerCase().includes(term)
        )
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
      addToast('success', res.data?.message || 'Role berhasil dihapus!');
      fetchRoles();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || 'Gagal menghapus role.';
      addToast('error', msg);
    } finally {
      setDeleting(false);
      cancelDelete();
    }
  };

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

      {/* Komponen Tabel Role Terpisah */}
      <RoleTable
        roles={filteredRoles}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onSearchClear={() => setSearchTerm('')}
        onEdit={openEdit}
        onDelete={handleDeletePrompt}
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
