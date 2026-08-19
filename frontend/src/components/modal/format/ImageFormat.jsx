import React from 'react';

export default function ImageFormat({ fileUrl, fileName, onError }) {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-8 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-auto">
      <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-lg max-h-full max-w-full flex items-center justify-center">
        <img
          src={fileUrl}
          alt={fileName}
          onError={onError}
          className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-xs"
        />
      </div>
    </div>
  );
}
