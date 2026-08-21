import React from 'react';

export default function RowsPerPageSelect({ value, onChange, options = ['5', '10', '20', '50', 'Semua'], totalItems = 0 }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
      <span>Tampilkan</span>
      <select
        value={value}
        onChange={onChange}
        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500 cursor-pointer font-semibold"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <span>data dari <strong className="font-semibold text-slate-800">{totalItems}</strong> data</span>
    </div>
  );
}
