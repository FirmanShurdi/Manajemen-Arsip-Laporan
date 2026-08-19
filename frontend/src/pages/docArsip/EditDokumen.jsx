import React from 'react';
import DokumenForm from '../../components/form/DokumenForm';
import FileViewer from '../../components/modal/FileViewer';
import Flash from '../../components/flash/flash';
import { useDokumenFormState } from '../../hooks/useDokumenFormState';

export default function EditDokumen() {
  const {
    formProps,
    previewFileModalData,
    setPreviewFileModalData,
    fetching,
    toasts,
    removeToast
  } = useDokumenFormState({ isEdit: true });

  return (
    <>
      <Flash toasts={toasts} removeToast={removeToast} />

      <div className="space-y-6 w-full">
        <FileViewer
          isOpen={!!previewFileModalData}
          file={previewFileModalData}
          onClose={() => setPreviewFileModalData(null)}
        />

        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Edit Dokumen Arsip</h1>
          <p className="text-xs md:text-sm text-slate-500">Perbarui informasi berkas dokumen arsip digital dan hubungkan dengan kategori dokumen.</p>
        </div>

        {fetching ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-bold text-slate-600">Memuat data dokumen...</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
            <DokumenForm {...formProps} />
          </div>
        )}
      </div>
    </>
  );
}
