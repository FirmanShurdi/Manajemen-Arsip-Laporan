import React from 'react';
import FileIcon from '../common/FileIcon';
import ActionDropdown from '../common/ActionDropdown';

export default function DokumenTable({
  dokumenItems = [],
  onEdit,
  onDelete,
  onViewFile,
  onSort,
  sortConfig,
  startIndex = 1,
  totalData = 0
}) {
  const getSortIcon = (key) => (
    <svg className={`ml-1.5 h-3.5 w-3.5 inline-block transition-transform ${sortConfig?.key === key ? 'text-blue-600' : 'text-slate-300'}`} viewBox="0 0 20 20" fill="currentColor">
      <path d={sortConfig?.key === key && sortConfig.direction === 'ASC' ? "M3 10h14l-7-7-7 7z" : "M3 10h14l-7 7-7-7z"} />
    </svg>
  );

  const renderHeader = (label, key) => (
    <th onClick={() => onSort && onSort(key)} className="px-4 py-3.5 text-left text-xs md:text-sm font-bold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 select-none transition-colors">
      <div className="flex items-center">{label}{getSortIcon(key)}</div>
    </th>
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
      <table className="w-full text-left text-sm divide-y divide-slate-200">
        <thead className="bg-slate-50/90">
          <tr>
            <th className="px-4 py-3.5 text-xs md:text-sm font-bold text-slate-600 uppercase w-12 text-center">No</th>
            {renderHeader("Nama Dokumen & Kategori", "nama_dokumen")}
            {renderHeader("Pengunggah", "uploader")}
            {renderHeader("Tanggal Terbit", "terbit")}
            {renderHeader("Ukuran", "ukuran_file")}
            {renderHeader("Di Unggah", "created_at")}
            <th className="px-4 py-3.5 text-right text-xs md:text-sm font-bold text-slate-600 uppercase w-20">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
          {dokumenItems?.length > 0 ? (
            dokumenItems.map((item, index) => {
              const parentCat = item.arsip?.kategori_arsip?.nama_kategori;
              const subCat = item.arsip?.nama_arsip || item.kategori_arsip?.nama_kategori || item.kategori_dokumen?.nama_kategori || 'Umum';
              const showBoth = parentCat && parentCat !== subCat;
              const itemNumber = totalData > 0 ? (totalData - (startIndex - 1) - index) : (startIndex + index);

              return (
                <tr key={item.id_dokumen} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-4 py-3.5 text-center text-sm font-semibold text-slate-500">{itemNumber}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div 
                        onClick={() => onViewFile && onViewFile(item)} 
                        className="cursor-pointer group hover:scale-105 transition-transform" 
                        title="Klik untuk membuka dokumen"
                      >
                        <FileIcon tipeFile={item.tipe_file} namaDokumen={item.nama_dokumen} />
                      </div>
                      <div>
                        <p 
                          onClick={() => onViewFile && onViewFile(item)} 
                          className="font-bold text-slate-900 text-sm md:text-base hover:text-blue-600 cursor-pointer truncate max-w-md" 
                          title="Klik membuka dokumen"
                        >
                          {item.nama_dokumen || '-'}
                        </p>
                        {/* Kategori & Sub-Arsip dengan Truncate & Tooltip Full Text */}
                        <div className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded mt-1 font-semibold max-w-xs">
                          {showBoth ? (
                            <>
                              <span 
                                className="truncate max-w-[130px] inline-block cursor-text" 
                                title={parentCat}
                              >
                                {parentCat}
                              </span>
                              <span className="text-slate-400 font-bold">•</span>
                              <span 
                                className="truncate max-w-[130px] inline-block cursor-text" 
                                title={subCat}
                              >
                                {subCat}
                              </span>
                            </>
                          ) : (
                            <span 
                              className="truncate max-w-[220px] inline-block cursor-text" 
                              title={subCat}
                            >
                              {subCat}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-slate-800">
                    {item.user?.nama_lengkap || item.user?.username || 'System'}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-700">
                    {item.terbit ? new Date(item.terbit).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-600 font-mono">{item.ukuran_file || '-'}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-700">
                    {item.created_at ? (
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">
                          {new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          {new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                        </p>
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <ActionDropdown
                      item={item}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onViewFile={onViewFile}
                    />
                  </td>
                </tr>
              );
            })
          ) : (
            <tr><td colSpan="7" className="px-4 py-12 text-center text-slate-400 text-sm font-semibold">Tidak ada dokumen yang ditemukan.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
