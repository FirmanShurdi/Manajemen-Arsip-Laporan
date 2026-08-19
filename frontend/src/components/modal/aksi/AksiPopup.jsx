import React from 'react';
import { createPortal } from 'react-dom';

/**
 * Komponen Wadah Pop-Up Form Serbaguna (AksiPopup)
 * Dipangkas ringkas (~45 baris) dengan dukungan scrollbar vertikal dinamis.
 */
export default function AksiPopup({
  isOpen, onClose, onSubmit,
  title = 'Form Data', subtitle = '',
  loading = false, submitText, cancelText = 'Batal',
  isEditMode = false, errorMsg = '', maxWidth = 'max-w-lg', children
}) {
  if (!isOpen) return null;
  const defaultSubmitText = isEditMode ? 'Simpan Perubahan' : 'Simpan Data';

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className={`w-full ${maxWidth} max-h-[90vh] flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-2xl overflow-hidden animate-scale-up`}>
        
        {/* Header (Sticky / Fixed at Top) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h3>
            {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors font-bold text-sm cursor-pointer">
            ✕
          </button>
        </div>

        {/* Form Body & Dynamic Fields (Scrollable) */}
        <form onSubmit={onSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-75px)] custom-scrollbar">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-4">{children}</div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} disabled={loading} className="px-4.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50 cursor-pointer">
              {cancelText}
            </button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 transition-all shadow-xs disabled:opacity-50 cursor-pointer">
              {loading ? 'Menyimpan...' : (submitText || defaultSubmitText)}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
