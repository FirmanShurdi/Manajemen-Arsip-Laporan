import React, { useState, useRef, useEffect } from 'react';

// Sub-komponen Input Tanggal dengan Format Tanggal/Bulan/Tahun (DD/MM/YYYY)
function FormattedDateInput({ value, onChange, placeholder = "DD/MM/YYYY" }) {
  const inputRef = useRef(null);

  // Format YYYY-MM-DD ke DD/MM/YYYY untuk tampilan visual
  const formatDisplay = (val) => {
    if (!val || typeof val !== 'string') return '';
    const [y, m, d] = val.split('-');
    if (y && m && d) return `${d}/${m}/${y}`;
    return val;
  };

  const handleOpenPicker = () => {
    if (inputRef.current) {
      if (typeof inputRef.current.showPicker === 'function') {
        try {
          inputRef.current.showPicker();
        } catch (_) {
          inputRef.current.focus();
          inputRef.current.click();
        }
      } else {
        inputRef.current.focus();
        inputRef.current.click();
      }
    }
  };

  return (
    <div 
      onClick={handleOpenPicker}
      className="relative w-full cursor-pointer group"
    >
      <input
        type="text"
        readOnly
        value={formatDisplay(value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 pr-9 text-xs font-semibold text-slate-800 outline-none group-hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer select-none"
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleOpenPicker();
        }}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-600 cursor-pointer p-0.5 transition-colors"
        title="Pilih Tanggal"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>

      {/* Hidden Native Input Date Trigger */}
      <input
        ref={inputRef}
        type="date"
        lang="id-ID"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
        style={{ left: 0, bottom: 0 }}
      />
    </div>
  );
}

export default function DateRangeFilter({
  dateType = 'created_at',
  startDate = '',
  endDate = '',
  onApply,
  onClear
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempType, setTempType] = useState(dateType);
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd] = useState(endDate);
  const popoverRef = useRef(null);

  useEffect(() => {
    setTempType(dateType);
    setTempStart(startDate);
    setTempEnd(endDate);
  }, [dateType, startDate, endDate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatLocalDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handlePreset = (days) => {
    const now = new Date();
    const endStr = formatLocalDate(now);
    let start = new Date();

    if (days === 0) {
      start = now;
    } else if (days === 30) {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      start.setDate(now.getDate() - days);
    }

    setTempStart(formatLocalDate(start));
    setTempEnd(endStr);
  };

  const handleApply = () => {
    if (onApply) onApply({ dateType: tempType, startDate: tempStart, endDate: tempEnd });
    setIsOpen(false);
  };

  const handleReset = (e) => {
    if (e) e.stopPropagation();
    setTempStart('');
    setTempEnd('');
    if (onClear) onClear();
    setIsOpen(false);
  };

  const hasActiveFilter = !!(startDate || endDate);
  const activeTypeLabel = (startDate || endDate ? dateType : tempType) === 'terbit' ? 'Terbit' : 'Diunggah';

  const fmtDate = (dStr) => {
    if (!dStr || typeof dStr !== 'string') return '';
    const [y, m, d] = dStr.split('-');
    return `${d}/${m}/${y?.slice(2)}`;
  };

  let label = 'Filter Tanggal';
  if (hasActiveFilter) {
    if (startDate && endDate) label = `${activeTypeLabel}: ${fmtDate(startDate)} - ${fmtDate(endDate)}`;
    else if (startDate) label = `${activeTypeLabel} ≥ ${fmtDate(startDate)}`;
    else if (endDate) label = `${activeTypeLabel} ≤ ${fmtDate(endDate)}`;
  }

  return (
    <div ref={popoverRef} className="relative w-full sm:w-auto min-w-[190px] z-20">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 h-11 rounded-xl border py-2 pl-9 pr-9 text-xs md:text-sm font-semibold outline-none transition-all shadow-2xs select-none cursor-pointer ${
          hasActiveFilter
            ? 'border-blue-500 bg-blue-50/40 text-blue-900 font-bold'
            : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
        }`}
      >
        <svg className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>

        <span className="truncate" title={label}>{label}</span>

        <div className="absolute right-2.5 flex items-center">
          {hasActiveFilter ? (
            <span
              onClick={handleReset}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold cursor-pointer hover:bg-blue-200"
              title="Bersihkan Filter Tanggal"
            >
              ×
            </span>
          ) : (
            <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 sm:right-0 top-full mt-1.5 z-50 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl min-w-[280px] sm:min-w-[310px] animate-in fade-in duration-100">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">Filter Rentang Tanggal</span>
            {hasActiveFilter && (
              <button type="button" onClick={handleReset} className="text-[11px] font-bold text-red-600 hover:underline">
                Reset
              </button>
            )}
          </div>

          {/* Segmented Switch: Diunggah vs Terbit */}
          <div className="mt-3">
            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Filter Berdasarkan:</label>
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setTempType('created_at')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  tempType === 'created_at' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tgl Diunggah
              </button>
              <button
                type="button"
                onClick={() => setTempType('terbit')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  tempType === 'terbit' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tgl Terbit
              </button>
            </div>
          </div>

          {/* Formatted Date Range Inputs (DD/MM/YYYY Format) */}
          <div className="mt-3 space-y-2.5">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Dari Tanggal:</label>
              <FormattedDateInput
                value={tempStart}
                onChange={(val) => setTempStart(val)}
                placeholder="DD/MM/YYYY"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Sampai Tanggal:</label>
              <FormattedDateInput
                value={tempEnd}
                onChange={(val) => setTempEnd(val)}
                placeholder="DD/MM/YYYY"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div className="mt-3">
            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Pilihan Cepat:</label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handlePreset(0)}
                className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Hari Ini
              </button>
              <button
                type="button"
                onClick={() => handlePreset(7)}
                className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                7 Hari Terakhir
              </button>
              <button
                type="button"
                onClick={() => handlePreset(30)}
                className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Bulan Ini
              </button>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-2xs cursor-pointer active:scale-95"
            >
              Terapkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
