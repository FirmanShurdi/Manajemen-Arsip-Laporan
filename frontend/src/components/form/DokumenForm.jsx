import React from 'react';
import CategoryFilter from '../ui/CategoryFilter';
import ArsipFilter from '../ui/ArsipFilter';
import FileUploadZone from './FileUploadZone';

export default function DokumenForm({
  namaDokumen, setNamaDokumen,
  selectedMainCategory = '', setSelectedMainCategory,
  mainCategoryList = [],
  idKategori, setIdKategori,
  categoryList = [],
  terbit, setTerbit,
  selectedFile, handleFileChange,
  currentFileName = '',
  currentFileUrl = '',
  onPreviewFile,
  loading = false,
  isEdit = false,
  submitLabel,
  loadingLabel,
  handleSubmit, onCancel
}) {
  // Filter list Sub-Arsip presisi berdasarkan Kategori Utama yang dipilih
  const filteredSubArsip = selectedMainCategory
    ? categoryList.filter(item => {
        const pId = item.id_kategori;
        const pName = typeof item.kategori_arsip === 'object' ? item.kategori_arsip?.nama_kategori : item.kategori_arsip;
        return String(pId) === String(selectedMainCategory) || String(pName) === String(selectedMainCategory);
      })
    : categoryList;

  const activeSubmitText = submitLabel || (isEdit ? 'Simpan Perubahan' : 'Unggah & Simpan Dokumen');
  const activeLoadingText = loadingLabel || (isEdit ? 'Menyimpan...' : 'Mengunggah...');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Nama Dokumen (Full Width across columns) */}
        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nama Dokumen Arsip <span className="text-rose-500">*</span></label>
          <input type="text" required value={namaDokumen} onChange={(e) => setNamaDokumen(e.target.value)} placeholder="Contoh: Laporan Operasional Magang Q3 2026" className="w-full h-11 rounded-xl border border-slate-300 px-4 text-xs md:text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
        </div>

        {/* Filter Kategori Utama (Induk) */}
        <div className="relative z-40">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Kategori Utama</label>
          <CategoryFilter 
            selectedCategory={selectedMainCategory} 
            onChange={(e) => {
              const val = e.target.value;
              setSelectedMainCategory && setSelectedMainCategory(val);
              // Reset sub-arsip jika tidak sesuai dengan Kategori Utama yang baru dipilih
              if (idKategori && val) {
                const isValid = categoryList.some(item => {
                  const isSubMatch = String(item.id_arsip) === String(idKategori);
                  const pId = item.id_kategori;
                  const pName = typeof item.kategori_arsip === 'object' ? item.kategori_arsip?.nama_kategori : item.kategori_arsip;
                  return isSubMatch && (String(pId) === String(val) || String(pName) === String(val));
                });
                if (!isValid && setIdKategori) setIdKategori('');
              }
            }} 
            onClear={() => setSelectedMainCategory && setSelectedMainCategory('')} 
            categoryOptions={mainCategoryList} 
            placeholder="Semua Kategori Utama"
            showIcon={false}
          />
        </div>

        {/* Filter Nama Arsip Dokumen */}
        <div className="relative z-30">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nama Arsip Dokumen <span className="text-rose-500">*</span></label>
          <ArsipFilter 
            selectedArsip={idKategori} 
            onChange={(e) => {
              const selectedSubId = e.target.value;
              setIdKategori && setIdKategori(selectedSubId);
              // Otomatis set Kategori Utama saat Sub-Arsip dipilih
              if (selectedSubId && categoryList.length > 0) {
                const item = categoryList.find(c => String(c.id_arsip) === String(selectedSubId));
                if (item) {
                  const pId = item.id_kategori;
                  if (pId && setSelectedMainCategory) {
                    setSelectedMainCategory(String(pId));
                  }
                }
              }
            }} 
            onClear={() => {
              setIdKategori && setIdKategori('');
              setSelectedMainCategory && setSelectedMainCategory('');
            }} 
            arsipOptions={filteredSubArsip} 
            placeholder="Pilih Nama Arsip Dokumen" 
            showIcon={false} 
          />
        </div>

        {/* Tanggal Terbit Dokumen */}
        <div className="relative z-20">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Tanggal Terbit Dokumen <span className="text-rose-500">*</span></label>
          <input type="date" required value={terbit} onChange={(e) => setTerbit(e.target.value)} className="w-full h-11 rounded-xl border border-slate-300 px-4 text-xs md:text-sm text-slate-800 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all" />
        </div>
      </div>

      {/* Upload Zone (Full Width) */}
      <div className="relative z-10">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Unggah Berkas File Dokumen {!isEdit && <span className="text-rose-500">*</span>}</label>
        <FileUploadZone 
          selectedFile={selectedFile} 
          currentFileName={currentFileName}
          currentFileUrl={currentFileUrl}
          onFileChange={handleFileChange} 
          onPreviewFile={onPreviewFile}
          maxSizeMB={20} 
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        {onCancel && <button type="button" onClick={onCancel} disabled={loading} className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">Batal</button>}
        <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-xs md:text-sm font-bold text-white shadow-xs transition-all disabled:opacity-50">
          {loading ? activeLoadingText : activeSubmitText}
        </button>
      </div>
    </form>
  );
}
