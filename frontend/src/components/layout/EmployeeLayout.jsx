import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Flash from '../flash/flash';
import { useFlash } from '../../hooks/useFlash';

export default function EmployeeLayout() {
  const { toasts, removeToast } = useFlash();

  return (
    <div className="app-container relative">
      <Flash toasts={toasts} removeToast={removeToast} />
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
