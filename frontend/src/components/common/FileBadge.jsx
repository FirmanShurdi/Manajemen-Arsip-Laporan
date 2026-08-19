import React from 'react';

export default function FileBadge({ type }) {
  const t = (type || 'pdf').toLowerCase();
  let bgClass = "bg-red-50 text-red-600 border-red-200";
  
  if (t.includes('xls') || t.includes('csv')) {
    bgClass = "bg-emerald-50 text-emerald-600 border-emerald-200";
  } else if (t.includes('doc')) {
    bgClass = "bg-blue-50 text-blue-600 border-blue-200";
  } else if (t.includes('png') || t.includes('jpg') || t.includes('jpeg')) {
    bgClass = "bg-amber-50 text-amber-600 border-amber-200";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase border ${bgClass}`}>
      {t}
    </span>
  );
}
