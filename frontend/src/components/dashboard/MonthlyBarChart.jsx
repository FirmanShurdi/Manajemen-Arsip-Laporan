import React from 'react';
import Chart from 'react-apexcharts';

const MonthlyBarChart = ({ data = [], datas = [] }) => {
  const chartInput = (Array.isArray(datas) && datas.length > 0) ? datas : data;
  
  const filteredData = Array.isArray(chartInput) && chartInput.length > 0
    ? chartInput.map(d => typeof d === 'number' ? d : (d?.count ?? d?.jumlah ?? d?.jumlah_dokumen ?? 0))
    : new Array(12).fill(0);

  const options = {
    colors: ["#4F46E5", "#3B82F6"], // #4F46E5 untuk Garis Tren (Puncak), #3B82F6 untuk Batang
    chart: {
      fontFamily: "Inter, sans-serif",
      type: "line", // Mixed Chart (Garis Tren + Batang)
      height: 350,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 8,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      width: [3, 0], // 3px untuk Garis Tren (Puncak), 0px untuk Batang
      curve: "smooth", // Garis melengkung halus menyentuh puncak tiap batang
    },
    markers: {
      size: [6, 0], // Lingkaran 6px tepat di titik puncak tertinggi batang
      strokeColors: "#FFFFFF",
      strokeWidth: 2,
      hover: {
        size: 8,
      }
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        rotate: 0,
        rotateAlways: false
      }
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      customLegendItems: ["Jumlah Dokumen"], // Hanya 1 legenda bersih
    },
    yaxis: { title: { text: undefined } },
    grid: { yaxis: { lines: { show: true } } },
    fill: { opacity: [1, 0.85] },
    tooltip: {
      shared: true,
      intersect: false,
      followCursor: false, // Terkunci di titik puncak (paling atas) batang
      custom: function({ series, dataPointIndex }) {
        const val = series[0][dataPointIndex];
        return `
          <div style="padding: 6px 10px; font-size: 12px; font-family: Inter, sans-serif; background: transparent; border: none; box-shadow: none;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="background-color: #3B82F6; width: 8px; height: 8px; border-radius: 50%; display: inline-block;"></span>
              <span style="color: #1e293b; font-size: 13px; font-weight: 500;">Jumlah Dokumen: <strong style="font-weight: 700; color: #0f172a;">${val} dokumen</strong></span>
            </div>
          </div>
        `;
      }
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          xaxis: {
            labels: {
              rotate: -45,
              style: {
                fontSize: '11px'
              }
            }
          },
          plotOptions: {
            bar: {
              columnWidth: "80%",
            },
          },
        }
      }
    ]
  };

  // Garis Tren ditaruh sebagai series PERTAMA (series[0]) agar ApexCharts menghitung posisi tooltip di PUNCAK tertinggi batang
  const series = [
    {
      name: "Garis Tren",
      type: "line",
      data: filteredData
    },
    {
      name: "Jumlah Dokumen",
      type: "column",
      data: filteredData
    }
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Grafik Arsip Dokumen per Bulan
        </h3>
      </div>
      <div className="flex-grow">
        <Chart options={options} series={series} type="line" height={350} />
      </div>
    </div>
  );
};

export default MonthlyBarChart;
