import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import PreviewNotice from '../../common/PreviewNotice';

export default function ExcelFormat({ fileUrl, fileName, onError }) {
  const [loading, setLoading] = useState(true);
  const [sheetNames, setSheetNames] = useState([]);
  const [activeSheet, setActiveSheet] = useState('');
  const [htmlSheets, setHtmlSheets] = useState({});

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(fileUrl)
      .then((res) => {
        if (!res.ok) throw new Error('File tidak dapat diakses');
        return res.arrayBuffer();
      })
      .then((buffer) => {
        if (!isMounted) return;
        const workbook = XLSX.read(buffer, { type: 'array', cellStyles: true, cellNF: true });
        const names = workbook.SheetNames || [];
        if (names.length === 0) throw new Error('Sheet kosong');

        const parsedHtml = {};
        names.forEach((name) => {
          const sheet = workbook.Sheets[name];
          parsedHtml[name] = XLSX.utils.sheet_to_html(sheet, { editable: false });
        });

        setSheetNames(names);
        setHtmlSheets(parsedHtml);
        setActiveSheet(names[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading Excel file:', err);
        if (isMounted) {
          setLoading(false);
          if (onError) onError(err);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [fileUrl, onError]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-600 bg-white rounded-2xl border border-slate-200 shadow-xs w-full h-full">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-slate-700">Membaca dan memproses tampilan asli Excel (.xlsx/.xlsm)...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xl text-slate-800 relative">
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 border-b border-slate-200 shrink-0 relative z-20">
        {sheetNames.length > 1 ? (
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {sheetNames.map((name) => (
              <button
                key={name}
                onClick={() => setActiveSheet(name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeSheet === name
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                📊 {name}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>Dokumen Spreadsheet Excel (.xlsx)</span>
          </div>
        )}
        <PreviewNotice fileType="Excel" />
      </div>

      <div className="flex-1 w-full h-full overflow-auto p-4 bg-slate-100/50">
        <div className="w-full overflow-auto bg-white rounded-xl border border-slate-300 p-4 shadow-xs">
          <style>{`
            .excel-asli-table table {
              border-collapse: collapse;
              width: 100%;
              font-family: Calibri, 'Segoe UI', Arial, sans-serif;
              font-size: 12px;
              color: #0f172a;
              background-color: #ffffff;
            }
            .excel-asli-table td, .excel-asli-table th {
              border: 1px solid #cbd5e1;
              padding: 5px 8px;
              text-align: center;
              vertical-align: middle;
              white-space: nowrap;
            }
            .excel-asli-table td[rowspan], .excel-asli-table td[colspan] {
              font-weight: 600;
            }
            .excel-asli-table tr:hover {
              background-color: #f1f5f9;
            }
          `}</style>
          <div
            className="excel-asli-table overflow-x-auto min-w-max"
            dangerouslySetInnerHTML={{ __html: htmlSheets[activeSheet] || '<p class="text-xs text-slate-400 p-4">Sheet kosong</p>' }}
          />
        </div>
      </div>
    </div>
  );
}
