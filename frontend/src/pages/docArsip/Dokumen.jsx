import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axiosInstance';
import DokumenTable from '../../components/table/DokumenTable';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import RowsPerPageSelect from '../../components/common/RowsPerPageSelect';
import CategoryFilter from '../../components/ui/CategoryFilter';
import ArsipFilter from '../../components/ui/ArsipFilter';
import DateRangeFilter from '../../components/common/DateRangeFilter';
import FileViewer from '../../components/modal/FileViewer';
import ConfirmDeleteModal from '../../components/modal/aksi/ConfirmDeleteModal';
import Flash from '../../components/flash/flash';
import { useFlash } from '../../hooks/useFlash';
import { useCrudModal } from '../../hooks/useCrudModal';

const rowsPerPageOptions = ['5', '10', '20', '50', 'Semua'];

export default function Dokumen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const getInitialFilter = (urlParam, storageKey) => {
    if (urlParam) return urlParam;
    try {
      const saved = sessionStorage.getItem('active_arsip_filter');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed[storageKey] || '';
      }
    } catch (_) { }
    return '';
  };

  const initialArsipFromUrl = searchParams.get('id_arsip') || searchParams.get('arsip') || '';
  const initialMainCatFromUrl = searchParams.get('id_kategori') || searchParams.get('kategori') || '';

  const { toasts, addToast, removeToast } = useFlash();
  const {
    deleteItem,
    deleting,
    setDeleting,
    promptDelete,
    cancelDelete
  } = useCrudModal();

  const [dokumenItems, setDokumenItems] = useState([]);
  const [arsipList, setArsipList] = useState([]);
  const [mainCategoryList, setMainCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedViewFile, setSelectedViewFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState(() => getInitialFilter(initialMainCatFromUrl, 'selectedMainCategory'));
  const [selectedArsip, setSelectedArsip] = useState(() => getInitialFilter(initialArsipFromUrl, 'selectedArsip'));
  const [dateFilterType, setDateFilterType] = useState('created_at');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState('5');
  const [totalData, setTotalData] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'DESC' });

  // Sync state dengan URL params ketika halaman diakses/diklik dari Card Dashboard
  useEffect(() => {
    const urlArsip = searchParams.get('id_arsip') || searchParams.get('arsip');
    const urlCat = searchParams.get('id_kategori') || searchParams.get('kategori');
    if (urlArsip !== null && urlArsip !== undefined) {
      setSelectedArsip(urlArsip);
    }
    if (urlCat !== null && urlCat !== undefined) {
      setSelectedMainCategory(urlCat);
    }
  }, [searchParams]);

  useEffect(() => {

    api.get('/kategori-dokumen')
      .then(res => {
        if (res.data?.success) {
          const list = res.data.datas || [];
          setArsipList(list);

          const uniqueCategories = [];
          const seen = new Set();

          list.forEach(item => {
            const catId = item.id_kategori || item.id_arsip;
            const catName = typeof item.kategori_arsip === 'object' ? item.kategori_arsip?.nama_kategori : item.kategori_arsip;

            if (catName && !seen.has(catName)) {
              seen.add(catName);
              uniqueCategories.push({
                id_kategori: catId,
                nama_kategori: catName
              });
            }
          });

          if (uniqueCategories.length > 0) {
            setMainCategoryList(uniqueCategories);
          }
        }
      })
      .catch(console.error);

    // Also fetch from /kategori-dokumen/induk endpoint
    api.get('/kategori-dokumen/induk')
      .then(res => {
        if (res.data?.success && Array.isArray(res.data.datas) && res.data.datas.length > 0) {
          setMainCategoryList(res.data.datas);
        }
      })
      .catch(() => { });
  }, []);

  // Simpan filter aktif ke sessionStorage agar tidak hilang saat navigasi ke Dashboard & balik lagi
  useEffect(() => {
    if (selectedArsip || selectedMainCategory) {
      sessionStorage.setItem('active_arsip_filter', JSON.stringify({
        selectedArsip,
        selectedMainCategory
      }));
    } else {
      sessionStorage.removeItem('active_arsip_filter');
    }
  }, [selectedArsip, selectedMainCategory]);

  const fetchDokumenData = useCallback(async () => {
    setLoading(true);
    const limit = rowsPerPage === 'Semua' ? 0 : parseInt(rowsPerPage, 10);
    try {
      const validCategory = (selectedMainCategory && !['Semua', 'Semua Kategori Arsip', 'Semua Nama Arsip', 'Semua Kategori Utama'].includes(selectedMainCategory)) ? selectedMainCategory : '';
      const validArsip = (selectedArsip && !['Semua', 'Semua Kategori Arsip', 'Semua Nama Arsip', 'Semua Kategori Utama'].includes(selectedArsip)) ? selectedArsip : '';

      const params = {
        page: currentPage,
        limit,
        searchTerm,
        id_arsip: validArsip,
        id_kategori: validCategory,
        sort: sortConfig.direction,
        data_name: sortConfig.key
      };

      if (startDate || endDate) {
        params.date_type = dateFilterType;
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
      }

      const res = await api.get('/dokumen', { params });
      if (res.data?.success) {
        setDokumenItems(res.data.datas || []);
        setTotalData(res.data.pagination?.totalData || res.data.totalData || 0);
        setTotalPages(res.data.pagination?.totalPages || res.data.totalPages || 0);
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Gagal mengambil data dokumen dari server.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, searchTerm, selectedArsip, selectedMainCategory, dateFilterType, startDate, endDate, sortConfig, addToast]);

  useEffect(() => {
    fetchDokumenData();
  }, [fetchDokumenData]);

  const confirmDelete = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/dokumen/${deleteItem.id_dokumen}`);
      addToast('success', res.data?.message || 'Dokumen berhasil dihapus!');
      cancelDelete();
      fetchDokumenData();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || 'Gagal menghapus dokumen.';
      addToast('error', msg);
    } finally {
      setDeleting(false);
    }
  };

  const startIndex = (currentPage - 1) * (rowsPerPage === 'Semua' ? totalData : parseInt(rowsPerPage, 10)) + 1;

  return (
    <>
      <Flash toasts={toasts} removeToast={removeToast} />
      <div className="space-y-6">

        {/* File Viewer Pop-Up Fullscreen Modal */}
        <FileViewer
          isOpen={!!selectedViewFile}
          file={selectedViewFile}
          onClose={() => setSelectedViewFile(null)}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmDeleteModal
          isOpen={Boolean(deleteItem)}
          title="Hapus Dokumen Arsip?"
          itemName={deleteItem?.nama_dokumen || ''}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          loading={deleting}
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Arsip Dokumen</h1>
            <p className="text-xs md:text-sm text-slate-500">Kelola dan tinjau seluruh dokumen arsip digital perusahaan.</p>
          </div>
          <Link to="/dokumen/tambah" className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs md:text-sm transition-all shadow-xs shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
            <span>Tambah Dokumen</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm relative z-10">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center gap-3 relative z-20 rounded-t-2xl">
            <div className="w-full sm:w-64">
              <SearchBar value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} onClear={() => { setSearchTerm(''); setCurrentPage(1); }} placeholder="Cari nama dokumen..." />
            </div>

            {/* Filter Kategori Utama (kategori_arsip) */}
            <CategoryFilter
              selectedCategory={selectedMainCategory}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedMainCategory(val);
                setCurrentPage(1);
                if (selectedArsip && val) {
                  const isValid = arsipList.some(item => {
                    const parentId = item.id_kategori || item.id_kategori_arsip || item.kategori_arsip?.id_kategori;
                    const parentName = typeof item.kategori_arsip === 'object' ? item.kategori_arsip?.nama_kategori : item.kategori_arsip;
                    return (String(item.id_arsip) === String(selectedArsip)) &&
                      (String(parentId) === String(val) || String(parentName) === String(val));
                  });
                  if (!isValid) setSelectedArsip('');
                }
              }}
              onClear={() => { setSelectedMainCategory(''); setCurrentPage(1); }}
              categoryOptions={mainCategoryList}
              placeholder="Semua Kategori Arsip"
            />

            {/* Filter Sub-Arsip (arsip) */}
            <ArsipFilter
              selectedArsip={selectedArsip}
              selectedCategory={selectedMainCategory}
              onChange={(e) => { setSelectedArsip(e.target.value); setCurrentPage(1); }}
              onClear={() => { setSelectedArsip(''); setCurrentPage(1); }}
              arsipOptions={arsipList}
              placeholder="Semua Nama Arsip"
            />

            {/* Filter Rentang Tanggal Terpadu (Diunggah vs Terbit) */}
            <DateRangeFilter
              dateType={dateFilterType}
              startDate={startDate}
              endDate={endDate}
              onApply={(filterData) => {
                if (filterData) {
                  if (filterData.dateType) setDateFilterType(filterData.dateType);
                  setStartDate(filterData.startDate || '');
                  setEndDate(filterData.endDate || '');
                  if (filterData.startDate || filterData.endDate) {
                    setRowsPerPage('Semua');
                  }
                }
                setCurrentPage(1);
              }}
              onClear={() => {
                setStartDate('');
                setEndDate('');
                setRowsPerPage('5');
                setCurrentPage(1);
              }}
            />
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs font-semibold">Memuat data dokumen...</div>
          ) : (
            <DokumenTable
              dokumenItems={dokumenItems}
              onEdit={(item) => {
                const targetId = item?.id_dokumen || item?.id || item?.id_arsip;
                if (targetId) {
                  navigate(`/dokumen/edit/${targetId}`);
                }
              }}
              onDelete={promptDelete}
              onViewFile={(file) => setSelectedViewFile(file)}
              onSort={(key) => {
                setSortConfig(prev => ({
                  key,
                  direction: prev.key === key && prev.direction === 'ASC' ? 'DESC' : 'ASC'
                }));
              }}
              sortConfig={sortConfig}
              startIndex={startIndex}
              totalData={totalData}
            />
          )}

          <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-b-2xl">
            <RowsPerPageSelect options={rowsPerPageOptions} value={rowsPerPage} onChange={(e) => { setRowsPerPage(e.target.value); setCurrentPage(1); }} totalItems={totalData} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
          </div>
        </div>
      </div>
    </>
  );
}
