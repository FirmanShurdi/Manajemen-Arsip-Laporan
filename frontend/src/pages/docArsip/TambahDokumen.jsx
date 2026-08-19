import React from 'react';
import DokumenForm from '../../components/form/DokumenForm';
import FileViewer from '../../components/modal/FileViewer';
import Flash from '../../components/flash/flash';
import { useDokumenFormState } from '../../hooks/useDokumenFormState';

export default function TambahDokumen() {
  const {
    formProps,
    previewFileModalData,
    setPreviewFileModalData,
    toasts,
    removeToast
  } = useDokumenFormState({ isEdit: false });

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
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Tambah Dokumen Arsip Baru</h1>
          <p className="text-xs md:text-sm text-slate-500">Unggah berkas dokumen arsip digital baru dan hubungkan dengan kategori dokumen.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
          <DokumenForm {...formProps} />
        </div>
      </div>
    </>
  );
}
