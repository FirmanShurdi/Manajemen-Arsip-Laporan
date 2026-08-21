import React from 'react';
import Chart from 'react-apexcharts';

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const MonthlyBarChart = ({ data = [], datas = [], breakdown = [] }) => {
  const chartInput = (Array.isArray(datas) && datas.length > 0) ? datas : data;
  const filteredData = Array.isArray(chartInput) && chartInput.length > 0
    ? chartInput.map(d => typeof d === 'number' ? d : (d?.count ?? d?.jumlah ?? d?.jumlah_dokumen ?? 0))
    : new Array(12).fill(0);

  // 1. Ekstraksi data breakdown per bulan
  const breakdownData = (Array.isArray(breakdown) && breakdown.length === 12)
    ? breakdown
    : MONTH_LABELS.map((_, idx) => {
        const details = chartInput?.[idx]?.details || {};
        return Object.entries(details).map(([name, item]) => ({
          name,
          color: (typeof item === 'object' && item?.warna) ? item.warna : '#60A5FA',
          count: typeof item === 'object' ? (item?.count || 0) : (item || 0)
        }));
      });

  // 2. Pemetaan warna & arsip unik
  const allArsipMap = {};
  breakdownData.forEach(items => items.forEach(i => {
    if (i?.name && !allArsipMap[i.name]) allArsipMap[i.name] = i.color || '#60A5FA';
  }));
  const allArsipNames = Object.keys(allArsipMap);

  // 3. Penyusunan series & warna ApexCharts
  const series = [
    { name: "Garis Tren", type: "line", data: filteredData },
    ...(allArsipNames.length > 0
      ? allArsipNames.map(name => ({
          name,
          type: "column",
          group: "bar_stack",
          data: breakdownData.map(m => m.find(i => i.name === name)?.count || 0)
        }))
      : [{ name: "Jumlah Dokumen", type: "column", group: "bar_stack", data: filteredData }])
  ];

  const chartColors = ["#4F46E5", ...(allArsipNames.length > 0 ? allArsipNames.map(n => allArsipMap[n]) : ["#3B82F6"])];
  const maxVal = Math.max(...filteredData, 0);

  const options = {
    colors: chartColors,
    chart: { fontFamily: "Inter, sans-serif", type: "line", height: 350, stacked: true, toolbar: { show: false }, zoom: { enabled: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: "55%", borderRadius: 8, borderRadiusApplication: "end" } },
    dataLabels: { enabled: false },
    stroke: { width: [3, ...new Array(series.length - 1).fill(0)], curve: "smooth" },
    markers: {
      size: [7, ...new Array(series.length - 1).fill(0)],
      colors: ["#FFFFFF"],
      strokeColors: "#4F46E5",
      strokeWidth: 2.5,
      hover: { size: 7, sizeOffset: 0 }
    },
    xaxis: { categories: MONTH_LABELS, axisBorder: { show: false }, axisTicks: { show: false } },
    legend: { show: true, position: "top", horizontalAlign: "left", customLegendItems: ["Jumlah Dokumen"] },
    yaxis: {
      min: -0.15,
      max: maxVal > 0 ? maxVal : 5,
      tickAmount: maxVal > 0 && maxVal <= 10 ? maxVal : 5,
      labels: { formatter: val => val < 0 ? '' : Math.floor(val), style: { colors: "#64748b", fontSize: "12px", fontWeight: 500 } }
    },
    grid: { yaxis: { lines: { show: true } } },
    fill: { opacity: 1 },
    tooltip: {
      shared: false,
      intersect: true,
      followCursor: false,
      offsetY: -10,
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        if (dataPointIndex == null || seriesIndex == null || dataPointIndex < 0 || seriesIndex < 0) return '';
        
        const month = MONTH_LABELS[dataPointIndex];
        const total = filteredData[dataPointIndex] ?? 0;
        const sObj = w?.config?.series?.[seriesIndex];
        const isLineSeries = seriesIndex === 0 || sObj?.type === 'line' || sObj?.name === 'Garis Tren';

        // Full Card untuk Buletan Garis Tren
        if (isLineSeries) {
          const items = breakdownData[dataPointIndex] || [];
          const listHtml = items.map(i => `
            <div style="display:flex;align-items:center;justify-content:space-between;gap:20px;margin-top:6px;">
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="background:${i.color};width:8px;height:8px;border-radius:50%;display:inline-block;"></span>
                <span style="color:#334155;font-size:12px;font-weight:500;">${i.name}</span>
              </div>
              <span style="color:#0f172a;font-size:12px;font-weight:700;">${i.count} dokumen</span>
            </div>
          `).join('');

          return `
            <div style="padding:12px 16px;font-family:Inter,sans-serif;background:#fff;border-radius:12px;min-width:230px;border:1px solid #e2e8f0;box-shadow:0 10px 25px -5px rgba(0,0,0,0.1);">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">
                <span style="font-size:14px;font-weight:700;color:#0f172a;">Bulan ${month}</span>
                <span style="background:#eff6ff;color:#3b82f6;font-size:11px;font-weight:700;padding:3px 10px;border-radius:6px;border:1px solid #bfdbfe;">Total ${total} Dokumen</span>
              </div>
              <div style="margin-top:10px;">
                <div style="font-size:10px;letter-spacing:0.05em;color:#94a3b8;font-weight:800;text-transform:uppercase;margin-bottom:4px;">RINCIAN NAMA ARSIP:</div>
                ${items.length > 0 && total > 0 ? listHtml : '<div style="font-size:12px;color:#94a3b8;font-style:italic;padding-top:4px;">Belum ada dokumen</div>'}
              </div>
            </div>
          `;
        }

        // Mini Card untuk Segmen Warna Batang
        const val = series?.[seriesIndex]?.[dataPointIndex] ?? 0;
        if (val <= 0) return '';
        const name = sObj?.name || '';
        const color = allArsipMap[name] || '#60A5FA';

        return `
          <div style="padding:6px 12px;font-size:12px;font-family:Inter,sans-serif;background:#fff;border-radius:8px;border:1px solid #e2e8f0;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="background:${color};width:8px;height:8px;border-radius:50%;display:inline-block;"></span>
              <span style="color:#334155;font-size:13px;font-weight:500;">${name}: <strong style="color:#0f172a;font-weight:700;">${val} dokumen</strong></span>
            </div>
          </div>
        `;
      }
    },
    responsive: [{ breakpoint: 768, options: { plotOptions: { bar: { columnWidth: "80%" } } } }]
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <style>{`
        .apexcharts-canvas .apexcharts-xcrosshairs { fill: transparent !important; }
        .apexcharts-canvas .apexcharts-tooltip,
        .apexcharts-canvas .apexcharts-tooltip::before,
        .apexcharts-canvas .apexcharts-tooltip::after {
          pointer-events: none !important;
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        .apexcharts-canvas .apexcharts-bar-area:hover { filter: brightness(0.92); }
      `}</style>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">Statistik Dokumen per Bulan</h3>
      </div>
      <div className="flex-grow">
        <Chart options={options} series={series} type="line" height={350} />
      </div>
    </div>
  );
};

export default MonthlyBarChart;