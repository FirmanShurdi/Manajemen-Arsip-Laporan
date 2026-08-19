import React from 'react';

export default function PdfFormat({ fileUrl, fileName, onError }) {
  return (
    <iframe
      src={fileUrl}
      title={fileName}
      onError={onError}
      className="w-full h-full rounded-2xl bg-white shadow-xl border border-slate-200"
    />
  );
}
