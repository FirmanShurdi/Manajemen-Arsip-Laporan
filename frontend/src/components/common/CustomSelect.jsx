import React, { useState, useRef, useEffect } from 'react';
import SearchBar from './SearchBar';

export default function CustomSelect({
  value,
  onChange,
  onClear,
  options = [],
  getOptionId = (item) => item.id_kategori || item.id_arsip || item.id,
  getOptionLabel = (item) => item.nama_kategori || item.nama_arsip || item.nama || item.label,
  placeholder = 'Pilih Opsi',
  defaultLabel = 'Semua Data',
  showIcon = true,
  showSearch = true
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeItem = options.find((item) => String(getOptionId(item)) === String(value));
  const activeLabel = activeItem ? getOptionLabel(activeItem) : (placeholder || defaultLabel);
  const filtered = options.filter((item) =>
    (getOptionLabel(item) || '').toLowerCase().includes(search.toLowerCase().trim())
  );

  const handleSelect = (item) => {
    const id = getOptionId(item);
    if (onChange) {
      onChange({ target: { value: id } }, item);
    }
    setIsOpen(false);
    setSearch('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onClear) onClear();
    if (onChange) onChange({ target: { value: '' } }, null);
    setSearch('');
  };

  return (
    <div ref={dropdownRef} className="relative w-full sm:w-auto min-w-[200px] z-20">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 h-11 rounded-xl border py-2 ${
          showIcon ? 'pl-9' : 'pl-4'
        } pr-9 text-sm font-semibold outline-none transition-all shadow-2xs select-none ${
          value
            ? 'border-blue-500 bg-blue-50/40 text-blue-900 font-bold'
            : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
        }`}
      >
        {showIcon && (
          <svg className="absolute left-3 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
        )}
        <span className="truncate cursor-pointer" title={activeLabel}>{activeLabel}</span>
        <div className="absolute right-2.5 flex items-center">
          {value ? (
            <span
              onClick={handleClear}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold cursor-pointer hover:bg-blue-200"
            >
              ×
            </span>
          ) : (
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-30 rounded-xl border border-slate-200 bg-white p-2 shadow-2xl min-w-[240px]">
          {showSearch && (
            <div className="mb-2 shrink-0">
              <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch('')} placeholder="Cari..." />
            </div>
          )}
          <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-0.5 pr-2">
            {filtered.length > 0 ? (
              filtered.map((item) => {
                const itemId = getOptionId(item);
                const itemLabel = getOptionLabel(item);
                const isSelected = String(itemId) === String(value);

                return (
                  <button
                    key={itemId}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate cursor-pointer" title={itemLabel}>{itemLabel}</span>
                    {isSelected && (
                      <svg className="w-4 h-4 text-blue-600 shrink-0 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-3 text-center text-xs text-slate-400 font-medium">Tidak ada opsi ditemukan.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
