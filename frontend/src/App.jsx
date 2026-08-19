import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import EmployeeLayout from './components/layout/EmployeeLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Dokumen from './pages/docArsip/Dokumen';
import TambahDokumen from './pages/docArsip/TambahDokumen';
import EditDokumen from './pages/docArsip/EditDokumen';
import RoleMaster from './pages/master/Role';
import ArsipMaster from './pages/master/Arsip';
import UserMaster from './pages/master/User';
import Home from './pages/Home';
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing Page */}
        <Route element={<EmployeeLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
        </Route>

        {/* Public Login Route */}
        <Route path="/login" element={<Auth />} />

        {/* Dashboard Layout (Protected for Superadmin: id 1 & Koordinator: id 2 / tipe_role: admin) */}
        <Route element={<ProtectedRoute allowedRoles={[1, 2]} />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dokumen" element={<Dokumen />} />
            <Route path="/dokumen/tambah" element={<TambahDokumen />} />
            <Route path="/dokumen/edit/:id" element={<EditDokumen />} />
            <Route path="/master/kategori" element={<ArsipMaster />} />
            <Route path="/master/arsip" element={<ArsipMaster />} />
            <Route path="/master/role" element={<RoleMaster />} />
            <Route path="/log-aktivitas" element={<Dashboard />} />
            <Route path="/manajemen-user" element={<UserMaster />} />
            <Route path="/profile" element={<Dashboard />} />
            <Route path="/settings" element={<Dashboard />} />
          </Route>
        </Route>

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
