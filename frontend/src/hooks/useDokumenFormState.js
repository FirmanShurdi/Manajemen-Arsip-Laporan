import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useFlash } from './useFlash';

export function useDokumenFormState({ isEdit = false } = {}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useFlash();

  const [namaDokumen, setNamaDokumen] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [idKategori, setIdKategori] = useState('');
  const [terbit, setTerbit] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentFileName, setCurrentFileName] = useState('');
  const [currentFileUrl, setCurrentFileUrl] = useState('');
  const [previewFileModalData, setPreviewFileModalData] = useState(null);

  const [categoryList, setCategoryList] = useState([]);
  const [mainCategoryList, setMainCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    // Fetch categories
    api.get('/kategori-dokumen')
      .then(res => {
        if (res.data?.success) {
          const list = res.data.datas || [];
          setCategoryList(list);

          const uniqueCategories = [];
          const seen = new Set();
          list.forEach(item => {
            const catId = item.id_kategori || item.kategori_arsip?.id_kategori;
            const catName = typeof item.kategori_arsip === 'object' ? item.kategori_arsip?.nama_kategori : item.kategori_arsip;
            if (catId && catName && !seen.has(catId)) {
              seen.add(catId);
              uniqueCategories.push({ id_kategori: catId, nama_kategori: catName });
            }
          });
          if (uniqueCategories.length > 0) setMainCategoryList(uniqueCategories);
        }
      })
      .catch(console.error);

    api.get('/kategori-dokumen/induk')
      .then(res => {
        if (res.data?.success && Array.isArray(res.data.datas) && res.data.datas.length > 0) {
          setMainCategoryList(res.data.datas);
        }
      })
      .catch(() => {});

    // If Edit mode, fetch document details
    if (isEdit && id) {
      setFetching(true);
      api.get(`/dokumen/${id}`)
        .then(res => {
          const item = res.data?.data || res.data?.datas;
          if (res.data?.success && item) {
            setNamaDokumen(item.nama_dokumen || '');
            setTerbit(item.terbit ? new Date(item.terbit).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
            setCurrentFileName(item.nama_dokumen ? `${item.nama_dokumen}.${item.tipe_file || 'pdf'}` : '');
            setCurrentFileUrl(item.file_url || '');

            const subId = item.id_arsip || item.id_kategori || item.kategori_dokumen?.id_kategori || '';
            setIdKategori(subId);

            const mainId = item.arsip?.id_kategori || item.arsip?.kategori_arsip?.id_kategori || item.kategori_dokumen?.kategori_arsip?.id_kategori || '';
            setSelectedMainCategory(mainId);
          } else {
            addToast('error', 'Dokumen tidak ditemukan.');
            navigate('/dokumen');
          }
        })
        .catch(err => {
          console.error(err);
          addToast('error', 'Gagal memuat data dokumen.');
          navigate('/dokumen');
        })
        .finally(() => setFetching(false));
    }
  }, [id, isEdit, navigate, addToast]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!isEdit && !namaDokumen) {
        setNamaDokumen(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handlePreviewFile = (fileObj) => {
    if (!fileObj) return;
    if (fileObj instanceof File) {
      const selectedCategory = categoryList.find(l => String(l.id_arsip || l.id_kategori) === String(idKategori));
      const catName = selectedCategory?.nama_arsip || selectedCategory?.nama_kategori || 'Kategori Dokumen';
      setPreviewFileModalData({
        nama_dokumen: namaDokumen || fileObj.name,
        tipe_file: fileObj.name.split('.').pop() || 'pdf',
        ukuran_file: (fileObj.size / (1024 * 1024)).toFixed(2) + ' MB',
        kategori_dokumen: { nama_kategori: catName },
        file_url: URL.createObjectURL(fileObj)
      });
    } else {
      setPreviewFileModalData({
        nama_dokumen: namaDokumen || currentFileName,
        file_url: currentFileUrl,
        tipe_file: currentFileName.split('.').pop() || 'pdf'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!namaDokumen.trim()) return addToast('error', 'Nama dokumen wajib diisi!');
    if (!idKategori) return addToast('error', 'Pilih Nama Arsip Dokumen!');
    if (!isEdit && !selectedFile) return addToast('error', 'Berkas file dokumen wajib diunggah!');

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('nama_dokumen', namaDokumen);
      formData.append('id_arsip', idKategori);
      formData.append('id_kategori', idKategori);
      formData.append('terbit', terbit);

      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const endpoint = isEdit ? `/dokumen/${id}` : '/dokumen/upload';
      const method = isEdit ? api.put : api.post;

      const res = await method(endpoint, formData);

      if (res.data?.success) {
        localStorage.setItem('_flash', JSON.stringify({
          type: 'success',
          message: res.data.message || (isEdit ? 'Dokumen berhasil diperbarui!' : 'Dokumen baru berhasil diunggah!')
        }));
        navigate('/dokumen');
      } else {
        addToast('error', res.data?.message || res.data?.msg || 'Gagal menyimpan dokumen.');
      }
    } catch (err) {
      console.error('Error submitting dokumen:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.msg || err.message || 'Gagal menyimpan dokumen. Silakan periksa koneksi server.';
      addToast('error', errMsg);
    } finally {
      setLoading(false);
    }
  };

  const formProps = {
    namaDokumen,
    setNamaDokumen,
    selectedMainCategory,
    setSelectedMainCategory,
    mainCategoryList,
    idKategori,
    setIdKategori,
    categoryList,
    terbit,
    setTerbit,
    selectedFile,
    currentFileName,
    currentFileUrl,
    handleFileChange,
    onPreviewFile: handlePreviewFile,
    loading,
    isEdit,
    handleSubmit,
    onCancel: () => navigate('/dokumen')
  };

  return {
    formProps,
    previewFileModalData,
    setPreviewFileModalData,
    fetching,
    toasts,
    removeToast
  };
}
