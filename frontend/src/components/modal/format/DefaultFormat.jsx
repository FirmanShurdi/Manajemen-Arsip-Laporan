import React from 'react';

export default function DefaultFormat({ fileUrl, fileName, ext = 'file' }) {
  return (
    <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-xl text-slate-800">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </div>
      <h3 className="font-bold text-lg text-slate-800 mb-1 truncate" title={fileName}>{fileName}</h3>
      <p className="text-xs text-slate-500 mb-6">
        Format <span className="uppercase font-bold text-slate-700">{ext}</span> mendukung pengunduhan berkas secara langsung.
      </p>
      <div className="flex items-center justify-center gap-3">
        <a
          href={fileUrl}
          download={fileName}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs active:scale-95"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Unduh Berkas (.{ext})</span>
        </a>
      </div>
    </div>
  );
}
