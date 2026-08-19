import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axiosInstance';
import { useFlash } from '../../hooks/useFlash';
import { useCrudModal } from '../../hooks/useCrudModal';
import UserTable from '../../components/table/UserTable';
import UserModal from '../../components/modal/UserModal';
import ConfirmDeleteModal from '../../components/modal/aksi/ConfirmDeleteModal';

/**
 * UserMaster Page Component
 * Halaman utama Manajemen User yang memanggil komponen terstruktur UserTable
 */
export default function UserMaster() {
  const [usersData, setUsersData] = useState([]);
  const [rolesData, setRolesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToast } = useFlash();
  const {
    isModalOpen,
    editingItem,
    deleteItem,
    deleting,
    setDeleting,
    openEdit,
    closeModal,
    promptDelete,
    cancelDelete
  } = useCrudModal();

  // Fetch data user & role dari API
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [resUsers, resRoles] = await Promise.all([
        api.get('/users'),
        api.get('/role')
      ]);

      const usersList = resUsers?.data?.datas || [];
      const rolesList = resRoles?.data?.datas || [];

      setUsersData(usersList);
      setRolesData(rolesList);
    } catch (error) {
      console.error('Error fetching user data:', error);
      addToast('error', 'Gagal memuat data pengguna dan role.');
      setUsersData([]);
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Eksekusi Hapus User
  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      await api.delete(`/users/${deleteItem.id_user}`);
      addToast('success', `User "${deleteItem.nama_lengkap || deleteItem.username}" berhasil dihapus.`);
      cancelDelete();
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
      const msg = error.response?.data?.message || 'Gagal menghapus data user.';
      addToast('error', msg);
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Judul Halaman */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
          Manajemen User & Hak Akses
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Kelola akun pengguna, jabatan, nomor telepon, dan pembagian hak akses sistem.
        </p>
      </div>

      {/* Komponen Tabel User yang Membungkus MasterTable */}
      <UserTable
        users={usersData}
        rolesList={rolesData}
        loading={loading}
        onEdit={openEdit}
        onDelete={promptDelete}
      />

      {/* Modal Form Edit User */}
      <UserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        editingUser={editingItem}
        rolesList={rolesData}
        onSuccess={(message) => {
          addToast('success', message);
          fetchData();
        }}
      />

      {/* Modal Konfirmasi Hapus */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteItem)}
        itemName={deleteItem?.nama_lengkap || deleteItem?.username || ''}
        title="Hapus Akun User?"
        onConfirm={handleDeleteConfirm}
        onCancel={cancelDelete}
        loading={deleting}
      />
    </div>
  );
}
