import React from 'react';
import FileIcon from '../common/FileIcon';

export default function FileUploadZone({
  selectedFile,
  currentFileName,
  currentFileUrl,
  onFileChange,
  onPreviewFile,
  accept = ".pdf,.xlsx,.xls,.xlsm,.csv,.doc,.docx,.png,.jpg,.jpeg",
  maxSizeMB = 20
}) {
  const fileExt = selectedFile 
    ? selectedFile.name.split('.').pop() 
    : currentFileName 
      ? currentFileName.split('.').pop() 
      : '';

  const activeName = selectedFile ? selectedFile.name : currentFileName;

  return (
    <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 md:p-8 bg-slate-50/50 hover:bg-blue-50/20 transition-all cursor-pointer group">
      <input
        type="file"
        name="file"
        required={!selectedFile && !currentFileName}
        onChange={onFileChange}
        accept={accept}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
      />

      {activeName ? (
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 w-full p-3 bg-white rounded-xl border border-blue-200 shadow-2xs">
          <div
            onClick={(e) => {
              if (onPreviewFile) {
                e.stopPropagation();
                onPreviewFile(selectedFile || { nama_dokumen: currentFileName, file_url: currentFileUrl });
              }
            }}
            className="z-20 cursor-pointer hover:scale-105 transition-transform"
            title="Klik untuk lihat pratinjau file"
          >
            <FileIcon tipeFile={fileExt} namaDokumen={activeName} className="h-12 w-12 shrink-0" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p
                onClick={(e) => {
                  if (onPreviewFile) {
                    e.stopPropagation();
                    onPreviewFile(selectedFile || { nama_dokumen: currentFileName, file_url: currentFileUrl });
                  }
                }}
                className="text-sm font-bold text-slate-800 hover:text-blue-600 truncate cursor-pointer z-20"
                title="Klik untuk lihat pratinjau file"
              >
                {activeName}
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedFile 
                ? `Ukuran: ${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` 
                : 'Berkas Fisik Terdaftar • Klik / tarik file baru untuk mengganti'}
            </p>
          </div>

          <div className="flex items-center gap-2 z-20 shrink-0">
            {onPreviewFile && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreviewFile(selectedFile || { nama_dokumen: currentFileName, file_url: currentFileUrl });
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
                title="Pratinjau Berkas File"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>Lihat Pratinjau</span>
              </button>
            )}

            <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
              selectedFile 
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                : 'text-blue-700 bg-blue-50 border-blue-200'
            }`}>
              {selectedFile ? '✓ Berkas Baru Dipilih' : '📁 Berkas Terpasang'}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-2">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p className="text-sm font-bold text-slate-800">
            Tarik &amp; Lepaskan Berkas ke Sini atau <span className="text-blue-600 underline">Cari Berkas</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Mendukung Format PDF, Excel (.xlsx/.xlsm), Word (.docx), dan Gambar (JPG/PNG) • Maksimal {maxSizeMB} MB
          </p>
        </div>
      )}
    </div>
  );
}
