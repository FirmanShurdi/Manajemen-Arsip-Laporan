import React from 'react';

export default function MetricCards({ 
  totalDokumen = 0, 
  totalKategori = 0, 
  dokumenToday = 0 
}) {
  const stats = [
    {
      label: "Total Dokumen Terarsip",
      value: totalDokumen,
      today: dokumenToday,
      iconBg: "bg-blue-50 text-blue-600",
      icon: (
        <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      )
    },
    {
      label: "Upload Hari Ini",
      value: dokumenToday,
      today: dokumenToday,
      iconBg: "bg-emerald-50 text-emerald-600",
      icon: (
        <svg className="h-6 w-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      )
    },
    {
      label: "Kategori Arsip",
      value: totalKategori,
      today: 0,
      iconBg: "bg-indigo-50 text-indigo-600",
      icon: (
        <svg className="h-6 w-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}>
            {stat.icon}
          </div>
          <div className="mt-5 flex items-end justify-between">
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</span>
              <h4 className="mt-1 text-2xl font-bold text-gray-800">{stat.value}</h4>
            </div>
            {stat.today > 0 && (
              <div className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                <span>+{stat.today} Baru</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
