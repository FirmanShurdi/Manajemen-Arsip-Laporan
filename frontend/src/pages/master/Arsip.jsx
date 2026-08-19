import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../api/axiosInstance';
import { useFlash } from '../../hooks/useFlash';
import { useCrudModal } from '../../hooks/useCrudModal';
import CategoryFilter from '../../components/ui/CategoryFilter';
import MasterTable from '../../components/common/MasterTable';
import ConfirmDeleteModal from '../../components/modal/aksi/ConfirmDeleteModal';
import ArsipModal from '../../components/modal/ArsipModal';

export default function ArsipMaster() {
  const [activeTab, setActiveTab] = useState('arsip'); // 'arsip' or 'kategori'
  const [arsipList, setArsipList] = useState([]);
  const [kategoriIndukList, setKategoriIndukList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParentCat, setSelectedParentCat] = useState('');

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

  // Fetch Kategori Induk List
  const fetchKategoriInduk = useCallback(async () => {
    try {
      const res = await api.get('/kategori/induk');
      setKategoriIndukList(res.data?.datas || []);
    } catch (err) {
      console.error('Gagal memuat kategori induk:', err);
    }
  }, []);

  // Fetch Arsip List
  const fetchArsipList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/kategori');
      const data = res.data?.datas || [];
      setArsipList(data);
    } catch (err) {
      addToast('error', 'Gagal memuat data arsip dokumen.');
      setArsipList([]);
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchKategoriInduk();
    fetchArsipList();
  }, [fetchKategoriInduk, fetchArsipList]);

  // Filtered data based on active tab & search
  const filteredData = useMemo(() => {
    if (activeTab === 'kategori') {
      let result = [...kategoriIndukList];
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        result = result.filter(item => 
          (item.nama_kategori || '').toLowerCase().includes(term) ||
          (item.deskripsi || '').toLowerCase().includes(term)
        );
      }
      return result;
    } else {
      let result = [...arsipList];

      if (selectedParentCat) {
        result = result.filter((item) => {
          const catId = item.id_kategori || item.kategori_arsip?.id_kategori;
          return String(catId) === String(selectedParentCat);
        });
      }

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        result = result.filter((item) => {
          const nama = (item.nama_arsip || item.nama_kategori || '').toLowerCase();
          const catInduk = (item.kategori_arsip?.nama_kategori || item.kategori_arsip || '').toLowerCase();
          const desk = (item.deskripsi || '').toLowerCase();
          return nama.includes(term) || catInduk.includes(term) || desk.includes(term);
        });
      }
      return result;
    }
  }, [activeTab, arsipList, kategoriIndukList, searchTerm, selectedParentCat]);

  const handleSubmitModal = async (formData) => {
    if (activeTab === 'kategori') {
      if (editingItem) {
        const id = editingItem.id_kategori || editingItem.id;
        await api.put(`/kategori/induk/${id}`, formData);
        addToast('success', 'Kategori arsip berhasil diperbarui!');
      } else {
        await api.post('/kategori/induk', formData);
        addToast('success', 'Kategori arsip baru berhasil ditambahkan!');
      }
      fetchKategoriInduk();
    } else {
      if (editingItem) {
        const id = editingItem.id_arsip || editingItem.id_kategori;
        await api.put(`/kategori/${id}`, formData);
        addToast('success', 'Arsip dokumen berhasil diperbarui!');
      } else {
        await api.post('/kategori', formData);
        addToast('success', 'Arsip dokumen baru berhasil ditambahkan!');
      }
      fetchArsipList();
    }
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      if (activeTab === 'kategori') {
        const id = deleteItem.id_kategori || deleteItem.id;
        await api.delete(`/kategori/induk/${id}`);
        addToast('success', 'Kategori arsip berhasil dihapus!');
        fetchKategoriInduk();
      } else {
        const id = deleteItem.id_arsip || deleteItem.id_kategori;
        await api.delete(`/kategori/${id}`);
        addToast('success', 'Arsip dokumen berhasil dihapus!');
        fetchArsipList();
      }
      cancelDelete();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || 'Gagal menghapus data.';
      addToast('error', msg);
    } finally {
      setDeleting(false);
    }
  };

  // Dynamic columns based on active tab
  const columns = useMemo(() => {
    if (activeTab === 'kategori') {
      return [
        {
          header: 'NAMA KATEGORI ARSIP',
          render: (item) => (
            <span className="font-bold text-slate-900 uppercase tracking-wide">
              {item.nama_kategori}
            </span>
          )
        },
        {
          header: 'DESKRIPSI',
          render: (item) => (
            <span
              className="text-xs md:text-sm text-slate-600 max-w-lg truncate block font-normal"
              title={item.deskripsi || ''}
            >
              {item.deskripsi || '-'}
            </span>
          )
        }
      ];
    }

    return [
      {
        header: 'NAMA ARSIP',
        render: (item) => (
          <span className="font-bold text-slate-900 uppercase tracking-wide">
            {item.nama_arsip || item.nama_kategori}
          </span>
        )
      },
      {
        header: 'KATEGORI ARSIP',
        render: (item) => {
          const catInduk = item.kategori_arsip?.nama_kategori || item.kategori_arsip || item.kategori_dokumen || 'Umum';
          return (
            <span className="inline-flex items-center px-3 py-1 text-xs md:text-sm font-bold rounded-full bg-blue-100 text-blue-900 border border-blue-300">
              {catInduk}
            </span>
          );
        }
      },
      {
        header: 'DESKRIPSI',
        render: (item) => (
          <span
            className="text-xs md:text-sm text-slate-600 max-w-xs truncate block font-normal"
            title={item.deskripsi || ''}
          >
            {item.deskripsi || '-'}
          </span>
        )
      }
    ];
  }, [activeTab]);

  const tabsComponent = (
    <div className="flex items-center gap-6">
      <button
        type="button"
        onClick={() => {
          setActiveTab('arsip');
          setSearchTerm('');
        }}
        className={`py-3 text-xs md:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
          activeTab === 'arsip'
            ? 'border-indigo-600 text-indigo-600 font-bold'
            : 'border-transparent text-slate-500 hover:text-slate-700'
        }`}
      >
        Arsip
      </button>
      <button
        type="button"
        onClick={() => {
          setActiveTab('kategori');
          setSearchTerm('');
        }}
        className={`py-3 text-xs md:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
          activeTab === 'kategori'
            ? 'border-indigo-600 text-indigo-600 font-bold'
            : 'border-transparent text-slate-500 hover:text-slate-700'
        }`}
      >
        Kategori Arsip
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
            Data Kategori & Arsip Dokumen
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Kelola jenis arsip dokumen dan kategorisasi dalam sistem Manajemen Arsip Digital.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-lg shadow-xs transition-all whitespace-nowrap cursor-pointer"
        >
          + Tambah Data
        </button>
      </div>

      {/* Unified Master Table Component with Tabs */}
      <MasterTable
        tabsComponent={tabsComponent}
        columns={columns}
        data={filteredData}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onSearchClear={() => setSearchTerm('')}
        searchPlaceholder={activeTab === 'kategori' ? 'Cari kategori arsip...' : 'Cari arsip dokumen...'}
        filterComponent={
          activeTab === 'arsip' ? (
            <CategoryFilter
              selectedCategory={selectedParentCat}
              onChange={(e) => setSelectedParentCat(e.target.value)}
              onClear={() => setSelectedParentCat('')}
              categoryOptions={kategoriIndukList}
              defaultLabel="Semua Kategori Arsip"
              placeholder="Semua Kategori Arsip"
              showIcon={false}
            />
          ) : null
        }
        onEdit={openEdit}
        onDelete={promptDelete}
        emptyMessage={activeTab === 'kategori' ? 'Tidak ada data kategori arsip yang ditemukan.' : 'Tidak ada data arsip yang ditemukan.'}
      />

      {/* Form Modal */}
      <ArsipModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmitModal}
        editingItem={editingItem}
        kategoriIndukList={kategoriIndukList}
        mode={activeTab}
      />

      {/* Reusable Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteItem)}
        title={activeTab === 'kategori' ? 'Hapus Kategori Arsip?' : 'Hapus Arsip?'}
        itemName={deleteItem?.nama_arsip || deleteItem?.nama_kategori || ''}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        loading={deleting}
      />
    </div>
  );
}
