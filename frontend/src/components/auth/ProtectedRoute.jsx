import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles, allowedTypes }) {
  const token = localStorage.getItem('token');
  let user = null;
  try {
    const stored = localStorage.getItem('user');
    if (stored) user = JSON.parse(stored);
  } catch (_) {}

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const roleId = Number(user.id_role || user.role?.id_role || 3);
  const tipeRole = user.tipe_role || user.role?.tipe_role || ([1, 2].includes(roleId) ? 'admin' : 'pegawai');

  // Pengecekan berbasis tipe_role (admin vs pegawai)
  if (allowedTypes && !allowedTypes.includes(tipeRole)) {
    if (tipeRole === 'pegawai') {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // Pengecekan backward compatibility allowedRoles
  if (allowedRoles) {
    const isAllowed = allowedRoles.includes(roleId) || 
                      allowedRoles.includes(tipeRole) ||
                      (tipeRole === 'admin' && (allowedRoles.includes(1) || allowedRoles.includes(2)));

    if (!isAllowed) {
      if (tipeRole === 'pegawai') {
        return <Navigate to="/" replace />;
      }
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
}
