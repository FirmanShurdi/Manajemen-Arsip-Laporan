import React, { useState, useEffect, lazy, Suspense } from 'react';
import FileIcon from '../common/FileIcon';
import { backendURL } from '../../api/axiosInstance';

// Lazy loading format renderers agar FileViewer sangat ringan dan cepat dimuat
const ExcelFormat = lazy(() => import('./format/ExcelFormat'));
const PdfFormat = lazy(() => import('./format/PdfFormat'));
const ImageFormat = lazy(() => import('./format/ImageFormat'));
const WordFormat = lazy(() => import('./format/WordFormat'));
const DefaultFormat = lazy(() => import('./format/DefaultFormat'));

export default function FileViewer({ isOpen, file, onClose }) {
  const [fileError, setFileError] = useState(false);
  const [checkingFile, setCheckingFile] = useState(true);

  const ext = (file?.tipe_file || file?.nama_dokumen?.split('.').pop() || 'pdf').toLowerCase().replace('.', '');
  const categoryName = file?.arsip?.nama_arsip || file?.kategori_arsip?.nama_kategori || file?.kategori_dokumen?.nama_kategori || 'Kategori Dokumen';
  
  const rawUrl = file?.file_url || `/File/${encodeURIComponent(categoryName)}/${encodeURIComponent(file?.nama_dokumen || '')}.${ext}`;
  const fullFileUrl = (rawUrl.startsWith('http') || rawUrl.startsWith('blob:')) 
    ? rawUrl 
    : `${backendURL}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;

  useEffect(() => {
    if (!isOpen || !file) return;

    setFileError(false);

    if (fullFileUrl.startsWith('blob:')) {
      setCheckingFile(false);
      return;
    }

    setCheckingFile(true);
    fetch(fullFileUrl, { method: 'GET' })
      .then((res) => { if (!res.ok) setFileError(true); })
      .catch(() => setFileError(true))
      .finally(() => setCheckingFile(false));
  }, [isOpen, file, fullFileUrl]);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !file) return null;

  const isExcel = ['xlsx', 'xls', 'xlsm', 'csv'].includes(ext);
  const isPdf = ext === 'pdf';
  const isImage = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext);
  const isWord = ['doc', 'docx'].includes(ext);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0 shadow-xs">
        <div className="flex items-center gap-3 min-w-0 pr-4">
          <FileIcon tipeFile={ext} namaDokumen={file.nama_dokumen} className="h-9 w-9 shrink-0" />
          <div className="min-w-0">
            <h2 className="text-sm md:text-base font-bold truncate tracking-tight text-slate-900" title={file.nama_dokumen}>
              {file.nama_dokumen}
            </h2>
            <p className="text-xs text-slate-500 truncate font-medium">
              {categoryName} • Ukuran: {file.ukuran_file || 'Standard'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!fileError && !checkingFile && (
            <a
              href={fullFileUrl}
              download={file.nama_dokumen}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-xs font-bold text-white transition-all shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Unduh Berkas</span>
            </a>
          )}
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 hover:bg-rose-50 border border-slate-200 text-slate-500 hover:text-rose-600 transition-all active:scale-90"
            title="Tutup (Esc)"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Viewport Content */}
      <div className="flex-1 w-full h-full p-2 md:p-4 overflow-hidden flex items-center justify-center">
        {checkingFile ? (
          <FileLoadingState />
        ) : fileError ? (
          <FileNotAvailableState categoryName={categoryName} onClose={onClose} />
        ) : (
          <Suspense fallback={<FileLoadingState />}>
            {isExcel && <ExcelFormat fileUrl={fullFileUrl} fileName={file.nama_dokumen} onError={() => setFileError(true)} />}
            {isPdf && <PdfFormat fileUrl={fullFileUrl} fileName={file.nama_dokumen} onError={() => setFileError(true)} />}
            {isImage && <ImageFormat fileUrl={fullFileUrl} fileName={file.nama_dokumen} onError={() => setFileError(true)} />}
            {isWord && <WordFormat fileUrl={fullFileUrl} fileName={file.nama_dokumen} ext={ext} onError={() => setFileError(true)} />}
            {!isExcel && !isPdf && !isImage && !isWord && <DefaultFormat fileUrl={fullFileUrl} fileName={file.nama_dokumen} ext={ext} />}
          </Suspense>
        )}
      </div>
    </div>
  );
}

function FileLoadingState() {
  return (
    <div className="max-w-xs w-full bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-xl flex flex-col items-center justify-center gap-3 animate-in zoom-in-95 duration-150">
      <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <div>
        <p className="text-xs font-bold text-slate-800">Sedang memuat berkas...</p>
        <p className="text-[11px] text-slate-500 font-medium mt-0.5">Mohon tunggu sebentar...</p>
      </div>
    </div>
  );
}

function FileNotAvailableState({ categoryName, onClose }) {
  return (
    <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-xl animate-in zoom-in-95 duration-150">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
      <h3 className="font-bold text-lg text-slate-800 mb-2">file tidak ada / belum diupload</h3>
      <p className="text-xs text-slate-500 mb-6 leading-relaxed">
        Berkas fisik dokumen ini tidak ditemukan di server atau belum diunggah ke direktori <span className="font-semibold text-slate-700">"{categoryName}"</span>.
      </p>
      <button
        onClick={onClose}
        className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition-all active:scale-95"
      >
        Kembali
      </button>
    </div>
  );
}
