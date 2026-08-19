import React, { useState, useEffect, useRef } from 'react';

export default function PreviewNotice({ fileType = 'Word / Excel', autoHideMs = 5000 }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hasAutoCollapsed, setHasAutoCollapsed] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setIsExpanded(true);
    setHasAutoCollapsed(false);

    const timer = setTimeout(() => {
      setIsExpanded(false);
      setHasAutoCollapsed(true);
    }, autoHideMs);

    return () => clearTimeout(timer);
  }, [fileType, autoHideMs]);

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (hasAutoCollapsed) {
      setIsExpanded(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block text-left"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Badge Tombol Utama di Header Bar (Gambar 1 Tetap Di Sini) */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100/90 border border-amber-200 text-amber-800 rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer group"
        title="Arahkan kursor atau klik untuk melihat info pratinjau"
      >
        <span className="relative flex h-2.5 w-2.5 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <svg className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span className="text-[11px] font-bold tracking-tight">Catatan Pratinjau</span>
      </button>

      {/* Floating Popover Melayang Di Bawah Badge (Tanpa Menggeser Layout Bar) */}
      {isExpanded && (
        <div className="absolute right-0 top-full mt-2 z-[9999] w-72 sm:w-88 p-3.5 bg-amber-50 border border-amber-300 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-start gap-2.5">
            <div className="flex items-center justify-center h-6 w-6 rounded-lg bg-amber-200/70 text-amber-800 shrink-0 font-bold mt-0.5">
              <svg className="w-4 h-4 text-amber-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            
            <div className="flex-1 text-[11px] sm:text-xs text-amber-900 leading-relaxed">
              <div className="flex items-center justify-between font-bold text-amber-950 mb-1">
                <span>Info Pratinjau {fileType}:</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                  className="text-amber-600 hover:text-amber-950 font-bold text-xs p-0.5 rounded hover:bg-amber-200/50 transition-colors"
                >
                  ✕
                </button>
              </div>
              <p>
                Tampilan visual browser adalah rancangan otomatis oleh sistem. Format tata letak dan jumlah halaman mungkin sedikit berbeda, namun{' '}
                <span className="font-bold text-amber-950 bg-amber-200/60 px-1 py-0.5 rounded border border-amber-300/50 inline-block mt-0.5">
                  berkas asli di server dipastikan 100% sama &amp; tidak terpengaruh.
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
