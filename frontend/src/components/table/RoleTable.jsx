import React from 'react';
import ActionDropdown from '../common/ActionDropdown';

export default function RoleTable({ roles = [], onEdit, onDelete }) {
  if (roles.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-sm">
        Tidak ada data role yang ditemukan.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3.5 text-left text-xs md:text-sm font-bold text-slate-600 uppercase tracking-wider w-16">
              NO.
            </th>
            <th className="px-6 py-3.5 text-left text-xs md:text-sm font-bold text-slate-600 uppercase tracking-wider">
              NAMA ROLE
            </th>
            <th className="px-6 py-3.5 text-left text-xs md:text-sm font-bold text-slate-600 uppercase tracking-wider">
              TIPE HAK AKSES
            </th>
            <th className="px-6 py-3.5 text-right text-xs md:text-sm font-bold text-slate-600 uppercase tracking-wider w-24">
              AKSI
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {roles.map((item, index) => {
            const isProtected = [1, 2, 3].includes(Number(item.id_role));
            const isAdmin = item.tipe_role === 'admin';

            return (
              <tr key={item.id_role} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base font-semibold text-slate-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base font-medium text-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 uppercase tracking-wide">
                      {item.nama}
                    </span>
                    {isProtected && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                        System Default
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isAdmin ? (
                    <span className="inline-flex items-center px-3 py-1 text-xs md:text-sm font-bold rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                      Akses Full / Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 text-xs md:text-sm font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                      Akses Pegawai
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <ActionDropdown
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    disabledDelete={isProtected}
                    deleteTitle={isProtected ? 'Role default sistem tidak dapat dihapus' : ''}
                    editLabel="Edit Data"
                    deleteLabel="Hapus Data"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
