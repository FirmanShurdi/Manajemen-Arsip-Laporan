import React from 'react';
import Chart from 'react-apexcharts';

const CategoryDoughnutChart = ({ data = [], datas = [] }) => {
  const chartInput = (Array.isArray(datas) && datas.length > 0) ? datas : data;

  const seriesData = Array.isArray(chartInput) && chartInput.length > 0
    ? chartInput.map(() => 1)
    : [0];

  const seriesLabels = Array.isArray(chartInput) && chartInput.length > 0
    ? chartInput.map(d => d.kategori_arsip || d.kategori || d.kategori_dokumen || d.label || d.name || 'Kategori')
    : ['Tanpa Kategori'];

  const options = {
    chart: {
      type: 'donut',
      fontFamily: 'Inter, sans-serif',
    },
    colors: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1'],
    labels: seriesLabels,
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Kategori',
              formatter: function () {
                return Array.isArray(chartInput) && chartInput.length > 0 ? chartInput.length : 0;
              }
            }
          }
        }
      }
    },
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">Distribusi Kategori Arsip</h3>
      <div className="flex h-full w-full items-center justify-center">
        <Chart options={options} series={seriesData} type="donut" height={350} />
      </div>
    </div>
  );
};

export default CategoryDoughnutChart;
