import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import MetricCards from '../components/dashboard/MetricCards';
import MonthlyBarChart from '../components/dashboard/MonthlyBarChart';
import CategoryDoughnutChart from '../components/dashboard/CategoryDoughnutChart';
import Flash from '../components/flash/flash';
import { useFlash } from '../hooks/useFlash';

export default function Dashboard() {
  const { toasts, removeToast } = useFlash();

  const [totalDokumen, setTotalDokumen] = useState(0);
  const [dokumenToday, setDokumenToday] = useState(0);
  const [totalKategori, setTotalKategori] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    fetchTotalDokumen();
    fetchTotalDokumenToday();
    fetchTotalKategori();
    fetchMonthlyData();
    fetchCategoryData();
  }, []);

  const fetchTotalDokumen = async () => {
    try {
      const res = await api.get('/dokumen/total');
      setTotalDokumen(res.data?.datas || 0);
    } catch (err) {
      console.error('Error fetching total dokumen:', err);
    }
  };

  const fetchTotalDokumenToday = async () => {
    try {
      const res = await api.get('/dokumen/total-today');
      setDokumenToday(res.data?.datas || 0);
    } catch (err) {
      console.error('Error fetching total dokumen today:', err);
    }
  };

  const fetchTotalKategori = async () => {
    try {
      const res = await api.get('/kategori-dokumen/total');
      setTotalKategori(res.data?.datas || 0);
    } catch (err) {
      console.error('Error fetching total kategori:', err);
    }
  };

  const fetchMonthlyData = async () => {
    try {
      const res = await api.get('/dokumen/total-month');
      setMonthlyData(res.data?.defaultData || []);
    } catch (err) {
      console.error('Error fetching monthly data:', err);
    }
  };

  const fetchCategoryData = async () => {
    try {
      const res = await api.get('/dokumen/total-kategori');
      setCategoryData(res.data?.defaultDatas || []);
    } catch (err) {
      console.error('Error fetching category data:', err);
    }
  };

  return (
    <>
      {/* Component Flash Notification di Dashboard */}
      <Flash toasts={toasts} removeToast={removeToast} />

      <div className="space-y-6 md:space-y-8">

        {/* Header Title */}
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Utama</h1>
            <p className="text-sm text-slate-500">Ringkasan statistik & metrik pengelolaan arsip digital terpadu.</p>
          </div>
        </div>

        {/* Metric Cards Grid (3 Cards Sesuai Standar Clearance) */}
        <MetricCards 
          totalDokumen={totalDokumen}
          totalKategori={totalKategori}
          dokumenToday={dokumenToday}
        />

        {/* Charts Grid (Sebagaimana Proyek Clearance) */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <MonthlyBarChart data={monthlyData} />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <CategoryDoughnutChart data={categoryData} />
          </div>
        </div>
      </div>
    </>
  );
}
