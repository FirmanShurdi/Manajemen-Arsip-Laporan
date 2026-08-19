import React from 'react';
import SearchBar from './SearchBar';
import ActionDropdown from './ActionDropdown';

export default function MasterTable({
  columns = [],
  data = [],
  loading = false,
  searchTerm = '',
  onSearchChange,
  onSearchClear,
  searchPlaceholder = 'Cari data...',
  filterComponent = null,
  tabsComponent = null,
  paginationComponent = null,
  footerComponent = null,
  onEdit,
  onDelete,
  onViewFile,
  onDownload,
  disabledDelete = () => false,
  deleteTitle = () => '',
  emptyMessage = 'Tidak ada data yang ditemukan.'
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden w-full">
      {/* Top Tabs Header (Image 1 Style) */}
      {tabsComponent && (
        <div className="border-b border-slate-200/80 bg-white px-6 pt-3 flex items-center gap-6">
          {tabsComponent}
        </div>
      )}

      {/* Search & Filter Bar */}
      {(onSearchChange || filterComponent) && (
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-center justify-start gap-4">
          {onSearchChange && (
            <div className="w-full md:w-80">
              <SearchBar
                value={searchTerm}
                onChange={onSearchChange}
                onClear={onSearchClear}
                placeholder={searchPlaceholder}
              />
            </div>
          )}

          {filterComponent && (
            <div className="w-full md:w-64">
              {filterComponent}
            </div>
          )}
        </div>
      )}

      {/* Table Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <span className="text-sm font-medium">Memuat data...</span>
        </div>
      ) : !data || data.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-sm">
          {emptyMessage}
        </div>
      ) : (
        <div className="w-full overflow-x-auto pb-4">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs md:text-sm font-bold text-slate-600 uppercase tracking-wider w-16">
                  NO.
                </th>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`px-6 py-3.5 text-left text-xs md:text-sm font-bold text-slate-600 uppercase tracking-wider ${col.className || ''}`}
                  >
                    {col.header}
                  </th>
                ))}
                <th className="px-6 py-3.5 text-right text-xs md:text-sm font-bold text-slate-600 uppercase tracking-wider w-20">
                  AKSI
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {data.map((item, index) => {
                const uniqueKey =
                  item.id_user ? `user-${item.id_user}` :
                  item.id_dokumen ? `dok-${item.id_dokumen}` :
                  item.id_arsip ? `arsip-${item.id_arsip}` :
                  item.id_kategori ? `kat-${item.id_kategori}` :
                  item.id_role ? `role-${item.id_role}` :
                  item.id ? `id-${item.id}` :
                  `row-${index}`;

                return (
                  <tr
                    key={uniqueKey}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-xs md:text-sm text-slate-500 font-medium">
                      {index + 1}
                    </td>
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-xs md:text-sm text-slate-700">
                        {col.render ? col.render(item, index) : item[col.accessor]}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs md:text-sm">
                      <ActionDropdown
                        item={item}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onViewFile={onViewFile}
                        onDownload={onDownload}
                        disabledDelete={disabledDelete(item)}
                        deleteTitle={deleteTitle(item)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Optional Pagination / Footer Component */}
      {(paginationComponent || footerComponent) && (
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          {paginationComponent || footerComponent}
        </div>
      )}
    </div>
  );
}
